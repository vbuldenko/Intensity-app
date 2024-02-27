import { createSlice } from '@reduxjs/toolkit';
import userService from '../services/users';
import loginService from '../services/login';
import storageService from '../services/storage';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        isAuthenticated: false,
        data: null,
        userList: [],
    },
    reducers: {
        setUser(state, action) {
            state.data = action.payload;
        },
        setAuthUser(state, action) {
            state.data = action.payload;
            state.isAuthenticated = true;
        },
        setUsers(state, action) {
            state.userList = action.payload;
        },
        removeUser(state) {
            state.data = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setUser, setUsers, setAuthUser, removeUser } = userSlice.actions;

export const createUser = (user) => {
    return async (dispatch) => {
        const newUser = await userService.create(user);
        dispatch(setAuthUser(newUser));
    };
};
export const updateUser = (id, modifiedUser) => {
    return async (dispatch) => {
        const updatedUser = await userService.update(id, modifiedUser);
        dispatch(setUser(updatedUser));
    };
};

export const deleteUser = (id) => {
    return async (dispatch) => {
        await userService.remove(id);
        dispatch(removeUser());
    };
};

export const initializeUsers = () => {
    return async (dispatch) => {
        const users = await userService.getAll();
        dispatch(setUsers(users));
    };
};

export const signUserIn = (userInfo) => {
    return async (dispatch) => {
        try {
            const userData = await loginService.login(userInfo);
            storageService.saveUser(userData);
            const user = await userService.getUserById(userData.id);
            dispatch(setAuthUser(user));
        } catch (error) {
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
            const userData = storageService.loadUser();
            if (userData) {
                const user = await userService.getUserById(userData.id);
                dispatch(setAuthUser(user));
            }
        } catch (error) {
            throw error; // Re-throw the error to be caught in your component
        }
    };
};

export default userSlice.reducer;
