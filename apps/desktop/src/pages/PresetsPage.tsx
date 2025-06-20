import { OutputDestination } from "@/components/OutputDestination";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageProcessingOptions } from "@/helpers/ipc/image/image-channels";
import { useImageConverterStore } from "@/lib/store";
import { Loader2, Save, Settings, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function PresetsPage() {
  const { t } = useTranslation();
  const [presetName, setPresetName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { presets, currentOptions, addPreset, removePreset, loadPreset } =
    useImageConverterStore();

  const handleSavePreset = async () => {
    if (!presetName.trim()) return;

    setIsSaving(true);
    try {
      addPreset(presetName.trim(), currentOptions);
      setPresetName("");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadPreset = (presetId: string) => {
    loadPreset(presetId);
  };

  const formatOptions = (options: ImageProcessingOptions) => {
    const parts = [
      options.format.toUpperCase(),
      `${options.quality}% ${t("presets.quality")}`,
    ];

    if (options.resize) {
      parts.push(`${options.resize.type.replace("_", " ")}`);
      if (options.resize.width) parts.push(`${options.resize.width}px`);
      if (options.resize.height) parts.push(`${options.resize.height}px`);
    }

    if (options.quantize) {
      parts.push(t("presets.quantized"));
    }

    return parts.join(", ");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        {/* Save Current Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="h-5 w-5" />
              {t("presets.saveCurrentSettings")}
            </CardTitle>
            <CardDescription>
              {t("presets.saveCurrentSettingsDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preset-name">{t("presets.presetName")}</Label>
              <Input
                id="preset-name"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder={t("presets.enterPresetName")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSavePreset();
                  }
                }}
              />
            </div>

            <div className="bg-muted rounded-lg p-3">
              <Label className="text-sm font-medium">
                {t("presets.currentSettings")}
              </Label>
              <p className="text-muted-foreground mt-1 text-sm">
                {formatOptions(currentOptions)}
              </p>
            </div>

            <Button
              onClick={handleSavePreset}
              disabled={!presetName.trim() || isSaving}
              className="w-full"
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {t("presets.savePreset")}
            </Button>
          </CardContent>
        </Card>
        <OutputDestination />

        {/* Saved Presets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {t("presets.savedPresets")} ({presets.length})
            </CardTitle>
            <CardDescription>{t("presets.savedPresetsDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            {presets.length === 0 ? (
              <div className="py-8 text-center">
                <Settings className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <p className="text-muted-foreground">
                  {t("presets.noPresetsYet")}
                </p>
              </div>
            ) : (
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {presets.map((preset) => (
                    <div
                      key={preset.id}
                      className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{preset.name}</h4>
                        <p className="text-muted-foreground text-sm">
                          {formatOptions(preset.options)}
                        </p>
                      </div>
                      <div className="ml-4 flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleLoadPreset(preset.id)}
                        >
                          {t("presets.load")}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removePreset(preset.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
