import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/app/store";
import { API_CONFIG } from "@/lib/apiConfig";

export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: [
    "Project",
    "DefaultProject",
    "ProjectUsers",
    "ProjectInvitations",
    "Users", 
    "Labels",
    "Columns",
    "TaskPriorities",
    "Tasks",
    "TaskComments"
  ],
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.baseUrl,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  refetchOnFocus: true,
  endpoints: () => ({}), // Endpoints will be injected by individual slices
});

export default baseApi;