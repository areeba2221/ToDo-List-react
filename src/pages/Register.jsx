import { useState } from "react";
import { registerUser } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";



const Register = (setIsAuthenticated) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",             
        email: "",
        password: "",
        confirmPassword: "" 
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {

        if (!formData.name || formData.name.trim().length < 3) {
            alert("Name must be at least 3 characters");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert("Please enter a valid email");
            return false;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            alert("Password must be 8+ chars with uppercase, lowercase, number and special character");
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setLoading(true);

            const { confirmPassword, ...dataToSend } = formData;
            await registerUser(dataToSend);

            alert("Register Successful");
            setIsAuthenticated(true);
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

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"                  
                            autoComplete="name"
                            placeholder="Enter your name"
                            value={formData.name}        
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg
                            focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            autoComplete="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg
                            focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            autoComplete="new-password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg
                            focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            autoComplete="new-password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg
                            focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg text-white bg-indigo-600
                        hover:bg-indigo-700 transition duration-200 cursor-pointer">
                        {loading ? "Creating Account..." : "Register"}
                    </button>

                </form>

                <p className="text-center text-gray-600 mt-6">
                    Already have an account?
                    <Link to="/login"
                        className="text-indigo-600 font-semibold ml-2 hover:underline">
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Register;