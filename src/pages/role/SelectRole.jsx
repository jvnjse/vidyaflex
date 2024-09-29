import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const SelectRole = () => {
    const navigate = useNavigate();
    const { userid } = useParams()

    const handleRoleSelect = (role) => {
        if (role === "student") {
            navigate(`/student-details/${userid}`);
        } else if (role === "teacher") {
            navigate(`/teacher-details/${userid}`);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Select Your Role</h2>
                <div className="flex justify-between">
                    <button
                        onClick={() => handleRoleSelect("student")}
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/2 mr-2"
                    >
                        I'm a Student
                    </button>
                    <button
                        onClick={() => handleRoleSelect("teacher")}
                        className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 w-1/2 ml-2"
                    >
                        I'm a Teacher
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectRole;
