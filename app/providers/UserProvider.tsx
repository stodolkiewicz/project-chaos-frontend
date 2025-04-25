"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/app/hooks";
import { setUser } from "@/app/state/userSlice";
import { store } from "@/app/store";
import { UserAuthPayload } from "../types/UserData";

// Individual Providers, like this one, are required only if you have to initialise the state on startup.
export default function UserProvider({
  user,
  children,
}: {
  user: UserAuthPayload;
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
    }
  }, [user, dispatch]);

  return children;
}
