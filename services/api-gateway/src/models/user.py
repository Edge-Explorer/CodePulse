from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from src.core.database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__= "users"

    id= Column(Integer, primary_key= True, index= True)
    github_id= Column(String, unique= True, index= True)
    username= Column(String, unique= True, index= True)
    email= Column(String, unique= True, index= True, nullable= True)
    avatar_url= Column(String, nullable= True)

    created_at= Column(DateTime(timezone= True), server_default= func.now())
    updated_at= Column(DateTime(timezone= True), onupdate= func.now())
    
    projects= relationship("Project", back_populates= "owner", cascade= "all, delete-orphan")