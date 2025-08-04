# Tiny Image for VS Code

![Tiny Image Icon](./res/icon.png)

> The best compression tool is the one right in your editor.

A powerful and easy-to-use image compression extension for Visual Studio Code, right in your editor. Powered by [sharp](https://sharp.pixelplumbing.com/).

## ✨ Features

-   **Compress Images**: Quickly compress various image formats (`JPEG`, `PNG`, `WebP`, `AVIF`, `TIFF`, `GIF`).
-   **Format Conversion**: Convert images to modern formats like `WebP` or `AVIF` to optimize for web performance.
-   **Interactive Mode**: Fine-tune compression settings like `quality`, `format`, and `max-width` for each operation.
-   **Batch Processing**: Compress multiple images or entire folders at once.
-   **Context Menu Integration**: Right-click on files or folders in the explorer to start compressing.

## 🚀 Usage

All commands are available from the File Explorer context menu.

### Compress with Default Settings

1.  In the VS Code Explorer, **right-click an image file** (or select multiple files and right-click).
2.  Select **Compress Images** from the context menu.
3.  The images will be compressed using your configured default settings.

### Interactive Compression

For more control over the output:

1.  **Right-click your image(s)** and select **Compress Images with Options...**.
2.  You'll be prompted to enter:
    -   **Max Width** (optional): Resize the image while maintaining aspect ratio.
    -   **Quality** (1-100): Set the compression quality.
    -   **Format**: Choose the output format (`Same as Source`, `JPG`, `PNG`, `WebP`, `AVIF`).
3.  The images will be processed with your chosen settings.

## 📦 Commands

<!-- commands -->

| Command                | Title                           |
| ---------------------- | ------------------------------- |
| `compress`             | Compress Images                 |
| `compress-interactive` | Compress Images with Options... |

<!-- commands -->

## 🔧 Configurations

<!-- configs -->

| Key                  | Description                                                | Type     | Default            |
| -------------------- | ---------------------------------------------------------- | -------- | ------------------ |
| `tiny-image.quality` | The default image quality for the compressed image (0-100) | `number` | `85`               |
| `tiny-image.format`  | The default image format for the compressed image          | `string` | `"same-as-source"` |

<!-- configs -->

## 🏛️ Architecture Overview

The extension is built with a simple and effective architecture:

-   **`index.ts`**: The main entry point that registers commands and handles user interactions (UI prompts, progress notifications). It uses `reactive-vscode` for clean, declarative command registration.
-   **`image-processor.ts`**: This is the core of the extension. It uses the **sharp** library to handle all image manipulation tasks. It's designed to be efficient, performing operations on buffers to minimize disk I/O and running compressions concurrently.
-   **`package.json`**: Defines the extension's metadata, commands, configuration options, and activation events. It's configured to activate the extension only when an image-related command is triggered, ensuring minimal impact on startup performance.
-   **`utils.ts` / `config.ts`**: Helper files for logging, size formatting, and managing configuration, keeping the main logic clean and focused.

---

Enjoy smaller images and faster websites!