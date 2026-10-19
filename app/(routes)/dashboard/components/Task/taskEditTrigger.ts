import { TaskEditField } from "@/app/types/TaskEditField";

// Highlights a double-clickable field on hover; the negative margin keeps the text in place
export const EDITABLE_FIELD_CLASS = "-mx-1 px-1 rounded-sm cursor-pointer transition-colors hover:bg-muted";

// Labels have their own background, so the hover darkens it instead of adding one
export const EDITABLE_LABEL_CLASS = "cursor-pointer transition hover:brightness-95";

// Props that make an element enter the task edit mode on double-click
export function editTriggerProps(
  field: TaskEditField,
  onStartEdit: (field: TaskEditField) => void
) {
  return {
    onDoubleClick: () => onStartEdit(field),
    // Stops the double-click from selecting the text under the cursor
    onMouseDown: (e: React.MouseEvent) => {
      if (e.detail > 1) {
        e.preventDefault();
      }
    },
  };
}
