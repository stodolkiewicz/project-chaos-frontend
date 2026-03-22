import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  isAIChatOpen: boolean;
  isBoardOpen: boolean;
  isBacklogOpen: boolean;
  isArchiveOpen: boolean;
}

const initialState: UiState = {
  isAIChatOpen: false,
  isBoardOpen: true,
  isBacklogOpen: false,
  isArchiveOpen: false,

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
    }
  },
});

export const { setAIChatOpen, toggleAIChat, toggleBoardOpen, setBoardOpen, toggleBacklogOpen, setBacklogOpen, toggleArchiveOpen, setArchiveOpen } = uiSlice.actions;
export default uiSlice.reducer;