"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Download, Trash2, File, Image, FileText, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { DeleteConfirmationPopover } from "./DeleteConfirmationPopover";
import { AttachmentSkeleton } from "./AttachmentSkeleton";
import { 
  useGetTaskAttachmentsQuery, 
  useDeleteTaskAttachmentMutation 
} from "@/app/state/TaskAttachmentApiSlice";
import { AttachmentResponseDTO } from "@/app/types/AttachmentTypes";

interface TaskAttachmentsListProps {
  projectId: string;
  taskId: string;
  uploadingFileName?: string | null;
  hideHeader?: boolean;
  compact?: boolean;
}

export function TaskAttachmentsList({ projectId, taskId, uploadingFileName, hideHeader = false, compact = false }: TaskAttachmentsListProps) {
  const { 
    data: attachmentsData, 
    isLoading, 
    error 
  } = useGetTaskAttachmentsQuery({ projectId, taskId });

  const [deleteAttachment] = useDeleteTaskAttachmentMutation();
  const [deletePopoverOpen, setDeletePopoverOpen] = useState<string | null>(null);

  const handleDownload = async (attachment: AttachmentResponseDTO) => {
    if (!attachment.presignedUrl) {
      toast.error("No download URL available");
      return;
    }

    try {
      toast.info(`Downloading ${attachment.originalName}...`);

      const response = await fetch(attachment.presignedUrl);
      if (!response.ok) throw new Error("Fetch failed");

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = attachment.originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Release memory after a while
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Download failed");
    }
  };

  const handleDeleteConfirm = async (attachmentId: string, fileName: string) => {
    try {
      await deleteAttachment({
        projectId,
        taskId,
        attachmentId
      }).unwrap();
      
      toast.success(`Deleted "${fileName}"`);
    } catch (error: any) {
      console.error("Delete failed:", error);
      toast.error("Delete failed");
    }
  };

  const getFileIcon = (contentType: string) => {
    const iconSize = compact ? "h-3 w-3" : "h-4 w-4";
    
    if (contentType.startsWith('image/')) {
      return <Image className={`${iconSize} text-blue-500`} />;
    } else if (contentType === 'application/pdf') {
      return <FileText className={`${iconSize} text-red-500`} />;
    } else if (contentType.includes('zip')) {
      return <Archive className={`${iconSize} text-yellow-500`} />;
    } else {
      return <File className={`${iconSize} text-gray-500`} />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Spinner className="h-3 w-3" />
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-xs text-red-600">
        Failed to load attachments
      </div>
    );
  }

  const attachments = attachmentsData?.attachments || [];
  const hasAttachments = attachments.length > 0;
  const showUploadingSection = uploadingFileName || hasAttachments;

  if (!showUploadingSection) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {uploadingFileName && (
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-200 rounded text-xs animate-pulse">
            <File className="h-3 w-3 text-gray-400" />
            <span>Uploading...</span>
          </div>
        )}
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center gap-2 px-2 py-1.5 bg-white border border-gray-200 hover:border-primary rounded text-xs group transition-all duration-200"
          >
            <div className="flex-shrink-0">
              {getFileIcon(attachment.contentType)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div 
                className="truncate max-w-40 font-medium" 
                title={attachment.originalName}
              >
                {attachment.originalName}
              </div>
              <div className="text-xs text-gray-500 leading-tight">
                {formatFileSize(attachment.fileSizeInBytes)}
              </div>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownload(attachment)}
                disabled={!attachment.presignedUrl}
                className="h-4 w-4 p-0 hover:bg-blue-100 cursor-pointer"
                title="Download"
              >
                <Download className="h-2 w-2 text-blue-600" />
              </Button>
              
              <DeleteConfirmationPopover
                isOpen={deletePopoverOpen === attachment.id}
                onOpenChange={(open) => setDeletePopoverOpen(open ? attachment.id : null)}
                onConfirm={() => handleDeleteConfirm(attachment.id, attachment.originalName)}
                title="Delete file?"
                trigger={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 text-red-600 hover:text-red-800 hover:bg-red-100 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="h-2 w-2" />
                  </Button>
                }
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {!hideHeader && (
        <h4 className="text-sm font-medium mb-3">Uploaded files</h4>
      )}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {uploadingFileName && (
          <AttachmentSkeleton fileName={uploadingFileName} />
        )}
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="border rounded p-1.5 hover:bg-primary-lighter-3 hover:border-primary-lighter-2 transition-all duration-200 cursor-pointer"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-1">
                {getFileIcon(attachment.contentType)}
              </div>
              
              <div className="w-full mb-1">
                <p 
                  className="text-xs truncate" 
                  title={attachment.originalName}
                >
                  {attachment.originalName}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(attachment)}
                  disabled={!attachment.presignedUrl}
                  className="h-5 w-5 p-0 hover:bg-blue-50 cursor-pointer"
                  title="Download"
                >
                  <Download className="h-2.5 w-2.5 text-blue-600" />
                </Button>
                
                <DeleteConfirmationPopover
                  isOpen={deletePopoverOpen === attachment.id}
                  onOpenChange={(open) => setDeletePopoverOpen(open ? attachment.id : null)}
                  onConfirm={() => handleDeleteConfirm(attachment.id, attachment.originalName)}
                  title="Delete file?"
                  trigger={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 text-red-600 hover:text-red-800 hover:bg-red-50 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="h-2.5 w-2.5" />
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}