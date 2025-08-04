import { promises as fs } from "fs";
import { basename, dirname, extname, join } from "path";
import sharp from "sharp";
import { logger } from "./utils";

const SUPPORTED_EXTENSIONS = [
	".jpg",
	".jpeg",
	".png",
	".webp",
	".avif",
	".tiff",
	".tif",
	".gif",
];

export function isImageFile(filePath: string): boolean {
	return SUPPORTED_EXTENSIONS.includes(extname(filePath).toLowerCase());
}

export interface CompressionOptions {
	quality: number;
	format: "same-as-source" | "jpg" | "png" | "webp" | "avif";
	maxWidth?: number;
}

function getOutputFormat(
	inputPath: string,
	format: CompressionOptions["format"],
): "jpeg" | "png" | "webp" | "avif" | "tiff" {
	if (format === "same-as-source") {
		const ext = extname(inputPath).toLowerCase();
		switch (ext) {
			case ".jpg":
			case ".jpeg":
				return "jpeg";
			case ".png":
				return "png";
			case ".webp":
				return "webp";
			case ".avif":
				return "avif";
			case ".tiff":
			case ".tif":
				return "tiff";
			default:
				return "jpeg";
		}
	}
	return format === "jpg" ? "jpeg" : format;
}

function getOutputExtension(format: string): string {
	return format === "jpeg" ? ".jpg" : `.${format}`;
}

export async function compressImage(
	filePath: string,
	options: CompressionOptions,
): Promise<{ savedBytes: number; newSize: number; originalSize: number }> {
	try {
		const originalBuffer = await fs.readFile(filePath);
		const originalSize = originalBuffer.length;

		const outputFormat = getOutputFormat(filePath, options.format);
		const outputExtension = getOutputExtension(outputFormat);

		let processor = sharp(originalBuffer);

		if (options.maxWidth) {
			processor = processor.resize({
				width: options.maxWidth,
				fit: "inside",
				withoutEnlargement: true,
			});
		}

		switch (outputFormat) {
			case "jpeg":
				processor = processor.jpeg({ quality: options.quality, mozjpeg: true });
				break;
			case "png":
				processor = processor.png({ quality: options.quality, compressionLevel: 9 });
				break;
			case "webp":
				processor = processor.webp({ quality: options.quality, effort: 6 });
				break;
			case "avif":
				processor = processor.avif({ quality: options.quality, effort: 9 });
				break;
			case "tiff":
				processor = processor.tiff({ quality: options.quality });
				break;
		}

		const compressedBuffer = await processor.toBuffer();
		const newSize = compressedBuffer.length;
		const savedBytes = originalSize - newSize;

		if (savedBytes < 0) {
			logger.info(`Compressed file is larger for ${basename(filePath)}.`);
			return { savedBytes: 0, newSize: originalSize, originalSize };
		}

		const dir = dirname(filePath);
		const baseName = basename(filePath, extname(filePath));
		const newPath = join(dir, `${baseName}${outputExtension}`);

		if (newPath.toLowerCase() !== filePath.toLowerCase()) {
			await fs.unlink(filePath);
		}
		
		await fs.writeFile(newPath, compressedBuffer);

		return { savedBytes, newSize, originalSize };
	} catch (error) {
		logger.error(`Error compressing ${filePath}:`, error);
		throw new Error(
			`Failed to compress image: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}