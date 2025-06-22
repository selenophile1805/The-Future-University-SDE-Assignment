from datetime import datetime
from typing import List
from database import supabase
from models import PostCreate, PostResponse
from fastapi import HTTPException
from cloudinary_service import upload_image
from utils import parse_datetime_robust, format_datetime_for_supabase
import io

class PostService:
    @staticmethod
    async def create_post(content: str, user_id: str, user_name: str, user_profile_picture: str = None, image_file=None):
        try:
            image_url = None
            if image_file:
                if not image_file.content_type or not image_file.content_type.startswith("image/"):
                    raise HTTPException(status_code=400, detail="File must be an image")
                contents = await image_file.read()
                image_url = upload_image(io.BytesIO(contents))
            
            post_data = {
                "content": content,
                "image_url": image_url,
                "user_id": user_id,
                "likes": 0,
                "created_at": format_datetime_for_supabase(datetime.utcnow())
            }
            
            response = supabase.table("posts").insert(post_data).execute()
            post = response.data[0]
            
            return {
                "id": post["id"],
                "content": post["content"],
                "image_url": post["image_url"],
                "likes": post["likes"],
                "user_id": post["user_id"],
                "user_name": user_name,
                "user_profile_picture": user_profile_picture,
                "created_at": parse_datetime_robust(post["created_at"])
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    async def get_all_posts() -> List[PostResponse]:
        try:
            response = supabase.table("posts").select("*, users(name, profile_picture)").order("created_at", desc=True).execute()
            
            posts = []
            for post in response.data:
                user_data = post["users"]
                posts.append({
                    "id": post["id"],
                    "content": post["content"],
                    "image_url": post["image_url"],
                    "likes": post["likes"],
                    "user_id": post["user_id"],
                    "user_name": user_data["name"],
                    "user_profile_picture": user_data.get("profile_picture"),
                    "created_at": parse_datetime_robust(post["created_at"])
                })
            
            return posts
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    async def like_post(post_id: str):
        try:
            response = supabase.table("posts").select("likes").eq("id", post_id).execute()
            if not response.data:
                raise HTTPException(status_code=404, detail="Post not found")
            
            current_likes = response.data[0]["likes"]
            new_likes = current_likes + 1
            
            supabase.table("posts").update({"likes": new_likes}).eq("id", post_id).execute()
            
            return {"likes": new_likes}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e)) 