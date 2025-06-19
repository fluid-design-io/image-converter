import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Trash2, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useImageConverterStore } from "@/lib/store";
import { updateFileExtension } from "@/utils";

export function ProcessedImagesList() {
  const { processedImages, removeProcessedImage, clearProcessedImages } =
    useImageConverterStore();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getCompressionRatio = (original: number, processed: number): number => {
    if (original === 0) return 0;
    return Math.round(((original - processed) / original) * 100);
  };

  const saveImage = async (image: any) => {
    try {
      // Update file extension based on the target format
      const updatedFileName = updateFileExtension(
        image.fileName,
        image.options.format,
      );
      const response = await (window as any).imageAPI.saveFile({
        filePath: `processed_${updatedFileName}`,
        data: image.processedData,
      });

      if (response.success) {
        console.log("Image saved successfully");
      } else {
        console.error("Failed to save image:", response.error);
      }
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  if (processedImages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Processed Images</CardTitle>
          <CardDescription>
            Your processed images will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground py-8 text-center">
            No images processed yet. Drop some images to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Processed Images ({processedImages.length})</CardTitle>
            <CardDescription>
              View and manage your processed images
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearProcessedImages}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {processedImages.map((image) => (
              <Card key={image.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <h4 className="truncate font-medium">{image.fileName}</h4>
                      {image.status === "processing" && (
                        <Badge variant="secondary">
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          Processing
                        </Badge>
                      )}
                      {image.status === "completed" && (
                        <Badge variant="default">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Completed
                        </Badge>
                      )}
                      {image.status === "error" && (
                        <Badge variant="destructive">
                          <XCircle className="mr-1 h-3 w-3" />
                          Error
                        </Badge>
                      )}
                    </div>

                    {image.status === "completed" && (
                      <div className="text-muted-foreground space-y-2 text-sm">
                        <div className="flex items-center gap-4">
                          <span>
                            Original: {formatFileSize(image.originalSize)}
                          </span>
                          <span>
                            Processed: {formatFileSize(image.processedSize)}
                          </span>
                          <span className="font-medium text-green-600">
                            {getCompressionRatio(
                              image.originalSize,
                              image.processedSize,
                            )}
                            % smaller
                          </span>
                        </div>
                        <div className="text-xs">
                          Format: {image.options.format.toUpperCase()}, Quality:{" "}
                          {image.options.quality}%
                          {image.options.resize && (
                            <span>
                              , Resize:{" "}
                              {image.options.resize.type.replace("_", " ")}
                              {image.options.resize.width &&
                                ` (${image.options.resize.width}px)`}
                              {image.options.resize.height &&
                                ` (${image.options.resize.height}px)`}
                            </span>
                          )}
                          {image.options.quantize && ", Quantized"}
                        </div>
                      </div>
                    )}

                    {image.status === "error" && (
                      <p className="text-destructive text-sm">
                        Error: {image.error}
                      </p>
                    )}
                  </div>

                  <div className="ml-4 flex items-center gap-2">
                    {image.status === "completed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => saveImage(image)}
                      >
                        <Download className="mr-1 h-4 w-4" />
                        Save
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeProcessedImage(image.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
