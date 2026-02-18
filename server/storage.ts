import { db } from "./db";
import {
  services, galleryItems, contactMessages, profiles,
  type Service, type InsertService,
  type GalleryItem, type InsertGalleryItem,
  type ContactMessage, type InsertContactMessage,
  type Profile
} from "@shared/schema";
import { eq, asc, desc } from "drizzle-orm";

export interface IStorage {
  // Services
  getServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service>;
  deleteService(id: number): Promise<void>;
  
  // Gallery
  getGalleryItems(): Promise<GalleryItem[]>;
  createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem>;
  updateGalleryItem(id: number, item: Partial<InsertGalleryItem>): Promise<GalleryItem>;
  deleteGalleryItem(id: number): Promise<void>;
  
  // Contact
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  updateContactMessageStatus(id: number, status: string): Promise<ContactMessage>;
  
  // Profiles
  getProfile(id: string): Promise<Profile | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Services
  async getServices(): Promise<Service[]> {
    return await db.select().from(services).orderBy(asc(services.sortOrder));
  }

  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db.insert(services).values(insertService).returning();
    return service;
  }

  async updateService(id: number, updateService: Partial<InsertService>): Promise<Service> {
    const [service] = await db
      .update(services)
      .set(updateService)
      .where(eq(services.id, id))
      .returning();
    return service;
  }

  async deleteService(id: number): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  // Gallery
  async getGalleryItems(): Promise<GalleryItem[]> {
    return await db.select().from(galleryItems).orderBy(asc(galleryItems.sortOrder));
  }

  async createGalleryItem(insertItem: InsertGalleryItem): Promise<GalleryItem> {
    const [item] = await db.insert(galleryItems).values(insertItem).returning();
    return item;
  }

  async updateGalleryItem(id: number, updateItem: Partial<InsertGalleryItem>): Promise<GalleryItem> {
    const [item] = await db
      .update(galleryItems)
      .set(updateItem)
      .where(eq(galleryItems.id, id))
      .returning();
    return item;
  }

  async deleteGalleryItem(id: number): Promise<void> {
    await db.delete(galleryItems).where(eq(galleryItems.id, id));
  }

  // Contact
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db.insert(contactMessages).values(insertMessage).returning();
    return message;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async updateContactMessageStatus(id: number, status: string): Promise<ContactMessage> {
    const [message] = await db
      .update(contactMessages)
      .set({ status })
      .where(eq(contactMessages.id, id))
      .returning();
    return message;
  }

  // Profiles
  async getProfile(id: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.id, id));
    return profile;
  }
}

export const storage = new DatabaseStorage();
