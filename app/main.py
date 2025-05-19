from fastapi import FastAPI
from app.database import Base, engine
from app.routers import users, pets, favorites, adaptions
from app.routers.auth import router as auth_router


Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(users.router)
app.include_router(pets.router)
app.include_router(favorites.router)
app.include_router(adaptions.router)
app.include_router(auth_router)  # sadece 1 tane

@app.get("/")
def root():
    return {"message": "API working!"}