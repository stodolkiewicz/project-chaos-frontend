"use client";

import { COLUMN_COLOR_KEYS, COLUMN_COLORS, ColumnColor } from "@/app/types/ColumnColor";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check } from "lucide-react";
import { useState } from "react";

interface ColumnColorPickerProps {
  value: ColumnColor;
  onChange: (color: ColumnColor) => void;
}

// Offers only the fixed palette, so every column color stays readable in both themes
export default function ColumnColorPicker({ value, onChange }: ColumnColorPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Column color"
          className="size-6 shrink-0 rounded-full border border-divider cursor-pointer transition hover:scale-110"
          style={{ backgroundColor: COLUMN_COLORS[value] }}
        />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-2">
        <div className="grid grid-cols-4 gap-2">
          {COLUMN_COLOR_KEYS.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={color.toLowerCase()}
              className="flex items-center justify-center size-7 rounded-full cursor-pointer transition hover:scale-110"
              style={{ backgroundColor: COLUMN_COLORS[color] }}
              onClick={() => {
                onChange(color);
                setOpen(false);
              }}
            >
              {color === value && <Check className="size-4 text-white" aria-hidden="true" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
