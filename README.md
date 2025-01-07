# Sharp Image Tools

A collection of modern image processing tools built with TypeScript and Sharp.

<div align="center">

![Static Badge](https://img.shields.io/badge/License-MIT-blue)

</div>

This repository contains two main tools:

1. **Sharp File Converter** - A desktop application for batch image processing
2. **Dynamic Image Processor** - A VS Code extension for automated image optimization

## Sharp File Converter

A cross-platform desktop application for batch image processing and conversion built with Electron, React, and Sharp.

### Features

- 🖼️ Batch image processing and conversion
- 📐 Flexible image resizing options (width/height, long edge, short edge, percentage)
- 🎨 Support for multiple image formats (PNG, JPEG, WebP, AVIF)
- 💾 Customizable export settings
- 📋 Preset management for quick access to common settings
- 🌓 Dark mode support
- 🖥️ Native desktop experience with modern UI

## Dynamic Image Processor (VS Code Extension)

A VS Code extension that automates image optimization and dimension detection for web development workflows.

### Features

- 🔄 Automatic conversion to AVIF format
- 📏 Automatic image dimension detection and insertion
- ⚙️ Configurable path prefixes for light/dark modes
- 🎯 Smart snippet insertion with accurate dimensions
- 🗑️ Optional original file cleanup

### VS Code Extension Settings

```json
{
  "dynamicImage.defaultPathPrefixLight": "/images/light",
  "dynamicImage.defaultPathPrefixDark": "/images/dark",
  "dynamicImage.defaultImageExtension": "avif"
}
```

## Installation

### Desktop App

```bash
# Clone the repository
git clone https://github.com/fluid-design-io/image-converters.git

# Navigate to project directory
cd sharp-image-tools

# Install dependencies
npm install
```

### VS Code Extension

1. Open VS Code
2. Press `Ctrl+Shift+X` or `Cmd+Shift+X`
3. Search for "Dynamic Image Processor"
4. Click Install

## Tech Stack

- **Core**: TypeScript, Sharp
- **Desktop App**:
  - Electron + React
  - Tailwind CSS + Radix UI
  - React Hook Form + Zod
  - Framer Motion
- **VS Code Extension**:
  - VS Code Extension API
  - Sharp for image processing

## Project Structure

```
├── apps/
│   ├── desktop/src/         # Sharp File Converter
│   │   ├── main/       # Electron main process
│   │   └── renderer/   # React renderer
│   └── vscode/         # Dynamic Image Processor extension
```

## Features in Detail

### Desktop App

- Advanced image processing options
- Preset management
- Batch processing
- Preview thumbnails
- Drag-and-drop interface

### VS Code Extension

- Automatic AVIF conversion
- Image dimension detection
- Custom path configuration
- Smart code snippet insertion

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

[GitHub Issues](https://github.com/fluid-design-io/image-converters/issues)

## License

Both projects are licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
