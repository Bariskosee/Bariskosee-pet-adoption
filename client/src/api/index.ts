import { apiRequest } from "@/lib/queryClient";
import { Adoption, AuthResponse, Favorite, LoginCredentials, Pet, PetFormData, SignupCredentials, User } from "@/types";

const API_BASE_URL = "/api";

// Auth API
export const authApi = {
  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    const res = await apiRequest("POST", `${API_BASE_URL}/signup`, credentials);
    return res.json();
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const res = await apiRequest("POST", `${API_BASE_URL}/login`, credentials);
    return res.json();
  },

  getCurrentUser: async (): Promise<User> => {
    const res = await apiRequest("GET", `${API_BASE_URL}/me`);
    return res.json();
  }
};

// Pets API
export const petsApi = {
  getAllPets: async (): Promise<Pet[]> => {
    const res = await apiRequest("GET", `${API_BASE_URL}/pets`);
    return res.json();
  },

  getPetById: async (id: number): Promise<Pet> => {
    const res = await apiRequest("GET", `${API_BASE_URL}/pets/${id}`);
    return res.json();
  },

  createPet: async (petData: PetFormData): Promise<Pet> => {
    const res = await apiRequest("POST", `${API_BASE_URL}/pets`, petData);
    return res.json();
  }
};

// Favorites API
export const favoritesApi = {
  getUserFavorites: async (): Promise<Favorite[]> => {
    const res = await apiRequest("GET", `${API_BASE_URL}/favorites`);
    return res.json();
  },

  addToFavorites: async (petId: number): Promise<Favorite> => {
    const res = await apiRequest("POST", `${API_BASE_URL}/favorites`, { petId });
    return res.json();
  },

  removeFromFavorites: async (petId: number): Promise<void> => {
    await apiRequest("DELETE", `${API_BASE_URL}/favorites/${petId}`);
  }
};

// Adoptions API
export const adoptionsApi = {
  getUserAdoptions: async (): Promise<Adoption[]> => {
    const res = await apiRequest("GET", `${API_BASE_URL}/adoptions`);
    return res.json();
  },

  createAdoption: async (petId: number): Promise<Adoption> => {
    const res = await apiRequest("POST", `${API_BASE_URL}/adoptions`, { petId });
    return res.json();
  }
};
