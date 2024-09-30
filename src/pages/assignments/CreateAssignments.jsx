import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import { useNavigate } from "react-router-dom";

const CreateAssignment = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [assignmentName, setAssignmentName] = useState("");
    const [assignmentDescription, setAssignmentDescription] = useState("");
    const [assignmentEndDate, setAssignmentEndDate] = useState("");
    const userid = localStorage.getItem('id');
    const navigate = useNavigate()
    const teacherid = localStorage.getItem("teacherid");


    useEffect(() => {
        axios.get(`${config.base_url}/courses/?tuserid=${teacherid}/`)
            .then(response => {
                setCourses(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the courses!", error);
            });
    }, [userid]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const newAssignment = {
            assignment_name: assignmentName,
            assignment_description: assignmentDescription,
            assignment_end_date: assignmentEndDate,
            course: selectedCourse
        };

        axios.post(`${config.base_url}/courseassignments/`, newAssignment)
            .then(response => {
                alert("Assignment created successfully!");
                navigate(`/tutor/assignments/${userid}`)
            })
            .catch(error => {
                console.error("There was an error creating the assignment!", error);
            });
    };

    return (
        <div className="max-w-lg mx-auto p-8 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Assignment</h2>
            <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Course:</label>
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="" disabled>Select a course</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.id}>{course.course_name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Assignment Name:</label>
                    <input
                        type="text"
                        value={assignmentName}
                        onChange={(e) => setAssignmentName(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Assignment Description:</label>
                    <textarea
                        value={assignmentDescription}
                        onChange={(e) => setAssignmentDescription(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">End Date:</label>
                    <input
                        type="date"
                        value={assignmentEndDate}
                        onChange={(e) => setAssignmentEndDate(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Create Assignment
                </button>
            </form>
        </div>
    );
};

export default CreateAssignment;
