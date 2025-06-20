import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useImageConverterStore } from "@/lib/store";
import { ImageProcessingOptions } from "@/helpers/ipc/image/image-channels";
import { IconChevronDown } from "@tabler/icons-react";
import { Button } from "./ui/button";

export const formatResizeOptions = (options: ImageProcessingOptions) => {
  const formatOptions: Record<ImageProcessingOptions["format"], string> = {
    jpeg: "JPEG",
    png: "PNG",
    webp: "WebP",
    avif: "AVIF",
  };
  const resizeOptions: Record<
    NonNullable<ImageProcessingOptions["resize"]>["type"],
    string
  > = {
    fixed_width: "Fixed width",
    fixed_height: "Fixed height",
    max_width: "Max width",
    max_height: "Max height",
  };
  return {
    format: formatOptions[options.format],
    quality: `${options.quality}%`,
    quantize: options.quantize ? "Quantize" : "",
    resize: options.resize ? resizeOptions[options.resize.type] : "No resize",
  };
};

const formats: Record<ImageProcessingOptions["format"], string> = {
  jpeg: "JPEG",
  png: "PNG",
  webp: "WebP",
  avif: "AVIF",
};

export function ImageProcessingControls() {
  const { currentOptions, setCurrentOptions, addPreset } =
    useImageConverterStore();
  const [isOpen, setIsOpen] = useState(false);

  const { format, quality, quantize, resize } =
    formatResizeOptions(currentOptions);

  const handleAddPreset = () => {
    const name = `${format} • ${quality}`;
    addPreset(name, currentOptions);
    setIsOpen(false);
  };
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal>
      <PopoverTrigger className="flex items-center gap-2 font-mono">
        <div className="divide-border/35 flex items-start justify-center divide-x">
          <div className="pr-2 text-xs font-medium">{format}</div>
          <div className="text-muted-foreground px-2 text-xs">{quality}</div>
          {quantize && (
            <div className="text-muted-foreground px-2 text-xs">{quantize}</div>
          )}
          <div className="text-muted-foreground pl-2 text-xs">{resize}</div>
        </div>
        <IconChevronDown className="size-4" />
      </PopoverTrigger>
      <PopoverContent side="bottom">
        <div className="space-y-6">
          {/* Output Format */}
          <div className="space-y-2">
            <Label htmlFor="format">Output Format</Label>
            <RadioGroup
              className="grid grid-cols-2 gap-4"
              value={currentOptions.format}
              onValueChange={(value: ImageProcessingOptions["format"]) =>
                setCurrentOptions({
                  format: value,
                })
              }
            >
              {Object.entries(formats).map(([key, value]) => (
                <div key={key}>
                  <RadioGroupItem
                    value={key}
                    id={key}
                    className="peer sr-only"
                    aria-label={value}
                  />
                  <Label
                    htmlFor={key}
                    className="border-muted hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary flex flex-col items-center justify-between rounded-md border-2 bg-transparent p-4"
                  >
                    {value}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Quality */}
          <div className="space-y-2">
            <Label htmlFor="quality">Quality: {currentOptions.quality}%</Label>
            <Slider
              value={[currentOptions.quality]}
              onValueChange={([value]) => setCurrentOptions({ quality: value })}
              max={100}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          {/* Resize Options */}
          <div className="space-y-4">
            <Label>Resize Options</Label>
            <RadioGroup
              value={currentOptions.resize?.type || "none"}
              onValueChange={(value) => {
                if (value === "none") {
                  setCurrentOptions({ resize: undefined });
                } else {
                  setCurrentOptions({
                    resize: {
                      type: value as
                        | "fixed_width"
                        | "fixed_height"
                        | "max_width"
                        | "max_height",
                      width: currentOptions.resize?.width,
                      height: currentOptions.resize?.height,
                    },
                  });
                }
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none">No resize</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fixed_width" id="fixed_width" />
                <Label htmlFor="fixed_width">Fixed width</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fixed_height" id="fixed_height" />
                <Label htmlFor="fixed_height">Fixed height</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="max_width" id="max_width" />
                <Label htmlFor="max_width">Max width</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="max_height" id="max_height" />
                <Label htmlFor="max_height">Max height</Label>
              </div>
            </RadioGroup>

            {/* Width/Height inputs */}
            {(currentOptions.resize?.type === "fixed_width" ||
              currentOptions.resize?.type === "max_width") && (
              <div className="space-y-2">
                <Label htmlFor="width">Width (px)</Label>
                <Input
                  id="width"
                  type="number"
                  value={currentOptions.resize?.width || ""}
                  onChange={(e) =>
                    setCurrentOptions({
                      resize: {
                        ...currentOptions.resize!,
                        width: parseInt(e.target.value) || undefined,
                      },
                    })
                  }
                  placeholder="Enter width"
                />
              </div>
            )}

            {(currentOptions.resize?.type === "fixed_height" ||
              currentOptions.resize?.type === "max_height") && (
              <div className="space-y-2">
                <Label htmlFor="height">Height (px)</Label>
                <Input
                  id="height"
                  type="number"
                  value={currentOptions.resize?.height || ""}
                  onChange={(e) =>
                    setCurrentOptions({
                      resize: {
                        ...currentOptions.resize!,
                        height: parseInt(e.target.value) || undefined,
                      },
                    })
                  }
                  placeholder="Enter height"
                />
              </div>
            )}
          </div>

          {/* Quantization (for PNG) */}
          {currentOptions.format === "png" && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="quantize"
                checked={currentOptions.quantize}
                onCheckedChange={(checked) =>
                  setCurrentOptions({ quantize: checked as boolean })
                }
              />
              <Label htmlFor="quantize">Reduce color palette (quantize)</Label>
            </div>
          )}

          {/* Add as Preset */}
          <Button variant="outline" onClick={handleAddPreset}>
            Add as Preset
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
