from fastapi import FastAPI
from .database import engine
from .models import Base
from .routes import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="HRMS Lite API")
origins = [
    "http://localhost:3000",  # local frontend
    "https://your-frontend.vercel.app", 
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(router)
