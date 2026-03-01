import { LabelResponseDTO } from "../types/LabelResponseDTO";
import baseApi from "./baseApi";

export const labelsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLabels: builder.query<LabelResponseDTO, string>({
      query: (projectId) => `/api/v1/projects/${projectId}/labels`,
      providesTags: (result, error, projectId) => [
        { type: "Labels", id: projectId },
      ],
    }),
  }),
});

export const { useGetLabelsQuery } = labelsApi;
export default labelsApi;
