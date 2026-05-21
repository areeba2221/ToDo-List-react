import { useState } from "react";
import { loginUser } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            await loginUser(formData);
            setIsAuthenticated(true);
            navigate('/');
        } catch (err) {
            console.log(err);
            alert(err.response?.data?.message || "Login Failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">

                <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-linear-to-r from-[#C4564D] to-[#864B49] mb-8">
                    Login to Your Account
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input type="email" id="email" name="email"
                            autoComplete="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg
                            focus:outline-none focus:ring-2 focus:ring-[#d3736a]" />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input type="password" id="password" name="password"
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg
                            focus:outline-none focus:ring-2 focus:ring-[#d3736a]" />
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full py-3 rounded-lg text-white bg-linear-to-r from-[#C4564D] to-[#864B49]
                        hover:bg-[#d3736a] transition duration-200 cursor-pointer disabled:opacity-60">
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-6">
                    Don't have an account?
                    <Link to="/register"
                        className="text-[#d3736a] font-semibold ml-2 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;