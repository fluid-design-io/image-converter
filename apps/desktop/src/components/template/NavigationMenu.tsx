import { navigationItems } from "@/lib/navItems";
import { cn } from "@/utils";
import { Link, useLocation } from "@tanstack/react-router";
import React from "react";
import { useTranslation } from "react-i18next";
import ToggleTheme from "../ToggleTheme";

export default function NavigationMenu() {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const isActive = (path: string) => pathname === path;
  return (
    <div className="flex justify-end gap-2">
      {navigationItems.map((item) => (
        <Link
          to={item.path}
          title={t(item.label + ".title")}
          key={item.path}
          className="p-1"
        >
          <item.icon
            className={cn("size-5", isActive(item.path) && "text-primary")}
          />
          <span className="sr-only">{t(item.label + ".title")}</span>
        </Link>
      ))}
      <ToggleTheme />
    </div>
  );
}
