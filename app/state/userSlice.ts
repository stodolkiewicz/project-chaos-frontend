import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserData } from "../types/UserData";

const initialState: UserData = {
  userId: "",
  firstName: "",
  email: "",
  pictureUrl: "",
  refreshToken: "",
  accessToken: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData>) => {
      state.userId = action.payload.userId || "";
      state.firstName = action.payload.firstName || "";
      state.email = action.payload.email || "";
      state.pictureUrl = action.payload.pictureUrl || "";
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken || "";
    },
    clearUser: (state) => {
      state.userId = "";
      state.firstName = "";
      state.email = "";
      state.pictureUrl = "";
      state.refreshToken = "";
      state.accessToken = "";
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
