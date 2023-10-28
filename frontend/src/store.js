import { configureStore } from '@reduxjs/toolkit';
import trainingReducer from './reducers/trainingReducer';
import notificationReducer from './reducers/notificationReducer';
import userReducer from './reducers/userReducer';
import usersReducer from './reducers/usersReducer';

const store = configureStore({
    reducer: {
        trainings: trainingReducer,
        notification: notificationReducer,
        user: userReducer,
        users: usersReducer,
    },
});

export default store;
