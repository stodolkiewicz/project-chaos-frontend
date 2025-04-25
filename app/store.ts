import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/app/state/userSlice";
import { columnsApi } from "./state/ColumnsApiSlice";
import { projectsApi } from "./state/ProjectsApiSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    [projectsApi.reducerPath]: projectsApi.reducer,
    [columnsApi.reducerPath]: columnsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      projectsApi.middleware,
      columnsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
