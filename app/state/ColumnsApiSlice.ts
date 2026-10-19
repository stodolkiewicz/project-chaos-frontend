import { ColumnDTO } from "../types/ColumnDTO";
import { ColumnPreferenceDTO } from "../types/ColumnPreferenceDTO";
import baseApi from "./baseApi";

export const columnsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getColumns: builder.query<ColumnDTO[], string>({
      query: (projectId) => `/api/v1/projects/${projectId}/columns`,
      providesTags: (result, error, projectId) => [
        { type: "Columns", id: projectId },
      ],
    }),
    getColumnPreferences: builder.query<ColumnPreferenceDTO[], string>({
      query: (projectId) => `/api/v1/projects/${projectId}/columns/preferences`,
      providesTags: (result, error, projectId) => [
        { type: "ColumnPreferences", id: projectId },
      ],
    }),
    updateColumnPreferences: builder.mutation<
      void,
      { projectId: string; body: ColumnPreferenceDTO[] }
    >({
      query: ({ projectId, body }) => ({
        url: `/api/v1/projects/${projectId}/columns/preferences`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { projectId }) =>
        error ? [] : [{ type: "ColumnPreferences", id: projectId }],
    }),
  }),
});

export const {
  useGetColumnsQuery,
  useLazyGetColumnsQuery,
  useGetColumnPreferencesQuery,
  useUpdateColumnPreferencesMutation,
} = columnsApi;
export default columnsApi;
