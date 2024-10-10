import React, { useEffect, useState } from 'react';
import TeacherSidebar from './TeacherSidebar';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import { FaDownload, FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';

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
                const response = await axios.get(`${config.base_url}/courses/?tuserid=${teacherid}`);
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
    const handleDeleteClick = async (courseId) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            try {
                await axios.delete(`${config.base_url}/courses/${courseId}/`);
                setCourses(courses.filter(course => course.id !== courseId));
            } catch (error) {
                console.error('Failed to delete course:', error);
                setError(error);
            }
        }
    };


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <>
            <div className='flex'>
                <TeacherSidebar userid={userid} />
                <div className="flex flex-wrap gap-6 p-6">
                    <button
                        onClick={handleCreateClick}
                        className="absolute top-4 right-5 bg-blue-500 text-white px-4 py-2 rounded z-10"
                    >
                        Create
                    </button>

                    <div>
                        {courses.length === 0 ? (
                            <div className="text-center text-gray-600 mt-8">
                                No courses available. Create a course to get started.
                            </div>
                        ) : (
                            courses.map(course => (
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
                                    <div className="absolute bottom-2 right-2" onClick={(e) => { e.stopPropagation() }}>
                                        <FaEdit
                                            onClick={() => handleEditClick(course)}
                                            className="text-gray-600 cursor-pointer hover:text-blue-500"
                                        />
                                    </div>
                                    <div className="absolute bottom-2 right-8" onClick={(e) => { e.stopPropagation() }}>
                                        <FaTrash
                                            onClick={() => handleDeleteClick(course.id)}
                                            className="text-red-600 cursor-pointer hover:text-red-800"
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <h3 className="text-lg font-medium text-gray-800 truncate">
                                            {course.course_name}
                                        </h3>
                                        <p className="text-sm text-gray-500 truncate">{course.course_description}</p>
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
                            ))
                        )}
                    </div>

                </div>
            </div>
            {showPopup && (
                <CreateOrEditCoursePopup
                    onClose={handlePopupClose}
                    onCourseCreatedOrUpdated={handleCourseCreatedOrUpdated}
                    course={selectedCourse}
                />
            )}
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

function CreateOrEditCoursePopup({ onClose, onCourseCreatedOrUpdated, course }) {
    const [courseName, setCourseName] = useState(course ? course.course_name : '');
    const [courseDescription, setCourseDescription] = useState(course ? course.course_description : '');
    const [courseProfile, setCourseProfile] = useState(null);
    const [coursePrice, setCoursePrice] = useState(course ? course.course_price : '');
    const [courseOverView, setCourseOverView] = useState(course ? course.course_overview : '');
    const [courseStartDate, setCourseStartDate] = useState(course ? course.course_start_date : '');
    const [courseEndDate, setCourseEndDate] = useState(course ? course.course_end_date : '');
    const { userid } = useParams();
    const teacherid = localStorage.getItem("teacherid");

    const handleProfileImageChange = (e) => {
        setCourseProfile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('course_name', courseName);
        formData.append('course_description', courseDescription);
        formData.append('course_overview', courseOverView);
        formData.append('course_price', coursePrice);
        formData.append('course_start_date', courseStartDate);
        formData.append('course_end_date', courseEndDate);
        formData.append('teacher', teacherid);
        if (courseProfile) {
            formData.append('course_profile', courseProfile);
        }

        try {
            const url = course ? `${config.base_url}/courses/${course.id}/` : `${config.base_url}/courses/`;
            const method = course ? 'put' : 'post';

            const response = await axios[method](url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onCourseCreatedOrUpdated(response.data);
        } catch (error) {
            console.error('Failed to create or update course:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 overflow-y-auto h-dvh relative">
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

                <h2 className="text-lg font-semibold mb-4">
                    {course ? 'Edit Course' : 'Create New Course'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Course Name</label>
                        <input
                            type="text"
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                            className="border border-gray-300 rounded p-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                            value={courseDescription}
                            onChange={(e) => setCourseDescription(e.target.value)}
                            className="border border-gray-300 rounded p-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Overview</label>
                        <textarea
                            value={courseOverView}
                            onChange={(e) => setCourseOverView(e.target.value)}
                            className="border border-gray-300 rounded p-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Profile Image</label>
                        <input
                            type="file"
                            onChange={handleProfileImageChange}
                            className="border border-gray-300 rounded p-2 w-full"
                        // {course ? '' : 'required'}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Price</label>
                        <input
                            type="number"
                            value={coursePrice}
                            onChange={(e) => setCoursePrice(e.target.value)}
                            className="border border-gray-300 rounded p-2 w-full"
                            required
                        />
                    </div>
                    <div className="flex">

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Start Date</label>
                            <input
                                type="date"
                                value={courseStartDate}
                                onChange={(e) => setCourseStartDate(e.target.value)}
                                className="border border-gray-300 rounded p-2 w-full"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">End Date</label>
                            <input
                                type="date"
                                value={courseEndDate}
                                onChange={(e) => setCourseEndDate(e.target.value)}
                                className="border border-gray-300 rounded p-2 w-full"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            {course ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


function CourseDetailsPopup({ onClose, course }) {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (selectedFile) {
            handleUploadMaterial(selectedFile);
            setSelectedFile(null); 
        }
    };

    const handleUploadMaterial = (file) => {
        const formData = new FormData();
        formData.append('material_file', file);
        formData.append('course', course.id); 
        formData.append('material_description',"file"); 
    
        axios.post(`${config.base_url}/coursematerials/`,  formData,
        )
            .then((response) => {
                console.log(response.data);
                onClose(false)
                
            })
            .catch((error) => {
                console.error('Error uploading material:', error);
            });
    };
    
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-2xl overflow-y-auto h-[100vh] overflow-scroll relative">
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
                            <span className="text-gray-600">
                                {course.course_rating ? `${course.course_rating}★` : 'No rating available'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                            Start Date: {new Date(course.course_start_date).toLocaleDateString()}<br />
                            End Date: {new Date(course.course_end_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                            {course.students.length} student{course.students.length > 1 ? 's' : ''} enrolled
                        </p>

                        {/* Displaying course materials */}
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

                        {/* Upload course materials */}
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">Add Course Material</h3>
                            <input type="file" onChange={handleFileChange} className="mb-2" />
                            <button
                                onClick={handleUpload}
                                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                                disabled={!selectedFile}
                            >
                                Upload Material
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
