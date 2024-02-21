import axios from 'axios';
import storageService from '../services/storage';

const configureAxios = () => {
    // Create an instance of Axios
    const instance = axios.create({
        baseURL: '/api',
        timeout: 5000, // Adjust timeout as needed
    });

    // Add a request interceptor
    instance.interceptors.request.use(
        function (config) {
            // Get the authentication token from localStorage or wherever it's stored
            const authToken = storageService.loadUser().token;

            // If the authentication token exists, add it to the request headers
            if (authToken) {
                config.headers['Authorization'] = `Bearer ${authToken}`;
            }

            return config;
        },
        function (error) {
            // Handle request errors
            return Promise.reject(error);
        }
    );

    return instance;
};

export default configureAxios;
