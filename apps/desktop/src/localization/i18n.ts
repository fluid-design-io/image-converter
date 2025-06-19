import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  resources: {
    en: {
      translation: {
        appName: "Image Converter",
        titleHomePage: "Home",
        titlePresetsPage: "Presets",
        titleSettingsPage: "Settings",
      },
    },
    "zh-CN": {
      translation: {
        appName: "图片格式转换器",
        titleHomePage: "首页",
        titlePresetsPage: "预设",
        titleSettingsPage: "设置",
      },
    },
  },
});
