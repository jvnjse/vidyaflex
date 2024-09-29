import React, { useEffect, useState } from 'react';
// import TeacherSidebar from './TeacherSidebar';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import { FaDownload, FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import StudentSidebar from './StudentSidebar';

function MyCourses() {
    const { userid } = useParams();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showPopupdetails, setShowPopupdetails] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const teacherid = localStorage.getItem("teacherid");

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${config.base_url}/courses/?suserid=${teacherid}`);
                setCourses(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [userid]);

    const handleCreateClick = () => {
        setSelectedCourse(null);
        setShowPopup(true);
    };

    const handleEditClick = (course) => {
        setSelectedCourse(course);
        setShowPopup(true);
    };

    const handlePopupClose = () => {
        setShowPopup(false);
    };

    const handleCourseCreatedOrUpdated = (newOrUpdatedCourse) => {
        const updatedCourses = selectedCourse
            ? courses.map(course =>
                course.id === newOrUpdatedCourse.id ? newOrUpdatedCourse : course
            )
            : [...courses, newOrUpdatedCourse];
        setCourses(updatedCourses);
        setShowPopup(false);
    };



    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <>
            <div className='flex'>
                <StudentSidebar userid={userid} />
                <div className="flex flex-wrap gap-6 p-6">

                    {courses.map(course => (
                        <div key={course.id}
                            onClick={() => {
                                setSelectedCourse(course);
                                setShowPopupdetails(true);
                            }}
                            className="bg-white p-4 rounded-lg shadow h-min w-56 relative">
                            <img
                                src={config.base_url + course.course_profile}
                                alt={course.course_name}
                                className="w-full h-32 object-cover rounded-md"
                            />


                            <div className="mt-4">
                                <h3 className="text-lg font-medium text-gray-800 truncate">
                                    {course.course_name}
                                </h3>
                                <p className="text-sm text-gray-500">{course.course_description}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-xl font-bold text-gray-800">
                                        {course.course_price ? `$${course.course_price}` : "Free"}
                                    </span>
                                    <span className="text-gray-600">
                                        {course.course_rating}★
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">
                                    {course.enrolled_students} students
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showPopupdetails && (
                <CourseDetailsPopup
                    onClose={setShowPopupdetails}
                    course={selectedCourse}
                />
            )}
        </>
    );
}

export default MyCourses;




function CourseDetailsPopup({ onClose, course }) {
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-2xl overflow-y-auto h-auto relative">
                <button
                    onClick={() => { onClose(false) }}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-300 transition-colors duration-200"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 text-gray-800 hover:text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                <h2 className="text-2xl font-semibold mb-4">{course.course_name}</h2>
                <div className="flex gap-6 mb-4">
                    <img
                        src={config.base_url + course.course_profile || '/default-course-image.jpg'}
                        alt={course.course_name}
                        className="w-1/3 h-40 object-cover rounded-lg"
                    />
                    <div className="w-2/3">
                        <p className="text-lg font-medium mb-2">{course.course_description || 'No description available'}</p>
                        <p className="text-gray-600 mb-2">{course.course_overview || 'No overview available'}</p>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xl font-bold text-gray-800">
                                {course.course_price ? `$${course.course_price}` : "Free"}
                            </span>

                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                            Start Date: {new Date(course.course_start_date).toLocaleDateString()} &nbsp; &nbsp;
                            End Date: {new Date(course.course_end_date).toLocaleDateString()}
                        </p>
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">Course Materials</h3>
                            <div className="flex flex-wrap gap-2 ">

                            {course.materials.length > 0 ? (
                                course.materials.map((material,index) => (
                                    <a
                                    href={config.base_url + material.material_file}
                                    download
                                    target='__blank'
                                    // className="text-blue-500 hover:text-blue-700"
                                 className="flex items-center gap-4 mb-2 bg-gray-300 rounded-md px-1">
                                        <p className="text-gray-600">material - {index+1}</p>
                                        
                                           <FaDownload/>
                                        </a>
                                    // </div>
                                ))
                            ) : (
                                <p className="text-gray-600">No materials available.</p>
                            )}
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                            {course.students.length} student{course.students.length > 1 ? 's' : ''} enrolled
                        </p>
                        {course.students.length > 0 && (
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold">Students</h3>
                                <div className='flex flex-wrap gap-4'>

                                    {course.students.map(student => (
                                        <div key={student.id} className="flex items-center gap-4 mb-2">
                                            <img
                                                src={config.base_url + student.profileimage || '/default-student-image.jpg'}
                                                alt={student.name}
                                                className="w-12 h-12 object-cover rounded-full"
                                            />
                                            <div>
                                                <p className="font-medium">{student.name}</p>
                                                <p className="text-gray-600 text-xs">{student.email}</p>
                                                <p className="text-gray-600 text-xs">{student.phonenumber}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
