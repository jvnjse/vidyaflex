import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png'
function StudentSidebar() {
    const location = useLocation();
    const [selected, setSelected] = useState(location.pathname);
    const userid = localStorage.getItem('id')
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
                    to={`/student/courses/${userid}`}
                    className={`p-3 rounded-md ${isActive("/student/courses")}`}
                    onClick={() => handleClick("/student/courses")}
                >
                    My Courses
                </Link>
                <Link
                    to={`/student/message/${userid}`}
                    className={`p-3 rounded-md mt-2 ${isActive("/message")}`}
                    onClick={() => handleClick("/student/message")}
                >
                    Message
                </Link>
                <Link
                    to={`/student/assignments/${userid}`}
                    className={`p-3 rounded-md mt-2 ${isActive("/student/assignments")}`}
                    onClick={() => handleClick("/student/assignments")}
                >
                    Assignments
                </Link>
                <Link
                    to={`/student/profile/${userid}`}
                    className={`p-3 rounded-md mt-2 ${isActive("/profile")}`}
                    onClick={() => handleClick("/student/profile")}
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

export default StudentSidebar