import axios from 'axios';
import storageService from './storage';
const baseUrl = '/api/users';
const config = {
    headers: {},
};

const getAll = async () => {
    const response = await axios.get(baseUrl);
    return response.data;
};
const getUserById = async (id) => {
    const user = storageService.loadUser();
    if (user) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    const response = await axios.get(`${baseUrl}/${id}`, config);
    return response.data;
};

const create = async (newUser) => {
    const response = await axios.post(baseUrl, newUser);
    return response.data;
};

const update = async (id, updatedUser) => {
    // const response = await axios.post(baseUrl, updatedUser, config)
    const response = await axios.put(`${baseUrl}/${id}`, updatedUser);
    return response.data;
};

const remove = (id) => {
    const user = storageService.loadUser();
    if (user) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    axios.delete(`${baseUrl}/${id}`, config);
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, getUserById, create, update, remove };
