import { createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "../../services/userService";
import { User } from "../../types/User";
import { ErrorResponse } from "../../types/Error";

export const fetchUserData = createAsyncThunk<
  User, // Return type of the successful request
  void, // Argument type (since you're not passing any arguments)
  { rejectValue: ErrorResponse } // Type for rejected value
>("user/fetchUser", async (_, { rejectWithValue }) => {
  try {
    const user = await userService.getProfile();
    return user;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || "Unexpected error occurred";
    return rejectWithValue({ message });
  }
});

export const updateUserData = createAsyncThunk<
  User, // Return type of the successful request
  any, // Argument type (partial user data for update)
  { rejectValue: ErrorResponse } // Type for rejected value
>("user/updateProfile", async (userData, { rejectWithValue }) => {
  try {
    const updatedUser = await userService.update(userData);
    return updatedUser;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || "Unexpected error occurred";
    return rejectWithValue({ message });
  }
});
