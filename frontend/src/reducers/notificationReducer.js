import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        setNotification(state, action) {
            return action.payload;
        },
    },
});

export const { setNotification } = notificationSlice.actions;

export const notifyWith = (message) => {
    return (dispatch) => {
        dispatch(setNotification(message));
        setTimeout(() => dispatch(setNotification(null)), 5000);
    };
};

export default notificationSlice.reducer;
