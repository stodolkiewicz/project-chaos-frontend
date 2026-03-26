"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { toast } from "sonner";
import { Upload, Plus, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useUploadTaskAttachmentMutation } from "@/app/state/TaskAttachmentApiSlice";

interface TaskAttachmentUploadProps {
  projectId: string;
  taskId: string;
  onUploadStart?: (fileName: string) => void;
  onUploadEnd?: () => void;
}

export function TaskAttachmentUpload({ projectId, taskId, onUploadStart, onUploadEnd }: TaskAttachmentUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadAttachment, { isLoading }] = useUploadTaskAttachmentMutation();

  const validateFile = (file: File): string | null => {
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      return "File must be less than 20MB";
    }
    return null;
  };

  const handleUpload = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      onUploadStart?.(file.name);
      
      await uploadAttachment({
        file,
        projectId,
        taskId
      }).unwrap();
      
      toast.success(`Uploaded "${file.name}"`);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error("Upload failed:", error);
      toast.error("Upload failed");
    } finally {
      onUploadEnd?.();
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
    }
    e.target.value = '';
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      handleUpload(selectedFile);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full lg:w-80">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg p-4 cursor-pointer transition-all duration-200
          ${isDragOver 
            ? 'border-primary bg-primary-lighter-3' 
            : 'border-gray-300 hover:border-primary-lighter-2 hover:bg-gray-50'
          }
          ${isLoading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isLoading}
        />
        
        <div className="flex items-center gap-3 pointer-events-none">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
            <Upload className="h-5 w-5 text-gray-600" />
          </div>
          
          <div className="flex-1">
            {selectedFile ? (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium truncate max-w-24" title={selectedFile.name}>
                  {selectedFile.name}
                </span>
                <Button
                  onClick={handleRemoveFile}
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 pointer-events-auto hover:bg-red-50"
                  title="Remove file"
                >
                  <X className="h-3 w-3 text-red-600" />
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {isDragOver ? 'Drop file here' : 'Drop file or click to browse'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Max file size: 20MB
                </p>
              </div>
            )}
          </div>

          {selectedFile && (
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                handleUploadClick();
              }}
              size="sm"
              disabled={isLoading}
              className="h-8 px-3 text-xs pointer-events-auto"
            >
              {isLoading ? (
                <>
                  <Spinner className="h-3 w-3 mr-1" />
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}