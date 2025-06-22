from fastapi import APIRouter, Depends, UploadFile, File, Form
from typing import List
from models import PostResponse
from services.post_service import PostService
from auth import get_current_user

router = APIRouter(prefix="/posts", tags=["Posts"])

@router.post("/", response_model=PostResponse)
async def create_post(
    content: str = Form(...),
    image: UploadFile = File(None),
    current_user: dict = Depends(get_current_user)
):
    return await PostService.create_post(
        content=content,
        user_id=current_user["id"],
        user_name=current_user["name"],
        user_profile_picture=current_user.get("profile_picture"),
        image_file=image
    )

@router.get("/", response_model=List[PostResponse])
async def get_posts():
    return await PostService.get_all_posts()

@router.post("/{post_id}/like")
async def like_post(
    post_id: str,
    current_user: dict = Depends(get_current_user)
):
    return await PostService.like_post(post_id) 