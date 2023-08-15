import axios from 'axios';
// import storageService from './storage';
const baseUrl = '/api/users';

// const token = storageService.loadUser()
//     ? `Bearer ${storageService.loadUser().token}`
//     : null;

// const config = {
//     headers: { Authorization: token },
// };

const getAll = async () => {
    const response = await axios.get(baseUrl);
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
    // axios.delete(`${baseUrl}/${id}`, config);
    axios.delete(`${baseUrl}/${id}`);
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, create, update, remove };
