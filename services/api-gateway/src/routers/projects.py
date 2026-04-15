from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
import httpx

from src.core.database import get_db
from src.core.dependencies import get_current_user
from src.models.user import User
from src.models.project import Project
from src.schemas.project import ProjectCreate 
from src.core.kafka import send_task
from src.models.scan_report import ScanReport
from sqlalchemy import select

# 1. Define the router!
router = APIRouter(prefix="/projects", tags=["Projects"])

@router.post("/")
async def create_project(
    project_in: ProjectCreate, # Use project_in consistently
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):

    if "github.com" not in project_in.repo_url:
        raise HTTPException(status_code=400, detail="Only GitHub repositories are supported")

    # 2. Extract repo path (Keep this OUTSIDE the if block)
    repo_path = project_in.repo_url.split("github.com/")[-1].rstrip("/")
    github_api_url = f"https://api.github.com/repos/{repo_path}"

    async with httpx.AsyncClient() as client:
        response = await client.get(github_api_url)
        if response.status_code != 200:
            raise HTTPException(status_code=404, detail="Repository not found or private")
        
        repo_data = response.json()

    # 3. Save to Database
    new_project = Project(
        name=repo_data["name"],
        repo_url=project_in.repo_url,
        github_repo_id=repo_data["id"],
        language=repo_data.get("language"),
        owner_id=current_user.id
    )
    
    db.add(new_project)
    await db.commit()
    await db.refresh(new_project)

    task_data= {
        "project_id": new_project.id,
        "repo_url": new_project.repo_url,
        "language": new_project.language,
        "user_id": current_user.id
    }

    await send_task("project_scans", task_data)
    return new_project

@router.get("/")
async def list_projects(
    current_user: User= Depends(get_current_user),
    db: AsyncSession= Depends(get_db)
):
    # Fetch all projects belonging to the current user
    result= await db.execute(
        select(Project).where(Project.owner_id == current_user.id)
    )
    return result.scalars().all()
    
@router.get("/{project_id}/report")
async def get_project_report(
    project_id: int,
    current_user: User= Depends(get_current_user),
    db: AsyncSession= Depends(get_db)
):
    # (Security check: don't let others see your reports!)
    project_result= await db.execute(
        select(Project).where(Project.id == project_id, Project.owner_id == current_user.id)
    )
    project= project_result.scalar_one_or_none()

    if not project:
        raise HTTPException(status_code= 404, detail= "Project not found")

    # Fetch the latest scan report
    report_result= await db.execute(
        select(ScanReport)
        .where(ScanReport.project_id == project_id)
        .order_by(ScanReport.created_at.desc())
    )
    report= report_result.scalar_one_or_none()

    if not report:
        return {"status": "pending", "message": "Scan is in progress or not started."}

    return{
        "status": "completed",
        "project_name": project.name,
        "report": report.report_data,
        "scanned_at": report.created_at
    }