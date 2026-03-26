"use client";

import { useState } from "react";
import { TaskAttachmentUpload } from "./TaskAttachmentUpload";
import { TaskAttachmentsList } from "./TaskAttachmentsList";
import { useGetTaskAttachmentsQuery } from "@/app/state/TaskAttachmentApiSlice";

interface TaskAttachmentsProps {
  projectId: string;
  taskId: string;
}

export function TaskAttachments({ projectId, taskId }: TaskAttachmentsProps) {
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);

  const { data: attachmentsData } = useGetTaskAttachmentsQuery({ projectId, taskId });
  const attachments = attachmentsData?.attachments || [];
  const hasAttachments = attachments.length > 0 || uploadingFile;

  return (
    <div className="p-3 bg-white rounded-lg">
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-semibold text-base">Attachments</h4>
        <TaskAttachmentUpload 
          projectId={projectId} 
          taskId={taskId}
          onUploadStart={(fileName) => setUploadingFile(fileName)}
          onUploadEnd={() => setUploadingFile(null)}
          compact={true}
        />
      </div>
      
      {hasAttachments && (
        <TaskAttachmentsList 
          projectId={projectId} 
          taskId={taskId}
          uploadingFileName={uploadingFile}
          hideHeader={true}
          compact={true}
        />
      )}
    </div>
  );
}