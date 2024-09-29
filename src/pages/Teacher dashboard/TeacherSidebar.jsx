import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png'
function TeacherSidebar({ userid }) {
    const location = useLocation();
    const [selected, setSelected] = useState(location.pathname);
    const navigate = useNavigate()

    const handleClick = (path) => {
        setSelected(path);
    };
    const isActive = (path) => selected.includes(path) ? "bg-[#FF6636] text-white" : "text-gray-300";

    return (
        <div className="min-w-64 max-w-64 h-screen bg-[#1D2026] text-gray-300 flex flex-col">
            <Link to={"/"}>

                <div>
                    <img src={logo} alt="" className="mix-blend-screen" />
                </div>
            </Link>
            <div className="flex flex-col p-4">
                <Link
                    to={`/tutor/courses/${userid}`}
                    className={`p-3 rounded-md ${isActive("/tutor/courses")}`}
                    onClick={() => handleClick("/tutor/courses")}
                >
                    My Courses
                </Link>
                <Link
                    to={`/tutor/messages/${userid}`}
                    className={`p-3 rounded-md mt-2 ${isActive("/tutor/messages")}`}
                    onClick={() => handleClick("/tutor/messages")}
                >
                    Message
                </Link>
                <Link
                    to={`/tutor/assignments/${userid}`}
                    className={`p-3 rounded-md mt-2 ${isActive("/tutor/assignments")}`}
                    onClick={() => handleClick("/tutor/assignments")}
                >
                    Assignments
                </Link>
                <Link
                    to={`/tutor/profile/${userid}`}
                    className={`p-3 rounded-md mt-2 ${isActive("/tutor/profile")}`}
                    onClick={() => handleClick("/tutor/profile")}
                >
                    Profile
                </Link>
                <div className="mt-auto p-3">
                    <button
                        className="w-full text-gray-300 bg-transparent border-none cursor-pointer"
                        onClick={() => {
                            localStorage.clear()
                            navigate('/')

                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeacherSidebar