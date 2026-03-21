import { BoardTaskDTO } from "../types/BoardTasksDTO";
import { CreateTaskFormData } from "../(routes)/dashboard/components/CreateTask/CreateTaskForm";
import { UpdateTaskColumnDTO } from "../types/UpdateTaskColumnDTO";
import baseApi from "./baseApi";

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBoardTasks: builder.query<BoardTaskDTO[], string>({
      query: (projectId) => `/api/v1/projects/${projectId}/tasks?stage=BOARD`,
      providesTags: (result, error, projectId) => [
        { type: "BoardTasks", id: projectId },
      ],
    }),
    getBacklogTasks: builder.query<BoardTaskDTO[], string>({
      query: (projectId) => `/api/v1/projects/${projectId}/tasks?stage=BACKLOG`,
      providesTags: (result, error, projectId) => [
        { type: "BacklogTasks", id: projectId },
      ],
    }),
    getArchivedTasks: builder.query<BoardTaskDTO[], string>({
      query: (projectId) => `/api/v1/projects/${projectId}/tasks?stage=ARCHIVED`,
      providesTags: (result, error, projectId) => [
        { type: "ArchivedTasks", id: projectId },
      ],
    }),
    deleteBoardTask: builder.mutation<void, { projectId: string; taskId: string }>({
      query: ({ projectId, taskId }) => ({
        url: `/api/v1/projects/${projectId}/tasks/${taskId}`,
        method: "DELETE",
      }),
      async onQueryStarted(
        { projectId, taskId },
        { dispatch, queryFulfilled }
      ) {
        try {
          await queryFulfilled;
          dispatch(
            tasksApi.util.updateQueryData(
              "getBoardTasks",
              projectId,
              (draft) => {
                return draft.filter((boardTask) => boardTask.taskId !== taskId);
              }
            )
          );
          dispatch(
            baseApi.util.invalidateTags([
              { type: "Labels", id: projectId },
              { type: "TaskComments", id: taskId }
            ])
          );
        } catch (error) {
          console.error("Failed to delete board task:", error);
        }
      },
    }),
    deleteBacklogTask: builder.mutation<void, { projectId: string; taskId: string }>({
      query: ({ projectId, taskId }) => ({
        url: `/api/v1/projects/${projectId}/tasks/${taskId}`,
        method: "DELETE",
      }),
      async onQueryStarted(
        { projectId, taskId },
        { dispatch, queryFulfilled }
      ) {
        try {
          await queryFulfilled;
          dispatch(
            tasksApi.util.updateQueryData(
              "getBacklogTasks",
              projectId,
              (draft) => {
                return draft.filter((backlogTask) => backlogTask.taskId !== taskId);
              }
            )
          );
          dispatch(
            baseApi.util.invalidateTags([
              { type: "Labels", id: projectId },
              { type: "TaskComments", id: taskId }
            ])
          );
        } catch (error) {
          console.error("Failed to delete backlog task:", error);
        }
      },
    }),
    deleteArchivedTask: builder.mutation<void, { projectId: string; taskId: string }>({
      query: ({ projectId, taskId }) => ({
        url: `/api/v1/projects/${projectId}/tasks/${taskId}`,
        method: "DELETE",
      }),
      async onQueryStarted(
        { projectId, taskId },
        { dispatch, queryFulfilled }
      ) {
        try {
          await queryFulfilled;
          dispatch(
            tasksApi.util.updateQueryData(
              "getArchivedTasks",
              projectId,
              (draft) => {
                return draft.filter((archivedTask) => archivedTask.taskId !== taskId);
              }
            )
          );
          dispatch(
            baseApi.util.invalidateTags([
              { type: "Labels", id: projectId },
              { type: "TaskComments", id: taskId }
            ])
          );
        } catch (error) {
          console.error("Failed to delete archived task:", error);
        }
      },
    }),
    createTask: builder.mutation<
      void, // what backend returns, void = we don't care
      { projectId: string; createTaskFormData: CreateTaskFormData }
    >({
      query: ({ projectId, createTaskFormData }) => ({
        url: `/api/v1/projects/${projectId}/tasks`,
        method: "POST",
        body: createTaskFormData,
      }),
      // pessimistic update
      async onQueryStarted(
        { projectId, createTaskFormData },
        { dispatch, queryFulfilled }
      ) {
        try {
          await queryFulfilled;
          dispatch(
            baseApi.util.invalidateTags([{ type: "BoardTasks", id: projectId }])
          );
          dispatch(
            baseApi.util.invalidateTags([{ type: "Labels", id: projectId }])
          );
        } catch (error) {
          console.error("Failed to create task:", error);
        }
      },
    }),
    moveTask: builder.mutation<
      void,
      {
        projectId: string;
        taskId: string;
        updateTaskColumnDTO: UpdateTaskColumnDTO;
      }
    >({
      query: ({ projectId, taskId, updateTaskColumnDTO }) => ({
        url: `/api/v1/projects/${projectId}/tasks/${taskId}`,
        method: "PATCH",
        body: updateTaskColumnDTO,
      }),
      async onQueryStarted(
        { projectId, taskId, updateTaskColumnDTO },
        { dispatch, queryFulfilled }
      ) {
        // Optimistic update
        dispatch(
          tasksApi.util.updateQueryData("getBoardTasks", projectId, (draft) => {
            const taskIndex = draft.findIndex((task) => task.taskId === taskId);
            if (taskIndex !== -1) {
              // Znajdź nazwę kolumny docelowej
              const targetColumn = draft.find(
                (task) => task.column.id === updateTaskColumnDTO.targetColumnId
              );

              draft[taskIndex] = {
                ...draft[taskIndex],
                column: {
                  id: updateTaskColumnDTO.targetColumnId,
                  name: targetColumn?.column.name || "Unknown Column",
                },
                positionInColumn: updateTaskColumnDTO.positionInColumn,
              };
            }
            return draft;
          })
        );

        try {
          await queryFulfilled;
        } catch (error) {
          //
          dispatch(
            baseApi.util.invalidateTags([{ type: "BoardTasks", id: projectId }])
          );
          console.error("Failed to move task:", error);
        }
      },
    }),
  }),
});

export const {
  useGetBoardTasksQuery,
  useGetBacklogTasksQuery,
  useGetArchivedTasksQuery,
  useDeleteBoardTaskMutation,
  useDeleteBacklogTaskMutation,
  useDeleteArchivedTaskMutation,
  useCreateTaskMutation,
  useMoveTaskMutation,
} = tasksApi;
export default tasksApi;
