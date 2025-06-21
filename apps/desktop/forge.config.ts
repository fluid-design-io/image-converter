import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerDMG } from "@electron-forge/maker-dmg";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { AutoUnpackNativesPlugin } from "@electron-forge/plugin-auto-unpack-natives";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { VitePlugin } from "@electron-forge/plugin-vite";
import type { ForgeConfig } from "@electron-forge/shared-types";
import { FuseV1Options, FuseVersion } from "@electron/fuses";
import { spawn } from "child_process";
import "dotenv/config";
import path from "path";

const appleId = process.env.VITE_APPLE_ID;
const applePassword = process.env.VITE_APPLE_PASSWORD;
const appleTeamId = process.env.VITE_APPLE_TEAM_ID;
const appleSigningIdentity = process.env.VITE_APPLE_SIGNING_IDENTITY;

const config: ForgeConfig = {
  packagerConfig: {
    asar: {
      unpack: "**/node_modules/{sharp,@img}/**/*",
    },
    icon: "src/assets/icon/icon.icns",
    osxSign: {
      identity: appleSigningIdentity,
      optionsForFile: (filePath) => {
        if (
          filePath.includes(
            "Image Converter.app/Contents/MacOS/Image Converter",
          )
        ) {
          return {
            entitlements: path.join(process.cwd(), "entitlements.mac.plist"),
            hardenedRuntime: true,
          };
        }
        return {};
      },
    },
    osxNotarize: {
      appleId: appleId!,
      appleIdPassword: applePassword!,
      teamId: appleTeamId!,
    },
    // macOS entitlements for file access permissions
    protocols: [
      {
        name: "Image Converter",
        schemes: ["imageconverter"],
      },
    ],
    extendInfo: {
      NSDownloadsFolderUsageDescription:
        "This app needs access to your Downloads folder to save converted images.",
      NSDocumentsFolderUsageDescription:
        "This app needs access to your Documents folder to save converted images.",
      NSDesktopFolderUsageDescription:
        "This app needs access to your Desktop folder to save converted images.",
      NSPhotoLibraryUsageDescription:
        "This app needs access to your Photo Library to import and convert images.",
      NSFileProviderDomainUsageDescription:
        "This app needs access to files to convert images.",
      LSApplicationCategoryType: "public.app-category.graphics-design",
    },
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({}),
    new MakerDMG({
      icon: "src/assets/icon/icon.icns",
      contents: [
        {
          x: 130,
          y: 220,
          type: "file",
          path: "out/Image Converter-darwin-arm64/Image Converter.app",
        },
        {
          x: 410,
          y: 220,
          type: "link",
          path: "/Applications",
        },
      ],
    }),
    new MakerRpm({}),
    new MakerDeb({}),
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new VitePlugin({
      build: [
        {
          entry: "src/main.ts",
          config: "vite.main.config.ts",
          target: "main",
        },
        {
          entry: "src/preload.ts",
          config: "vite.preload.config.ts",
          target: "preload",
        },
      ],
      renderer: [
        {
          name: "main_window",
          config: "vite.renderer.config.mts",
        },
      ],
    }),

    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
  hooks: {
    packageAfterPrune: async (forgeConfig, buildPath) => {
      return new Promise((resolve, reject) => {
        const bunInstall = spawn(
          "bun",
          [
            "install",
            "sharp",
            "--omit",
            "dev",
            "--omit",
            "optional",
            "--omit",
            "peer",
          ],
          {
            cwd: buildPath,
            stdio: "inherit",
          },
        );

        bunInstall.on("close", (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error("process finished with error code " + code));
          }
        });

        bunInstall.on("error", (error) => {
          reject(error);
        });
      });
    },
  },
};

export default config;
