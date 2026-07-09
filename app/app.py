from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routing import todo, auth
from app.config.app_config import getappconfig

# Agar config load karni hai toh yahan call karein (agar zaroorat ho)
# config = getappconfig() 

app = FastAPI(title="Todo API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    # Yahan sirf apne actual Frontend ke URLs rakhein
    allow_origins=[
        "http://localhost:5173", 
        "https://smart-todo-api-gvx2.onrender.com", # <--- Apna actual frontend URL dalein
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api", tags=["Authentication"])
app.include_router(todo.router, prefix="/api", tags=["Todos"])

@app.get("/")
async def root():
    return {
        "message": "Todo API is running!",
        "docs": "/docs",
        "status": "OK"
    }
