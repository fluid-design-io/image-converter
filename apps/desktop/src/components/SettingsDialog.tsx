import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, Settings } from "lucide-react";
import { useImageConverterStore } from "@/lib/store";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [downloadsPath, setDownloadsPath] = useState("");

  const {
    destinationType,
    customDestinationPath,
    setDestinationType,
    setCustomDestinationPath,
  } = useImageConverterStore();

  useEffect(() => {
    if (open) {
      // Get downloads path when dialog opens
      window.imageAPI.getDownloadsPath().then(setDownloadsPath);
    }
  }, [open]);

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Configure application settings and preferences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Output Destination */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Output Destination</CardTitle>
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
                  <Label htmlFor="same">Same as source folder</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="downloads" id="downloads" />
                  <Label htmlFor="downloads">
                    Downloads folder
                    {downloadsPath && (
                      <span className="text-muted-foreground block text-xs">
                        {downloadsPath}
                      </span>
                    )}
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom">Custom folder</Label>
                </div>
              </RadioGroup>

              {destinationType === "custom" && (
                <div className="space-y-2">
                  <Label>Custom Folder Path</Label>
                  <div className="flex items-center gap-2">
                    <div className="bg-muted flex-1 rounded border p-2 text-sm">
                      {customDestinationPath || "No folder selected"}
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

          {/* Additional Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                More settings will be added here in future updates.
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
