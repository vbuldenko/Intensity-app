import { createSlice } from '@reduxjs/toolkit';
import statisticsService from '../services/statistics';

const statisticsSlice = createSlice({
    name: 'statistics',
    initialState: {},
    reducers: {
        setStatistics: (state, action) => {
            return action.payload;
        },
    },
});

export const { setStatistics } = statisticsSlice.actions;

export const getStatistics = () => {
    return async (dispatch) => {
        const statData = await statisticsService.getStatData();
        dispatch(setStatistics(statData));
    };
};

export default statisticsSlice.reducer;
