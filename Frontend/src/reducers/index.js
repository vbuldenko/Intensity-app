import { combineReducers } from '@reduxjs/toolkit';
import statisticsReducer from './statisticsReducer';
import abonementReducer from './abonementReducer';
import reservationsReducer from './reservationsReducer';
import trainingReducer from './trainingReducer';
import notificationReducer from './notificationReducer';
import loginReducer from './loginReducer';
import usersReducer from './usersReducer';

const rootReducer = combineReducers({
    statistics: statisticsReducer,
    abonements: abonementReducer,
    reservedTrainings: reservationsReducer,
    trainings: trainingReducer,
    notification: notificationReducer,
    user: loginReducer,
    users: usersReducer,
    // include other reducers here...
});

const resettableReducer = (state, action) => {
    if (action.type === 'RESET_STATE') {
        // Reset all reducers to their initial state
        return rootReducer(undefined, action);
    }
    return rootReducer(state, action);
};

export default resettableReducer;
