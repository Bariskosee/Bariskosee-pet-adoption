from sqlalchemy.orm import Session
from app import models, schemas

# USERS
def create_user(db: Session, user: schemas.UserCreate):
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = models.User(email=user.email, hashed_password=fake_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users(db: Session):
    return db.query(models.User).all()

# PETS
def create_pet(db: Session, pet: schemas.PetBase):
    db_pet = models.Pet(name=pet.name, owner_id=pet.owner_id)
    db.add(db_pet)
    db.commit()
    db.refresh(db_pet)
    return db_pet

def get_pets(db: Session):
    return db.query(models.Pet).all()

# FAVORITES
def create_favorite(db: Session, favorite: schemas.FavoriteBase):
    db_fav = models.Favorite(name=favorite.name, user_id=favorite.user_id)
    db.add(db_fav)
    db.commit()
    db.refresh(db_fav)
    return db_fav

def get_favorites(db: Session):
    return db.query(models.Favorite).all()

# ADOPTIONS
def create_adoption(db: Session, adoption: schemas.AdoptionBase):
    db_adopt = models.Adoption(pet_id=adoption.pet_id, user_id=adoption.user_id)
    db.add(db_adopt)
    db.commit()
    db.refresh(db_adopt)
    return db_adopt

def get_adoptions(db: Session):
    return db.query(models.Adoption).all()