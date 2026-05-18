import axios from "axios";

const API =
`${import.meta.env.VITE_BACKEND_URL}/api/auth`;

export const registerUser = async (
    userData
) => {

    return await axios.post(
        `${API}/register`,
        userData
    );

};

export const loginUser = async (
    userData
) => {

    return await axios.post(
        `${API}/login`,
        userData
    );

};