import React, { type ReactNode } from "react";

interface DragWindowRegionProps {
  title?: ReactNode;
}

export default function DragWindowRegion({ title }: DragWindowRegionProps) {
  return (
    <div className="flex w-screen items-stretch justify-center">
      <div className="draglayer w-full">
        {title && (
          <div className="flex flex-1 items-center justify-center p-2 text-xs whitespace-nowrap text-gray-400 select-none">
            {title}
          </div>
        )}
      </div>
    </div>
  );
}
