"use client";

import { useAppSelector } from "@/app/hooks";
import { useGetProjectUsersQuery } from "@/app/state/ProjectsApiSlice";
import { useGetDefaultProjectIdQuery } from "@/app/state/UsersApiSlice";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useGetTaskPrioritiesQuery } from "@/app/state/TaskPrioritiesApiSlice";
import { useCreateTaskMutation, useUpdateTaskMutation } from "@/app/state/TasksApiSlice";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { HexColorPicker } from "react-colorful";
import { useGetLabelsQuery } from "@/app/state/LabelsApiSlice";
import { useErrorHandler } from "@/app/hooks/useErrorHandler";
import { BoardTaskDTO } from "@/app/types/BoardTasksDTO";
import { UpdateTaskDTO } from "@/app/types/UpdateTaskDTO";
import { buildUpdatedTask } from "../Task/buildUpdatedTask";

type Label = {
  name: string;
  color: string;
};

import { TaskStage } from "@/app/types/TaskStage";

export type CreateTaskFormData = {
  title: string;
  description: string;
  positionInColumn: number;
  columnId: string;
  assigneeEmail: string;
  priorityId: string;
  labels: Label[];
  stage: TaskStage;
};

type CreateTaskFormProps = {
  positionInColumn: number;
  // Backlog and archived tasks have no column
  columnId?: string;
  stage?: TaskStage;
  onClose: () => void;
  initialTitle?: string;
  initialDescription?: string;
  // When set, the form edits this task instead of creating a new one
  taskToEdit?: BoardTaskDTO;
};

export const generateRandomColor = () => {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
};

export default function CreateTaskForm({
  positionInColumn,
  columnId,
  stage = TaskStage.BOARD,
  onClose,
  initialTitle,
  initialDescription,
  taskToEdit,
}: CreateTaskFormProps) {
  const {
    register,
    control, // for dynamic fields
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskFormData>({
    defaultValues: taskToEdit
      ? {
          title: taskToEdit.title,
          description: taskToEdit.description ?? "",
          assigneeEmail: taskToEdit.assignee.email ?? "",
          priorityId: taskToEdit.priority.id ?? "",
          labels: taskToEdit.labels.map(({ name, color }) => ({ name, color })),
        }
      : {
          title: initialTitle,
          description: initialDescription,
        },
  });

  const { data } = useGetDefaultProjectIdQuery();
  const defaultProjectId = data?.projectId;

  const {
    data: projectUsers,
    isLoading: projectUsersLoading,
    error: projectUsersError,
  } = useGetProjectUsersQuery(defaultProjectId, {
    skip: !useAppSelector((state) => state.user.accessToken),
  });

  const {
    data: taskPriorities,
    isLoading: taskPrioritiesLoading,
    error: taskPrioritiesError,
  } = useGetTaskPrioritiesQuery(defaultProjectId, {
    skip: !useAppSelector((state) => state.user.accessToken),
  });

  const {
    data: labelResponseDTO,
    isLoading: labelsLoading,
    error: labelsError,
  } = useGetLabelsQuery(defaultProjectId, {
    skip: !useAppSelector((state) => state.user.accessToken),
  });

  useEffect(() => {
    register("positionInColumn", { valueAsNumber: true });
    setValue("positionInColumn", positionInColumn);
  });

  useEffect(() => {
    register("columnId");
    setValue("columnId", columnId);
  });

  // The selects get their options after the form mounts, so the edited values are set again once options exist
  useEffect(() => {
    if (taskToEdit && projectUsers) {
      setValue("assigneeEmail", taskToEdit.assignee.email ?? "");
    }
  }, [taskToEdit, projectUsers, setValue]);

  useEffect(() => {
    if (taskToEdit && taskPriorities) {
      setValue("priorityId", taskToEdit.priority.id ?? "");
    }
  }, [taskToEdit, taskPriorities, setValue]);

  const [createTask, { isLoading, isSuccess, isError }] =
    useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const { handleApiError } = useErrorHandler();

  const onSubmit = async (createTaskFormData: CreateTaskFormData) => {
    const createTaskFormDataNoEmptyLabels: CreateTaskFormData = {
      ...createTaskFormData,
      stage,
      labels: createTaskFormData.labels.filter((label, index, array) => {
        // The backend stores label names trimmed and lower-cased, so they are compared the same way
        const lastOccurrenceIndex = array.findLastIndex(
          (l) => l.name.trim().toLowerCase() === label.name.trim().toLowerCase()
        );
        // leave only the last occurrence, so a label added again overrides the color
        return index === lastOccurrenceIndex && label.name !== "";
      }),
    };

    if (taskToEdit) {
      await saveEditedTask(createTaskFormDataNoEmptyLabels);
      return;
    }

    try {
      await createTask({
        projectId: defaultProjectId,
        createTaskFormData: createTaskFormDataNoEmptyLabels,
      }).unwrap();

      toast.success(`Task "${createTaskFormData.title}" was created.`);
      onClose();
    } catch (err) {
      handleApiError(
        err,
        `There was an error while creating "${createTaskFormData.title}" task.`
      );
    }
    reset();
  };

  const saveEditedTask = async (formData: CreateTaskFormData) => {
    if (!taskToEdit || !defaultProjectId) return;

    const updateTaskDTO: UpdateTaskDTO = {
      title: formData.title.trim(),
      description: formData.description ?? "",
      assigneeEmail: formData.assigneeEmail || null,
      priorityId: formData.priorityId || null,
      labels: formData.labels,
    };

    try {
      await updateTask({
        projectId: defaultProjectId,
        taskId: taskToEdit.taskId,
        updateTaskDTO,
        updatedTask: buildUpdatedTask(taskToEdit, updateTaskDTO, taskPriorities),
      }).unwrap();

      toast.success(`Task "${updateTaskDTO.title}" was updated.`);
      onClose();
    } catch (err) {
      handleApiError(
        err,
        `There was an error while updating "${updateTaskDTO.title}" task.`
      );
    }
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "labels",
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col p-4"
      onKeyDown={(e) => {
        // Ctrl+Enter saves an edited task, as in the inline edit mode
        if (taskToEdit && e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          handleSubmit(onSubmit)();
        }
      }}
    >
      {/* TITLE */}
      <div>
        <label className="block text-sm font-medium">Title:</label>
        <input
          type="text"
          placeholder="Task title"
          {...register("title", { required: "Title is required" })}
          className="border border-primary p-2 rounded w-full"
        />
        {errors.title && (
          <p className="text-red-600 text-sm mt-0 mb-2">
            {" "}
            {errors.title.message}
          </p>
        )}
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="block text-sm font-medium mt-3">Description:</label>
        <Textarea
          className="wrap-anywhere"
          placeholder="Describe the task."
          {...register("description", {
            maxLength: {
              value: 5000,
              message: "Description must be at most 5000 characters",
            },
          })}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1 mb-2">
            {errors.description.message}
          </p>
        )}
      </div>
      {/* POSITION IN COLUMN - HIDDEN */}

      {/* COLUMN ID - HIDDEN */}

      {/* Assign to */}
      <label className="text-sm font-medium mt-3">Assign to:</label>
      <select
        {...register("assigneeEmail")}
        className="border border-primary p-2 rounded w-full mt-2"
      >
        <option value="">-- Select assignee email --</option>
        {projectUsers?.projectUsers?.map((projectUser) => (
          <option key={projectUser.email} value={projectUser.email}>
            {projectUser.email}
          </option>
        ))}
      </select>

      {/* Task priority */}
      <label className="text-sm font-medium mt-3">Priority:</label>
      <select
        {...register("priorityId")}
        className="border border-primary p-2 rounded w-full mt-2"
      >
        <option value="">-- Select task priority --</option>
        {taskPriorities?.map((taskPriority) => (
          <option key={taskPriority.id} value={taskPriority.id}>
            {taskPriority.name} ({taskPriority.priorityValue})
          </option>
        ))}
      </select>

      {/* Task labels */}
      <label className="text-sm font-medium mt-3">Labels:</label>

      {fields.map((field, index) => (
        <div key={field.id} className="mt-2 flex gap-2">
          <Controller
            control={control}
            name={`labels.${index}.name`}
            render={({ field }) => (
              <Input {...field} placeholder="Label name" />
            )}
          />
          {/* Kolor */}
          <Controller
            control={control}
            name={`labels.${index}.color`}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    className="w-8 h-8 rounded-full border"
                    style={{ backgroundColor: field.value }}
                  />
                </PopoverTrigger>
                <PopoverContent className="w-fit p-2">
                  <HexColorPicker
                    color={field.value}
                    onChange={field.onChange}
                  />
                </PopoverContent>
              </Popover>
            )}
          />

          <Button
            type="button"
            variant="destructive"
            onClick={() => remove(index)}
          >
            Delete
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="secondary"
        onClick={() => append({ name: "", color: generateRandomColor() })}
        className="mt-3"
      >
        Click to add a new label
      </Button>

      <div className="text-sm font-medium mt-3 flex gap-2">
        Existing labels:
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {labelResponseDTO &&
          labelResponseDTO?.labels?.map((label) => (
            <div
              key={label.id}
              onClick={() => append({ name: label.name, color: label.color })}
              className="flex border-1 border-primary-lighter-1 p-2 rounded-2xl hover:scale-104 duration-300 cursor-pointer hover:shadow-md"
            >
              <Button
                type="button"
                className="w-8 h-8 rounded-full border mr-2"
                style={{ backgroundColor: label.color }}
              />
              <div className="text-sm font-medium mt-1">{label.name}</div>
            </div>
          ))}
      </div>

      {/* SUBMIT BUTTON */}
      {taskToEdit ? (
        <div className="mt-4 flex gap-2 self-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-azure-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      ) : (
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-azure-600 self-end disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Create task
        </button>
      )}
    </form>
  );
}
