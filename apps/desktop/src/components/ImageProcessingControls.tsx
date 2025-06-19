import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useImageConverterStore } from "@/lib/store";

export function ImageProcessingControls() {
  const { currentOptions, setCurrentOptions } = useImageConverterStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Options</CardTitle>
        <CardDescription>
          Configure how your images will be processed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Output Format */}
        <div className="space-y-2">
          <Label htmlFor="format">Output Format</Label>
          <Select
            value={currentOptions.format}
            onValueChange={(value: "jpeg" | "png" | "webp" | "avif") =>
              setCurrentOptions({ format: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jpeg">JPEG</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="webp">WebP</SelectItem>
              <SelectItem value="avif">AVIF</SelectItem>
            </SelectContent>
          </Select>
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
                    type: value as any,
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
      </CardContent>
    </Card>
  );
}
