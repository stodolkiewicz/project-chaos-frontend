"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/app/hooks";
import { setUser } from "@/app/features/userSlice";

// Individual Providers, like this one, are required only if you have to initialise the state on startup.
export default function UserProvider({ user, children }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
    }
  }, [user, dispatch]);

  return children;
}
