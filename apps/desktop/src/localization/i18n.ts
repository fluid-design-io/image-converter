import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  resources: {
    en: {
      translation: {
        appName: "Image Converter",
        titleHomePage: {
          title: "Home",
          description:
            "Convert and optimize your images with drag-and-drop ease",
        },
        titlePresetsPage: {
          title: "Presets",
          description: "Save and manage your favorite processing settings",
        },
        titleSettingsPage: {
          title: "Settings",
          description: "Configure your image processing preferences",
        },
        // ImageConverterPage translations
        imageConverter: {
          dropFilesHere: "Drop the files here...",
          dropImagesHere: "Drop images here",
          processingImages: "Processing images...",
          supportsFormats: "Supports JPG and PNG files",
        },
        // PresetsPage translations
        presets: {
          saveCurrentSettings: "Save Current Settings",
          saveCurrentSettingsDesc:
            "Save your current processing options as a new preset",
          presetName: "Preset Name",
          enterPresetName: "Enter preset name",
          currentSettings: "Current Settings",
          savePreset: "Save Preset",
          savedPresets: "Saved Presets",
          savedPresetsDesc: "Your saved presets for quick access",
          noPresetsYet:
            "No presets saved yet. Create your first preset to get started!",
          load: "Load",
          quality: "quality",
          quantized: "quantized",
        },
        // SettingsPage translations
        settings: {
          outputDestination: "Output Destination",
          outputDestinationDesc: "Choose where processed images will be saved",
          sameAsSource: "Same as source folder",
          sameAsSourceDesc:
            "Save processed images in the same folder as the original",
          downloadsFolder: "Downloads folder",
          customFolder: "Custom folder",
          customFolderDesc: "Choose a specific folder for all processed images",
          customFolderPath: "Custom Folder Path",
          noFolderSelected: "No folder selected",
          applicationInfo: "Application Info",
          applicationInfoDesc:
            "Information about the application and its capabilities",
          supportedInputFormats: "Supported Input Formats",
          supportedOutputFormats: "Supported Output Formats",
          processingFeatures: "Processing Features",
          version: "Version",
          additionalSettings: "Additional Settings",
          additionalSettingsDesc:
            "More configuration options will be available in future updates",
          futureSettings: "Future settings may include:",
          qualityControl: "Quality control (1-100%)",
          smartResizing: "Smart resizing with aspect ratio preservation",
          pngQuantization: "PNG quantization for reduced file sizes",
          batchProcessing: "Batch processing",
          defaultProcessingOptions: "Default processing options",
          autoSavePreferences: "Auto-save preferences",
          themeCustomization: "Theme customization",
          keyboardShortcuts: "Keyboard shortcuts",
          processingQueueManagement: "Processing queue management",
        },
      },
    },
    "zh-CN": {
      translation: {
        appName: "图片格式转换器",
        titleHomePage: {
          title: "首页",
          description: "拖放即可转换图片格式",
        },
        titlePresetsPage: {
          title: "预设",
          description: "保存和管理你的最爱处理设置",
        },
        titleSettingsPage: {
          title: "设置",
          description: "配置你的图片处理偏好",
        },
        // ImageConverterPage translations
        imageConverter: {
          dropFilesHere: "将文件拖放到这里...",
          dropImagesHere: "拖放图片到这里",
          processingImages: "正在处理图片...",
          supportsFormats: "支持 JPG 和 PNG 文件",
        },
        // PresetsPage translations
        presets: {
          saveCurrentSettings: "保存当前设置",
          saveCurrentSettingsDesc: "将当前处理选项保存为新预设",
          presetName: "预设名称",
          enterPresetName: "输入预设名称",
          currentSettings: "当前设置",
          savePreset: "保存预设",
          savedPresets: "已保存的预设",
          savedPresetsDesc: "你的已保存预设，方便快速访问",
          noPresetsYet: "还没有保存的预设。创建你的第一个预设开始使用！",
          load: "加载",
          quality: "质量",
          quantized: "量化",
        },
        // SettingsPage translations
        settings: {
          outputDestination: "输出目标",
          outputDestinationDesc: "选择处理后图片的保存位置",
          sameAsSource: "与源文件夹相同",
          sameAsSourceDesc: "将处理后的图片保存在原始图片的同一文件夹中",
          downloadsFolder: "下载文件夹",
          customFolder: "自定义文件夹",
          customFolderDesc: "为所有处理后的图片选择特定文件夹",
          customFolderPath: "自定义文件夹路径",
          noFolderSelected: "未选择文件夹",
          applicationInfo: "应用程序信息",
          applicationInfoDesc: "关于应用程序及其功能的信息",
          supportedInputFormats: "支持的输入格式",
          supportedOutputFormats: "支持的输出格式",
          processingFeatures: "处理功能",
          version: "版本",
          additionalSettings: "其他设置",
          additionalSettingsDesc: "更多配置选项将在未来更新中提供",
          futureSettings: "未来设置可能包括：",
          qualityControl: "质量控制 (1-100%)",
          smartResizing: "智能调整大小，保持宽高比",
          pngQuantization: "PNG 量化以减少文件大小",
          batchProcessing: "批量处理",
          defaultProcessingOptions: "默认处理选项",
          autoSavePreferences: "自动保存偏好",
          themeCustomization: "主题自定义",
          keyboardShortcuts: "键盘快捷键",
          processingQueueManagement: "处理队列管理",
        },
      },
    },
  },
});
