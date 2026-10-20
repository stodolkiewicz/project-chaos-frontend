"use client";

import ColumnColorPicker from "@/app/(routes)/dashboard/components/CreateProject/ColumnColorPicker";
import {
  useLazyGetColumnsQuery,
  useUpdateColumnPreferencesMutation,
} from "@/app/state/ColumnsApiSlice";
import { useUpdateProjectMutation } from "@/app/state/ProjectsApiSlice";
import { useUpdateTaskPrioritiesMutation } from "@/app/state/TaskPrioritiesApiSlice";
import { BoardTaskDTO } from "@/app/types/BoardTasksDTO";
import { ColumnDTO } from "@/app/types/ColumnDTO";
import { COLUMN_COLORS, ColumnColor, firstUnusedColumnColor } from "@/app/types/ColumnColor";
import { ColumnPreferenceDTO } from "@/app/types/ColumnPreferenceDTO";
import { COLUMN_SOUND_KEYS, COLUMN_SOUND_LABELS, ColumnSound } from "@/app/types/ColumnSound";
import { firstUnusedPriorityColor } from "@/app/types/PriorityColor";
import { ProjectDTO } from "@/app/types/ProjectDTO";
import { TaskPriorityDTO } from "@/app/types/TaskPriorityDTO";
import { UpdateProjectRequestDTO } from "@/app/types/UpdateProjectRequestDTO";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { playColumnSound } from "@/lib/celebrate";
import { ChevronDown, ChevronUp, Trash2, Volume2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, SubmitHandler, useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import PriorityColorPicker from "./PriorityColorPicker";

// Column, sound and confetti
const PREFERENCES_GRID = "grid-cols-[minmax(0,1fr)_11rem_7rem]";

// The database allows priority values from 1 to 5, and every priority has a different one.
// The form hides the values; a new priority takes the first free one.
const PRIORITY_VALUES = [1, 2, 3, 4, 5];

// The backend explains a rejected save in "detail"
function errorDetail(err: unknown): string | undefined {
  const detail = (err as { data?: { detail?: unknown } })?.data?.detail;
  return typeof detail === "string" ? detail : undefined;
}

type ProjectSettingsFormData = {
  description: string;
  // A missing columnId means a column added in this form
  columns: {
    columnId?: string;
    name: string;
    color: ColumnColor;
    sound: ColumnSound;
    confetti: boolean;
  }[];
  // A missing priorityId means a priority added in this form
  priorities: {
    priorityId?: string;
    name: string;
    priorityValue: number;
    color: string;
    taskCount: number;
  }[];
};

export default function ProjectSettingsForm({
  project,
  columns,
  boardTasks,
  preferences,
  priorities,
  projectRole,
}: {
  project: ProjectDTO;
  columns: ColumnDTO[];
  boardTasks: BoardTaskDTO[];
  preferences: ColumnPreferenceDTO[];
  priorities: TaskPriorityDTO[];
  projectRole: "ADMIN" | "MEMBER" | "VIEWER";
}) {
  const router = useRouter();
  const [updateProject, { isLoading: isProjectSaving }] = useUpdateProjectMutation();
  const [updateTaskPriorities, { isLoading: isPrioritiesSaving }] =
    useUpdateTaskPrioritiesMutation();
  const [updateColumnPreferences, { isLoading: isPreferencesSaving }] =
    useUpdateColumnPreferencesMutation();
  const [fetchColumns] = useLazyGetColumnsQuery();
  const [columnError, setColumnError] = useState("");
  const [priorityError, setPriorityError] = useState("");
  // The index of a used priority waiting for the admin to confirm its deletion
  const [priorityToDelete, setPriorityToDelete] = useState<number | null>(null);

  const isAdmin = projectRole === "ADMIN";
  const isViewer = projectRole === "VIEWER";

  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors, isDirty },
  } = useForm<ProjectSettingsFormData>({
    defaultValues: {
      description: project.description ?? "",
      columns: columns.map((column) => {
        const preference = preferences.find((p) => p.columnId === column.id);
        return {
          columnId: column.id,
          name: column.name,
          color: column.color,
          sound: preference?.sound ?? "NONE",
          confetti: preference?.confetti ?? false,
        };
      }),
      priorities: priorities.map((priority) => ({
        priorityId: priority.id,
        name: priority.name,
        priorityValue: priority.priorityValue,
        color: priority.color,
        taskCount: priority.taskCount,
      })),
    },
  });

  // react-hook-form keeps its own row key in "id", so the column id lives in "columnId"
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "columns",
  });
  // The sounds section shows the names and colors while the admin edits them above
  const watchedColumns = useWatch({ control, name: "columns" });

  const {
    fields: priorityFields,
    append: appendPriority,
    remove: removePriority,
  } = useFieldArray({
    control,
    name: "priorities",
  });
  // The delete dialog shows the current name of the priority
  const watchedPriorities = useWatch({ control, name: "priorities" });

  const onSubmit: SubmitHandler<ProjectSettingsFormData> = async (data) => {
    if (data.columns.length < 2) {
      setColumnError("Keep at least 2 columns");
      return;
    }
    if (data.columns.some((column) => column.name.trim() === "")) {
      setColumnError("Every column needs a name");
      return;
    }
    setColumnError("");
    if (data.priorities.some((priority) => priority.name.trim() === "")) {
      setPriorityError("Every priority needs a name");
      return;
    }
    setPriorityError("");

    try {
      let columnIds = data.columns.map((column) => column.columnId);

      if (isAdmin) {
        const body: UpdateProjectRequestDTO = {
          description: data.description,
          columns: data.columns.map(({ columnId, name, color }) => ({
            id: columnId,
            name: name.trim(),
            color,
          })),
        };
        await updateProject({ projectId: project.id, body }).unwrap();

        try {
          await updateTaskPriorities({
            projectId: project.id,
            body: {
              priorities: data.priorities.map(({ priorityId, name, priorityValue, color }) => ({
                id: priorityId,
                name: name.trim(),
                priorityValue,
                color,
              })),
            },
          }).unwrap();
        } catch (err) {
          setPriorityError(
            errorDetail(err) ?? `There was an error while saving priorities of "${project.name}" project.`
          );
          return;
        }

        // New columns get their ids only now. The backend keeps the order of the form, so row i is column i
        const savedColumns = await fetchColumns(project.id).unwrap();
        columnIds = savedColumns.map((column) => column.id);
      }

      await updateColumnPreferences({
        projectId: project.id,
        body: data.columns.map((column, index) => ({
          columnId: columnIds[index]!,
          sound: column.sound,
          confetti: column.confetti,
        })),
      }).unwrap();

      toast.success(`Settings of "${project.name}" were saved.`);
      router.back();
    } catch (err) {
      // The backend rejects a column that got tasks after the page opened. Its message names the column
      setColumnError(
        errorDetail(err) ?? `There was an error while saving settings of "${project.name}" project.`
      );
    }
  };

  const handleDeletePriority = (index: number) => {
    setPriorityError("");
    if (getValues(`priorities.${index}.taskCount`) > 0) {
      setPriorityToDelete(index);
      return;
    }
    removePriority(index);
  };

  const handleAddPriority = () => {
    const currentPriorities = getValues("priorities");
    const usedValues = currentPriorities.map((priority) => priority.priorityValue);
    const freeValue = PRIORITY_VALUES.find((value) => !usedValues.includes(value));
    if (freeValue === undefined) return;
    setPriorityError("");
    appendPriority({
      name: "",
      priorityValue: freeValue,
      color: firstUnusedPriorityColor(currentPriorities.map((priority) => priority.color)),
      taskCount: 0,
    });
  };

  const priorityPendingDeletion =
    priorityToDelete === null ? undefined : watchedPriorities[priorityToDelete];

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
      sound: "NONE",
      confetti: false,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      {/* DESCRIPTION */}
      <section className="bg-panel rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-header px-6 py-2">
          <h2 className="text-base font-semibold text-primary-foreground">Description</h2>
        </div>
        <div className="p-6">
          {isAdmin ? (
            <>
              <Textarea
                className="wrap-anywhere"
                placeholder="Describe the project in a few sentences"
                {...register("description", {
                  maxLength: {
                    value: 5000,
                    message: "Description must be at most 5000 characters",
                  },
                })}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </>
          ) : (
            <p className="leading-relaxed whitespace-pre-wrap wrap-anywhere">{project.description}</p>
          )}
        </div>
      </section>

      {/* COLUMNS: the board layout, shared by everyone, so only an admin changes it */}
      {isAdmin && (
        <section className="bg-panel rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-header px-6 py-2">
            <h2 className="text-base font-semibold text-primary-foreground">Columns</h2>
          </div>
          <div className="p-6 flex flex-col">
            {fields.map((field, index) => (
              <div key={field.id} className="mt-2 first:mt-0 flex items-center gap-2">
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
                <div className="w-6 shrink-0">{index + 1}. </div>
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
                  className="min-w-0 flex-1"
                />
                <button
                  type="button"
                  aria-label="Delete column"
                  title="Delete column"
                  onClick={() => handleDeleteColumn(index)}
                  className="rounded p-1 text-text-muted cursor-pointer hover:text-red-500"
                >
                  <Trash2 className="size-5" aria-hidden="true" />
                </button>
              </div>
            ))}
            {columnError && <p className="text-red-500 text-sm mt-2">{columnError}</p>}

            <Button type="button" variant="secondary" onClick={handleAddColumn} className="mt-4">
              Click to add the next column
            </Button>
          </div>
        </section>
      )}

      {/* SOUNDS AND CONFETTI: personal, so every member sets them only for themself */}
      <section className="bg-panel rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-header px-6 py-2">
          <h2 className="text-base font-semibold text-primary-foreground">Sounds and confetti</h2>
        </div>
        <div className="p-6 flex flex-col">
          <p className="text-sm text-text-muted">
            Choose what you hear and see after you drop a task into a column. These settings are only yours.
          </p>

          {/* A shared grid keeps the sound and confetti controls under their headers in every row */}
          <div
            className={`mt-4 grid ${PREFERENCES_GRID} items-center gap-3 pb-2 border-b border-divider text-xs font-medium uppercase tracking-wide text-text-muted`}
          >
            <span>Column</span>
            <span>Sound</span>
            <span className="text-center">Confetti</span>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className={`grid ${PREFERENCES_GRID} items-center gap-3 py-2 border-b border-divider last:border-b-0`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 shrink-0">{index + 1}. </div>
                <span
                  className="size-6 shrink-0 rounded-full border border-divider"
                  style={{ backgroundColor: COLUMN_COLORS[watchedColumns[index]?.color ?? field.color] }}
                  aria-hidden="true"
                />
                <span className="truncate font-medium">
                  {watchedColumns[index]?.name || <span className="italic text-text-muted">New column</span>}
                </span>
              </div>

              <Controller
                control={control}
                name={`columns.${index}.sound`}
                render={({ field: soundField }) => (
                  <div className="flex items-center gap-2">
                    <Select
                      value={soundField.value}
                      onValueChange={soundField.onChange}
                      disabled={isViewer}
                    >
                      <SelectTrigger className="w-full" aria-label={`Sound of column ${index + 1}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COLUMN_SOUND_KEYS.map((sound) => (
                          <SelectItem key={sound} value={sound}>
                            {COLUMN_SOUND_LABELS[sound]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <button
                      type="button"
                      aria-label="Play sound"
                      disabled={soundField.value === "NONE"}
                      onClick={() => playColumnSound(soundField.value)}
                      className="rounded text-text-muted cursor-pointer hover:text-primary disabled:cursor-default disabled:opacity-30 disabled:hover:text-text-muted"
                    >
                      <Volume2 className="size-5" aria-hidden="true" />
                    </button>
                  </div>
                )}
              />

              <Controller
                control={control}
                name={`columns.${index}.confetti`}
                render={({ field: confettiField }) => (
                  <div className="flex justify-center">
                    <Switch
                      aria-label={`Confetti in column ${index + 1}`}
                      checked={confettiField.value}
                      onCheckedChange={confettiField.onChange}
                      disabled={isViewer}
                    />
                  </div>
                )}
              />
            </div>
          ))}
          {/* A member can still get an error from the backend, so it is shown here too */}
          {!isAdmin && columnError && <p className="text-red-500 text-sm mt-2">{columnError}</p>}
        </div>
      </section>

      {/* PRIORITIES: shared by the whole project, so only an admin changes them */}
      {isAdmin && (
        <section className="bg-panel rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-header px-6 py-2">
            <h2 className="text-base font-semibold text-primary-foreground">Task priorities</h2>
          </div>
          <div className="p-6 flex flex-col">
            <p className="text-sm text-text-muted mb-2">
              Choose the priorities that members can give to tasks in this project.
            </p>

            {priorityFields.map((field, index) => (
              <div key={field.id} className="mt-2 flex items-center gap-2">
                <Controller
                  control={control}
                  name={`priorities.${index}.color`}
                  render={({ field: colorField }) => (
                    <PriorityColorPicker value={colorField.value} onChange={colorField.onChange} />
                  )}
                />
                <Input
                  {...register(`priorities.${index}.name`)}
                  placeholder="Priority name"
                  maxLength={50}
                  className="min-w-0 flex-1"
                />
                <button
                  type="button"
                  aria-label="Delete priority"
                  title="Delete priority"
                  onClick={() => handleDeletePriority(index)}
                  className="rounded p-1 text-text-muted cursor-pointer hover:text-red-500"
                >
                  <Trash2 className="size-5" aria-hidden="true" />
                </button>
              </div>
            ))}
            {priorityError && <p className="text-red-500 text-sm mt-2">{priorityError}</p>}

            <Button
              type="button"
              variant="secondary"
              onClick={handleAddPriority}
              disabled={priorityFields.length >= PRIORITY_VALUES.length}
              className="mt-4"
            >
              Click to add the next priority
            </Button>
          </div>

          <AlertDialog
            open={priorityToDelete !== null}
            onOpenChange={(open) => !open && setPriorityToDelete(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete priority?</AlertDialogTitle>
                <AlertDialogDescription>
                  {priorityPendingDeletion?.taskCount}{" "}
                  {priorityPendingDeletion?.taskCount === 1 ? "task uses" : "tasks use"} priority{" "}
                  <span className="font-bold">{priorityPendingDeletion?.name}</span>. After saving
                  they will have no priority.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    if (priorityToDelete !== null) removePriority(priorityToDelete);
                    setPriorityToDelete(null);
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>
      )}

      {/* The page is long, so the buttons stick to the bottom of the screen and stay visible */}
      <div className="sticky bottom-0 z-10 flex items-center justify-end gap-2 border-t border-divider bg-background py-4">
        {!isViewer && isDirty && (
          <span className="mr-auto text-sm font-medium text-amber-600">You have unsaved changes</span>
        )}
        <Button type="button" variant="outline" onClick={() => router.back()}>
          {isViewer ? "Back" : "Cancel"}
        </Button>
        {!isViewer && (
          <button
            type="submit"
            disabled={isProjectSaving || isPrioritiesSaving || isPreferencesSaving}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover cursor-pointer disabled:opacity-50"
          >
            Save changes
          </button>
        )}
      </div>
    </form>
  );
}
