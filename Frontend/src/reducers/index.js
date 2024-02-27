import { combineReducers } from '@reduxjs/toolkit';
import statisticsReducer from './statisticsReducer';
import abonementReducer from './abonementReducer';
import trainingReducer from './trainingReducer';
import notificationReducer from './notificationReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
    statistics: statisticsReducer,
    abonements: abonementReducer,
    trainings: trainingReducer,
    notification: notificationReducer,
    user: userReducer,
});

const resettableReducer = (state, action) => {
    if (action.type === 'RESET_STATE') {
        // Reset all reducers to their initial state
        return rootReducer(undefined, action);
    }
    return rootReducer(state, action);
};

export default resettableReducer;
