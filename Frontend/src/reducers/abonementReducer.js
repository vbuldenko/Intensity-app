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

export const initializeUserAbonements = () => {
    return async (dispatch) => {
        const abonements = await abonementService.getAllByUserId();
        dispatch(setAbonements(abonements));
    };
};
export const initializeAllAbonements = () => {
    return async (dispatch) => {
        const abonements = await abonementService.getAll();
        dispatch(setAbonements(abonements));
    };
};

export const createAbonement = (abonement) => {
    return async (dispatch) => {
        try {
            const newAbonement = await abonementService.create(abonement);
            dispatch(addAbonement(newAbonement));
        } catch (error) {
            console.log(error.response.data.error);
            throw error; // Rethrow the error
        }
    };
};

export const updateAbonement = (id, updateBody) => {
    return async (dispatch) => {
        const updatedAbonement = await abonementService.update(id, updateBody);
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
