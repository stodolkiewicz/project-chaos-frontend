"use client";

import { useUpdateProjectMutation } from "@/app/state/ProjectsApiSlice";
import { BoardTaskDTO } from "@/app/types/BoardTasksDTO";
import { ColumnDTO } from "@/app/types/ColumnDTO";
import { COLUMN_COLORS, ColumnColor, firstUnusedColumnColor } from "@/app/types/ColumnColor";
import { ProjectDTO } from "@/app/types/ProjectDTO";
import { UpdateProjectRequestDTO } from "@/app/types/UpdateProjectRequestDTO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Controller, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import ColumnColorPicker from "./ColumnColorPicker";

type EditProjectFormData = {
  description: string;
  // A missing columnId means a column added in this form
  columns: { columnId?: string; name: string; color: ColumnColor }[];
};

export default function EditProjectForm({
  project,
  columns,
  boardTasks,
  onClose,
}: {
  project: ProjectDTO;
  columns: ColumnDTO[];
  boardTasks: BoardTaskDTO[];
  onClose: () => void;
}) {
  const [updateProject, { isLoading }] = useUpdateProjectMutation();
  const [columnError, setColumnError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<EditProjectFormData>({
    defaultValues: {
      description: project.description ?? "",
      columns: columns.map((column) => ({
        columnId: column.id,
        name: column.name,
        color: column.color,
      })),
    },
  });

  // react-hook-form keeps its own row key in "id", so the column id lives in "columnId"
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "columns",
  });

  const onSubmit: SubmitHandler<EditProjectFormData> = async (data) => {
    if (data.columns.length < 2) {
      setColumnError("Keep at least 2 columns");
      return;
    }
    if (data.columns.some((column) => column.name.trim() === "")) {
      setColumnError("Every column needs a name");
      return;
    }
    setColumnError("");

    const body: UpdateProjectRequestDTO = {
      description: data.description,
      columns: data.columns.map(({ columnId, name, color }) => ({
        id: columnId,
        name: name.trim(),
        color,
      })),
    };

    try {
      await updateProject({ projectId: project.id, body }).unwrap();
      toast.success(`Project "${project.name}" was updated.`);
      onClose();
    } catch (err) {
      // The backend rejects a column that got tasks after the dialog opened. Its message names the column
      const detail = (err as { data?: { detail?: unknown } })?.data?.detail;
      if (typeof detail === "string") {
        setColumnError(detail);
      } else {
        setColumnError(`There was an error while updating "${project.name}" project.`);
      }
    }
  };

  const handleDeleteColumn = (index: number) => {
    const column = getValues(`columns.${index}`);
    const tasksCount = boardTasks.filter((task) => task.column.id === column.columnId).length;
    if (column.columnId && tasksCount > 0) {
      setColumnError(
        `Column "${column.name}" can not be deleted, because it has ${tasksCount} ${tasksCount === 1 ? "task" : "tasks"}. Move them to another column first.`
      );
      return;
    }
    setColumnError("");
    remove(index);
  };

  const handleAddColumn = () => {
    const currentColumns = getValues("columns");
    if (currentColumns.length > 0 && currentColumns[currentColumns.length - 1].name === "") {
      setColumnError("Choose a name for previous column first");
      return;
    }
    setColumnError("");
    append({
      name: "",
      color: firstUnusedColumnColor(currentColumns.map((column) => column.color)),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-4">
      {/* DESCRIPTION */}
      <div>
        <label className="block text-sm font-medium">Description:</label>
        <Textarea
          className="wrap-anywhere"
          placeholder="Describe the project in a few sentences"
          {...register("description", {
            required: "Description is required.",
            maxLength: {
              value: 5000,
              message: "Description must be at most 5000 characters",
            },
          })}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1 mb-2">{errors.description.message}</p>
        )}
      </div>

      {/* Columns */}
      <label className="text-sm font-medium mt-3">Columns:</label>

      {fields.map((field, index) => (
        <div key={field.id} className="mt-2 flex items-center gap-2">
          <div className="flex flex-col">
            <button
              type="button"
              aria-label="Move column up"
              disabled={index === 0}
              onClick={() => move(index, index - 1)}
              className="rounded text-text-muted cursor-pointer hover:text-primary disabled:cursor-default disabled:opacity-30 disabled:hover:text-text-muted"
            >
              <ChevronUp className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Move column down"
              disabled={index === fields.length - 1}
              onClick={() => move(index, index + 1)}
              className="rounded text-text-muted cursor-pointer hover:text-primary disabled:cursor-default disabled:opacity-30 disabled:hover:text-text-muted"
            >
              <ChevronDown className="size-4" aria-hidden="true" />
            </button>
          </div>
          <div className="w-6">{index + 1}. </div>
          {field.columnId ? (
            // The color of an existing column is fixed; it is chosen only when the column is created
            <span
              className="size-6 shrink-0 rounded-full border border-divider"
              style={{ backgroundColor: COLUMN_COLORS[field.color] }}
              aria-hidden="true"
            />
          ) : (
            <Controller
              control={control}
              name={`columns.${index}.color`}
              render={({ field: colorField }) => (
                <ColumnColorPicker value={colorField.value} onChange={colorField.onChange} />
              )}
            />
          )}
          <Input
            {...register(`columns.${index}.name`)}
            placeholder="Column name"
            className="flex-1"
          />
          <Button type="button" variant="destructive" onClick={() => handleDeleteColumn(index)}>
            Delete
          </Button>
        </div>
      ))}
      {columnError && <p className="text-red-500 text-sm mt-1 mb-2">{columnError}</p>}

      <Button type="button" variant="secondary" onClick={handleAddColumn} className="mt-3">
        Click to add the next column
      </Button>

      <div className="mt-4 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover cursor-pointer disabled:opacity-50"
        >
          Save changes
        </button>
      </div>
    </form>
  );
}
