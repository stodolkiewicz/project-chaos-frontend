import { BoardTaskDTO } from "../types/BoardTasksDTO";
import { CreateTaskFormData } from "../(routes)/dashboard/components/CreateTask/CreateTaskForm";
import { UpdateTaskColumnDTO } from "../types/UpdateTaskColumnDTO";
import baseApi from "./baseApi";

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBoardTasks: builder.query<BoardTaskDTO[], string>({
      query: (projectId) => `/api/v1/projects/${projectId}/tasks`,
      providesTags: (result, error, projectId) => [
        { type: "Tasks", id: projectId },
      ],
    }),
    deleteTask: builder.mutation<void, { projectId: string; taskId: string }>({
      query: ({ projectId, taskId }) => ({
        url: `/api/v1/projects/${projectId}/tasks/${taskId}`,
        method: "DELETE",
      }),
      // pessimistic Query RTK cache update.
      // Wait for queryFulfilled, no error? -> delete boardTask from cache of getBoardTasks endpoint
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
          console.error("Failed to delete task:", error);
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
            baseApi.util.invalidateTags([{ type: "Tasks", id: projectId }])
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
            baseApi.util.invalidateTags([{ type: "Tasks", id: projectId }])
          );
          console.error("Failed to move task:", error);
        }
      },
    }),
  }),
});

export const {
  useGetBoardTasksQuery,
  useDeleteTaskMutation,
  useCreateTaskMutation,
  useMoveTaskMutation,
} = tasksApi;
export default tasksApi;
