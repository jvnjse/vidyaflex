import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../config';
import { useNavigate, useParams } from 'react-router-dom';
import StudentSidebar from './StudentSidebar';
import Modal from 'react-modal';

function StudentAssignments() {
    const [assignments, setAssignments] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const { userid } = useParams();
    const teacherid = localStorage.getItem("teacherid");
    const [tab, setTab] = useState('ongoing'); // 'ongoing' or 'ended'
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [assignmentDescription, setAssignmentDescription] = useState('');
    const [assignmentFile, setAssignmentFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await axios.get(`${config.base_url}/student/${teacherid}/assignments/`);
                setAssignments(response.data);
            } catch (error) {
                console.error("Error fetching assignments:", error);
            }
        };

        fetchAssignments();
    }, [teacherid]);

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const ongoingAssignments = assignments.filter(assignment => new Date(assignment.assignment_end_date) > yesterday);
    const endedAssignments = assignments.filter(assignment => new Date(assignment.assignment_end_date) <= yesterday);

    const openModal = (assignment) => {
        setSelectedAssignment(assignment);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setAssignmentDescription('');
        setAssignmentFile(null);
    };

    const handleFileChange = (e) => {
        setAssignmentFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('assignment_description', assignmentDescription);
        formData.append('assignment_file', assignmentFile);
        formData.append('assignment', selectedAssignment.id);
        formData.append('student', teacherid);

        try {
            await axios.post(`${config.base_url}/assignmentstudents/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Assignment submitted successfully!');
            closeModal();
        } catch (error) {
            console.error('Error submitting assignment:', error);
            alert('Failed to submit assignment.');
        }
    };

    return (
        <div className="flex">
            <StudentSidebar />
            <div className="w-full p-4">
                <div className="flex justify-between px-10">
                    <h1 className="text-2xl font-bold mb-4">My Assignments</h1>
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
                                    <button
                                        onClick={() => openModal(assignment)}
                                        className="text-blue-500 hover:text-blue-700 font-semibold"
                                    >
                                        Submit Assignment
                                    </button>
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

            {/* Modal for assignment submission */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Submit Assignment"
                // className="modal-content"
                overlayClassName="modal-overlay"
                style={{
                    overlay: {
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    },
                }}
            >
                <div className='w-7/10 bg-white rounded-lg'>

                    <h2 className="text-xl font-semibold mb-4">Submit Assignment</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700">Description</label>
                            <textarea
                                value={assignmentDescription}
                                onChange={(e) => setAssignmentDescription(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Upload File</label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div className="text-right">
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                                Submit
                            </button>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}

export default StudentAssignments;
