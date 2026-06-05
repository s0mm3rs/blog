import { defineCollection, z } from 'astro:content';

const articulos = defineCollection({
  type: 'content',
  schema: z.object({
    titulo: z.string(),
    descripcion: z.string(),
    fecha: z.date(),
    tags: z.array(z.string()).default([]),
    // Link al artículo original en LinkedIn (opcional)
    linkedin: z.string().url().optional(),
    // Marcar como destacado para que aparezca arriba
    destacado: z.boolean().default(false),
    // Borrador: no se publica si es true
    borrador: z.boolean().default(false),
  }),
});

export const collections = { articulos };
