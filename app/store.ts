import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/app/state/userSlice";
import { columnsApi } from "./state/ColumnsApiSlice";
import { projectsApi } from "./state/ProjectsApiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import tasksApi from "./state/TasksApiSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    [projectsApi.reducerPath]: projectsApi.reducer,
    [columnsApi.reducerPath]: columnsApi.reducer,
    [tasksApi.reducerPath]: tasksApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      projectsApi.middleware,
      columnsApi.middleware,
      tasksApi.middleware
    ),
});

// enable refetch on going back to tab, reconnect to internet
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
