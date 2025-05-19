from sqlalchemy.orm import Session
from app import schemas, crud
from app.dependencies import get_db
from fastapi import APIRouter, Depends

router = APIRouter(prefix="/favorites", tags=["Favorites"])

@router.post("/", response_model=schemas.Favorite)
def create_favorite(favorite: schemas.FavoriteBase, db: Session = Depends(get_db)):
    return crud.create_favorite(db, favorite)

@router.get("/", response_model=list[schemas.Favorite])
def list_favorites(db: Session = Depends(get_db)):
    return crud.get_favorites(db)