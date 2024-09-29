import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import config from '../../config';
import Navbar from '../../components/Navbar';
import TeacherSidebar from './TeacherSidebar';

function SubmittedAssignments() {
    const [submissions, setSubmissions] = useState([]);
    const { assignmentId } = useParams(); // Get the assignmentId from the URL

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await axios.get(`${config.base_url}/assignments/${assignmentId}/files/`);
                setSubmissions(response.data);
            } catch (error) {
                console.error("Error fetching submitted assignments:", error);
            }
        };

        fetchSubmissions();
    }, [assignmentId]);

    return (
        <>
            {/* <Navbar /> */}
            <div className="flex">
                <TeacherSidebar />
                <div className="p-4">
                    <h1 className="text-2xl font-bold mb-4">Submitted Assignments</h1>
                    {submissions.length > 0 ? (
                        submissions.map((submission) => (
                            <div key={submission.id} className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 mb-4">
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{submission.student.name}</h2>
                                    <h2 className=" text-gray-800 mb-2">{submission.student.email} &nbsp; &nbsp;  --  &nbsp; &nbsp;{submission.student.phonenumber}   </h2>
                                    <p className="text-gray-600">Description: {submission.assignment_description}</p>
                                    <a
                                        href={config.base_url + submission.assignment_file}
                                        className="text-blue-500 hover:text-blue-700 font-semibold"
                                        download target='_blank'
                                    >
                                        Download File
                                    </a>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No submissions yet.</p>
                    )
                    }
                </div >
            </div>
        </>
    );
}

export default SubmittedAssignments;
