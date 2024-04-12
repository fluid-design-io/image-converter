import { z } from 'zod';

export const resizeModeOptions = [
  'long-edge',
  'short-edge',
  'width-height',
  'percentage',
] as const;

const ResizeModeEnum = z.enum(resizeModeOptions);

/**
 * Resize options for the image
 */
const ResizeOptions = z.object({
  /**
   * Required for `width-height` mode
   */
  width: z.coerce
    .number()
    .int()
    .positive()
    .min(1, 'Width must be at least 1')
    .max(40000, 'Maximun allowed width is 40000')
    .default(2560)
    .optional(),
  /**
   * Required for `width-height` mode
   */
  height: z.coerce
    .number()
    .int()
    .positive()
    .min(1, 'Height must be at least 1')
    .max(40000, 'Maximun allowed height is 40000')
    .default(1440)
    .optional(),
  /**
   * Required for `percentage` mode
   */
  percentage: z.coerce
    .number()
    .int()
    .positive()
    .min(1, 'Percentage must be at least 1')
    .max(100, 'Percentage must be at most 100')
    .default(50)
    .optional(),
  /**
   * Required for `long-edge` or `short-edge` mode
   */
  length: z.coerce
    .number()
    .int()
    .positive()
    .min(1, 'Length must be at least 1')
    .max(40000, 'Maximun allowed length is 40000')
    .default(2560)
    .optional(),
});

export const presetSchema = z.object({
  imageFormat: z.string(),
  quality: z.coerce
    .number()
    .int()
    .min(30, 'Quality must be at least 30')
    .max(100, 'Quality must be at most 100')
    .default(85),

  resizeToFit: z.boolean(),
  /**
   * Whether to enlarge the image if it is smaller than the specified dimensions
   * @default true
   */
  dontEnlarge: z.boolean().default(true),
  /**
   * Mode to use for resizing
   * @see ResizeModeEnum
   * @default 'long-edge'
   */
  resizeMode: ResizeModeEnum,
  resizeOptions: ResizeOptions,
  /**
   * Pixels per inch
   * @default 72
   */
  resolution: z.coerce.number().int().positive().min(24).max(600).default(72),
  exportLocation: z.string(),
});

export type Preset = z.infer<typeof presetSchema>;
export type ResizeMode = z.infer<typeof ResizeModeEnum>;
