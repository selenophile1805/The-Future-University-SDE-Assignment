from fastapi import HTTPException, UploadFile
from cloudinary_service import upload_image
import io

class ImageService:
    @staticmethod
    async def upload_image(file: UploadFile):
        try:
            if not file.content_type or not file.content_type.startswith("image/"):
                raise HTTPException(status_code=400, detail="File must be an image")
            
            contents = await file.read()
            image_url = upload_image(io.BytesIO(contents))
            
            return {"image_url": image_url}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e)) 