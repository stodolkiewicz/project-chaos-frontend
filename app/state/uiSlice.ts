import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TaskEditField } from "@/app/types/TaskEditField";

interface UiState {
  isAIChatOpen: boolean;
  isBoardOpen: boolean;
  isBacklogOpen: boolean;
  isArchiveOpen: boolean;
  // Only one task card is edited at a time
  editingTask: { taskId: string; field: TaskEditField } | null;
}

const initialState: UiState = {
  isAIChatOpen: false,
  isBoardOpen: true,
  isBacklogOpen: false,
  isArchiveOpen: false,
  editingTask: null,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setAIChatOpen: (state, action: PayloadAction<boolean>) => {
      state.isAIChatOpen = action.payload;
    },
    toggleAIChat: (state) => {
      state.isAIChatOpen = !state.isAIChatOpen;
    },
    toggleBoardOpen: (state) => {
      state.isBoardOpen = !state.isBoardOpen;
    },
    setBoardOpen: (state, action: PayloadAction<boolean>) => {
      state.isBoardOpen = action.payload;
    },
    toggleBacklogOpen: (state) => {
      state.isBacklogOpen = !state.isBacklogOpen;
    },
    setBacklogOpen: (state, action: PayloadAction<boolean>) => {
      state.isBacklogOpen = action.payload;
    },
    toggleArchiveOpen: (state) => {
      state.isArchiveOpen = !state.isArchiveOpen;
    },
    setArchiveOpen: (state, action: PayloadAction<boolean>) => {
      state.isArchiveOpen = action.payload;
    },
    startTaskEdit: (state, action: PayloadAction<{ taskId: string; field: TaskEditField }>) => {
      state.editingTask = action.payload;
    },
    stopTaskEdit: (state) => {
      state.editingTask = null;
    }
  },
});

export const { setAIChatOpen, toggleAIChat, toggleBoardOpen, setBoardOpen, toggleBacklogOpen, setBacklogOpen, toggleArchiveOpen, setArchiveOpen, startTaskEdit, stopTaskEdit } = uiSlice.actions;
export default uiSlice.reducer;