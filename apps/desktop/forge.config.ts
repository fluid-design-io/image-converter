import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerDMG } from "@electron-forge/maker-dmg";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { AutoUnpackNativesPlugin } from "@electron-forge/plugin-auto-unpack-natives";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { VitePlugin } from "@electron-forge/plugin-vite";
import type { ForgeConfig } from "@electron-forge/shared-types";
import { FuseV1Options, FuseVersion } from "@electron/fuses";
import "dotenv/config";

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
    },
    osxNotarize: {
      appleId: appleId!,
      appleIdPassword: applePassword!,
      teamId: appleTeamId!,
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
};

export default config;
