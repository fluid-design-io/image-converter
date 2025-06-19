import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, Trash2, Settings } from "lucide-react";
import { useImageConverterStore } from "@/lib/store";

interface PresetManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PresetManager({ open, onOpenChange }: PresetManagerProps) {
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
    onOpenChange(false);
  };

  const formatOptions = (options: any) => {
    const parts = [options.format.toUpperCase(), `${options.quality}% quality`];

    if (options.resize) {
      parts.push(`${options.resize.type.replace("_", " ")}`);
      if (options.resize.width) parts.push(`${options.resize.width}px`);
      if (options.resize.height) parts.push(`${options.resize.height}px`);
    }

    if (options.quantize) {
      parts.push("quantized");
    }

    return parts.join(", ");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Preset Manager
          </DialogTitle>
          <DialogDescription>
            Save and load your favorite processing settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Save Current Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Save Current Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="preset-name">Preset Name</Label>
                <Input
                  id="preset-name"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="Enter preset name"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSavePreset();
                    }
                  }}
                />
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
                Save Preset
              </Button>
            </CardContent>
          </Card>

          {/* Saved Presets */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Saved Presets</CardTitle>
            </CardHeader>
            <CardContent>
              {presets.length === 0 ? (
                <p className="text-muted-foreground py-4 text-center">
                  No presets saved yet
                </p>
              ) : (
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {presets.map((preset) => (
                      <div
                        key={preset.id}
                        className="flex items-center justify-between rounded-lg border p-3"
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
                            Load
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
      </DialogContent>
    </Dialog>
  );
}
