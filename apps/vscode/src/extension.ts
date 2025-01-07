import * as vscode from "vscode";
import sharp from "sharp";
import * as fs from "fs";
import { showDelayedNotification } from "./notification";

async function convertToAvif(inputPath: string): Promise<string> {
  // ignore if the file is already an AVIF
  if (inputPath.endsWith(".avif")) {
    return inputPath;
  }
  const outputPath = inputPath.replace(/\.\w+$/, ".avif");

  console.log("Input Path:", inputPath);
  console.log("Output Path:", outputPath);

  try {
    await sharp(inputPath)
      .avif({ quality: 80 }) // Set the quality of the AVIF image
      .toFile(outputPath);
    fs.unlinkSync(inputPath); // Delete the original file
    return outputPath;
  } catch (error) {
    console.error("Error converting image to AVIF:", error);
    throw new Error("Failed to convert image to AVIF");
  }
}

async function getImageDimensions(
  filePath: string
): Promise<{ width: number; height: number }> {
  try {
    const metadata = await sharp(filePath).metadata();
    return { width: metadata.width || 0, height: metadata.height || 0 };
  } catch (error) {
    console.error("Error reading image dimensions:", error);
    throw new Error("Failed to read image dimensions");
  }
}

function filenameToAltText(filename: string) {
  // Replace all hyphens with spaces and split the string into words
  let words = filename.replace(/-/g, " ").split(" ");

  // Capitalize the first letter of each word
  words = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the words back into a single string
  return words.join(" ");
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.dynamicImage",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage("No active editor");
        return;
      }

      //* Get default path prefix and default image extension from settings
      const config = vscode.workspace.getConfiguration();
      const pathPrefix = config.get("dynamicImage.defaultPathPrefix") as string;
      const defaultExt = config.get(
        "dynamicImage.defaultImageExtension"
      ) as string;

      let imageName = await vscode.window.showInputBox({
        prompt: "Enter the image name",
      });
      if (!imageName) {
        return;
      }
      if (!imageName.includes(".")) {
        imageName = imageName + "." + defaultExt;
      }

      //* Show a progress notification
      const notification = showDelayedNotification();

      //* Get the base path of the workspace
      try {
        const basePath =
          vscode.workspace.workspaceFolders?.[0].uri.fsPath + pathPrefix + "/";
        const imageLightPath = basePath + "light/" + imageName;
        const imageDarkPath = basePath + "dark/" + imageName;
        const avifLightPath = await convertToAvif(imageLightPath);
        await convertToAvif(imageDarkPath);
        const dimensions = await getImageDimensions(avifLightPath);
        const altText = filenameToAltText(imageName); // Remove path and extension

        const pathPrefixWithoutPublic = pathPrefix.replace("/public", "");
        const snippet = `<Image
		          srcLight='${pathPrefixWithoutPublic}/light/${imageName.replace(
          /\.\w+$/,
          ".avif"
        )}'
		          srcDark='${pathPrefixWithoutPublic}/dark/${imageName.replace(
          /\.\w+$/,
          ".avif"
        )}'
		          alt='${altText.replace(/\.\w+$/, "")}'
		          width={${dimensions.width}}
		          height={${dimensions.height}}
		        />`;

        editor.insertSnippet(new vscode.SnippetString(snippet));
      } catch (error: any) {
        vscode.window.showErrorMessage(
          "Failed to process image: " + error.message
        );
      } finally {
        notification.done();
      }
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
