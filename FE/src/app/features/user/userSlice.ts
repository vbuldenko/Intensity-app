import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { fetchUserData, updateUserData } from "./userThunk";
import { User } from "../../../types/User";
import { ErrorResponse } from "../../../types/Error";

// Define a type for the slice state
export interface UserState {
  loading: boolean;
  data: User | null;
  error: string | null;
}

// Define the initial state using that type
const initialState: UserState = {
  loading: false,
  data: null,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchUserData.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.data = action.payload;
          state.loading = false;
          state.error = null; // Clear the error on success
        }
      )
      .addCase(
        fetchUserData.rejected,
        (state, action: PayloadAction<ErrorResponse | undefined>) => {
          state.loading = false;
          state.error = action.payload?.message || "An unknown error occurred";
        }
      )
      .addCase(updateUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        updateUserData.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.data = action.payload;
          state.loading = false;
          state.error = null; // Clear the error on success
        }
      )
      .addCase(
        updateUserData.rejected,
        (state, action: PayloadAction<ErrorResponse | undefined>) => {
          state.loading = false;
          state.error = action.payload?.message || "An unknown error occurred";
        }
      );
  },
});

// export const {
// } = userSlice.actions;

// Selector to access user state
export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
