import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";
import { accessTokenService } from "../../services/accessTokenService";
import { fetchUserData } from "../user/userThunk";
import { ErrorResponse } from "../../types/Error";
import { setError } from "./authSlice";

export const checkAuth = createAsyncThunk<
  void, // Return type of the successful request
  void, // Argument type
  { rejectValue: ErrorResponse } // Type for rejected value
>("auth/checkAuth", async (_, { dispatch, rejectWithValue }) => {
  try {
    const { accessToken } = await authService.refresh();
    accessTokenService.save(accessToken);
    dispatch(fetchUserData()); // Fetch user data if the token is valid
  } catch (error: any) {
    const message =
      error?.response?.data?.message || "Unexpected error occurred";
    return rejectWithValue({ message });
  }
});

export const login = createAsyncThunk<
  void,
  { email: string; password: string },
  { rejectValue: ErrorResponse }
>("auth/login", async (credentials, { dispatch, rejectWithValue }) => {
  try {
    const { accessToken } = await authService.login(credentials);
    accessTokenService.save(accessToken);
    dispatch(fetchUserData());
  } catch (error: any) {
    const message =
      error?.response?.data?.message || "Unexpected error occurred";

    setTimeout(() => dispatch(setError(null)), 3000);

    return rejectWithValue({ message });
  }
});

export const activate = createAsyncThunk<
  void,
  string,
  { rejectValue: ErrorResponse }
>("auth/activation", async (activationToken, { dispatch, rejectWithValue }) => {
  try {
    const { accessToken } = await authService.activate(activationToken);
    accessTokenService.save(accessToken);
    dispatch(fetchUserData());
  } catch (error: any) {
    const message =
      error?.response?.data?.message || "Unexpected error occurred";

    setTimeout(() => dispatch(setError(null)), 3000);

    return rejectWithValue({ message });
  }
});
