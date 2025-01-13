import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { showDelayedNotification } from "./notification";

import sharp from "sharp";

/**
 * Converts an image to AVIF format using Sharp.
 * @param inputPath - The path to the original image file.
 * @param shouldCleanup - Whether to delete the original file after conversion.
 * @returns The output path of the converted AVIF image.
 */
async function convertToAvif(
  inputPath: string,
  shouldCleanup: boolean
): Promise<string> {
  // If the file is already .avif, skip re-conversion
  if (inputPath.endsWith(".avif")) {
    return inputPath;
  }

  const outputPath = inputPath.replace(/\.\w+$/, ".avif");
  vscode.window.showInformationMessage(
    `Converting: ${path.basename(inputPath)} → ${path.basename(outputPath)}`
  );

  try {
    await sharp(inputPath)
      .avif({ quality: 80 }) // Set the quality of the AVIF image
      .toFile(outputPath);

    if (shouldCleanup) {
      try {
        fs.unlinkSync(inputPath);
        vscode.window.showInformationMessage(
          `Cleaned up original file: ${path.basename(inputPath)}`
        );
      } catch (unlinkErr) {
        console.error("Error deleting original file:", unlinkErr);
        // Non-critical error—allow process to continue
      }
    }

    return outputPath;
  } catch (error) {
    console.error("Error converting image to AVIF:", error);
    throw new Error(
      `Failed to convert image '${path.basename(
        inputPath
      )}' to AVIF. Please check if the file is valid and not corrupted.`
    );
  }
}

/**
 * Retrieves the dimensions of an image file.
 * @param filePath - The path to the image file.
 * @returns An object containing the width and height.
 */
async function getImageDimensions(
  filePath: string
): Promise<{ width: number; height: number }> {
  try {
    const metadata = await sharp(filePath).metadata();
    return { width: metadata.width || 0, height: metadata.height || 0 };
  } catch (error) {
    console.error("Error reading image dimensions:", error);
    throw new Error(
      `Failed to read dimensions for '${path.basename(
        filePath
      )}'. Is it a valid image?`
    );
  }
}

/**
 * Generates alt text from a filename by replacing hyphens with spaces and capitalizing words.
 * @param filename - The name of the file (without a path).
 * @returns A string suitable for an alt attribute.
 */
function filenameToAltText(filename: string) {
  // Strip extension
  const baseName = filename.replace(/\.\w+$/, "");
  // Replace hyphens with spaces, split into words, then capitalize each
  const words = baseName.replace(/-/g, " ").split(" ");
  const capitalized = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  return capitalized.join(" ");
}

export function activate(context: vscode.ExtensionContext) {
  // Register the main command
  const disposable = vscode.commands.registerCommand(
    "processImage",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage(
          "No active editor found. Please open a file to insert an image snippet."
        );
        return;
      }

      // Grab config
      const config = vscode.workspace.getConfiguration();
      const pathPrefix =
        config.get<string>("dynamicImage.defaultPathPrefix") ?? "/public";
      const lightSubfolder =
        config.get<string>("dynamicImage.lightSubfolder") ?? "light";
      const darkSubfolder =
        config.get<string>("dynamicImage.darkSubfolder") ?? "dark";
      const defaultExt =
        config.get<string>("dynamicImage.defaultImageExtension") ?? "png";
      const cleanupOriginal =
        config.get<boolean>("dynamicImage.cleanupOriginal") ?? false;

      // Prompt user for an image name
      let imageName = await vscode.window.showInputBox({
        prompt: "Enter the base image filename (with or without extension).",
      });

      if (!imageName) {
        vscode.window.showWarningMessage(
          "No image name entered; command canceled."
        );
        return;
      }

      // If user didn't provide an extension, append the default
      if (!imageName.includes(".")) {
        imageName += `.${defaultExt}`;
      }

      // Show a progress notification if processing takes > 500ms
      const notification = showDelayedNotification();

      try {
        // Construct absolute paths
        const workspaceFolder =
          vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        if (!workspaceFolder) {
          throw new Error(
            "No workspace folder open. Please open a workspace before using this extension."
          );
        }

        // Build absolute paths for light and dark images
        const lightInputPath = path.join(
          workspaceFolder,
          pathPrefix,
          lightSubfolder,
          imageName
        );
        const darkInputPath = path.join(
          workspaceFolder,
          pathPrefix,
          darkSubfolder,
          imageName
        );

        // Check if light/dark images exist
        if (!fs.existsSync(lightInputPath)) {
          throw new Error(`Light image not found: ${lightInputPath}`);
        }
        if (!fs.existsSync(darkInputPath)) {
          throw new Error(`Dark image not found: ${darkInputPath}`);
        }

        // Convert both images
        const avifLightPath = await convertToAvif(
          lightInputPath,
          cleanupOriginal
        );
        const avifDarkPath = await convertToAvif(
          darkInputPath,
          cleanupOriginal
        );

        // Grab dimensions from the light image (assuming they match the dark version)
        const dimensions = await getImageDimensions(avifLightPath);

        // Generate alt text from the filename
        const altText = filenameToAltText(path.basename(imageName));

        // Prepare relative paths for snippet
        // e.g., removing "/public" from the path prefix or customizing per your doc structure
        const pathPrefixSanitized = pathPrefix.replace(/^\/?public/, "");
        const avifFileName = path
          .basename(imageName)
          .replace(/\.\w+$/, ".avif");

        // Insert snippet into the editor
        const snippet = `<Image
  srcLight='${pathPrefixSanitized}/${lightSubfolder}/${avifFileName}'
  srcDark='${pathPrefixSanitized}/${darkSubfolder}/${avifFileName}'
  alt='${altText}'
  width={${dimensions.width}}
  height={${dimensions.height}}
/>`;

        editor.insertSnippet(new vscode.SnippetString(snippet));
        vscode.window.showInformationMessage(
          "Dynamic Image snippet inserted successfully!"
        );
      } catch (error: any) {
        console.error("Image Processor Error:", error);
        vscode.window.showErrorMessage(
          `Failed to process image: ${error.message}`
        );
      } finally {
        // Cleanup progress notification
        notification.done();
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {
  // Cleanup if necessary
}
