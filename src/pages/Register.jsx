import { useState } from "react";

import { registerUser } from "../api/auth";

import {
    Link,
    useNavigate
} from "react-router-dom";

const Register = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
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
            !formData.name ||
            !formData.email ||
            !formData.password
        ) {

            alert("Please fill all fields");

            return;
        }

        try {

            setLoading(true);

            const res =
                await registerUser(formData);

            localStorage.setItem(
                "token",
                res.data.token
            );

            alert("Register Successful");

            navigate('/');

        } catch (err) {

            console.log(err);

            alert(
                err.response?.data?.message ||
                err.message
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="relative min-h-screen flex items-center justify-center px-4">

            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">

                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">

                    Create Your Account

                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Name */}
                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-1">

                            Full Name

                        </label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg
                            focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                    </div>

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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg text-white bg-indigo-600
                        hover:bg-indigo-700 transition duration-200 cursor-pointer" >

                        {
                            loading
                                ? "Creating Account..."
                                : "Register"
                        }

                    </button>

                </form>

                {/* Login Link */}
                <p className="text-center text-gray-600 mt-6">

                    Already have an account?

                    <Link
                        to="/login"
                        className="text-indigo-600 font-semibold ml-2 hover:underline"
                    >
                        Login
                    </Link>

                </p>

            </div>

        </div>
    );
};

export default Register;