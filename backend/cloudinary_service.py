import cloudinary
import cloudinary.uploader
from config import settings

cloudinary.config(
    cloud_name=settings.cloudinary_cloud_name,
    api_key=settings.cloudinary_api_key,
    api_secret=settings.cloudinary_api_secret
)

def upload_image(file):
    try:
        result = cloudinary.uploader.upload(file, folder="social_media")
        return result["secure_url"]
    except Exception as e:
        raise Exception(f"Failed to upload image: {str(e)}") 