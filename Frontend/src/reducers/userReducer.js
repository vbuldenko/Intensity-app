import { createSlice } from '@reduxjs/toolkit';
import userService from '../services/users';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        data: null,
        userList: [],
    },
    reducers: {
        setUser(state, action) {
            state.data = action.payload;
        },
        setUsers(state, action) {
            state.userList = action.payload;
        },
        removeUser(state) {
            state.data = null;
        },
    },
});

export const { setUser, setUsers, removeUser } = userSlice.actions;

export const createUser = (user) => {
    return async (dispatch) => {
        const newUser = await userService.create(user);
        dispatch(setUser(newUser));
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

export const initializeUser = (id) => {
    return async (dispatch) => {
        const user = await userService.getUserById(id);
        dispatch(setUser(user));
    };
};

export default userSlice.reducer;
