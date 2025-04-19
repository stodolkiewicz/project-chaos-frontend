import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  firstName: string;
  email: string;
  pictureUrl: string;
  accessToken?: string;
  refreshToken?: string;
}

interface UserPayload {
  firstName?: string;
  email?: string;
  pictureUrl?: string;
  accessToken?: string;
  refreshToken?: string;
}

const initialState: UserState = {
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
    setUser: (state, action: PayloadAction<UserPayload>) => {
      console.log("Reducer setUser otrzymał:", action.payload);
      state.firstName = action.payload.firstName || "";
      state.email = action.payload.email || "";
      state.pictureUrl = action.payload.pictureUrl || "";
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken || "";
    },
    clearUser: (state) => {
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
