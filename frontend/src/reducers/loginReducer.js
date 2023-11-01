import { createSlice } from '@reduxjs/toolkit';
import loginService from '../services/login';
import storageService from '../services/storage';
import usersService from '../services/users';

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
            const loggedUserToken = await loginService.login(userInfo);
            storageService.saveUser(loggedUserToken);
            const user = await usersService.getUserById(loggedUserToken.id);
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
    return async (dispatch) => {
        try {
            const loggedUserToken = storageService.loadUser();
            if (loggedUserToken) {
                const user = await usersService.getUserById(loggedUserToken.id);
                dispatch(setUser(user));
            }
        } catch (error) {
            // // Handle the  error here
            throw error; // Re-throw the error to be caught in your component
        }
    };
};

export default userSlice.reducer;
