from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime
from utils import parse_datetime_robust

class UserCreate(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserProfile(BaseModel):
    name: str
    bio: Optional[str] = None
    profile_picture: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    bio: Optional[str] = None
    profile_picture: Optional[str] = None
    created_at: datetime

    @field_validator('created_at', mode='before')
    @classmethod
    def validate_created_at(cls, v):
        return parse_datetime_robust(v)

class PostCreate(BaseModel):
    content: str
    image_url: Optional[str] = None

class PostResponse(BaseModel):
    id: str
    content: str
    image_url: Optional[str] = None
    likes: int
    user_id: str
    user_name: str
    user_profile_picture: Optional[str] = None
    created_at: datetime

    @field_validator('created_at', mode='before')
    @classmethod
    def validate_created_at(cls, v):
        return parse_datetime_robust(v)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None 