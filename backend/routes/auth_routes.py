from fastapi import APIRouter, Depends
from models import UserCreate, UserLogin, Token, UserResponse, UserProfile
from services.user_service import UserService
from auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
async def register(user: UserCreate):
    return await UserService.register_user(user)

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin):
    return await UserService.login_user(user_credentials)

@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    profile: UserProfile,
    current_user: dict = Depends(get_current_user)
):
    return await UserService.update_user_profile(current_user["id"], profile) 