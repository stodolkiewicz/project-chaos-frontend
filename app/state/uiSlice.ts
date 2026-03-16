import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  isAIChatOpen: boolean;
}

const initialState: UiState = {
  isAIChatOpen: false,
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
  },
});

export const { setAIChatOpen, toggleAIChat } = uiSlice.actions;
export default uiSlice.reducer;