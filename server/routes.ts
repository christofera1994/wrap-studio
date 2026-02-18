import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertServiceSchema, insertGalleryItemSchema, insertContactMessageSchema } from "@shared/schema";

// Seed Data
const SEED_SERVICES = [
  { title: "Full Color Change", description: "Potpuna promena boje vozila visokokvalitetnim folijama.", price: "od 1200€", sortOrder: 1, isActive: true },
  { title: "Chrome Delete", description: "Zatamnjivanje svih hromiranih delova za agresivniji izgled.", price: "od 150€", sortOrder: 2, isActive: true },
  { title: "PPF Zaštita", description: "Paint Protection Film - nevidljiva zaštita od kamenčića i ogrebotina.", price: "od 1500€", sortOrder: 3, isActive: true },
  { title: "Krov & Retrovizori", description: "Parcijalno presvlačenje krova i retrovizora u drugu boju (najčešće crna sjaj).", price: "od 100€", sortOrder: 4, isActive: true },
  { title: "Zatamnjivanje Stakala", description: "Visokokvalitetne folije sa UV zaštitom i atestom.", price: "od 80€", sortOrder: 5, isActive: true },
  { title: "Brendeniranje Vozila", description: "Dizajn i lepljenje reklama za firmu na vaša vozila.", price: "Na upit", sortOrder: 6, isActive: true },
];

const SEED_GALLERY = [
  { title: "Matte Black Audi RS7", description: "Potpuno presvlačenje u mat crnu sa sjajnim crnim detaljima.", imageUrl: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2669&auto=format&fit=crop", sortOrder: 1, isActive: true },
  { title: "Nardo Grey BMW M4", description: "Klasična Nardo Grey nijansa koja ističe linije automobila.", imageUrl: "https://images.unsplash.com/photo-1555215695-3004980adade?q=80&w=2680&auto=format&fit=crop", sortOrder: 2, isActive: true },
  { title: "Ferrari Red Porsche 911", description: "Vatrena crvena folija visokog sjaja.", imageUrl: "https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2670&auto=format&fit=crop", sortOrder: 3, isActive: true },
  { title: "Satin Blue Mercedes AMG", description: "Satenska završnica u kraljevsko plavoj boji.", imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2670&auto=format&fit=crop", sortOrder: 4, isActive: true },
  { title: "Camo Wrap G-Wagon", description: "Custom kamuflažni dizajn za Mercedes G-Klasu.", imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2670&auto=format&fit=crop", sortOrder: 5, isActive: true },
  { title: "Gold Chrome Lamborghini", description: "Ekskluzivna zlatna hrom folija.", imageUrl: "https://images.unsplash.com/photo-1544605368-180a4a30fc49?q=80&w=2670&auto=format&fit=crop", sortOrder: 6, isActive: true },
  { title: "PPF Ferrari 488", description: "Nevidljiva zaštita na crvenom Ferrariju.", imageUrl: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=2670&auto=format&fit=crop", sortOrder: 7, isActive: true },
  { title: "Racing Stripes Mustang", description: "Klasične trkačke linije.", imageUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2670&auto=format&fit=crop", sortOrder: 8, isActive: true },
  { title: "Color Shift Wrap", description: "Folija koja menja boju zavisno od ugla gledanja.", imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2670&auto=format&fit=crop", sortOrder: 9, isActive: true },
];

async function seedDatabase() {
  try {
    const services = await storage.getServices();
    if (services.length === 0) {
      console.log("Seeding services...");
      for (const service of SEED_SERVICES) {
        await storage.createService(service);
      }
    }

    const gallery = await storage.getGalleryItems();
    if (gallery.length === 0) {
      console.log("Seeding gallery...");
      for (const item of SEED_GALLERY) {
        await storage.createGalleryItem(item);
      }
    }
    console.log("Database seeding completed.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed Database on startup
  seedDatabase();

  // --- API Routes ---

  // Services
  app.get(api.services.list.path, async (_req, res) => {
    const services = await storage.getServices();
    res.json(services);
  });

  app.post(api.services.create.path, async (req, res) => {
    try {
      const input = insertServiceSchema.parse(req.body);
      // TODO: Add auth check here if not handled by middleware
      const service = await storage.createService(input);
      res.status(201).json(service);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });
  
  app.patch(api.services.update.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const input = insertServiceSchema.partial().parse(req.body);
      const service = await storage.updateService(id, input);
      res.json(service);
    } catch (err) {
       res.status(400).json({ message: "Invalid request" });
    }
  });

  app.delete(api.services.delete.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteService(id);
      res.status(204).send();
    } catch (err) {
      res.status(400).json({ message: "Failed to delete" });
    }
  });

  // Gallery
  app.get(api.gallery.list.path, async (_req, res) => {
    const items = await storage.getGalleryItems();
    res.json(items);
  });

  app.post(api.gallery.create.path, async (req, res) => {
    try {
      const input = insertGalleryItemSchema.parse(req.body);
      const item = await storage.createGalleryItem(input);
      res.status(201).json(item);
    } catch (err) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.patch(api.gallery.update.path, async (req, res) => {
    try {
       const id = parseInt(req.params.id);
       const input = insertGalleryItemSchema.partial().parse(req.body);
       const item = await storage.updateGalleryItem(id, input);
       res.json(item);
    } catch (err) {
       res.status(400).json({ message: "Invalid request" });
    }
  });

  app.delete(api.gallery.delete.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteGalleryItem(id);
      res.status(204).send();
    } catch (err) {
      res.status(400).json({ message: "Failed to delete" });
    }
  });

  // Contact
  app.post(api.contact.send.path, async (req, res) => {
    try {
      const input = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(input);
      
      // Send Email if RESEND_API_KEY is configured
      if (process.env.RESEND_API_KEY && process.env.MY_EMAIL) {
        try {
          const { Resend } = await import('resend');
          const resend = new Resend(process.env.RESEND_API_KEY);
          
          await resend.emails.send({
            from: 'Car Wrap Studio <onboarding@resend.dev>', // Or verified domain
            to: process.env.MY_EMAIL,
            subject: `Nova poruka od: ${input.name}`,
            html: `
              <p><strong>Ime:</strong> ${input.name}</p>
              <p><strong>Email:</strong> ${input.email}</p>
              <p><strong>Poruka:</strong></p>
              <p>${input.message}</p>
            `
          });
          console.log("Email sent successfully");
        } catch (emailError) {
          console.error("Failed to send email:", emailError);
          // Don't fail the request if email fails, just log it
        }
      }

      res.json({ message: "Poruka uspešno poslata!" });
    } catch (err) {
      res.status(400).json({ message: "Došlo je do greške prilikom slanja poruke." });
    }
  });

  app.get(api.contact.list.path, async (req, res) => {
    // Auth check should be here
    const messages = await storage.getContactMessages();
    res.json(messages);
  });

  app.patch(api.contact.updateStatus.path, async (req, res) => {
     try {
       const id = parseInt(req.params.id);
       const { status } = req.body;
       const message = await storage.updateContactMessageStatus(id, status);
       res.json(message);
     } catch (err) {
       res.status(400).json({ message: "Update failed" });
     }
  });

  return httpServer;
}
