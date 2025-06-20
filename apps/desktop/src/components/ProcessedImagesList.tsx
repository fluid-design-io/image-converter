import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { type ProcessedImage } from "@/lib/imageProcessor";
import { useImageConverterStore } from "@/lib/store";
import { updateFileExtension } from "@/utils";
import {
  CheckCircle,
  Download,
  Images,
  Loader2,
  Trash2,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";

export function ProcessedImagesList() {
  const { processedImages, removeProcessedImage, clearProcessedImages } =
    useImageConverterStore();
  const [isOpen, setIsOpen] = useState(false);

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

  const saveImage = async (image: ProcessedImage) => {
    try {
      // Update file extension based on the target format
      const updatedFileName = updateFileExtension(
        image.fileName,
        image.options.format,
      );
      const response = await window.imageAPI.saveFile({
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

  const completedImages = processedImages.filter(
    (img) => img.status === "completed",
  );
  const processingImages = processedImages.filter(
    (img) => img.status === "processing",
  );
  const errorImages = processedImages.filter((img) => img.status === "error");

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="text-xs">
          Processed Images ({processedImages.length})
          {processingImages.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              {processingImages.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[600px] sm:w-[700px] sm:max-w-none">
        <SheetHeader>
          <SheetTitle>Processed Images ({processedImages.length})</SheetTitle>
          <SheetDescription>
            View and manage your processed images
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {processedImages.length === 0 ? (
            <div className="py-8 text-center">
              <Images className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <p className="text-muted-foreground">
                No images processed yet. Drop some images to get started!
              </p>
            </div>
          ) : (
            <>
              {/* Summary Stats */}
              <div className="mb-6 flex gap-4">
                {completedImages.length > 0 && (
                  <Badge variant="default" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    {completedImages.length} Completed
                  </Badge>
                )}
                {processingImages.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Loader2 className="h-3 w-3 animate-spin" />
                    {processingImages.length} Processing
                  </Badge>
                )}
                {errorImages.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="flex items-center gap-1"
                  >
                    <XCircle className="h-3 w-3" />
                    {errorImages.length} Errors
                  </Badge>
                )}
              </div>

              {/* Clear All Button */}
              <div className="mb-4 flex justify-end">
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

              {/* Images List */}
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {processedImages.map((image) => (
                    <Card key={image.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <h4 className="truncate font-medium">
                              {image.fileName}
                            </h4>
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
                                  Processed:{" "}
                                  {formatFileSize(image.processedSize)}
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
                                Format: {image.options.format.toUpperCase()},
                                Quality: {image.options.quality}%
                                {image.options.resize && (
                                  <span>
                                    , Resize:{" "}
                                    {image.options.resize.type.replace(
                                      "_",
                                      " ",
                                    )}
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
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
