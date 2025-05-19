import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

export const pets = pgTable("pets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  breed: text("breed"),
  age: integer("age"),
  description: text("description"),
  imageUrl: text("image_url"),
  ownerId: integer("owner_id").references(() => users.id),
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  petId: integer("pet_id").notNull().references(() => pets.id),
});

export const adoptions = pgTable("adoptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  petId: integer("pet_id").notNull().references(() => pets.id),
  adoptedAt: text("adopted_at").notNull().default(new Date().toISOString()),
});

// User schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
});

export const loginUserSchema = z.object({
  username: z.string().email(),
  password: z.string(),
});

// Pet schemas
export const insertPetSchema = createInsertSchema(pets).omit({
  id: true,
});

// Favorite schemas
export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
});

// Adoption schemas
export const insertAdoptionSchema = createInsertSchema(adoptions).omit({
  id: true,
  adoptedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;

export type Pet = typeof pets.$inferSelect;
export type InsertPet = z.infer<typeof insertPetSchema>;

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;

export type Adoption = typeof adoptions.$inferSelect;
export type InsertAdoption = z.infer<typeof insertAdoptionSchema>;
