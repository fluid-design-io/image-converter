# Dynamic Image Processor

The Dynamic Image Processor is a Visual Studio Code extension that automates the conversion of images to the `.avif` format and dynamically inserts accurate image dimensions into your code. This extension is particularly useful for web developers looking to optimize their image assets directly within the VS Code environment.

## Features

- **Automatic Conversion**: Convert images to `.avif` format seamlessly.
- **Dimension Detection**: Automatically detect and insert image dimensions into your image tags.
- **Custom Configuration**: Set default paths and image extensions through VS Code settings for a personalized experience.

## Installation

To install the Dynamic Image Processor, follow these steps:

1. Open Visual Studio Code.
2. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window or by pressing `Ctrl+Shift+X`.
3. Search for "Dynamic Image Processor."
4. Click on the install button.

Alternatively, if you have the `.vsix` file:

1. Open Visual Studio Code.
2. Go to the Extensions view.
3. Click on the `...` at the top of the Extensions view, choose `Install from VSIX...`, and select the `.vsix` file.

## Usage

After installation, you can use the extension by following these steps:

1. Open a project that contains your image assets.
2. Open the Command Palette with `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac).
3. Type `Insert Dynamic Image` and hit enter.
4. Follow the prompt to input the name of the image you want to convert and insert.

The extension will handle the conversion to `.avif`, delete the original file (if configured), and insert a snippet with the new image path and dimensions.

## Configuration

Configure the extension by going to the settings:

- `dynamicImage.defaultPathPrefixLight`: Set the default path prefix for light mode images.
- `dynamicImage.defaultPathPrefixDark`: Set the default path prefix for dark mode images.
- `dynamicImage.defaultImageExtension`: Set the default image file extension to use.

## Support

For support, feature requests, or bug reporting, please visit the [GitHub repository](https://github.com/fluid-design-io/dynamic-image-processor) and open an issue.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

## License

Distributed under the MIT License.
