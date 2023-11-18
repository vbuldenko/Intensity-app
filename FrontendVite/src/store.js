import { configureStore } from '@reduxjs/toolkit';
import resettableReducer from './reducers';
// import trainingReducer from './reducers/trainingReducer';
// import reservationsReducer from './reducers/reservationsReducer';
// import notificationReducer from './reducers/notificationReducer';
// import loginReducer from './reducers/loginReducer';
// import usersReducer from './reducers/usersReducer';
// import abonementReducer from './reducers/abonementReducer';
// import statisticsReducer from './reducers/statisticsReducer';

// const store = configureStore({
//     reducer: {
//         statistics: statisticsReducer,
//         abonements: abonementReducer,
//         reservedTrainings: reservationsReducer,
//         trainings: trainingReducer,
//         notification: notificationReducer,
//         user: loginReducer,
//         users: usersReducer,
//     },
// });

const store = configureStore({
    reducer: resettableReducer,
});

export default store;
