import React from "react";
import { ImageProcessingControls } from "../ImageProcessingControls";
import { useImageConverterStore } from "@/lib/store";
import { Badge } from "../ui/badge";

export default function NavbarControls() {
  const { isProcessing, processingProgress } = useImageConverterStore();
  if (isProcessing)
    return (
      <Badge className="text-center font-mono text-sm" variant="secondary">
        {processingProgress.current}/{processingProgress.total}
      </Badge>
    );
  return <ImageProcessingControls />;
}
