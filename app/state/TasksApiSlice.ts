import { BoardTaskDTO } from "../types/BoardTasksDTO";
import { CreateTaskFormData } from "../(routes)/dashboard/components/CreateTask/CreateTaskForm";
import { UpdateTaskColumnDTO } from "../types/UpdateTaskColumnDTO";
import { MoveTasksRequestDTO } from "../types/MoveTasksRequestDTO";
import { UpdateTaskDTO } from "../types/UpdateTaskDTO";
import { NO_VALUE, TaskFilters } from "../types/TaskFilters";
import { PageResponseDTO } from "./TaskCommentsApiSlice";
import baseApi from "./baseApi";

export interface TasksPageArgs {
  projectId: string;
  page: number;
  size: number;
  filters: TaskFilters;
}

// Empty filters become undefined, so they are left out of the URL
function toFilterParams({ priorities, labels, assignees }: TaskFilters) {
  const ids = (values: string[]) => {
    const selectedIds = values.filter((value) => value !== NO_VALUE);
    return selectedIds.length > 0 ? selectedIds.join(",") : undefined;
  };
  const includesNoValue = (values: string[]) => values.includes(NO_VALUE) || undefined;

  return {
    priorityIds: ids(priorities),
    withoutPriority: includesNoValue(priorities),
    labelIds: ids(labels),
    withoutLabel: includesNoValue(labels),
    assigneeIds: ids(assignees),
    unassigned: includesNoValue(assignees),
  };
}

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBoardTasks: builder.query<BoardTaskDTO[], string>({
      query: (projectId) => `/api/v1/projects/${projectId}/tasks?stage=BOARD`,
      providesTags: (result, error, projectId) => [
        { type: "BoardTasks", id: projectId },
      ],
    }),
    getBacklogTasks: builder.query<PageResponseDTO<BoardTaskDTO>, TasksPageArgs>({
      query: ({ projectId, page, size, filters }) => ({
        url: `/api/v1/projects/${projectId}/tasks/paged`,
        params: { stage: "BACKLOG", page, size, ...toFilterParams(filters) },
      }),
      providesTags: (result, error, { projectId }) => [
        { type: "BacklogTasks", id: projectId },
      ],
    }),
    getArchivedTasks: builder.query<PageResponseDTO<BoardTaskDTO>, TasksPageArgs>({
      query: ({ projectId, page, size, filters }) => ({
        url: `/api/v1/projects/${projectId}/tasks/paged`,
        params: { stage: "ARCHIVED", page, size, ...toFilterParams(filters) },
      }),
      providesTags: (result, error, { projectId }) => [
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
          // The refetch fills the page with the next task, so the page is not patched locally
          dispatch(
            baseApi.util.invalidateTags([
              { type: "BacklogTasks", id: projectId },
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
          // The refetch fills the page with the next task, so the page is not patched locally
          dispatch(
            baseApi.util.invalidateTags([
              { type: "ArchivedTasks", id: projectId },
              { type: "Labels", id: projectId },
              { type: "TaskComments", id: taskId }
            ])
          );
        } catch (error) {
          console.error("Failed to delete archived task:", error);
        }
      },
    }),
    // Used by the AI chat, which does not know the stage of the task
    deleteTask: builder.mutation<void, { projectId: string; taskId: string }>({
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
            baseApi.util.invalidateTags([
              { type: "BoardTasks", id: projectId },
              { type: "BacklogTasks", id: projectId },
              { type: "ArchivedTasks", id: projectId },
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
            baseApi.util.invalidateTags([
              { type: "BoardTasks", id: projectId },
              { type: "BacklogTasks", id: projectId },
              { type: "ArchivedTasks", id: projectId },
            ])
          );
          dispatch(
            baseApi.util.invalidateTags([{ type: "Labels", id: projectId }])
          );
        } catch (error) {
          console.error("Failed to create task:", error);
        }
      },
    }),
    updateTask: builder.mutation<
      void,
      {
        projectId: string;
        taskId: string;
        updateTaskDTO: UpdateTaskDTO;
        // The task as it looks after the update; it replaces the cached one
        updatedTask: BoardTaskDTO;
      }
    >({
      query: ({ projectId, taskId, updateTaskDTO }) => ({
        url: `/api/v1/projects/${projectId}/tasks/${taskId}`,
        method: "PUT",
        body: updateTaskDTO,
      }),
      // pessimistic update; the cache is patched before the refetch, so the card does not flash old data
      async onQueryStarted(
        { projectId, taskId, updatedTask },
        { dispatch, getState, queryFulfilled }
      ) {
        try {
          await queryFulfilled;
          const replaceTask = (draft: BoardTaskDTO[]) => {
            const index = draft.findIndex((task) => task.taskId === taskId);
            if (index !== -1) {
              draft[index] = updatedTask;
            }
          };
          dispatch(tasksApi.util.updateQueryData("getBoardTasks", projectId, replaceTask));
          // Every cached page is patched, because the task can be on any of them
          for (const queryName of ["getBacklogTasks", "getArchivedTasks"] as const) {
            tasksApi.util
              .selectCachedArgsForQuery(getState(), queryName)
              .filter((args) => args.projectId === projectId)
              .forEach((args) =>
                dispatch(
                  tasksApi.util.updateQueryData(queryName, args, (draft) =>
                    replaceTask(draft.content)
                  )
                )
              );
          }
          dispatch(
            baseApi.util.invalidateTags([
              { type: "BoardTasks", id: projectId },
              { type: "BacklogTasks", id: projectId },
              { type: "ArchivedTasks", id: projectId },
              { type: "Labels", id: projectId },
            ])
          );
        } catch (error) {
          console.error("Failed to update task:", error);
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
    moveTasksToBacklog: builder.mutation<
      void,
      { projectId: string; taskIds: string[] }
    >({
      query: ({ projectId, taskIds }) => ({
        url: `/api/v1/projects/${projectId}/tasks/move-to-backlog`,
        method: "POST",
        body: { taskIds },
      }),
      async onQueryStarted(
        { projectId },
        { dispatch, queryFulfilled }
      ) {
        try {
          await queryFulfilled;
          dispatch(
            baseApi.util.invalidateTags([
              { type: "BoardTasks", id: projectId },
              { type: "BacklogTasks", id: projectId },
              { type: "ArchivedTasks", id: projectId },
            ])
          );
        } catch (error) {
          console.error("Failed to move tasks to backlog:", error);
        }
      },
    }),
    moveTasksToArchive: builder.mutation<
      void,
      { projectId: string; taskIds: string[] }
    >({
      query: ({ projectId, taskIds }) => ({
        url: `/api/v1/projects/${projectId}/tasks/move-to-archive`,
        method: "POST",
        body: { taskIds },
      }),
      async onQueryStarted(
        { projectId },
        { dispatch, queryFulfilled }
      ) {
        try {
          await queryFulfilled;
          dispatch(
            baseApi.util.invalidateTags([
              { type: "BoardTasks", id: projectId },
              { type: "BacklogTasks", id: projectId },
              { type: "ArchivedTasks", id: projectId },
            ])
          );
        } catch (error) {
          console.error("Failed to move tasks to archive:", error);
        }
      },
    }),
    moveTasksToBoard: builder.mutation<
      void,
      { projectId: string; taskIds: string[] }
    >({
      query: ({ projectId, taskIds }) => ({
        url: `/api/v1/projects/${projectId}/tasks/move-to-board`,
        method: "POST",
        body: { taskIds },
      }),
      async onQueryStarted(
        { projectId },
        { dispatch, queryFulfilled }
      ) {
        try {
          await queryFulfilled;
          dispatch(
            baseApi.util.invalidateTags([
              { type: "BoardTasks", id: projectId },
              { type: "BacklogTasks", id: projectId },
              { type: "ArchivedTasks", id: projectId },
            ])
          );
        } catch (error) {
          console.error("Failed to move tasks to board:", error);
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
  useDeleteTaskMutation,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useMoveTaskMutation,
  useMoveTasksToBacklogMutation,
  useMoveTasksToArchiveMutation,
  useMoveTasksToBoardMutation,
} = tasksApi;
export default tasksApi;
