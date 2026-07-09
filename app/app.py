from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routing import todo, auth
from app.config.app_config import getappconfig

app = FastAPI(title="Todo API", version="1.0")

# ✅ allow_origins=["*"] + allow_credentials=True is rejected by browsers.
# List the actual frontend origin(s) you use, e.g. your local dev server.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
         "https://smart-todo-api-gvx2.onrender.com",
    ],
    allow_origins=origins,
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
