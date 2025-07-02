"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/app/hooks";
import { setUser } from "@/app/state/userSlice";
import { UserData } from "../types/UserData";
import { useGetDefaultProjectIdQuery } from "../state/ProjectsApiSlice";

export default function UserProvider({
  user,
  children,
}: {
  user: UserData;
  children: React.ReactNode;
}) {
  const [userSet, setUserSet] = useState(false);
  const { data, isLoading, error } = useGetDefaultProjectIdQuery(undefined, {
    // don't start query until user is set (access token needs to be set to execute query)
    skip: !userSet,
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setUser(user));
    setUserSet(true);
  }, [user, dispatch]);

  // Nie renderuj children dopóki nie mamy defaultProjectId
  if (!data) {
    return <div>Loading...aa</div>; // lub jakiś loading spinner
  }

  return children;
}
