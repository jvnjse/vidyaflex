import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import config from '../../config';
import courseimage from '../../assets/course.webp';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import Footer from '../../components/Footer';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${config.base_url}/courses/`);
                setCourses(response.data);
            } catch (error) {
                console.error('Failed to fetch courses:', error);
            }
        };

        fetchCourses();
    }, []);

    const filteredCourses = courses.filter(course =>
        course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.course_description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            {/* Navbar */}
            <Navbar />

            {/* Course List */}
            <section className="container mx-auto px-6 py-12">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">Courses</h2>
                    <div className="flex items-center bg-gray-100 rounded-md px-4 py-2">
                        <FaSearch className="text-gray-500 mr-2" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-gray-100 outline-none"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredCourses.map(course => (
                        <Link key={course.id} className="bg-white p-4 rounded-lg shadow" to={`/courses/${course.id}`}>
                            <img src={config.base_url + course.course_profile || courseimage} alt={course.course_name} className="w-full h-32 object-cover rounded-md" />
                            <div className="mt-4">
                                <h3 className="text-lg font-medium text-gray-800">{course.course_name}</h3>
                                <p className="text-sm text-gray-500">{course.course_description}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-xl font-bold text-gray-800">{course.course_price ? `$${course.course_price}` : 'Free'}</span>
                                    <span className="text-gray-600">{course.course_rating ? `${course.course_rating}★` : 'No ratings'}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">{course.students.length} students</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Pagination */}

            <Footer />
        </div>
    );
};

export default Courses;
