import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/app/state/userSlice";
import uiReducer from "@/app/state/uiSlice";
import { baseApi } from "./state/baseApi";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    user: userReducer,
    ui: uiReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      baseApi.middleware
    ),
});

// enable refetch on going back to tab, reconnect to internet
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
