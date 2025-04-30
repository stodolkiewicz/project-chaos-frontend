"use client";

import { useAppSelector } from "@/app/hooks";
import { useGetProjectUsersQuery } from "@/app/state/UsersApiSlice";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  title: string;
  description: string;
  positionInColumn: number;
  columnId: string;
  assigneeEmail: string;
};

type CreateTaskFormProps = {
  positionInColumn: number;
  columnId: string;
};

export default function CreateTaskForm({
  positionInColumn,
  columnId,
}: CreateTaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

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

  useEffect(() => {
    setValue("positionInColumn", positionInColumn);
  }, [positionInColumn, setValue]);

  useEffect(() => {
    setValue("columnId", columnId);
  }, [columnId, setValue]);

  const onSubmit = (data: FormData) => {
    console.log("FormData: " + JSON.stringify(data));
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-4">
      {/* TITLE */}
      <div>
        <label className="block text-sm font-medium">Task title</label>
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
        <label className="block text-sm font-medium mt-3">
          Task description
        </label>
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
      <input type="hidden" {...register("positionInColumn")} />
      {/* COLUMN ID - HIDDEN */}
      <input type="hidden" {...register("columnId")} />

      {/* Assign to */}
      <label className="block text-sm font-medium mt-3">Assign to</label>
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
      {errors.assigneeEmail && (
        <p className="text-red-500 text-sm mt-1 mb-2">
          {errors.assigneeEmail.message}
        </p>
      )}

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
