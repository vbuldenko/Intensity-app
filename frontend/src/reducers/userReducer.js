import { createSlice } from '@reduxjs/toolkit';
import loginService from '../services/login';
import storageService from '../services/storage';

const userSlice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
        setUser(state, action) {
            return action.payload;
        },
        removeUser(state, action) {
            return null;
        },
    },
});

export const { setUser, removeUser } = userSlice.actions;

export const signUserIn = (userInfo) => {
    return async (dispatch) => {
        try {
            const user = await loginService.login(userInfo);
            storageService.saveUser(user);

            dispatch(setUser(user));
        } catch (error) {
            // // Handle the login error here
            // console.error('Login failed:', error);
            throw error; // Re-throw the error to be caught in your component
        }
    };
};

export const logUserOut = () => {
    return (dispatch) => {
        storageService.removeUser();
        dispatch(removeUser());
    };
};

export const loadLoggedInUser = () => {
    return (dispatch) => {
        const user = storageService.loadUser();
        if (user) {
            dispatch(setUser(user));
        }
    };
};

export default userSlice.reducer;
