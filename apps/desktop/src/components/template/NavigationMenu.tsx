import React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  NavigationMenu as NavigationMenuBase,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { cn } from "@/utils";

export default function NavigationMenu() {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const isActive = (path: string) => pathname === path;
  return (
    <NavigationMenuBase className="text-muted-foreground px-2 font-mono">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/">
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                isActive("/") && "bg-accent",
              )}
            >
              {t("titleHomePage")}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/presets">
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                isActive("/presets") && "bg-accent",
              )}
            >
              {t("titlePresetsPage")}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/settings">
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                isActive("/settings") && "bg-accent",
              )}
            >
              {t("titleSettingsPage")}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenuBase>
  );
}
