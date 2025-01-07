import { z } from 'zod';

export const imageFileSchema = z.object({
  name: z.string(),
  // jpg, jpeg, png, webp, avif
  type: z.string().regex(/image\/(jpeg|jpg|png|webp|avif)/),
});

// This function can be used to validate files
export const isImageFile = (file: File) => imageFileSchema.safeParse(file);
