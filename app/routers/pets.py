from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import schemas, crud
from app.dependencies import get_db

router = APIRouter(prefix="/pets", tags=["Pets"])

@router.post("/", response_model=schemas.Pet)
def create_pet(pet: schemas.PetBase, db: Session = Depends(get_db)):
    return crud.create_pet(db, pet)

@router.get("/", response_model=list[schemas.Pet])
def list_pets(db: Session = Depends(get_db)):
    return crud.get_pets(db)