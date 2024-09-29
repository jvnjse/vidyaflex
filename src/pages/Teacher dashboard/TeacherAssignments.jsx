import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TeacherSidebar from './TeacherSidebar';
import config from '../../config';
import { useNavigate, useParams } from 'react-router-dom';

function TeacherAssignments() {
    const [assignments, setAssignments] = useState([]);
    const { userid } = useParams()
    const teacherid = localStorage.getItem("teacherid");
    const [tab, setTab] = useState('ongoing'); // 'ongoing' or 'ended'


    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await axios.get(`${config.base_url}/courseassignments/?tuserid=${teacherid}`);
                setAssignments(response.data);
            } catch (error) {
                console.error("Error fetching assignments:", error);
            }
        };

        fetchAssignments();
    }, []);
    const navigate = useNavigate()
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const ongoingAssignments = assignments.filter(assignment => new Date(assignment.assignment_end_date) > yesterday);
    const endedAssignments = assignments.filter(assignment => new Date(assignment.assignment_end_date) <= yesterday);

    return (
        <div className="flex">
            <TeacherSidebar userid={userid} />
            <div className="w-full p-4">
                <div className="flex justify-between px-10">

                    <h1 className="text-2xl font-bold mb-4">My Assignments</h1>
                    <button
                        onClick={() => { navigate(`/tutor/create/assignments/${userid}`) }}
                        className="absolute top-4 right-5 bg-blue-500 text-white px-4 py-2 rounded z-10"
                    >
                        Create Assignments
                    </button>
                </div>
                <div className="flex space-x-4 mb-4">
                    <button
                        className={`px-4 py-2 rounded-md focus:outline-none ${tab === 'ongoing' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                        onClick={() => setTab('ongoing')}
                    >
                        Ongoing
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md focus:outline-none ${tab === 'ended' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                        onClick={() => setTab('ended')}
                    >
                        Ended
                    </button>
                </div>
                <div className="assignments">
                    {tab === 'ongoing' && ongoingAssignments.length > 0 ? (
                        ongoingAssignments.map(assignment => (
                            <div key={assignment.id} className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 mb-4">
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{assignment.assignment_name}</h2>
                                    <p className="text-gray-600">{assignment.assignment_description}</p>
                                    <p className="text-gray-600">End Date: {assignment.assignment_end_date}</p>
                                </div>
                                <div className="bg-gray-50 p-4 text-right">
                                    <button className="text-blue-500 hover:text-blue-700 font-semibold" onClick={() => navigate(`/assignments/${assignment.id}/submissions`)}>View Details</button>
                                </div>

                            </div>
                        ))
                    ) : tab === 'ongoing' ? (
                        <p>No ongoing assignments.</p>
                    ) : null}

                    {tab === 'ended' && endedAssignments.length > 0 ? (
                        endedAssignments.map(assignment => (
                            <div key={assignment.id} className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 mb-4">
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{assignment.assignment_name}</h2>
                                    <p className="text-gray-600">{assignment.assignment_description}</p>
                                    <p className="text-gray-600">End Date: {assignment.assignment_end_date}</p>
                                </div>
                                <div className="bg-gray-50 p-4 text-right">
                                    <button className="text-blue-500 hover:text-blue-700 font-semibold">View Details</button>
                                </div>
                            </div>
                        ))
                    ) : tab === 'ended' ? (
                        <p>No ended assignments.</p>
                    ) : null}
                </div>
            </div>
        </div >
    );
}

export default TeacherAssignments;
