"use client";

import { useState } from "react";
import { TaskAttachmentUpload } from "./TaskAttachmentUpload";
import { TaskAttachmentsList } from "./TaskAttachmentsList";

interface TaskAttachmentsProps {
  projectId: string;
  taskId: string;
}

export function TaskAttachments({ projectId, taskId }: TaskAttachmentsProps) {
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-semibold text-base mb-4">Attachments</h3>
      
      <div className="flex flex-col lg:flex-row gap-4 lg:items-start">
        <div className="lg:flex-shrink-0">
          <TaskAttachmentUpload 
            projectId={projectId} 
            taskId={taskId}
            onUploadStart={(fileName) => setUploadingFile(fileName)}
            onUploadEnd={() => setUploadingFile(null)}
          />
        </div>
        
        <div className="lg:flex-1 lg:min-w-0">
          <TaskAttachmentsList 
            projectId={projectId} 
            taskId={taskId}
            uploadingFileName={uploadingFile}
            hideHeader={true}
          />
        </div>
      </div>
    </div>
  );
}