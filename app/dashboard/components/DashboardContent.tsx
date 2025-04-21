"use client";

import { useAppSelector } from "@/app/hooks";
import { useGetUserProjectsQuery } from "@/app/services/api";
import { Button } from "@/components/ui/button";

export default function DashboardContent() {
  // undefined -> we are not passing any parameters (it is a simple get)
  const {
    data: userProjectsResponseDTO,
    isLoading,
    error,
  } = useGetUserProjectsQuery(undefined, {
    // skip until there is accessToken in redux store
    skip: !useAppSelector((state) => state.user.accessToken),
  });

  if (error) return <div>There was an error while loading the projects</div>;
  if (isLoading || !userProjectsResponseDTO) return <div>Loading...</div>;

  return (
    <div>
      <h1>Your projects</h1>
      {userProjectsResponseDTO.projects.length > 0 ? (
        <>
          <div>{userProjectsResponseDTO.defaultProjectId}</div>
          <div>{JSON.stringify(userProjectsResponseDTO.projects)}</div>
        </>
      ) : (
        <Button>Create your first project</Button>
      )}
    </div>
  );
}
