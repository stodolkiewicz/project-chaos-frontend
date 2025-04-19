"use client";

import { useAppSelector } from "@/app/hooks";
import { useGetUserProjectsQuery } from "@/app/services/api";
import { Button } from "@/components/ui/button";

export default function DashboardContent() {
  // undefined -> we are not passing any parameters (it is a simple get)
  const {
    data: projects,
    isLoading,
    error,
  } = useGetUserProjectsQuery(undefined, {
    // skip until there is accessToken in redux store
    skip: !useAppSelector((state) => state.user.accessToken),
  });

  if (error) return <div>There was an error while loading the projects</div>;
  if (isLoading || !projects) return <div>Loading...</div>;

  return (
    <div>
      <h1>Your projects</h1>
      {projects.length > 0 ? (
        <div>{JSON.stringify(projects)}</div>
      ) : (
        <Button>Create your first project</Button>
      )}
    </div>
  );
}
