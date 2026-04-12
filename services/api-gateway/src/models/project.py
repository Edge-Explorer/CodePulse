from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from src.core.database import Base
from sqlalchemy.sql import func

class Project(Base):
    __tablename__ = "projects"

    id= Column(Integer, primary_key= True, index= True)
    name= Column(String, index= True)
    repo_url= Column(String, unique= True, index= True)
    github_repo_id= Column(Integer, unique= True)
    language= Column(String, nullable= True)
    is_active= Column(Boolean, default= True)

    owner_id= Column(Integer, ForeignKey("users.id"))
    owner= relationship("User", back_populates= "projects")

    created_at= Column(DateTime(timezone= True), server_default= func.now())
    updated_at= Column(DateTime(timezone= True), onupdate= func.now())