import { createSlice } from '@reduxjs/toolkit';
import abonementService from '../services/abonement';

const abonementSlice = createSlice({
    name: 'abonements',
    initialState: [],
    reducers: {
        setAbonements(state, action) {
            return action.payload;
        },
        addAbonement(state, action) {
            state.push(action.payload);
        },
        updateExistingAbonement(state, action) {
            const updatedAbonement = action.payload;
            return state.map((abonement) =>
                abonement.id === updatedAbonement.id
                    ? updatedAbonement
                    : abonement
            );
        },
        removeAbonement(state, action) {
            return state.filter((abonement) => abonement.id !== action.payload);
        },
    },
});

export const {
    setAbonements,
    addAbonement,
    updateExistingAbonement,
    removeAbonement,
} = abonementSlice.actions;

export const initializeAbonements = () => {
    return async (dispatch) => {
        const abonements = await abonementService.getAllByUserId();
        dispatch(setAbonements(abonements));
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

export const updateAbonement = (id, newAbonementBody) => {
    return async (dispatch) => {
        const updatedAbonement = await abonementService.update(
            id,
            newAbonementBody
        );
        dispatch(updateExistingAbonement(updatedAbonement));
    };
};

// export const deleteTraining = (id) => {
//     return (dispatch) => {
//         trainingService.remove(id);
//         dispatch(removeTraining(id));
//     };
// };

export default abonementSlice.reducer;
