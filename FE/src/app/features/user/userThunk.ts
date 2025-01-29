import { createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "../../../services/userService";
import { User } from "../../../types/User";
import { ErrorResponse } from "../../../types/Error";
import { getErrorMessage } from "../../../utils/utils";
import { authService } from "../../../services/authService";
import { accessTokenService } from "../../../services/accessTokenService";
import { setError } from "./userSlice";

export const checkAuth = createAsyncThunk<
  User, // Return type of the successful request
  void, // Argument type
  { rejectValue: ErrorResponse } // Type for rejected value
>("user/checkAuth", async (_, { rejectWithValue }) => {
  try {
    const { accessToken } = await authService.refresh();
    accessTokenService.save(accessToken);
    return await userService.getProfile();
  } catch (error: any) {
    accessTokenService.remove();
    return rejectWithValue({ message: getErrorMessage(error) });
  }
});

export const login = createAsyncThunk<
  User,
  { identifier: string; password: string },
  { rejectValue: ErrorResponse }
>("user/login", async (credentials, { dispatch, rejectWithValue }) => {
  try {
    const { accessToken } = await authService.login(credentials);
    accessTokenService.save(accessToken);
    return await userService.getProfile();
  } catch (error: any) {
    setTimeout(() => dispatch(setError(null)), 3000);
    return rejectWithValue({ message: getErrorMessage(error) });
  }
});

export const activate = createAsyncThunk<
  User,
  string,
  { rejectValue: ErrorResponse }
>("user/activation", async (activationToken, { dispatch, rejectWithValue }) => {
  try {
    const { accessToken } = await authService.activate(activationToken);
    accessTokenService.save(accessToken);
    return await userService.getProfile();
  } catch (error: any) {
    setTimeout(() => dispatch(setError(null)), 2000);
    return rejectWithValue({ message: getErrorMessage(error) });
  }
});

export const logOut = createAsyncThunk<
  void,
  void,
  { rejectValue: ErrorResponse }
>("user/logout", async (_, { dispatch, rejectWithValue }) => {
  try {
    accessTokenService.remove();
    await authService.logout();
  } catch (error: any) {
    setTimeout(() => dispatch(setError(null)), 3000);
    return rejectWithValue({ message: getErrorMessage(error) });
  }
});

export const fetchUserData = createAsyncThunk<
  User,
  void,
  { rejectValue: ErrorResponse }
>("user/getProfile", async (_, { rejectWithValue }) => {
  try {
    return await userService.getProfile();
  } catch (error: any) {
    return rejectWithValue({ message: getErrorMessage(error) });
  }
});

export const updateUserData = createAsyncThunk<
  User,
  any,
  { rejectValue: ErrorResponse }
>("user/updateProfile", async (userData, { rejectWithValue }) => {
  try {
    return await userService.update(userData);
  } catch (error: any) {
    return rejectWithValue({ message: getErrorMessage(error) });
  }
});
