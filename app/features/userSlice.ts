import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  firstName: string;
  email: string;
  pictureUrl: string;
}

interface UserPayload {
  firstName?: string;
  email?: string;
  pictureUrl?: string;
}

const initialState: UserState = {
  firstName: "",
  email: "",
  pictureUrl: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserPayload>) => {
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
