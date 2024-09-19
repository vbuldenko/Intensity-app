import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { accessTokenService } from "../../services/accessTokenService";
import { checkAuth, login } from "./authThunk";
import { RootState } from "../../app/store";
import { ErrorResponse } from "../../types/Error";

export interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: Boolean(accessTokenService.get()),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
    signOut: (state) => {
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null; // Clear the error on success
      })
      .addCase(
        checkAuth.rejected,
        (state, action: PayloadAction<ErrorResponse | undefined>) => {
          state.isAuthenticated = false;
          state.loading = false;
          state.error = action.payload?.message || "An unknown error occurred";
        }
      )
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(
        login.rejected,
        (state, action: PayloadAction<ErrorResponse | undefined>) => {
          state.isAuthenticated = false;
          state.loading = false;
          state.error = action.payload?.message || "An unknown error occurred";
        }
      );
  },
});

export const { setError, signOut } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
