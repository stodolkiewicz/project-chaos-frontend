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

  if (columnsLoading) return <div>Loading...</div>;
  if (error)
    return (
      <div>Error: {"message" in error ? error.message : "Unknown error"}</div>
    );

  return (
    <div>
      <h1>Your projects</h1>
      {columns && columns.length > 0 && <div>{JSON.stringify(columns)}</div>}

      {!columns ||
        (columns.length === 0 && <Button>Create your first project</Button>)}
    </div>
  );
}
