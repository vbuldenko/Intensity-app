import axios from 'axios';
import storageService from './storage';
const baseUrl = '/api/training-sessions';

const getAll = async () => {
    const response = await axios.get(baseUrl);
    return response.data;
};

// const create = async (newObject) => {
//     const response = await axios.post(baseUrl, newObject, config);
//     return response.data;
// };
// const addcomment = async (id, comment) => {
//     const response = await axios.post(`${baseUrl}/${id}/comments/`, {
//         comment,
//     });
//     return response.data;
// };

const update = async (id, updateType) => {
    const token = storageService.loadUser()
        ? `Bearer ${storageService.loadUser().token}`
        : null;
    const config = {
        headers: { Authorization: token },
    };
    const response = await axios.put(`${baseUrl}/${id}`, updateType, config);
    return response.data;
};

// const remove = (id) => {
//     axios.delete(`${baseUrl}/${id}`, config);
//     axios.delete(`${baseUrl}/${id}`);
// };

// eslint-disable-next-line import/no-anonymous-default-export
// export default { getAll, create, addcomment, update, remove };
export default { getAll, update };
