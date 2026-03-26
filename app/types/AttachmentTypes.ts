export enum VectorStatusEnum {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING", 
  COMPLETED = "COMPLETED",
  FAILED = "FAILED"
}

export enum StorageStatusEnum {
  UPLOADING = "UPLOADING",
  STORED = "STORED",
  FAILED = "FAILED"
}

export interface AttachmentResponseDTO {
  id: string;
  projectId: string;
  taskId: string;
  userId: string;
  fileName: string;
  originalName: string;
  filePath: string;
  contentType: string;
  fileSizeInBytes: number;
  vectorStatus: VectorStatusEnum;
  storageStatus: StorageStatusEnum;
  presignedUrl: string;
}

export interface TaskAttachmentsResponseDTO {
  attachments: AttachmentResponseDTO[];
}

export interface AttachmentInfo {
  id: string;
  projectId: string;
  taskId: string;
  userId: string;
  fileName: string;
  originalName: string;
  filePath: string;
  contentType: string;
  fileSizeInBytes: number;
  vectorStatus: VectorStatusEnum;
  storageStatus: StorageStatusEnum;
  presignedUrl?: string;
}