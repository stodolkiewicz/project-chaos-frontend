import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/app/store";
import { LabelResponseDTO } from "../types/LabelResponseDTO";
import { API_CONFIG } from "@/lib/apiConfig";

export const labelsApi = createApi({
  reducerPath: "LabelsApi",
  tagTypes: ["Labels"],
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
    getLabels: builder.query<LabelResponseDTO, string>({
      query: (projectId) => `/${projectId}/labels`,
      providesTags: (result, error, projectId) => [
        { type: "Labels", id: projectId },
      ],
    }),
  }),
});

export const { useGetLabelsQuery } = labelsApi;
export default labelsApi;
