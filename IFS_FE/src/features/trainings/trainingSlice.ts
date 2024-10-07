import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { fetchTrainings, reserveTraining } from "./trainingThunk";
import { ErrorResponse } from "../../types/Error";
import { Training } from "../../types/Training";

// Define a type for the slice state
export interface TrainingState {
  loading: boolean;
  data: Training[];
  error: string | null;
}

// Define the initial state using that type
const initialState: TrainingState = {
  loading: false,
  data: [],
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
      )
      .addCase(reserveTraining.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        reserveTraining.fulfilled,
        (state, action: PayloadAction<{ updatedTraining: Training }>) => {
          // Update the specific training in the state after reservation
          const { updatedTraining } = action.payload;
          const index = state.data.findIndex(
            (t) => t.id === updatedTraining.id
          );
          if (index !== -1) {
            state.data[index] = updatedTraining;
          }
          state.loading = false;
          state.error = null; // Clear error on success
        }
      )
      .addCase(
        reserveTraining.rejected,
        (state, action: PayloadAction<ErrorResponse | undefined>) => {
          state.loading = false;
          state.error = action.payload?.message || "An unknown error occurred";
        }
      );
  },
});

// export const {
// } = trainingSlice.actions;

export const selectTrainings = (state: RootState) => state.trainings.data;

export default trainingSlice.reducer;
