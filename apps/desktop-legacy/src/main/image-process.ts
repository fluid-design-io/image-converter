import { Preset } from '@/types/preset';
import path from 'path';
import sharp from 'sharp';

export async function processImages(filePaths: string[], preset: Preset) {
  const {
    imageFormat,
    quality,
    resizeToFit,
    dontEnlarge,
    resizeMode,
    resizeOptions,
    exportLocation,
  } = preset;

  const processFile = async (filePath: string) => {
    let transformer = sharp(filePath);

    if (resizeToFit) {
      switch (resizeMode) {
        case 'width-height':
          transformer = transformer.resize(
            resizeOptions.width,
            resizeOptions.height,
            {
              withoutEnlargement: dontEnlarge,
            },
          );
          break;
        case 'long-edge':
        case 'short-edge': {
          const fit =
            resizeMode === 'long-edge' ? sharp.fit.outside : sharp.fit.inside;
          transformer = transformer.resize({
            width: resizeOptions.length,
            height: resizeOptions.length,
            fit,
            withoutEnlargement: dontEnlarge,
          });
          break;
        }
        case 'percentage': {
          const metadata = await transformer.metadata();
          const width = metadata.width
            ? Math.round(metadata.width * (resizeOptions.percentage! / 100))
            : undefined;
          const height = metadata.height
            ? Math.round(metadata.height * (resizeOptions.percentage! / 100))
            : undefined;
          transformer = transformer.resize(width, height, {
            withoutEnlargement: dontEnlarge,
          });
          break;
        }
        default:
          break;
      }
    }

    if (imageFormat) {
      transformer = transformer.toFormat(imageFormat as any, {
        quality,
      });
    }

    const outputFileName = `${path.basename(
      filePath,
      path.extname(filePath),
    )}.${imageFormat}`;
    const outputPath = path.join(exportLocation, outputFileName);
    await transformer.toFile(outputPath);

    return outputPath;
  };

  const processedFiles = await Promise.all(filePaths.map(processFile));
  return processedFiles;
}
