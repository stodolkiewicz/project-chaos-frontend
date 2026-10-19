"use client";

import { useErrorHandler } from "@/app/hooks/useErrorHandler";
import { useGetProjectUsersQuery } from "@/app/state/ProjectsApiSlice";
import { useGetTaskPrioritiesQuery } from "@/app/state/TaskPrioritiesApiSlice";
import { useUpdateTaskMutation } from "@/app/state/TasksApiSlice";
import { useGetDefaultProjectIdQuery } from "@/app/state/UsersApiSlice";
import { BoardTaskDTO } from "@/app/types/BoardTasksDTO";
import { TaskEditField } from "@/app/types/TaskEditField";
import { UpdateTaskDTO } from "@/app/types/UpdateTaskDTO";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AddLabelPopover from "./AddLabelPopover";
import { buildUpdatedTask } from "./buildUpdatedTask";
import { getLabelColors } from "./taskCardStyles";

// Radix Select does not accept an empty value, so this one stands for "nothing selected"
const NONE = "none";

interface TaskEditFormProps {
  boardTask: BoardTaskDTO;
  initialField: TaskEditField;
  onClose: () => void;
  // "card" is the compact board card, "details" is the Task Details dialog
  variant: "card" | "details";
}

export default function TaskEditForm({
  boardTask,
  initialField,
  onClose,
  variant,
}: TaskEditFormProps) {
  const { data } = useGetDefaultProjectIdQuery();
  const projectId = data?.projectId;
  const { data: taskPriorities } = useGetTaskPrioritiesQuery(projectId, {
    skip: !projectId,
  });
  const { data: projectUsers } = useGetProjectUsersQuery(projectId, {
    skip: !projectId,
  });
  const [updateTask, { isLoading }] = useUpdateTaskMutation();
  const { handleApiError } = useErrorHandler();

  const [title, setTitle] = useState(boardTask.title);
  const [description, setDescription] = useState(boardTask.description ?? "");
  const [priorityId, setPriorityId] = useState(boardTask.priority.id || NONE);
  const [assigneeEmail, setAssigneeEmail] = useState(boardTask.assignee.email || NONE);
  const [labels, setLabels] = useState(
    boardTask.labels.map(({ name, color }) => ({ name, color }))
  );
  const [prioritySelectOpen, setPrioritySelectOpen] = useState(initialField === "priority");
  const [assigneeSelectOpen, setAssigneeSelectOpen] = useState(initialField === "assignee");

  const titleRef = useRef<HTMLTextAreaElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  // Puts the cursor at the end of the double-clicked text field
  useEffect(() => {
    const field =
      initialField === "title" ? titleRef.current
        : initialField === "description" ? descriptionRef.current
        : null;
    if (field) {
      field.focus();
      field.setSelectionRange(field.value.length, field.value.length);
    }
  }, [initialField]);

  const canSave = title.trim() !== "" && !isLoading;

  const handleSave = async () => {
    if (!projectId || !canSave) return;

    const priority = taskPriorities?.find((p) => p.id === priorityId);
    const email = assigneeEmail === NONE ? null : assigneeEmail;

    const updateTaskDTO: UpdateTaskDTO = {
      title: title.trim(),
      description,
      assigneeEmail: email,
      priorityId: priority ? priority.id : null,
      labels,
    };

    try {
      await updateTask({
        projectId,
        taskId: boardTask.taskId,
        updateTaskDTO,
        updatedTask: buildUpdatedTask(boardTask, updateTaskDTO, taskPriorities),
      }).unwrap();
      onClose();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Keys pressed in open selects and popovers bubble here through the portal; they belong to them
    if (!e.currentTarget.contains(e.target as Node)) return;

    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  // Runs in the capture phase, so a focused select trigger does not also open on Ctrl+Enter
  const handleKeyDownCapture = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.target as Node)) return;

    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      e.stopPropagation();
      handleSave();
    }
  };

  const isCard = variant === "card";
  const textSize = isCard ? "text-sm md:text-sm" : "text-base md:text-base";
  const selectTriggerClass = isCard ? "h-7 text-xs px-2" : "h-9";

  return (
    <div
      className="flex flex-col gap-2"
      onKeyDown={handleKeyDown}
      onKeyDownCapture={handleKeyDownCapture}
    >
      <Textarea
        ref={titleRef}
        value={title}
        aria-label="Title"
        placeholder="Title"
        rows={1}
        className={`min-h-0 px-2 py-1 resize-none font-medium ${textSize}`}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          // A title has one line, so Enter saves instead of breaking the line
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSave();
          }
        }}
      />

      <div className="flex flex-wrap items-center gap-1">
        {labels.map((label) => (
          <span
            key={label.name}
            className="inline-flex items-center gap-0.5 rounded-full pl-2 pr-1 py-0 text-xs font-medium"
            style={getLabelColors(label.color)}
          >
            {label.name}
            <button
              type="button"
              aria-label={`Remove label ${label.name}`}
              className="rounded-full cursor-pointer hover:bg-black/10"
              onClick={() => setLabels((current) => current.filter((l) => l.name !== label.name))}
            >
              <X className="size-3" aria-hidden="true" />
            </button>
          </span>
        ))}
        <AddLabelPopover
          taskLabelNames={labels.map((label) => label.name)}
          autoFocus={initialField === "labels"}
          onAdd={(newLabel) =>
            setLabels((current) =>
              // Adding a label the task already has changes its color
              current.some((l) => l.name === newLabel.name)
                ? current.map((l) => (l.name === newLabel.name ? newLabel : l))
                : [...current, newLabel]
            )
          }
        />
      </div>

      <Textarea
        ref={descriptionRef}
        value={description}
        aria-label="Description"
        placeholder="Description"
        className={`px-2 py-1 ${isCard ? "min-h-14" : "min-h-24"} ${textSize}`}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="flex items-center gap-2">
        <Select
          value={priorityId}
          onValueChange={setPriorityId}
          open={prioritySelectOpen}
          onOpenChange={setPrioritySelectOpen}
        >
          <SelectTrigger aria-label="Priority" className={`flex-1 min-w-0 ${selectTriggerClass}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE}>No priority</SelectItem>
            {taskPriorities?.map((priority) => (
              <SelectItem key={priority.id} value={priority.id}>
                <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: priority.color }}
                  aria-hidden="true"
                />
                {priority.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={assigneeEmail}
          onValueChange={setAssigneeEmail}
          open={assigneeSelectOpen}
          onOpenChange={setAssigneeSelectOpen}
        >
          <SelectTrigger aria-label="Assignee" className={`flex-1 min-w-0 ${selectTriggerClass}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE}>Unassigned</SelectItem>
            {projectUsers?.projectUsers?.map((projectUser) => (
              <SelectItem key={projectUser.email} value={projectUser.email}>
                {projectUser.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" size="sm" disabled={!canSave} onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}
