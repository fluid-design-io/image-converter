import { useImageConverterStore } from "@/lib/store";
import { cn } from "@/utils";
import React, { useEffect, useState } from "react";

export default function ProgressBar() {
  const [isFinished, setIsFinished] = useState(false);
  const { isProcessing, processingProgress, setProcessingProgress } =
    useImageConverterStore();

  const progressPercentage =
    (processingProgress.current / processingProgress.total) * 100;
  const isProcessingStart = isProcessing && progressPercentage === 0;

  useEffect(() => {
    if (progressPercentage === 100) {
      setIsFinished(true);
      setTimeout(() => {
        setIsFinished(false);
        setProcessingProgress({ current: 0, total: 0 });
      }, 1000);
    }
  }, [progressPercentage]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[-1] h-15.5 w-full bg-transparent">
      {/* Animated progress bar */}
      <div
        className={cn(
          "h-full transition-all ease-out",
          isProcessing && "bg-primary animate-pulse",
          isFinished && "bg-green-500",
        )}
        style={{
          width: isProcessingStart ? "5%" : `${progressPercentage}%`,
        }}
      />
    </div>
  );
}
