import React, { type ReactNode } from "react";
import { ProcessedImagesList } from "./ProcessedImagesList";

interface DragWindowRegionProps {
  title?: ReactNode;
}

export default function DragWindowRegion({ title }: DragWindowRegionProps) {
  return (
    <div className="grid w-full grid-cols-[1fr_auto_1fr] items-stretch justify-center">
      <div />

      <div className="draglayer w-full">
        {title && (
          <div className="flex flex-1 items-center justify-center p-2 text-xs whitespace-nowrap text-gray-400 select-none">
            {title}
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <ProcessedImagesList />
      </div>
    </div>
  );
}
