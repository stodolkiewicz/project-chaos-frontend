"use client";

import { useGetLabelsQuery } from "@/app/state/LabelsApiSlice";
import { useGetProjectUsersQuery } from "@/app/state/ProjectsApiSlice";
import { useGetTaskPrioritiesQuery } from "@/app/state/TaskPrioritiesApiSlice";
import { useGetDefaultProjectIdQuery } from "@/app/state/UsersApiSlice";
import { EMPTY_TASK_FILTERS, NO_VALUE, TaskFilters } from "@/app/types/TaskFilters";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { getLabelColors } from "../Task/taskCardStyles";

interface FilterOption {
  value: string;
  content: React.ReactNode;
}

interface FilterDropdownProps {
  name: string;
  noValueLabel: string;
  options: FilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

function FilterDropdown({
  name,
  noValueLabel,
  options,
  selected,
  onChange,
}: FilterDropdownProps) {
  const toggle = (value: string, checked: boolean) =>
    onChange(checked ? [...selected, value] : selected.filter((v) => v !== value));

  const renderItem = (value: string, content: React.ReactNode) => (
    <DropdownMenuCheckboxItem
      key={value}
      checked={selected.includes(value)}
      onCheckedChange={(checked) => toggle(value, checked)}
      // Keeps the menu open, so several values can be picked in a row
      onSelect={(e) => e.preventDefault()}
    >
      {content}
    </DropdownMenuCheckboxItem>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={selected.length > 0 ? "border-primary text-primary" : ""}
        >
          {name}
          {selected.length > 0 && (
            <span className="rounded-full bg-primary px-1.5 text-xs text-white">
              {selected.length}
            </span>
          )}
          <ChevronDown className="size-4 opacity-60" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-72 overflow-y-auto">
        {renderItem(NO_VALUE, <span className="text-text-muted">{noValueLabel}</span>)}
        {options.length > 0 && <DropdownMenuSeparator />}
        {options.map((option) => renderItem(option.value, option.content))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface TaskFiltersBarProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
}

export default function TaskFiltersBar({ filters, onChange }: TaskFiltersBarProps) {
  const { data } = useGetDefaultProjectIdQuery();
  const projectId = data?.projectId;
  const { data: taskPriorities } = useGetTaskPrioritiesQuery(projectId, {
    skip: !projectId,
  });
  const { data: labelResponseDTO } = useGetLabelsQuery(projectId, {
    skip: !projectId,
  });
  const { data: projectUsers } = useGetProjectUsersQuery(projectId, {
    skip: !projectId,
  });

  const hasFilters =
    filters.priorities.length > 0 || filters.labels.length > 0 || filters.assignees.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-2 px-2 pb-1">
      <FilterDropdown
        name="Priority"
        noValueLabel="No priority"
        selected={filters.priorities}
        onChange={(priorities) => onChange({ ...filters, priorities })}
        options={(taskPriorities ?? []).map((priority) => ({
          value: priority.id,
          content: (
            <>
              <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: priority.color }}
                aria-hidden="true"
              />
              {priority.name}
            </>
          ),
        }))}
      />
      <FilterDropdown
        name="Label"
        noValueLabel="No label"
        selected={filters.labels}
        onChange={(labels) => onChange({ ...filters, labels })}
        options={(labelResponseDTO?.labels ?? []).map((label) => ({
          value: label.id,
          content: (
            <span
              className="rounded-full px-2 py-0 text-xs font-medium"
              style={getLabelColors(label.color)}
            >
              {label.name}
            </span>
          ),
        }))}
      />
      <FilterDropdown
        name="Assignee"
        noValueLabel="Unassigned"
        selected={filters.assignees}
        onChange={(assignees) => onChange({ ...filters, assignees })}
        options={(projectUsers?.projectUsers ?? []).map((projectUser) => ({
          value: projectUser.id,
          content: projectUser.email,
        }))}
      />
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={() => onChange(EMPTY_TASK_FILTERS)}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
