import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "../../../services/userService";
import { User } from "../../../types/User";
import { RootState } from "../../store";

export interface ClientState {
  data: User[];
  loading: boolean;
}

const initialState: ClientState = {
  data: [],
  loading: false,
};

export const fetchClients = createAsyncThunk(
  "client/fetchClients",
  async () => {
    return await userService.getAll();
  }
);

const clientSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchClients.rejected, (state) => {
        state.loading = false;
      });
  },
});

// Selector to access user state
export const selectClients = (state: RootState) => state.clients;
export default clientSlice.reducer;
