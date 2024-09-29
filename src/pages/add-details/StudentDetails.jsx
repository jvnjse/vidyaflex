import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import config from "../../config";

const StudentDetails = () => {
    const { userid } = useParams()
    const [formData, setFormData] = useState({

        name: "",
        bio: "",
        email: "",
        phonenumber: "",
        profileimage: null,
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "profileimage") {
            setFormData({
                ...formData,
                profileimage: files[0],
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("user", userid);
        data.append("name", formData.name);
        data.append("bio", formData.bio);
        data.append("email", formData.email);
        data.append("student", true);
        data.append("phonenumber", formData.phonenumber);
        if (formData.profileimage) {
            data.append("profileimage", formData.profileimage);
        }

        try {
            const response = await axios.post(`${config.base_url}/student/`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            navigate(`/courses`);
            localStorage.setItem('role', true)
            localStorage.setItem('teacherid', response.data.id)

        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Student Details</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
                            Bio
                        </label>
                        <textarea
                            name="bio"
                            id="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        ></textarea>
                    </div>
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
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phonenumber">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phonenumber"
                            id="phonenumber"
                            value={formData.phonenumber}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profileimage">
                            Profile Image
                        </label>
                        <input
                            type="file"
                            name="profileimage"
                            id="profileimage"
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="mb-6">
                        <button
                            type="submit"
                            className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentDetails;
