import asyncio
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import SessionLocal, engine
from sqlalchemy import text

import time

from auth import staff_router, admin_router
from users import router as users_router
from audit_logs import router as audit_logs_router
#--------Health Check before server accepts incoming traffic--------#
async def database_health_checker():
    print("📋 Starting background database health monitor...")
    was_connected = True
    INTERVAL = 5.0
    while True:
        start_time = time.time()
        try:
            db = SessionLocal()
            db.execute(text("SELECT 1"))
            db.close()

            if not was_connected:
                print("✨ CONNECTION RESTORED! FastAPI has successfully reconnected to MariaDB. 🎉")
                was_connected = True

        except Exception as e:
            was_connected = False
            print(f"🚨 CONNECTION LOST: Cannot reach MariaDB at port 3306.")
            print(f"🔄 Retrying reconnection automatically in 5 seconds... (Error: {e})")

        elapsed_time = time.time() - start_time
        sleep_time = max(0.0, INTERVAL - elapsed_time)

        # Pause for 5 seconds before trying the loop all over again
        await asyncio.sleep(sleep_time)


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 FastAPI Server starting up...")
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        print("🟢 Database connection initialized successfully at startup!")
    except Exception as e:
        print(f"Failed to initialize database at startup! Check connection string. Error: {e}")

    health_check_task = asyncio.create_task(database_health_checker())

    yield

    # --- Execute at App Shutdown --- #
    print("🛑 FastAPI Server shutting down...")
    health_check_task.cancel()

app = FastAPI(lifespan = lifespan)

origins = ['http://localhost:3000','http://localhost:5173']

app.add_middleware(CORSMiddleware, allow_origins = origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

app.include_router(staff_router)
app.include_router(admin_router)
app.include_router(users_router)
app.include_router(audit_logs_router)

@app.get('/')
def read_root():
    return {"Server Status": "Runnning"}

@app.get('/running')
def running():
    return [{"Running": "True"}]

@app.post('/running')
async def runningPOST(request: Request):
    requestBody = await request.json()
    return {"Running": requestBody['Running']+' ACCEPTED'}
