import { toast } from "sonner";
import { isApiError } from "@/app/types/ApiError";

export function useErrorHandler() {
  const handleApiError = (
    err: any,
    defaultMessage: string = "Unknown error occurred. Action failed."
  ) => {
    if (err && "data" in err && isApiError(err.data)) {
      toast.error(err.data.detail);
    } else {
      toast.error(defaultMessage);
    }
  };

  return { handleApiError };
}
