import React from 'react'
import { accessCheck, roleCheck } from '../utils/access_check'
import { Link, useNavigate } from 'react-router-dom'
import logow from '../assets/logow.png'

function Navbar() {
    const navigate = useNavigate()
    const userid = localStorage.getItem('id')

    return (
        <header className="bg-white shadow" id='home'>
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <div>
                    <Link to='/' className="text-xl font-bold text-gray-800 lg:text-2xl">
                        <img src={logow} alt="" className='h-16' />
                    </Link>
                </div>
                <div className="flex items-center">
                    <nav className="hidden md:flex space-x-8 px-4">
                        <a href="/" className="text-gray-600 hover:text-orange-500">Home</a>
                        <Link to="/courses" className="text-gray-600 hover:text-orange-500">Courses</Link>
                    </nav>
                    {accessCheck() ?
                        <>
                            <button className="bg-orange-500 text-white px-4 py-2 rounded-md" onClick={() => { roleCheck() ? navigate(`/tutor/courses/${userid}`) : navigate(`/student/courses/${userid}`) }}>Go to profile</button>
                            <button className="mx-4 text-gray-600 hover:text-orange-500" onClick={() => { localStorage.removeItem("access"); localStorage.removeItem("id"); navigate("/") }}>Log Out</button>
                        </>
                        :
                        <>
                            <button className="mx-4 text-gray-600 hover:text-orange-500" onClick={() => { navigate(`/auth`) }}>Sign In / Sign Up</button>
                        </>
                    }
                </div>
            </div>
        </header >
    )
}

export default Navbar