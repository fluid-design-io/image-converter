import DragWindowRegion from "@/components/DragWindowRegion";
import ProgressNavbar from "@/components/template/ProgressNavbar";
import React from "react";
import { useTranslation } from "react-i18next";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();

  return (
    <>
      <DragWindowRegion title={t("appName")} />
      <ProgressNavbar />
      <main className="h-screen p-2 pb-18">{children}</main>
    </>
  );
}
