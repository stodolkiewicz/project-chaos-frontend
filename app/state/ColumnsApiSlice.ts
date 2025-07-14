import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/app/store";
import { ColumnDTO } from "../types/ColumnDTO";
import { API_CONFIG } from "@/lib/apiConfig";

export const columnsApi = createApi({
  reducerPath: "ColumnsApi",
  tagTypes: ["Columns"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_CONFIG.baseUrl}/api/v1/projects`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.accessToken;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  refetchOnFocus: true,
  endpoints: (builder) => ({
    getColumns: builder.query<ColumnDTO[], string>({
      query: (projectId) => `/${projectId}/columns`,
      providesTags: (result, error, projectId) => [
        { type: "Columns", id: projectId },
      ],
    }),
  }),
});

export const { useGetColumnsQuery } = columnsApi;
export default columnsApi;
