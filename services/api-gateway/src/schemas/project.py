from pydantic import BaseModel, HttpUrl

class ProjectCreate(BaseModel):
    repo_url: str

class ProjectResponse(BaseModel):
    id: int
    name: str
    repo_url: str
    language: str | None
    is_active: bool

    class Config:
        from_attributes= True