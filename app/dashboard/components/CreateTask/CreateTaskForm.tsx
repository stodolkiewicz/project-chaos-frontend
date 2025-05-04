"use client";

import { useAppSelector } from "@/app/hooks";
import { useGetProjectUsersQuery } from "@/app/state/UsersApiSlice";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useGetTaskPrioritiesQuery } from "@/app/state/TaskPrioritiesApiSlice";
import { useCreateTaskMutation } from "@/app/state/TasksApiSlice";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { HexColorPicker } from "react-colorful";

type Label = {
  name: string;
  color: string;
};

export type CreateTaskFormData = {
  title: string;
  description: string;
  positionInColumn: number;
  columnId: string;
  assigneeEmail: string;
  priorityId: string;
  labels: Label[];
};

type CreateTaskFormProps = {
  positionInColumn: number;
  columnId: string;
  onClose: () => void;
};

export default function CreateTaskForm({
  positionInColumn,
  columnId,
  onClose,
}: CreateTaskFormProps) {
  const {
    register,
    control, // for dynamic fields
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateTaskFormData>();

  const defaultProjectId = useAppSelector(
    (state) => state.user.defaultProjectId
  );

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

  useEffect(() => {
    register("positionInColumn", { valueAsNumber: true });
    setValue("positionInColumn", positionInColumn);
  });

  useEffect(() => {
    register("columnId");
    setValue("columnId", columnId);
  });

  const [createTask, { isLoading, isSuccess, isError }] =
    useCreateTaskMutation();

  const onSubmit = async (createTaskFormData: CreateTaskFormData) => {
    // console.log("FormData: " + JSON.stringify(createTaskFormData));
    // console.log("FormData obiekt:", createTaskFormData);

    const createTaskFormDataNoEmptyLabels: CreateTaskFormData = {
      ...createTaskFormData,
      labels: createTaskFormData.labels.filter(
        (label) => label.name.trim() != ""
      ),
    };

    try {
      await createTask({
        projectId: defaultProjectId,
        createTaskFormData: createTaskFormDataNoEmptyLabels,
      }).unwrap();

      toast.success(`Task "${createTaskFormData.title}" was created.`);
      onClose();
    } catch (err) {
      toast.error(
        `There was an error while creating "${createTaskFormData.title}" task.`
      );
    }
    reset();
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "labels",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-4">
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
            required: "Description is required.",
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

      {/* Todo: task labels */}
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
        onClick={() => append({ name: "", color: "" })}
        className="mt-3"
      >
        Click to add a new label
      </Button>

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-azure-600 self-end"
      >
        Create task
      </button>
    </form>
  );
}
