"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/app/features/userSlice";

export default function UserProvider({ user, children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
    }
  }, [user, dispatch]);

  return children;
}
