import { configureStore } from '@reduxjs/toolkit';
import trainingReducer from './reducers/trainingReducer';
import reservationsReducer from './reducers/reservationsReducer';
import notificationReducer from './reducers/notificationReducer';
import loginReducer from './reducers/loginReducer';
import usersReducer from './reducers/usersReducer';
import abonementReducer from './reducers/abonementReducer';

const store = configureStore({
    reducer: {
        abonements: abonementReducer,
        reservedTrainings: reservationsReducer,
        trainings: trainingReducer,
        notification: notificationReducer,
        user: loginReducer,
        users: usersReducer,
    },
});

export default store;