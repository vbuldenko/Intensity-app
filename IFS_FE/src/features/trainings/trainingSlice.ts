import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { fetchTrainings } from "./trainingThunk";
import { ErrorResponse } from "../../types/Error";
import { Training } from "../../types/Training";
import { getErrorMessage } from "../../utils/utils";

// Define a type for the slice state
export interface TrainingState {
  loading: boolean;
  data: Training[] | null;
  error: string | null;
}

// Define the initial state using that type
const initialState: TrainingState = {
  loading: false,
  data: null,
  error: null,
};

export const trainingSlice = createSlice({
  name: "trainings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainings.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchTrainings.fulfilled,
        (state, action: PayloadAction<Training[]>) => {
          state.data = action.payload;
          state.loading = false;
          state.error = null; // Clear the error on success
        }
      )
      .addCase(
        fetchTrainings.rejected,
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
export const selectTrainings = (state: RootState) => state.trainings;

export default trainingSlice.reducer;
