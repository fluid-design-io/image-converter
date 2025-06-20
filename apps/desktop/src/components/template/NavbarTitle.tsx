import React from "react";
import { useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { navigationItems } from "@/lib/navItems";
import { Preset, useImageConverterStore } from "@/lib/store";
import { cn } from "@/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { formatResizeOptions } from "../ImageProcessingControls";
import { Button } from "../ui/button";
import { IconTrash } from "@tabler/icons-react";

export default function NavbarTitle() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { presets, loadPreset } = useImageConverterStore();
  const currentPage = navigationItems.find(
    (item) => item.path === pathname,
  ) ?? {
    label: "titleHomePage",
    path: "/",
  };
  // show first 5 presets if current page is /
  if (pathname === "/") {
    if (presets.length === 0)
      return <h1 className="font-semibold">{t("titleHomePage.title")}</h1>;
    return (
      <div
        className={cn(
          "flex max-w-full gap-2 overflow-x-auto",
          "[mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-48px),transparent)]",
          // hide scrollbar
          "scrollbar-hide",
        )}
      >
        {presets.slice(0, 5).map((preset) => (
          <HoverCard key={preset.id}>
            <HoverCardTrigger onClick={() => loadPreset(preset.id)} asChild>
              <Button variant="ghost" className="h-6 px-2 py-0 text-xs">
                <span className="max-w-[100px] truncate">{preset.name}</span>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent>
              <PresetDetails preset={preset} />
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    );
  }
  return (
    <h1 className="overflow-hidden font-semibold text-ellipsis whitespace-nowrap">
      {t(currentPage.label + ".title")}
    </h1>
  );
}

const PresetDetails = ({ preset }: { preset: Preset }) => {
  const { format, quality, quantize, resize } = formatResizeOptions(
    preset.options,
  );
  const { removePreset } = useImageConverterStore();
  return (
    <div className="flex flex-col gap-2">
      <p>{format}</p>
      <p>{quality}</p>
      {quantize && <p>Quantize</p>}
      {resize && <p>{resize}</p>}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => removePreset(preset.id)}
      >
        <span className="sr-only">Remove preset</span>
        <IconTrash className="size-4" />
      </Button>
    </div>
  );
};
