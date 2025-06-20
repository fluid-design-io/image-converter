import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";

import { useImageConverterStore } from "@/lib/store";
import { cn } from "@/utils";
import { IconPhoto } from "@tabler/icons-react";

export default function ImageConverterPage() {
  const { t } = useTranslation();
  const { isProcessing, processImages } = useImageConverterStore();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      await processImages(acceptedFiles);
    },
    [processImages],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "group flex h-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed text-center transition-colors duration-200",
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50",
        isProcessing ? "pointer-events-none opacity-50" : "",
      )}
    >
      <input {...getInputProps()} />

      <div
        className={cn(
          "mb-2 transition-all duration-1000 ease-in-out",
          isProcessing && "scale-125 animate-pulse",
        )}
      >
        <IconPhoto
          className={cn(
            "text-muted-foreground size-12 transition-colors",
            "group-hover:text-primary",
          )}
        />
      </div>

      {isDragActive ? (
        <p className="text-lg font-medium">
          {t("imageConverter.dropFilesHere")}
        </p>
      ) : (
        <p className="text-lg font-medium">
          {isProcessing
            ? t("imageConverter.processingImages")
            : t("imageConverter.dropImagesHere")}
        </p>
      )}
    </div>
  );
}
