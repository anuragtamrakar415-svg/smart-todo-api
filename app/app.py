from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routing import todo, auth

app = FastAPI(title="Todo API", version="1.0")

# ✅ allow_origins=["*"] + allow_credentials=True is rejected by browsers.
# List the actual frontend origin(s) you use, e.g. your local dev server.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://smart-todo-api-gvx2.onrender.com",
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
