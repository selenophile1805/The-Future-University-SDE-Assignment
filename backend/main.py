from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import auth_routes, post_routes, image_routes

app = FastAPI(title="Social Media API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(post_routes.router)
app.include_router(image_routes.router)

@app.get("/")
async def root():
    return {"message": "Social Media API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 