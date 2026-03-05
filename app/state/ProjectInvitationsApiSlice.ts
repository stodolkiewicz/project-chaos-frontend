import { baseApi } from "./baseApi";

export interface CreateInvitationRequestDTO {
  email: string;
  role: string;
}

export interface CreateInvitationResponseDTO {
  id: string;
  email: string;
  role: "ADMIN" | "MEMBER" | "VIEWER";
  invitationStatus: "ADDED" | "INVITED";
}

export interface InvitationResponseDTO {
  id: string;
  email: string;
  role: string;
  projectId: string;
  projectName: string;
  invitedByEmail: string;
  createdDate: string;
}

export const projectInvitationsApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProjectInvitation: builder.mutation<CreateInvitationResponseDTO, { projectId: string; request: CreateInvitationRequestDTO }>({
      query: ({ projectId, request }) => ({
        url: `/api/v1/projects/${projectId}/invitations`,
        method: 'POST',
        body: request,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: 'ProjectInvitations', id: projectId },
        { type: 'ProjectInvitations', id: 'LIST' },
        { type: 'ProjectUsers', id: projectId }
      ],
    }),
    
    getProjectInvitations: builder.query<InvitationResponseDTO[], string>({
      query: (projectId) => `/api/v1/projects/${projectId}/invitations`,
      providesTags: (result, error, projectId) => [
        { type: 'ProjectInvitations', id: 'LIST' },
        { type: 'ProjectInvitations', id: projectId },
        ...(result || []).map((invitation) => ({ type: 'ProjectInvitations' as const, id: invitation.id })),
      ],
    }),
    
    deleteProjectInvitation: builder.mutation<void, { invitationId: string; projectId: string }>({
      query: ({ invitationId, projectId }) => ({
        url: `/api/v1/projects/${projectId}/invitations/${invitationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { projectId, invitationId }) => [
        { type: 'ProjectInvitations', id: invitationId },
        { type: 'ProjectInvitations', id: projectId },
        { type: 'ProjectInvitations', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateProjectInvitationMutation,
  useGetProjectInvitationsQuery,
  useDeleteProjectInvitationMutation,
} = projectInvitationsApiSlice;