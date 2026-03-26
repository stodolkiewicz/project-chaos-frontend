"use client";

import { File } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface AttachmentSkeletonProps {
  fileName?: string;
}

export function AttachmentSkeleton({ fileName = "Uploading..." }: AttachmentSkeletonProps) {
  return (
    <div className="border rounded p-1.5 bg-gray-50 border-dashed border-gray-300">
      <div className="flex flex-col items-center text-center">
        <div className="mb-1 relative">
          <File className="h-4 w-4 text-gray-400" />
          <div className="absolute -bottom-1 -right-1">
            <Spinner className="h-2 w-2" />
          </div>
        </div>
        
        <div className="w-full mb-1">
          <p className="text-xs text-gray-500 truncate animate-pulse">
            {fileName}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}