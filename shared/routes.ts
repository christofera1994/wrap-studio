import { z } from 'zod';
import { insertServiceSchema, insertGalleryItemSchema, insertContactMessageSchema, services, galleryItems, contactMessages } from './schema';

export const api = {
  services: {
    list: {
      method: 'GET' as const,
      path: '/api/services' as const,
      responses: {
        200: z.array(z.custom<typeof services.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/services' as const,
      input: insertServiceSchema,
      responses: {
        201: z.custom<typeof services.$inferSelect>(),
        400: z.object({ message: z.string() }), // Validation error
        401: z.object({ message: z.string() }), // Unauthorized
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/services/:id' as const,
      input: insertServiceSchema.partial(),
      responses: {
        200: z.custom<typeof services.$inferSelect>(),
        400: z.object({ message: z.string() }),
        401: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/services/:id' as const,
      responses: {
        204: z.void(),
        401: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
      },
    },
  },
  gallery: {
    list: {
      method: 'GET' as const,
      path: '/api/gallery' as const,
      responses: {
        200: z.array(z.custom<typeof galleryItems.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/gallery' as const,
      input: insertGalleryItemSchema,
      responses: {
        201: z.custom<typeof galleryItems.$inferSelect>(),
        400: z.object({ message: z.string() }),
        401: z.object({ message: z.string() }),
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/gallery/:id' as const,
      input: insertGalleryItemSchema.partial(),
      responses: {
        200: z.custom<typeof galleryItems.$inferSelect>(),
        400: z.object({ message: z.string() }),
        401: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/gallery/:id' as const,
      responses: {
        204: z.void(),
        401: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
      },
    },
  },
  contact: {
    send: {
      method: 'POST' as const,
      path: '/api/contact' as const,
      input: insertContactMessageSchema,
      responses: {
        200: z.object({ message: z.string() }),
        400: z.object({ message: z.string() }),
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/admin/contact' as const,
      responses: {
        200: z.array(z.custom<typeof contactMessages.$inferSelect>()),
        401: z.object({ message: z.string() }),
      },
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/admin/contact/:id/status' as const,
      input: z.object({ status: z.string() }),
      responses: {
        200: z.custom<typeof contactMessages.$inferSelect>(),
        401: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
