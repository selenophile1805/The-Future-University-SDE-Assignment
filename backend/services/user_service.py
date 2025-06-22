from datetime import datetime
from database import supabase
from auth import get_password_hash, verify_password, create_access_token
from models import UserCreate, UserLogin, UserProfile
from fastapi import HTTPException
from datetime import timedelta
from utils import format_datetime_for_supabase

def parse_datetime(date_string):
    """Parse datetime string from Supabase, handling timezone info"""
    try:
        # Remove timezone info if present and parse
        if '+' in date_string:
            date_string = date_string.split('+')[0]
        elif 'Z' in date_string:
            date_string = date_string.replace('Z', '')
        return datetime.fromisoformat(date_string)
    except Exception:
        # Fallback to current time if parsing fails
        return datetime.utcnow()

class UserService:
    @staticmethod
    async def register_user(user: UserCreate):
        try:
            existing_user = supabase.table("users").select("*").eq("email", user.email).execute()
            if existing_user.data:
                raise HTTPException(status_code=400, detail="Email already registered")
            
            hashed_password = get_password_hash(user.password)
            user_data = {
                "email": user.email,
                "password": hashed_password,
                "name": user.name,
                "created_at": format_datetime_for_supabase(datetime.utcnow())
            }
            
            response = supabase.table("users").insert(user_data).execute()
            
            access_token_expires = timedelta(minutes=30)
            access_token = create_access_token(
                data={"sub": user.email}, expires_delta=access_token_expires
            )
            
            return {"access_token": access_token, "token_type": "bearer"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    async def login_user(user_credentials: UserLogin):
        try:
            response = supabase.table("users").select("*").eq("email", user_credentials.email).execute()
            if not response.data:
                raise HTTPException(status_code=401, detail="Invalid credentials")
            
            user = response.data[0]
            if not verify_password(user_credentials.password, user["password"]):
                raise HTTPException(status_code=401, detail="Invalid credentials")
            
            access_token_expires = timedelta(minutes=30)
            access_token = create_access_token(
                data={"sub": user["email"]}, expires_delta=access_token_expires
            )
            
            return {"access_token": access_token, "token_type": "bearer"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    async def get_user_by_email(email: str):
        try:
            response = supabase.table("users").select("*").eq("email", email).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    async def update_user_profile(user_id: str, profile: UserProfile):
        try:
            update_data = {
                "name": profile.name,
                "bio": profile.bio,
                "profile_picture": profile.profile_picture
            }
            
            response = supabase.table("users").update(update_data).eq("id", user_id).execute()
            return response.data[0]
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    async def update_profile_picture(user_id: str, image_url: str):
        try:
            response = supabase.table("users").update({"profile_picture": image_url}).eq("id", user_id).execute()
            return response.data[0]
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e)) 