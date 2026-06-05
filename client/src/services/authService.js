import axios from 'axios'; //for making HTTP requests
const API_BASE = import.meta.env.VITE_BACKEND_API_URL;
console.log("VITE_BACKEND_API_URL =", import.meta.env.VITE_BACKEND_API_URL);

/**
 * Sends a POST request to the backend to register a new user.
 * @param {object} userData - The user's data (name, email, password).
 * @returns {Promise<object>} A promise that resolves to the response data from the backend, which includes the new user object and a JWT.
 */

export const register = async (userData) => {
    try {
        const response = await axios.post(
            `${API_BASE}/api/users/register`,
            userData
        );
        return response.data;
    } catch (error) {
        console.error('Registration failed:', error);
        throw new Error(
            error.response?.data?.message || 'Registration failed'
        );
    }
};

/**
 * Sends a POST request to the backend to log in a user.
 * @param {object} userData - The user's credentials (email, password).
 * @returns {Promise<object>} A promise that resolves to the response data from the backend, which includes the user object and a JWT.
 */

export const login = async (userData) => {
    try {
        const response = await axios.post(
            `${API_BASE}/api/users/login`,
            userData
        );
        return response.data;
    } catch (error) {
        console.error('Login failed:', error);
        throw new Error(
            error.response?.data?.message || 'Login failed'
        );
    }
};

console.log("API BASE:", import.meta.env.VITE_BACKEND_API_URL);