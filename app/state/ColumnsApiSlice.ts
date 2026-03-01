import { ColumnDTO } from "../types/ColumnDTO";
import baseApi from "./baseApi";

export const columnsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getColumns: builder.query<ColumnDTO[], string>({
      query: (projectId) => `/api/v1/projects/${projectId}/columns`,
      providesTags: (result, error, projectId) => [
        { type: "Columns", id: projectId },
      ],
    }),
  }),
});

export const { useGetColumnsQuery } = columnsApi;
export default columnsApi;
