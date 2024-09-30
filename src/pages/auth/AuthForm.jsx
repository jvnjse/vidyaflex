import React, { useState } from "react";
import axios from "axios";
import config from "../../config";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: ""
    });

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setFormData({
            username: "",
            password: "",
            email: ""
        });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isLogin
            ? `${config.base_url}/login/`
            : `${config.base_url}/register/`;

        try {
            const response = await axios.post(url, isLogin ? {
                username: formData.username,
                password: formData.password
            } : formData);

            localStorage.setItem('access', response.data.access);
            localStorage.setItem('id', response.data.user_id);
            localStorage.setItem('role', response.data.role);
            localStorage.setItem('teacherid', response.data.teacherstudentid);
            (isLogin ? (response.data.role ===true ?   navigate('/courses'): navigate(`/tutor/courses/${response.data.user_id}/`)) : navigate(`/select-role/${response.data.user_id}`));
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">{isLogin ? "Login" : "Register"}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    {!isLogin && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="mb-6">
                        <button
                            type="submit"
                            className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {isLogin ? "Login" : "Register"}
                        </button>
                    </div>
                    <div className="text-center">
                        <p className="text-gray-600">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button
                                type="button"
                                onClick={toggleForm}
                                className="text-indigo-500 hover:underline focus:outline-none"
                            >
                                {isLogin ? " Register" : " Login"}
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthForm;
