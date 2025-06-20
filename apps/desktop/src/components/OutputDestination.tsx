import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FolderOpen, Download, Folder } from "lucide-react";
import { useImageConverterStore } from "@/lib/store";

export function OutputDestination() {
  const { t } = useTranslation();
  const [downloadsPath, setDownloadsPath] = useState("");

  const {
    destinationType,
    customDestinationPath,
    setDestinationType,
    setCustomDestinationPath,
  } = useImageConverterStore();

  useEffect(() => {
    // Get downloads path when component mounts
    window.imageAPI.getDownloadsPath().then(setDownloadsPath);
  }, []);

  const handleSelectCustomFolder = async () => {
    try {
      const response = await window.imageAPI.selectFolder();
      if (response.success && response.path) {
        setCustomDestinationPath(response.path);
      }
    } catch (error) {
      console.error("Error selecting folder:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Folder className="h-5 w-5" />
          {t("settings.outputDestination")}
        </CardTitle>
        <CardDescription>{t("settings.outputDestinationDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          value={destinationType}
          onValueChange={(value: "same" | "downloads" | "custom") =>
            setDestinationType(value)
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="same" id="same" />
            <Label htmlFor="same" className="flex-1">
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4" />
                {t("settings.sameAsSource")}
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                {t("settings.sameAsSourceDesc")}
              </p>
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="downloads" id="downloads" />
            <Label htmlFor="downloads" className="flex-1">
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                {t("settings.downloadsFolder")}
              </div>
              {downloadsPath && (
                <p className="text-muted-foreground mt-1 text-xs">
                  {downloadsPath}
                </p>
              )}
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="custom" id="custom" />
            <Label htmlFor="custom" className="flex-1">
              <div className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                {t("settings.customFolder")}
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                {t("settings.customFolderDesc")}
              </p>
            </Label>
          </div>
        </RadioGroup>

        {destinationType === "custom" && (
          <div className="space-y-2 border-t pt-4">
            <Label>{t("settings.customFolderPath")}</Label>
            <div className="flex items-center gap-2">
              <div className="bg-muted flex-1 rounded border p-3 font-mono text-sm">
                {customDestinationPath || t("settings.noFolderSelected")}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleSelectCustomFolder}
              >
                <FolderOpen className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
