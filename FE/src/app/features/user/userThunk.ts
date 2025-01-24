import { createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "../../../services/userService";
import { User } from "../../../types/User";
import { ErrorResponse } from "../../../types/Error";
import { getErrorMessage } from "../../../utils/utils";

export const fetchUserData = createAsyncThunk<
  User, // Return type of the successful request
  void, // Argument type (since you're not passing any arguments)
  { rejectValue: ErrorResponse } // Type for rejected value
>("user/fetchUser", async (_, { rejectWithValue }) => {
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
