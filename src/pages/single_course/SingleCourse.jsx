import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import config from '../../config';
import { useNavigate, useParams } from 'react-router-dom';
import { roleCheck } from '../../utils/access_check';

const SingleCourse = () => {
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const { courseid } = useParams();
    const userid = localStorage.getItem('id')
    const teacherid = localStorage.getItem("teacherid");

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axios.get(`${config.base_url}/courses/${courseid}/`);
                setCourse(response.data);
            } catch (err) {
                setError('Failed to fetch course data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseid]);

    const handleEnrollClick = () => {
        setShowConfirmModal(true);
    };

    const handleConfirmEnrollment = async () => {
        try {
            setShowConfirmModal(false);
            await axios.post(`${config.base_url}/enroll/${courseid}/?students=${teacherid}`);

            setShowSuccessModal(true);
        } catch (error) {
            console.error('Failed to enroll:', error);
            setError('Failed to enroll in the course');
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        // Optionally navigate to another page or refresh data
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="flex items-center justify-center h-screen">
                    <div className="text-xl font-semibold">Loading...</div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="flex items-center justify-center h-screen">
                    <div className="text-xl font-semibold text-red-500">{error}</div>
                </div>
            </>
        );
    }

    const {
        course_name,
        course_description,
        course_price,
        course_rating,
        course_overview,
        course_profile,
        course_start_date,
        course_end_date,
        students,
        teacher,
        skills,
    } = course;

    return (
        <>
            <Navbar />
            <div className="container mx-auto py-12 px-6">
                {/* Course Header */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                    <div className="md:w-3/4 w-full">
                        <h1 className="text-3xl font-bold">{course_name}</h1>
                        <p className="text-lg text-gray-600 mt-2">{course_description}</p>
                        <div className="flex items-center mt-4">
                            <span className="text-2xl font-bold text-orange-500">${course_price}</span>
                            {course_rating && (
                                <span className="ml-4 text-sm text-gray-500">Rating: {course_rating}★</span>
                            )}
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                            <span>Start Date: {new Date(course_start_date).toLocaleDateString()}</span>
                            <span className="ml-4">End Date: {new Date(course_end_date).toLocaleDateString()}</span>
                            <span className="ml-4">{students.length} Students Enrolled</span>
                        </div>
                        {skills.length > 0 && (
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold">Skills Covered:</h3>
                                <ul className="list-disc list-inside text-gray-600 mt-2">
                                    {skills.map((skill, index) => (
                                        <span key={skill.id} className="mr-2 rounded-sm bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                                            {skill.skill_name}
                                        </span>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="md:w-1/4 w-full bg-white p-6 shadow-md rounded-lg mt-6 md:mt-0">
                        <img
                            src={config.base_url + course_profile}
                            alt={course_name}
                            className="w-full h-48 object-cover rounded-md mb-4"
                        />
                        {!roleCheck() && (
                            <>
                                {students.length >= 30 ? (
                                    <button
                                        className="bg-gray-400 text-white px-4 py-2 rounded-md w-full cursor-not-allowed"
                                        disabled
                                    >
                                        Course is full
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleEnrollClick}
                                        className="bg-orange-500 text-white px-4 py-2 rounded-md w-full"
                                    >
                                        Enroll Now
                                    </button>
                                )}
                            </>
                        )}

                    </div>
                </div>

                {/* Course Overview */}
                {course_overview && (
                    <div className="bg-white p-6 shadow-md rounded-lg mb-6">
                        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
                        <p className="text-gray-600 leading-relaxed">{course_overview}</p>
                    </div>
                )}

                {/* Instructor Details */}
                {teacher && (
                    <InstructorDetails teacherId={teacher} />
                )}
            </div>

            {/* Confirm Enrollment Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-md shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Confirm Enrollment</h2>
                        <p>Are you sure you want to enroll in this course?</p>
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="mr-4 bg-gray-500 text-white px-4 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmEnrollment}
                                className="bg-orange-500 text-white px-4 py-2 rounded-md"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-md shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Enrollment Successful</h2>
                        <p>You have successfully enrolled in the course!</p>
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={handleCloseSuccessModal}
                                className="bg-orange-500 text-white px-4 py-2 rounded-md"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SingleCourse;


const InstructorDetails = ({ teacherId }) => {
    const [instructor, setInstructor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInstructor = async () => {
            try {
                const response = await axios.get(`${config.base_url}/teacher/${teacherId}/`); // Replace with your actual API endpoint
                setInstructor(response.data);
            } catch (err) {
                setError('Failed to fetch instructor data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchInstructor();
    }, [teacherId]);
    const navigate = useNavigate()


    if (loading) {
        return (
            <div className="bg-white p-6 shadow-md rounded-lg mb-6">
                <h2 className="text-2xl font-semibold mb-4">Instructor</h2>
                <div className="text-gray-600">Loading instructor details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white p-6 shadow-md rounded-lg mb-6">
                <h2 className="text-2xl font-semibold mb-4">Instructor</h2>
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    const { name, bio, profileimage, email, phonenumber } = instructor;

    return (
        <div className="bg-white p-6 shadow-md rounded-lg mb-6" onClick={() => { navigate(`/teacher-profile/${teacherId}`) }}>
            <h2 className="text-2xl font-semibold mb-4">Instructor</h2>
            <div className="flex items-center">
                <img
                    src={config.base_url + profileimage}
                    alt={name}
                    className="w-24 h-24 rounded-full object-cover mr-6"
                />
                <div>
                    <h3 className="text-xl font-bold">{name}</h3>
                    <p className="text-gray-600 mt-2">{bio}</p>
                    <div className="text-sm text-gray-500 mt-2">
                        <span>Email: {email}</span>
                        <span className="ml-4">Phone: {phonenumber}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};