from app.app import app
from app.database.db import init_db
import uvicorn

if __name__ == "__main__":
    init_db()
    uvicorn.run(app, host="localhost", port=8000)
