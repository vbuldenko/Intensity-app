import { createSlice } from '@reduxjs/toolkit';
import trainingService from '../services/training';

const trainingSlice = createSlice({
    name: 'trainings',
    initialState: [],
    reducers: {
        setTrainings(state, action) {
            return action.payload;
        },
        addTraining(state, action) {
            state.push(action.payload);
        },
        updateExistingTraining(state, action) {
            const updatedTraining = action.payload;
            return state.map((training) =>
                training.id === updatedTraining.id ? updatedTraining : training
            );
        },
        removeTraining(state, action) {
            return state.filter((training) => training.id !== action.payload);
        },
    },
});

export const {
    setTrainings,
    addTraining,
    updateExistingTraining,
    removeTraining,
} = trainingSlice.actions;

export const initializeTrainings = () => {
    return async (dispatch) => {
        const trainings = await trainingService.getAll();
        dispatch(setTrainings(trainings));
    };
};

// export const createTraining = (training) => {
//     return async (dispatch) => {
//         try {
//             const newTraining = await trainingService.create(training);
//             dispatch(addBlog(newTraining));
//         } catch (error) {
//             console.log('Error occured');
//         }
//     };
// };

// export const updateTraining = (id, modifiedTraining) => {
//     return async (dispatch) => {
//         const updatedTraining = await trainingService.update(id, modifiedTraining);
//         dispatch(updateExistingTraining(updatedTraining));
//     };
// };

// export const deleteTraining = (id) => {
//     return (dispatch) => {
//         trainingService.remove(id);
//         dispatch(removeTraining(id));
//     };
// };

export default trainingSlice.reducer;
