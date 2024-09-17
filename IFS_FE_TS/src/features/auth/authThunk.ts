import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";
import { accessTokenService } from "../../services/accessTokenService";
import { fetchUserData } from "../user/userThunk";
import { ErrorResponse } from "../../types/Error";

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
