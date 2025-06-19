import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon, Settings, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import { useImageConverterStore } from "@/lib/store";
import { ImageProcessingControls } from "@/components/ImageProcessingControls";
import { ProcessedImagesList } from "@/components/ProcessedImagesList";
import { type ImageProcessingOptions } from "@/helpers/ipc/image/image-channels";
import { updateFileExtension } from "@/utils";

export default function ImageConverterPage() {
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    currentOptions,
    destinationType,
    customDestinationPath,
    addProcessedImage,
    updateProcessedImage,
    clearProcessedImages,
  } = useImageConverterStore();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsProcessing(true);

      try {
        for (const file of acceptedFiles) {
          if (!file.type.startsWith("image/")) continue;

          const imageId = crypto.randomUUID();

          // Add placeholder for processing
          addProcessedImage({
            id: imageId,
            fileName: file.name,
            originalSize: file.size,
            processedSize: 0,
            originalData: await file.arrayBuffer(),
            processedData: new ArrayBuffer(0),
            options: currentOptions,
            status: "processing",
          });

          try {
            // Process the image
            const response = await (window as any).imageAPI.processImage({
              imageData: await file.arrayBuffer(),
              fileName: file.name,
              options: currentOptions,
            });

            if (response.success && response.processedData) {
              updateProcessedImage(imageId, {
                processedData: response.processedData,
                processedSize: response.processedSize,
                status: "completed",
              });

              // Auto-save if destination is set
              if (destinationType !== "same") {
                await saveProcessedImage(file.name, response.processedData);
              }
            } else {
              updateProcessedImage(imageId, {
                status: "error",
                error: response.error || "Processing failed",
              });
            }
          } catch (error) {
            updateProcessedImage(imageId, {
              status: "error",
              error: error instanceof Error ? error.message : "Unknown error",
            });
          }
        }
      } finally {
        setIsProcessing(false);
      }
    },
    [currentOptions, destinationType, addProcessedImage, updateProcessedImage],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    multiple: true,
  });

  const saveProcessedImage = async (fileName: string, data: ArrayBuffer) => {
    try {
      // Update file extension based on the target format
      const updatedFileName = updateFileExtension(
        fileName,
        currentOptions.format,
      );
      let destinationPath: string;

      if (destinationType === "downloads") {
        const downloadsPath = await (window as any).imageAPI.getDownloadsPath();
        destinationPath = `${downloadsPath}/${updatedFileName}`;
      } else if (destinationType === "custom" && customDestinationPath) {
        destinationPath = `${customDestinationPath}/${updatedFileName}`;
      } else {
        return; // Same as source or no custom path
      }

      const response = await (window as any).imageAPI.saveFile({
        filePath: destinationPath,
        data,
      });

      if (!response.success) {
        console.error("Failed to save file:", response.error);
      }
    } catch (error) {
      console.error("Error saving file:", error);
    }
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Image Converter & Optimizer</h1>
          <p className="text-muted-foreground">
            Convert and optimize your images with drag-and-drop ease
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/presets">
            <Button variant="outline" size="sm">
              <Save className="mr-2 h-4 w-4" />
              Presets
            </Button>
          </Link>
          <Link to="/settings">
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Controls */}
        <div className="space-y-6">
          {/* Processing Controls */}
          <ImageProcessingControls />

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Access presets and settings quickly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/presets" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Save className="mr-2 h-4 w-4" />
                  Manage Presets
                </Button>
              </Link>
              <Link to="/settings" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Application Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Center Column - Drop Zone */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Drop Images Here
              </CardTitle>
              <CardDescription>
                Drag and drop JPG or PNG files, or click to select
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-colors duration-200 ${
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50"
                } ${isProcessing ? "pointer-events-none opacity-50" : ""} `}
              >
                <input {...getInputProps()} />
                <ImageIcon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                {isDragActive ? (
                  <p className="text-lg font-medium">Drop the files here...</p>
                ) : (
                  <div>
                    <p className="mb-2 text-lg font-medium">
                      {isProcessing
                        ? "Processing images..."
                        : "Drop images here"}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Supports JPG and PNG files
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      {/* Processed Images */}
      <ProcessedImagesList />
    </div>
  );
}
