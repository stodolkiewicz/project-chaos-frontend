"use client";

import { PRIORITY_COLORS } from "@/app/types/PriorityColor";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check } from "lucide-react";
import { useState } from "react";

interface PriorityColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

// Offers only the fixed palette, like the column color picker
export default function PriorityColorPicker({ value, onChange }: PriorityColorPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Priority color"
          className="size-6 shrink-0 rounded-full border border-divider cursor-pointer transition hover:scale-110"
          style={{ backgroundColor: value }}
        />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-2">
        <div className="grid grid-cols-4 gap-2">
          {PRIORITY_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={color}
              className="flex items-center justify-center size-7 rounded-full cursor-pointer transition hover:scale-110"
              style={{ backgroundColor: color }}
              onClick={() => {
                onChange(color);
                setOpen(false);
              }}
            >
              {color === value.toUpperCase() && <Check className="size-4 text-white" aria-hidden="true" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
