export * from "./tailwind";

/**
 * Updates the file extension based on the target format
 * @param fileName - Original file name
 * @param format - Target format (jpeg, png, webp, avif)
 * @returns File name with updated extension
 */
export function updateFileExtension(fileName: string, format: string): string {
  const lastDotIndex = fileName.lastIndexOf(".");
  const nameWithoutExtension =
    lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;

  const extensionMap: Record<string, string> = {
    jpeg: ".jpg",
    jpg: ".jpg",
    png: ".png",
    webp: ".webp",
    avif: ".avif",
  };

  const newExtension = extensionMap[format.toLowerCase()] || `.${format}`;
  return nameWithoutExtension + newExtension;
}
