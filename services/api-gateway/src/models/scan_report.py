from sqlalchemy import Column, Integer, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from src.core.database import Base 
from sqlalchemy.sql import func

class ScanReport(Base):
    __tablename__ = "scan_reports"

    id= Column(Integer, primary_key= True, index= True)
    project_id= Column(Integer, ForeignKey("projects.id"), index= True)
    report_data= Column(JSON, nullable= False)
    project= relationship("Project", backref= "reports")
    created_at= Column(DateTime(timezone= True), server_default= func.now())