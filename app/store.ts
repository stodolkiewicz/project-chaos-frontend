import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/app/features/userSlice";
import { projectApi } from "./services/api";

export const store = configureStore({
  reducer: {
    user: userReducer,
    [projectApi.reducerPath]: projectApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(projectApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
