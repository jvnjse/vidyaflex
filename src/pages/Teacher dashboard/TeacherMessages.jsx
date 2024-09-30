import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import config from '../../config';
import { FaPaperclip, FaPaperPlane } from 'react-icons/fa';
import TeacherSidebar from './TeacherSidebar';

function TeacherMessages() {
    const { userid } = useParams();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const chatWindowRef = useRef(null);
    const intervalIdRef = useRef(null);
    const teacherid = localStorage.getItem("teacherid");

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            fetchMessages();
            startPolling();
        } else {
            stopPolling();
        }
        return () => stopPolling(); // Clean up polling on unmount
    }, [selectedCourse]);

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchCourses = async () => {
        try {
            const response = await axios.get(`${config.base_url}/courses/?tuserid=${teacherid}`);
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const fetchMessages = async () => {
        if (selectedCourse) {
            try {
                const response = await axios.get(`${config.base_url}/coursemessages/${selectedCourse.id}/`);
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        }
    };

    const startPolling = () => {
        stopPolling();
        intervalIdRef.current = setInterval(fetchMessages, 5000);
    };

    const stopPolling = () => {
        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
        }
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() === '' || !selectedCourse) return;

        try {
            await axios.post(`${config.base_url}/coursemessages/`, {
                message: newMessage,
                course: selectedCourse.id,
                sent_by: teacherid,
            });
            setNewMessage('');
            fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };



    return (
        <div className="flex">
            <TeacherSidebar userid={userid} />

            <div className="flex h-dvh overflow-hidden bg-gray-100 flex-1">
                <div className="w-1/4 bg-[#1D2026] border-r ">
                    <div className="p-4 bg-[#FF6636] text-white">
                        <h2 className="text-2xl font-bold">Courses</h2>
                    </div>
                    <ul className="h-full overflow-y-scroll">
                        {courses.map(course => (
                            <li
                                key={course.id}
                                onClick={() => setSelectedCourse(course)}
                                className={`p-4 cursor-pointer hover:bg-gray-100 ${selectedCourse?.id === course.id ? 'bg-gray-200' : ''}`}
                            >
                                <div className={`font-semibold ${selectedCourse?.id === course.id ? 'text-gray-900' : 'text-gray-200'}`}>{course.course_name}</div>
                                <div className="text-sm text-gray-500">Last message preview...</div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex-1 flex flex-col">
                    {selectedCourse ? (
                        <>
                            <div className="p-4 bg-[#FF6636] text-white flex items-center">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${selectedCourse.course_name}`}
                                    alt={selectedCourse.course_name}
                                    className="w-10 h-10 rounded-full mr-3"
                                />
                                <h2 className="text-xl font-bold">{selectedCourse.course_name}</h2>
                            </div>
                            <div ref={chatWindowRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sent_by.id == teacherid ? 'justify-end' : 'justify-start'} mb-4`}
                                    >
                                        <img
                                            src={config.base_url + msg.sent_by.profileimage}
                                            alt={`${msg.sent_by.name}'s profile`}
                                            className="w-8 h-8 rounded-full mr-3 self-end"
                                        />
                                        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg shadow bg-white`}>
                                            <div className="font-semibold text-sm mb-1 text-[#FF6636]">{msg.sent_by.name}</div>
                                            <p className="text-gray-800">{msg.message}</p>
                                            <div className="text-xs text-gray-400 text-right mt-2">
                                                {new Date(msg.sent_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>

                                    </div>
                                ))}

                            </div>

                            <div className="p-4 bg-gray-200">
                                <div className="flex items-center bg-white rounded-full px-4 py-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="flex-1 outline-none"
                                        placeholder="Type a message"
                                    />

                                    <button onClick={handleSendMessage} className="text-[#FF6636]">
                                        <FaPaperPlane />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            Select a course to view messages
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TeacherMessages;
