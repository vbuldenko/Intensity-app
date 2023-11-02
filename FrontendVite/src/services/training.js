import axios from 'axios';
import storageService from './storage';
const baseUrl = '/api/training-sessions';

const token = storageService.loadUser()
    ? `Bearer ${storageService.loadUser().token}`
    : null;
const config = {
    headers: { Authorization: token },
};

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

const update = async (id, updateTypeBody) => {
    const response = await axios.put(
        `${baseUrl}/${id}`,
        updateTypeBody,
        config
    );
    return response.data;
};

// const remove = (id) => {
//     axios.delete(`${baseUrl}/${id}`, config);
//     axios.delete(`${baseUrl}/${id}`);
// };

// eslint-disable-next-line import/no-anonymous-default-export
// export default { getAll, create, addcomment, update, remove };
export default { getAll, update };
