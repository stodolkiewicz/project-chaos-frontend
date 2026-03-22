"use client";

import { useAppSelector } from "@/app/hooks";
import { ColumnDTO } from "@/app/types/ColumnDTO";
import { BoardTaskDTO } from "@/app/types/BoardTasksDTO";
import Column from "./Column";

interface KanbanBoardProps {
  columns: ColumnDTO[];
  groupedTasks: Record<string, BoardTaskDTO[]>;
}

export default function KanbanBoard({ columns, groupedTasks }: KanbanBoardProps) {
  const isAIChatOpen = useAppSelector((state) => state.ui.isAIChatOpen);
  const isBoardOpen = useAppSelector((state) => state.ui.isBoardOpen);

  return (
    <>
      {/* COLUMNS */}
      {isBoardOpen && columns?.length > 0 && (
        <div 
          className={`grid 
          grid-cols-1 
          xl:grid-cols-[repeat(var(--cols),minmax(0,1fr))] 
          ${isAIChatOpen ? 'w-[97%]' : 'w-[85%]'} gap-1 mx-auto items-stretch transition-all duration-300`}
          style={{ '--cols': columns.length } as React.CSSProperties}
        >
          {columns.map((column, index) => {
            const tasksInColumn = groupedTasks[column.id] || [];
            return (
              <Column
                key={column.id}
                column={column}
                tasksInColumn={tasksInColumn}
              />
            );
          })}
        </div>
      )}
    </>
  );
}