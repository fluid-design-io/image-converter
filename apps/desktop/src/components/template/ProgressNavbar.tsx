import React from "react";
import NavigationMenu from "./NavigationMenu";
import NavbarTitle from "./NavbarTitle";
import ProgressBar from "./ProgressBar";
import NavbarControls from "./NavbarControls";

export default function ProgressNavbar() {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-2">
        <NavbarTitle />
        <NavbarControls />
        <NavigationMenu />
      </div>
      <ProgressBar />
    </div>
  );
}
