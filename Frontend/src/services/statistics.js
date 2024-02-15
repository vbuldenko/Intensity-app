import axios from 'axios';
import storageService from './storage';
const baseUrl = '/api/sales';

const getStatData = async () => {
    const token = storageService.loadUser()
        ? `Bearer ${storageService.loadUser().token}`
        : null;

    const config = {
        headers: { Authorization: token },
    };

    const response = await axios.get(baseUrl, config);
    return response.data;
};

export default { getStatData };
