
"use client";

import { useErrorHandler } from "@/app/hooks/useErrorHandler";
import { useDeleteProjectMutation } from "@/app/state/ProjectsApiSlice";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { toast } from "sonner";

  const { handleApiError } = useErrorHandler();
  async function handleOnDeleteProject() {
    try {
    //   await deleteTask({ projectId, taskId: boardTask.taskId }).unwrap();
      toast.success(`Project nazwa projektu has been deleted.`);
    } catch (error) {
      handleApiError(error, `Failed to delete project nazwa projektu".`);
    }
  }

interface DeleteProjectProps {
  projectId: string;
  projectName: string;
  children: React.ReactNode;
}

export default function DeleteProjectAlertDialog({
  projectId,
  projectName,
  children,
}: DeleteProjectProps
) {
    const [inputValue, setInputValue] = useState("");
    const [showError, setShowError] = useState(false);
    const [open, setOpen] = useState(false);
    
    const [deleteProject] = useDeleteProjectMutation();
    const { handleApiError } = useErrorHandler();
    
    const handleProjectDeletion = async (e) => {
      if(inputValue !== projectName || inputValue === "") {
        e.preventDefault();
        setShowError(true);
        return;
      }

      try {
        await deleteProject(projectId).unwrap();
        toast.success(`Project "${projectName}" has been deleted.`);
        setOpen(false); // Close dialog only on success
        setInputValue(""); // Reset input
        setShowError(false); // Reset error
      } catch (error) {
        handleApiError(error, `Failed to delete project "${projectName}".`);
      }
    }
    
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger className="cursor-pointer">
            {children}
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent align="center" className="-translate-x-[4px] border-1">
          <p>Delete project</p>
        </TooltipContent>
      </Tooltip>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="flex flex-col gap-3">
              <div>
                This action will <span className="text-red-600 font-bold">permanently delete</span> project: &nbsp;
                <span className="font-bold">{projectName} </span>
                {showError && (
                  <span className="text-red-500 block mt-2">Please type the project name correctly to confirm deletion.</span>
                )}
              </div>
              <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} type="text" placeholder="Type the project name to confirm deletion" />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => {
            setOpen(false);
            setInputValue("");
            setShowError(false);
          }}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={(e) => {
            
            handleProjectDeletion(e);
          }}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}