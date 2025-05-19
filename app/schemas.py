from pydantic import BaseModel

class UserCreate(BaseModel):
    email: str
    password: str

class User(BaseModel):
    id: int
    email: str

    class Config:
        from_attributes = True

class PetBase(BaseModel):
    name: str
    owner_id: int

class Pet(PetBase):
    id: int

    class Config:
        from_attributes = True

class FavoriteBase(BaseModel):
    name: str
    user_id: int

class Favorite(FavoriteBase):
    id: int

    class Config:
        from_attributes = True

class AdoptionBase(BaseModel):
    pet_id: int
    user_id: int

class Adoption(AdoptionBase):
    id: int

    class Config:
        from_attributes = True