import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import express, { Request, Response } from "express";
import { z } from "zod";
import { insertAdoptionSchema, insertFavoriteSchema, insertPetSchema, insertUserSchema, loginUserSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_EXPIRES_IN = "24h";

// Auth middleware to protect routes
const authMiddleware = async (req: Request, res: Response, next: Function) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number, email: string };
    const user = await storage.getUser(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    
    req.body.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes Prefix
  const apiRouter = express.Router();
  app.use("/api", apiRouter);

  // AUTH ROUTES
  // Register a new user
  apiRouter.post("/signup", async (req: Request, res: Response) => {
    try {
      const result = insertUserSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid data", errors: result.error.flatten() });
      }

      const existingUser = await storage.getUserByEmail(result.data.email);
      
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(result.data.password, salt);

      const newUser = await storage.createUser({
        email: result.data.email,
        password: hashedPassword
      });

      // Generate JWT
      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return res.status(201).json({
        id: newUser.id,
        email: newUser.email,
        token
      });
    } catch (error) {
      console.error("Signup error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Login a user
  apiRouter.post("/login", async (req: Request, res: Response) => {
    try {
      const result = loginUserSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid data", errors: result.error.flatten() });
      }

      const user = await storage.getUserByEmail(result.data.username);
      
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(result.data.password, user.password);
      
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Generate JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return res.status(200).json({
        id: user.id,
        email: user.email,
        token
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Get current user
  apiRouter.get("/me", authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(req.body.userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        id: user.id,
        email: user.email
      });
    } catch (error) {
      console.error("Get me error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // PETS ROUTES
  // Get all pets
  apiRouter.get("/pets", async (req: Request, res: Response) => {
    try {
      const pets = await storage.getAllPets();
      return res.status(200).json(pets);
    } catch (error) {
      console.error("Get pets error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Get a pet by ID
  apiRouter.get("/pets/:id", async (req: Request, res: Response) => {
    try {
      const petId = parseInt(req.params.id);
      const pet = await storage.getPetById(petId);
      
      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }

      return res.status(200).json(pet);
    } catch (error) {
      console.error("Get pet error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Create a new pet
  apiRouter.post("/pets", authMiddleware, async (req: Request, res: Response) => {
    try {
      const result = insertPetSchema.safeParse({
        ...req.body,
        ownerId: req.body.userId
      });
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid data", errors: result.error.flatten() });
      }

      const newPet = await storage.createPet(result.data);
      return res.status(201).json(newPet);
    } catch (error) {
      console.error("Create pet error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // FAVORITES ROUTES
  // Get all favorites for a user
  apiRouter.get("/favorites", authMiddleware, async (req: Request, res: Response) => {
    try {
      const favorites = await storage.getUserFavorites(req.body.userId);
      return res.status(200).json(favorites);
    } catch (error) {
      console.error("Get favorites error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Add a pet to favorites
  apiRouter.post("/favorites", authMiddleware, async (req: Request, res: Response) => {
    try {
      const result = insertFavoriteSchema.safeParse({
        ...req.body,
        userId: req.body.userId
      });
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid data", errors: result.error.flatten() });
      }

      // Check if pet exists
      const pet = await storage.getPetById(result.data.petId);
      
      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }

      // Check if already favorited
      const existingFavorite = await storage.getFavoriteByUserAndPet(req.body.userId, result.data.petId);
      
      if (existingFavorite) {
        return res.status(400).json({ message: "Pet already in favorites" });
      }

      const newFavorite = await storage.createFavorite(result.data);
      return res.status(201).json(newFavorite);
    } catch (error) {
      console.error("Add favorite error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Remove a pet from favorites
  apiRouter.delete("/favorites/:petId", authMiddleware, async (req: Request, res: Response) => {
    try {
      const petId = parseInt(req.params.petId);
      const favorite = await storage.getFavoriteByUserAndPet(req.body.userId, petId);
      
      if (!favorite) {
        return res.status(404).json({ message: "Favorite not found" });
      }

      await storage.deleteFavorite(favorite.id);
      return res.status(200).json({ message: "Favorite removed successfully" });
    } catch (error) {
      console.error("Remove favorite error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // ADOPTIONS ROUTES
  // Get all adoptions for a user
  apiRouter.get("/adoptions", authMiddleware, async (req: Request, res: Response) => {
    try {
      const adoptions = await storage.getUserAdoptions(req.body.userId);
      return res.status(200).json(adoptions);
    } catch (error) {
      console.error("Get adoptions error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Create a new adoption
  apiRouter.post("/adoptions", authMiddleware, async (req: Request, res: Response) => {
    try {
      const result = insertAdoptionSchema.safeParse({
        ...req.body,
        userId: req.body.userId
      });
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid data", errors: result.error.flatten() });
      }

      // Check if pet exists
      const pet = await storage.getPetById(result.data.petId);
      
      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }

      // Check if pet is already adopted
      const existingAdoption = await storage.getAdoptionByPet(result.data.petId);
      
      if (existingAdoption) {
        return res.status(400).json({ message: "Pet is already adopted" });
      }

      const newAdoption = await storage.createAdoption(result.data);
      
      return res.status(201).json(newAdoption);
    } catch (error) {
      console.error("Create adoption error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
