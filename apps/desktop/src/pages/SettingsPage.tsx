import React, { useState, useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";
import {
  FolderOpen,
  Settings,
  ArrowLeft,
  Download,
  Folder,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useImageConverterStore } from "@/lib/store";

export default function SettingsPage() {
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
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Configure application preferences and behavior
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Output Destination */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Folder className="h-5 w-5" />
              Output Destination
            </CardTitle>
            <CardDescription>
              Choose where processed images will be saved
            </CardDescription>
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
                    Same as source folder
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Save processed images in the same folder as the original
                  </p>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="downloads" id="downloads" />
                <Label htmlFor="downloads" className="flex-1">
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Downloads folder
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
                    Custom folder
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Choose a specific folder for all processed images
                  </p>
                </Label>
              </div>
            </RadioGroup>

            {destinationType === "custom" && (
              <div className="space-y-2 border-t pt-4">
                <Label>Custom Folder Path</Label>
                <div className="flex items-center gap-2">
                  <div className="bg-muted flex-1 rounded border p-3 font-mono text-sm">
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

        {/* Application Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Application Info
            </CardTitle>
            <CardDescription>
              Information about the application and its capabilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">
                  Supported Input Formats
                </Label>
                <p className="text-muted-foreground text-sm">
                  JPEG (.jpg, .jpeg), PNG (.png)
                </p>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium">
                  Supported Output Formats
                </Label>
                <p className="text-muted-foreground text-sm">
                  JPEG, PNG, WebP, AVIF
                </p>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium">
                  Processing Features
                </Label>
                <ul className="text-muted-foreground mt-1 space-y-1 text-sm">
                  <li>• Quality control (1-100%)</li>
                  <li>• Smart resizing with aspect ratio preservation</li>
                  <li>• PNG quantization for reduced file sizes</li>
                  <li>• Batch processing</li>
                </ul>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium">Version</Label>
                <p className="text-muted-foreground text-sm">1.0.0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Settings Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Settings</CardTitle>
          <CardDescription>
            More configuration options will be available in future updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Future settings may include:
          </p>
          <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
            <li>• Default processing options</li>
            <li>• Auto-save preferences</li>
            <li>• Theme customization</li>
            <li>• Keyboard shortcuts</li>
            <li>• Processing queue management</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
