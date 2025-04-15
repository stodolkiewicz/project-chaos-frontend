import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  firstName: "",
  email: "",
  pictureUrl: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.firstName = action.payload.firstName || "";
      state.email = action.payload.email || "";
      state.pictureUrl = action.payload.pictureUrl || "";
    },
    clearUser: (state) => {
      state.firstName = "";
      state.email = "";
      state.pictureUrl = "";
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
