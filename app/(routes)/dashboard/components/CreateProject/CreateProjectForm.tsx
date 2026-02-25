"use client";

import { useCreateProjectMutation } from "@/app/state/ProjectsApiSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { CreateProjectRequestDTO } from "@/app/types/CreateProjectRequestDTO";

import { toast } from "sonner";

export type CreateProjectFormData = {
  name: string;
  description: string;
  columns: { name: string }[];
};

export default function CreateProjectForm({
  onClose,
}: {
  onClose: () => void;
}) {
  const [createProject, { isLoading, isSuccess, isError }] =
    useCreateProjectMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CreateProjectFormData>();

  const onSubmit: SubmitHandler<CreateProjectFormData> = async (data) => {
    if (data.columns.length < 2) {
      setColumnError("Create at least 2 columns");
      return;
    }

    try {
      const createProjectRequestDTO = {
        ...data,
        columns: data.columns.map((col) => col.name),
      };
      await createProject(createProjectRequestDTO).unwrap();

      toast.success(`Project "${createProjectRequestDTO.name}" was created.`);
      onClose();
    } catch (err) {
      toast.error(`There was an error while creating "${data.name}" project.`);
    }
    reset();
  };

  const { fields, append, remove } = useFieldArray<CreateProjectFormData>({
    control,
    name: "columns",
  });

  useEffect(() => {
    const columns = getValues("columns");
    if (!columns || columns.length === 0) {
      append({ name: "To do" });
      append({ name: "In progress" });
      append({ name: "Done" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [columnError, setColumnError] = useState("");

  const handleAddColumn = () => {
    const columns = getValues("columns");
    if (columns.length > 0 && columns[columns.length - 1].name === "") {
      setColumnError("Choose a name for previous column first");
      return;
    }
    setColumnError("");
    append({ name: "" });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-4">
      {/* name */}
      <div>
        <label className="block text-sm font-medium">Project name:</label>
        <input
          type="text"
          placeholder="Type Project Name here"
          {...register("name", { required: "Project name is required" })}
          className="border border-primary p-2 rounded w-full"
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-0 mb-2">
            {" "}
            {errors.name.message}
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

      {/* Column names */}
      <label className="text-sm font-medium mt-3">Column names:</label>

      {fields.map((field, index) => (
        <div key={field.id} className="mt-2 flex gap-2">
          <Controller
            control={control}
            name={`columns.${index}.name`}
            render={({ field }) => (
              <>
                <div className="flex items-center w-full">
                  <div className="mr-2 w-6">{index + 1}. </div>
                  <Input
                    {...field}
                    placeholder="Label name"
                    className="flex-1"
                  />
                </div>
              </>
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
      {columnError && (
        <p className="text-red-500 text-sm mt-1 mb-2">{columnError}</p>
      )}

      <Button
        type="button"
        variant="secondary"
        onClick={handleAddColumn}
        className="mt-3"
      >
        Click to add the next column
      </Button>

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-azure-600 self-end"
      >
        Create project
      </button>
    </form>
  );
}
