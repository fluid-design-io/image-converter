import { promises as fs } from 'fs'
import { basename, dirname, extname } from 'path'
import sharp from 'sharp'
import { logger } from './utils'

/**
 * Supported image file extensions
 */
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tiff', '.tif', '.bmp', '.gif']

/**
 * Check if a file is a supported image type
 */
export function isImageFile(filePath: string): boolean {
  const ext = extname(filePath).toLowerCase()
  return SUPPORTED_EXTENSIONS.includes(ext)
}

/**
 * Get basic information about an image file
 */
export async function getImageInfo(filePath: string): Promise<{ size: number, width: number, height: number, format: string }> {
  const stats = await fs.stat(filePath)
  const metadata = await sharp(filePath).metadata()
  
  return {
    size: stats.size,
    width: metadata.width || 0,
    height: metadata.height || 0,
    format: metadata.format || 'unknown'
  }
}

/**
 * Compression options
 */
export interface CompressionOptions {
  quality: number
  format: 'same-as-source' | 'jpg' | 'png' | 'webp' | 'avif'
  maxWidth?: number
}

/**
 * Get the output format based on the input file and options
 */
function getOutputFormat(inputPath: string, format: CompressionOptions['format']): string {
  if (format === 'same-as-source') {
    const ext = extname(inputPath).toLowerCase()
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        return 'jpeg'
      case '.png':
        return 'png'
      case '.webp':
        return 'webp'
      case '.avif':
        return 'avif'
      case '.tiff':
      case '.tif':
        return 'tiff'
      case '.bmp':
        return 'png' // Convert BMP to PNG for better compression
      case '.gif':
        return 'png' // Convert GIF to PNG (note: this loses animation)
      default:
        return 'jpeg'
    }
  }
  
  return format === 'jpg' ? 'jpeg' : format
}

/**
 * Get the output file extension based on format
 */
function getOutputExtension(format: string): string {
  switch (format) {
    case 'jpeg':
      return '.jpg'
    case 'png':
      return '.png'
    case 'webp':
      return '.webp'
    case 'avif':
      return '.avif'
    case 'tiff':
      return '.tiff'
    default:
      return '.jpg'
  }
}

/**
 * Compress an image file using Sharp
 * Returns the number of bytes saved (positive number means compression was successful)
 */
export async function compressImage(filePath: string, options: CompressionOptions): Promise<number> {
  try {
    // Get original file size
    const originalStats = await fs.stat(filePath)
    const originalSize = originalStats.size
    
    // Determine output format
    const outputFormat = getOutputFormat(filePath, options.format)
    const outputExtension = getOutputExtension(outputFormat)
    
    // Create Sharp instance
    let processor = sharp(filePath)
    
    // Apply resizing if maxWidth is specified
    if (options.maxWidth) {
      processor = processor.resize({
        width: options.maxWidth,
        height: undefined, // Maintain aspect ratio
        fit: 'inside',
        withoutEnlargement: true
      })
    }
    
    // Apply compression based on format
    switch (outputFormat) {
      case 'jpeg':
        processor = processor.jpeg({ 
          quality: options.quality,
          progressive: true,
          mozjpeg: true
        })
        break
      case 'png':
        processor = processor.png({ 
          quality: options.quality,
          compressionLevel: 9,
          progressive: true
        })
        break
      case 'webp':
        processor = processor.webp({ 
          quality: options.quality,
          effort: 6
        })
        break
      case 'avif':
        processor = processor.avif({ 
          quality: options.quality,
          effort: 9
        })
        break
      case 'tiff':
        processor = processor.tiff({ 
          quality: options.quality,
          compression: 'lzw'
        })
        break
      default:
        processor = processor.jpeg({ quality: options.quality })
    }
    
    // Generate compressed image buffer
    const compressedBuffer = await processor.toBuffer()
    
    // If format changed, we need to update the file extension
    const dir = dirname(filePath)
    const baseName = basename(filePath, extname(filePath))
    const currentExtension = extname(filePath)
    
    let outputPath = filePath
    if (outputExtension !== currentExtension.toLowerCase()) {
      // Format changed, create new filename
      outputPath = `${dir}/${baseName}${outputExtension}`
      
      // Remove original file if we're changing format
      await fs.unlink(filePath)
      logger.info(`Converted ${basename(filePath)} to ${basename(outputPath)}`)
    }
    
    // Write compressed image
    await fs.writeFile(outputPath, compressedBuffer)
    
    // Calculate bytes saved
    const newSize = compressedBuffer.length
    const bytesSaved = originalSize - newSize
    
    logger.info(`Compressed ${basename(outputPath)}: ${originalSize} → ${newSize} bytes (saved ${bytesSaved} bytes)`)
    
    return bytesSaved
    
  } catch (error) {
    logger.error(`Error compressing ${filePath}:`, error)
    throw new Error(`Failed to compress image: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Batch compress multiple images
 */
export async function compressImages(filePaths: string[], options: CompressionOptions): Promise<{ totalSaved: number, results: Array<{ path: string, saved: number, error?: string }> }> {
  const results: Array<{ path: string, saved: number, error?: string }> = []
  let totalSaved = 0
  
  for (const filePath of filePaths) {
    try {
      const saved = await compressImage(filePath, options)
      results.push({ path: filePath, saved })
      totalSaved += saved
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      results.push({ path: filePath, saved: 0, error: errorMessage })
      logger.error(`Failed to compress ${filePath}:`, error)
    }
  }
  
  return { totalSaved, results }
}