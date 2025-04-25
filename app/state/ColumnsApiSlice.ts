import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/app/store";
import { ColumnDTO } from "../types/ColumnDTO";

export const columnsApi = createApi({
  reducerPath: "ColumnsApi",
  tagTypes: ["Columns"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/v1/projects",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.accessToken;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getColumns: builder.query<ColumnDTO[], string>({
      query: (projectId) => `/${projectId}/columns`,
      providesTags: [{ type: "Columns" }],
    }),
  }),
});

export const { useGetColumnsQuery } = columnsApi;
export default columnsApi;
