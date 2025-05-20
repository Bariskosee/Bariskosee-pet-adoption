export interface User {
  id: number;
  email: string;
}

export interface Pet {
  id: number;
  name: string;
  type: string;
  breed?: string;
  age?: number;
  description?: string;
  imageUrl?: string;
  ownerId?: number;
}

export interface Favorite {
  id: number;
  userId: number;
  petId: number;
  pet?: Pet;
}

export interface Adoption {
  id: number;
  userId: number;
  petId: number;
  adoptedAt: string;
  pet?: Pet;
}

export interface AuthResponse {
  id: number;
  email: string;
  token: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
}

export interface PetFormData {
  name: string;
  type: string;
  breed?: string;
  age?: number;
  description?: string;
  imageUrl?: string;
}
