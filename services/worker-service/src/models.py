from sqlalchemy import Column, Integer, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base= declarative_base()

class ScanReport(Base):
    __tablename__= "scan_reports"

    id= Column(Integer, primary_key= True, index= True)
    project_id= Column(Integer, index= True)
    report_data= Column(JSON, nullable= False)
    created_at= Column(DateTime(timezone= True), server_default= func.now())
