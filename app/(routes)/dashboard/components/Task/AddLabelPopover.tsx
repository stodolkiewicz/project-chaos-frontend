"use client";

import { useGetLabelsQuery } from "@/app/state/LabelsApiSlice";
import { useGetDefaultProjectIdQuery } from "@/app/state/UsersApiSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus } from "lucide-react";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { generateRandomColor } from "../CreateTask/CreateTaskForm";
import { getLabelColors } from "./taskCardStyles";

interface AddLabelPopoverProps {
  // Names of the labels the task already has; they are left out of the suggestions
  taskLabelNames: string[];
  onAdd: (label: { name: string; color: string }) => void;
  autoFocus?: boolean;
}

export default function AddLabelPopover({
  taskLabelNames,
  onAdd,
  autoFocus = false,
}: AddLabelPopoverProps) {
  const { data } = useGetDefaultProjectIdQuery();
  const projectId = data?.projectId;
  const { data: labelResponseDTO } = useGetLabelsQuery(projectId, {
    skip: !projectId,
  });

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(generateRandomColor);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  // The backend stores label names trimmed and lower-cased
  const normalizedName = name.trim().toLowerCase();

  const suggestions = (labelResponseDTO?.labels ?? []).filter(
    (label) =>
      !taskLabelNames.includes(label.name) &&
      label.name.includes(normalizedName)
  );

  const reset = () => {
    setName("");
    setColor(generateRandomColor());
    setColorPickerOpen(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      reset();
    }
  };

  const handleAdd = () => {
    if (!normalizedName) return;
    onAdd({ name: normalizedName, color });
    handleOpenChange(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Add label"
          autoFocus={autoFocus}
          className="flex items-center justify-center size-4 rounded-full border border-divider text-text-muted cursor-pointer hover:text-foreground hover:border-foreground"
        >
          <Plus className="size-3" aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-2 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Label color"
            className="size-6 shrink-0 rounded-full border cursor-pointer"
            style={{ backgroundColor: color }}
            onClick={() => setColorPickerOpen((isOpen) => !isOpen)}
          />
          <Input
            autoFocus
            value={name}
            placeholder="Label name"
            className="h-8 text-sm"
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
          />
        </div>

        {colorPickerOpen && (
          <HexColorPicker
            color={color}
            onChange={setColor}
            className="!w-full"
          />
        )}

        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {suggestions.map((label) => (
              <button
                key={label.id}
                type="button"
                className="rounded-full px-2 py-0 text-xs font-medium cursor-pointer hover:brightness-95"
                style={getLabelColors(label.color)}
                onClick={() => {
                  setName(label.name);
                  setColor(label.color);
                }}
              >
                {label.name}
              </button>
            ))}
          </div>
        )}

        <Button
          type="button"
          size="sm"
          disabled={!normalizedName}
          onClick={handleAdd}
        >
          Add
        </Button>
      </PopoverContent>
    </Popover>
  );
}
