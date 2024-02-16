import { createSlice } from '@reduxjs/toolkit';
import usersService from '../services/users';

const authSlice = createSlice({
    name: 'auth',
    initialState: [],
    reducers: {
        setUsers(state, action) {
            return action.payload;
        },
        addUser(state, action) {
            state.push(action.payload);
        },
        updateExistingUser(state, action) {
            const updatedUser = action.payload;
            return state.map((user) =>
                user.id === updatedUser.id ? updatedUser : user
            );
        },
        removeUser(state, action) {
            return state.filter((user) => user.id !== action.payload);
        },
    },
});

export const { setUsers, addUser, updateExistingUser, removeUser } =
    usersSlice.actions;

// think about more complex state with different types of users: clients, trainers, admins
export const initializeUsers = () => {
    return async (dispatch) => {
        const users = await usersService.getAll();
        dispatch(setUsers(users));
    };
};

export const createUser = (user) => {
    return async (dispatch) => {
        const newUser = await usersService.create(user);
        dispatch(addUser(newUser));
    };
};

export const updateUser = (id, modifiedUser) => {
    return async (dispatch) => {
        const updatedUser = await usersService.update(id, modifiedUser);
        dispatch(updateExistingUser(updatedUser));
    };
};

export const deleteUser = (id) => {
    return (dispatch) => {
        usersService.remove(id);
        dispatch(removeUser(id));
    };
};

export default usersSlice.reducer;
