from fastapi import APIRouter, Depends, UploadFile, File
from services.image_service import ImageService
from services.user_service import UserService
from auth import get_current_user

router = APIRouter(prefix="/images", tags=["Images"])

@router.post("/upload")
async def upload_profile_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    result = await ImageService.upload_image(file)
    await UserService.update_profile_picture(current_user["id"], result["image_url"])
    return result 