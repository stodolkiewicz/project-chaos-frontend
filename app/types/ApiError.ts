export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  timestamp: string;
  entity?: string;
  identifiers?: Record<string, any>;
  [key: string]: any;
}

export function isApiError(error: any): error is ApiError {
  console.log(error);
  return (
    error &&
    typeof error === "object" &&
    "type" in error &&
    "title" in error &&
    "status" in error &&
    "detail" in error
  );
}
