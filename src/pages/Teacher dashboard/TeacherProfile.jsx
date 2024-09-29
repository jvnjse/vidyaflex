import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import TeacherSidebar from './TeacherSidebar';
import config from '../../config';
import courseimage from '../../assets/course.webp';

const TeacherProfile = () => {
    const [teacher, setTeacher] = useState(null);
    const [courses, setCourses] = useState([]);
    const [ongoingCourses, setOngoingCourses] = useState([]);
    const [completedCourses, setCompletedCourses] = useState([]);
    const [skills, setSkills] = useState([]);
    const [activeTab, setActiveTab] = useState('ongoing'); // 'ongoing' or 'completed'
    const { userid } = useParams();
    const teacherid = localStorage.getItem("teacherid");

    useEffect(() => {
        const fetchTeacherData = async () => {
            try {
                const response = await axios.get(`${config.base_url}/teacher/${teacherid}/`);
                setTeacher(response.data);
            } catch (error) {
                console.error('Failed to fetch teacher data:', error);
            }
        };

        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${config.base_url}/courses/?tuserid=${teacherid}`);
                const allCourses = response.data;
                const currentDate = new Date();

                // Filter ongoing and completed courses
                const ongoing = allCourses.filter(course => new Date(course.course_end_date) >= currentDate);
                const completed = allCourses.filter(course => new Date(course.course_end_date) < currentDate);

                setOngoingCourses(ongoing);
                setCompletedCourses(completed);

                // Aggregate skills
                const allSkills = allCourses.reduce((acc, course) => {
                    course.skills.forEach(skill => {
                        if (!acc.includes(skill.skill_name)) {
                            acc.push(skill.skill_name);
                        }
                    });
                    return acc;
                }, []);

                setSkills(allSkills);
                setCourses(allCourses);
            } catch (error) {
                console.error('Failed to fetch courses:', error);
            }
        };

        fetchTeacherData();
        fetchCourses();
    }, [userid]);

    if (!teacher) {
        return <div>Loading...</div>; // or a loading spinner
    }

    const activeCourses = activeTab === 'ongoing' ? ongoingCourses : completedCourses;

    return (
        <div className='flex'>
            <TeacherSidebar userid={userid} />
            <div className="bg-white md:mx-auto rounded shadow-xl w-full overflow-y-scroll h-dvh px-10">
                <div className="px-5 py-2 flex flex-col gap-3 pb-6">
                    <div className="h-[90px] shadow-md w-[90px] rounded-full border-4 overflow-hidden border-white">
                        <img
                            src={config.base_url + teacher.profileimage}
                            alt={teacher.name}
                            className="w-full h-full rounded-full object-center object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="text-xl text-slate-900 relative font-bold leading-6">{teacher.name}</h3>
                        <p className="text-sm text-gray-600">{teacher.email}</p>
                        <p className="text-sm text-gray-600">{teacher.phonenumber}</p>
                    </div>
                    <h4 className="text-md font-medium leading-3">Skills</h4>
                    <div className="flex gap-3 flex-wrap">
                        {skills.map(skill => (
                            <span key={skill} className="rounded-sm bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                                {skill}
                            </span>
                        ))}
                    </div>

                    <h4 className="text-md font-medium leading-3">About</h4>
                    <p className="text-sm text-stone-500">{teacher.bio}</p>

                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={() => setActiveTab('ongoing')}
                            className={`py-2 px-4 rounded ${activeTab === 'ongoing' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Ongoing Courses
                        </button>
                        <button
                            onClick={() => setActiveTab('completed')}
                            className={`py-2 px-4 rounded ${activeTab === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Completed Courses
                        </button>
                    </div>

                    <div className="flex flex-col gap-4 mt-4">
                        {activeCourses.map(course => (
                            <Link key={course.id} className="bg-white p-4 rounded-lg shadow" to={`/courses/${course.id}`}>
                                <img
                                    src={course.course_profile ? config.base_url + course.course_profile : courseimage}
                                    alt={course.course_name}
                                    className="w-full h-32 object-cover rounded-md"
                                />
                                <div className="mt-4">
                                    <h3 className="text-lg font-medium text-gray-800">{course.course_name}</h3>
                                    <p className="text-sm text-gray-500">{course.course_description}</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-gray-600">{course.course_rating ? `${course.course_rating}★` : 'No ratings'}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">{course.students.length} students</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherProfile;
