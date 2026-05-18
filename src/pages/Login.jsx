import { useState } from "react";

import { loginUser } from "../api/auth";

import {
    Link,
    useNavigate
} from "react-router-dom";

const Login = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (
            !formData.email ||
            !formData.password
        ) {

            alert("Please fill all fields");

            return;
        }

        try {

            setLoading(true);

            const res =
                await loginUser(formData);

            localStorage.setItem(
                "token",
                res.data.token
            );

            alert("Login Successful");

            navigate('/');

        } catch (err) {

            console.log(err);

            alert(
                err.response?.data?.message ||
                "Login Failed"
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="relative min-h-screen flex items-center justify-center px-4">

            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">

                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">

                    Login to Your Account

                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Email */}
                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-1">

                            Email Address

                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg
                            focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                    </div>

                    {/* Password */}
                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-1">

                            Password

                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg
                            focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg text-white bg-indigo-600
                        hover:bg-indigo-700 transition duration-200 cursor-pointer"
                    >

                        {
                            loading
                                ? "Logging in..."
                                : "Login"
                        }

                    </button>

                </form>

                {/* Register Link */}
                <p className="text-center text-gray-600 mt-6">

                    Don't have an account?

                    <Link
                        to="/register"
                        className="text-indigo-600 font-semibold ml-2 hover:underline"
                    >
                        Register
                    </Link>

                </p>

            </div>

        </div>
    );
};

export default Login;