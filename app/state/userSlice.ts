import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserData } from "../types/UserData";

const initialState: UserData = {
  firstName: "",
  email: "",
  pictureUrl: "",
  defaultProjectId: "",
  refreshToken: "",
  accessToken: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData>) => {
      state.firstName = action.payload.firstName || "";
      state.email = action.payload.email || "";
      state.pictureUrl = action.payload.pictureUrl || "";
      state.defaultProjectId = action.payload.defaultProjectId || "";
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken || "";
    },
    clearUser: (state) => {
      state.firstName = "";
      state.email = "";
      state.pictureUrl = "";
      state.defaultProjectId = "";
      state.refreshToken = "";
      state.accessToken = "";
    },
    setDefaultProjectId: (state, action: PayloadAction<string>) => {
      state.defaultProjectId = action.payload;
    },
  },
});

export const { setUser, clearUser, setDefaultProjectId } = userSlice.actions;
export default userSlice.reducer;
