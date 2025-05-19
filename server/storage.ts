import { 
  users, pets, favorites, adoptions, 
  type User, type InsertUser, 
  type Pet, type InsertPet,
  type Favorite, type InsertFavorite,
  type Adoption, type InsertAdoption
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Pet methods
  getAllPets(): Promise<Pet[]>;
  getPetById(id: number): Promise<Pet | undefined>;
  createPet(pet: InsertPet): Promise<Pet>;
  
  // Favorite methods
  getUserFavorites(userId: number): Promise<(Favorite & { pet?: Pet })[]>;
  getFavoriteByUserAndPet(userId: number, petId: number): Promise<Favorite | undefined>;
  createFavorite(favorite: InsertFavorite): Promise<Favorite>;
  deleteFavorite(id: number): Promise<void>;
  
  // Adoption methods
  getUserAdoptions(userId: number): Promise<(Adoption & { pet?: Pet })[]>;
  getAdoptionByPet(petId: number): Promise<Adoption | undefined>;
  createAdoption(adoption: InsertAdoption): Promise<Adoption>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private pets: Map<number, Pet>;
  private favorites: Map<number, Favorite>;
  private adoptions: Map<number, Adoption>;
  private currentUserId: number;
  private currentPetId: number;
  private currentFavoriteId: number;
  private currentAdoptionId: number;

  constructor() {
    this.users = new Map();
    this.pets = new Map();
    this.favorites = new Map();
    this.adoptions = new Map();
    this.currentUserId = 1;
    this.currentPetId = 1;
    this.currentFavoriteId = 1;
    this.currentAdoptionId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Pet methods
  async getAllPets(): Promise<Pet[]> {
    return Array.from(this.pets.values());
  }

  async getPetById(id: number): Promise<Pet | undefined> {
    return this.pets.get(id);
  }

  async createPet(insertPet: InsertPet): Promise<Pet> {
    const id = this.currentPetId++;
    const pet: Pet = { 
      ...insertPet, 
      id,
      // Convert undefined values to null to match schema expectations
      breed: insertPet.breed ?? null,
      age: insertPet.age ?? null,
      description: insertPet.description ?? null,
      imageUrl: insertPet.imageUrl ?? null,
      ownerId: insertPet.ownerId ?? null
    };
    this.pets.set(id, pet);
    return pet;
  }

  // Favorite methods
  async getUserFavorites(userId: number): Promise<(Favorite & { pet?: Pet })[]> {
    const userFavorites = Array.from(this.favorites.values()).filter(
      (favorite) => favorite.userId === userId
    );
    
    return userFavorites.map(favorite => ({
      ...favorite,
      pet: this.pets.get(favorite.petId)
    }));
  }

  async getFavoriteByUserAndPet(userId: number, petId: number): Promise<Favorite | undefined> {
    return Array.from(this.favorites.values()).find(
      (favorite) => favorite.userId === userId && favorite.petId === petId
    );
  }

  async createFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const id = this.currentFavoriteId++;
    const favorite: Favorite = { ...insertFavorite, id };
    this.favorites.set(id, favorite);
    return favorite;
  }

  async deleteFavorite(id: number): Promise<void> {
    this.favorites.delete(id);
  }

  // Adoption methods
  async getUserAdoptions(userId: number): Promise<(Adoption & { pet?: Pet })[]> {
    const userAdoptions = Array.from(this.adoptions.values()).filter(
      (adoption) => adoption.userId === userId
    );
    
    return userAdoptions.map(adoption => ({
      ...adoption,
      pet: this.pets.get(adoption.petId)
    }));
  }

  async getAdoptionByPet(petId: number): Promise<Adoption | undefined> {
    return Array.from(this.adoptions.values()).find(
      (adoption) => adoption.petId === petId
    );
  }

  async createAdoption(insertAdoption: InsertAdoption): Promise<Adoption> {
    const id = this.currentAdoptionId++;
    const adoption: Adoption = { 
      ...insertAdoption, 
      id,
      adoptedAt: new Date().toISOString()
    };
    this.adoptions.set(id, adoption);
    return adoption;
  }
}

export const storage = new MemStorage();
