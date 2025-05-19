from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import schemas, crud
from app.dependencies import get_db

router = APIRouter(prefix="/adoptions", tags=["Adoptions"])

@router.post("/", response_model=schemas.Adoption)
def create_adoption(adoption: schemas.AdoptionBase, db: Session = Depends(get_db)):
    return crud.create_adoption(db, adoption)

@router.get("/", response_model=list[schemas.Adoption])
def list_adoptions(db: Session = Depends(get_db)):
    return crud.get_adoptions(db)