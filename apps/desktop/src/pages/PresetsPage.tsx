import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Save, Trash2, Settings, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useImageConverterStore } from "@/lib/store";

export default function PresetsPage() {
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
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Converter
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Preset Management</h1>
            <p className="text-muted-foreground">
              Save and manage your favorite processing settings
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Save Current Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="h-5 w-5" />
              Save Current Settings
            </CardTitle>
            <CardDescription>
              Save your current processing options as a new preset
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <div className="bg-muted rounded-lg p-3">
              <Label className="text-sm font-medium">Current Settings</Label>
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
              Save Preset
            </Button>
          </CardContent>
        </Card>

        {/* Saved Presets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Saved Presets ({presets.length})
            </CardTitle>
            <CardDescription>
              Your saved presets for quick access
            </CardDescription>
          </CardHeader>
          <CardContent>
            {presets.length === 0 ? (
              <div className="py-8 text-center">
                <Settings className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <p className="text-muted-foreground">
                  No presets saved yet. Create your first preset to get started!
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
    </div>
  );
}
