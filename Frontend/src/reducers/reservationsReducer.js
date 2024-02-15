import { createSlice } from '@reduxjs/toolkit';

const reservationsSlice = createSlice({
    name: 'reservations',
    initialState: [],
    reducers: {
        addReservation: (state, action) => {
            state.push(action.payload);
        },
        removeReservation: (state, action) => {
            const index = state.indexOf(action.payload);
            if (index !== -1) {
                state.splice(index, 1);
            }
        },
    },
});

export const { addReservation, removeReservation } = reservationsSlice.actions;

export default reservationsSlice.reducer;
