import React from 'react'
import { Link } from 'react-router-dom'
import lg from "../assets/logo.png"

function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-12">
            <div className="container mx-auto px-6">
                <div className="flex justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">Vidya Flex</h3>
                        <p className="text-sm">Your Online Tutor</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Company</h3>
                        <nav className="mt-4 space-y-2 flex flex-col">
                            <a href="#home" className="text-gray-400 hover:text-white">Home</a>
                            <Link to="/courses" className="text-gray-400 hover:text-white">Courses</Link>
                            <a href="#" className="text-gray-400 hover:text-white">Details</a>
                        </nav>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Support</h3>
                        <nav className="mt-4 space-y-2">
                            <a href={"#home"}>
                                <img src={lg} className='h-16 mix-blend-screen' alt="" />
                            </a>
                        </nav>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer