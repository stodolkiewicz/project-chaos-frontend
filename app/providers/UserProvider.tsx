"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/app/hooks";
import { setUser } from "@/app/state/userSlice";
import { UserData } from "../types/UserData";
import { useLazyGetDefaultProjectIdQuery } from "../state/ProjectsApiSlice";

export default function UserProvider({
  user,
  children,
}: {
  user: UserData;
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const [triggerGetDefaultProject] = useLazyGetDefaultProjectIdQuery();

  useEffect(() => {
    // dlaczego? bo nie można bezpośrednio użyć await w useEffect.
    const fetchAndSetUser = async () => {
      // set user data from access token (no defaultProjectId)
      dispatch(setUser(user));

      // no defaultProjectId? try to get it from backend
      if (!user.defaultProjectId) {
        try {
          const result = await triggerGetDefaultProject().unwrap();

          if (result?.projectId) {
            const updatedUser = {
              ...user,
              defaultProjectId: result.projectId,
            };
            dispatch(setUser(updatedUser));
          }
        } catch (err) {
          console.error("Failed to fetch default projectId:", err);
        }
      }
    };

    fetchAndSetUser();
  }, [user, dispatch, triggerGetDefaultProject]);

  return children;
}
