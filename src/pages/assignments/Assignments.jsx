import React from 'react'
import TeacherSidebar from '../Teacher dashboard/TeacherSidebar'
import CreateAssignment from './CreateAssignments'

function Assignments() {
    return (
        <div className='flex'>
            <TeacherSidebar />
            <CreateAssignment />
        </div>
    )
}

export default Assignments