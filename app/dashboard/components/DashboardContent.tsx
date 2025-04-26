"use client";

import { useAppSelector } from "@/app/hooks";
import { useGetColumnsQuery } from "@/app/state/ColumnsApiSlice";
import { Button } from "@/components/ui/button";
import { ColumnDTO } from "@/app/types/ColumnDTO";

export default function DashboardContent() {
  const defaultProjectId = useAppSelector(
    (state) => state.user.defaultProjectId
  );

  const {
    data: columns,
    isLoading: columnsLoading,
    error,
  } = useGetColumnsQuery(defaultProjectId, {
    skip: !useAppSelector((state) => state.user.accessToken),
  });

  if (!defaultProjectId || !columns)
    return (
      <div className="flex justify-center items-center min-h-screen ">
        <Button className="-translate-y-15">Create your first project</Button>
      </div>
    );

  let columnWidthPercentage = 80 / columns?.length;

  if (columnsLoading) return <div>Loading...</div>;
  if (error)
    return (
      <div>Error: {"message" in error ? error.message : "Unknown error"}</div>
    );

  return (
    <div>
      <h1 className="text-center mt-3 mb-3">Your project</h1>
      {columns?.length > 0 && (
        <div className="flex justify-center mx-auto">
          {columns.map((column, index) => (
            <div
              key={index}
              className="box-border border-2 ml-2 mr-2 min-h-[30rem]"
              style={{ width: `${columnWidthPercentage}%` }}
            >
              <h5 className="text-center bg-amber-400">{column.name}</h5>
              <p>Position {column.position}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
