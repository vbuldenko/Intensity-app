import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import {
  activate,
  checkAuth,
  fetchUserData,
  login,
  logOut,
  updateUserData,
} from "./userThunk";
import { User } from "../../../types/User";
import { ErrorResponse } from "../../../types/Error";
import { accessTokenService } from "../../../services/accessTokenService";

// Define a type for the slice state
export interface UserState {
  loading: boolean;
  data: User | null;
  isAuthenticated: boolean;
  error: string | null;
}

// Define the initial state using that type
const initialState: UserState = {
  loading: false,
  data: null,
  isAuthenticated: Boolean(accessTokenService.get()),
  error: null,
};

const handlePending = (state: UserState) => {
  state.loading = true;
  state.error = null;
};

const handleFulfilled = (
  state: UserState,
  action: PayloadAction<User | undefined>
) => {
  state.isAuthenticated = true;
  state.data = action.payload || null;
  state.loading = false;
  state.error = null;
};

const handleAuthRejected = (
  state: UserState,
  action: PayloadAction<ErrorResponse | undefined>
) => {
  state.isAuthenticated = false;
  state.data = null;
  state.loading = false;
  state.error = action.payload?.message || "An unknown error occurred";
};
const handleRejected = (
  state: UserState,
  action: PayloadAction<ErrorResponse | undefined>
) => {
  state.loading = false;
  state.error = action.payload?.message || "An unknown error occurred";
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, handlePending)
      .addCase(checkAuth.fulfilled, handleFulfilled)
      .addCase(checkAuth.rejected, handleAuthRejected)
      .addCase(login.pending, handlePending)
      .addCase(login.fulfilled, handleFulfilled)
      .addCase(login.rejected, handleAuthRejected)
      .addCase(activate.pending, handlePending)
      .addCase(activate.fulfilled, handleFulfilled)
      .addCase(activate.rejected, handleAuthRejected)
      .addCase(logOut.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.data = null;
        state.error = null;
      })
      .addCase(logOut.rejected, handleRejected)
      .addCase(fetchUserData.pending, handlePending)
      .addCase(fetchUserData.fulfilled, handleFulfilled)
      .addCase(fetchUserData.rejected, handleAuthRejected)
      .addCase(updateUserData.pending, handlePending)
      .addCase(updateUserData.fulfilled, handleFulfilled)
      .addCase(updateUserData.rejected, handleRejected);
  },
});

export const { setError } = userSlice.actions;

// Selector to access user state
export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
