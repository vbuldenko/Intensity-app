import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppDispatch } from "../../app/hooks";
import { RootState } from "../../app/store";

type NotificationState = string | null;

const notificationSlice = createSlice({
  name: "notification",
  initialState: null as NotificationState,
  reducers: {
    setNotification(state, action: PayloadAction<NotificationState>) {
      return action.payload;
    },
  },
});

export const { setNotification } = notificationSlice.actions;

export const notifyWith = (message: string) => {
  return (dispatch: ReturnType<typeof useAppDispatch>) => {
    dispatch(setNotification(message));
    setTimeout(() => dispatch(setNotification(null)), 5000);
  };
};

export default notificationSlice.reducer;
export const selectNotification = (state: RootState) => state.notification;
