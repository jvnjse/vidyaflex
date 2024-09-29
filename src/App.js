import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import LandingPage from "./pages/landing/LandingPage.jsx";
import LandingPage from "./pages/landing/Landing";
import Courses from "./pages/courses/Courses.jsx";
import SingleCourse from "./pages/single_course/SingleCourse.jsx";
import AuthForm from "./pages/auth/AuthForm.jsx";
import SelectRole from "./pages/role/SelectRole.jsx";
import StudentDetails from "./pages/add-details/StudentDetails.jsx";
import TeacherDetails from "./pages/add-details/TeacherDetails.jsx";
import MyCourses from "./pages/Teacher dashboard/MyCourses.jsx";
import StudentCourses from "./pages/studentDashboard/StudentCourses.jsx";
import TeacherMessages from "./pages/Teacher dashboard/TeacherMessages.jsx";
import TeacherProfile from "./pages/Teacher dashboard/TeacherProfile.jsx";
import StudentMessage from "./pages/studentDashboard/StudentMessage.jsx";
import StudentProfile from "./pages/studentDashboard/StudentProfile.jsx";
import TutorProfile from "./pages/instructor/TutorProfile.jsx";
import Assignments from "./pages/assignments/Assignments.jsx";
import TeacherAssignments from "./pages/Teacher dashboard/TeacherAssignments.jsx";
import StudentAssignments from "./pages/studentDashboard/StudentAssignments.jsx";
import SubmittedAssignments from "./pages/Teacher dashboard/SubmittedAssignments.jsx";
import NotFound from "./NotFound.jsx";
import { roleCheck } from "./utils/access_check.js";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseid" element={<SingleCourse />} />
          <Route path="/auth" element={<AuthForm />} />
          <Route path="/select-role/:userid" element={<SelectRole />} />
          <Route path="/student-details/:userid" element={<StudentDetails />} />
          <Route path="/teacher-details/:userid" element={<TeacherDetails />} />
          <Route path="/teacher-profile/:userid" element={<TutorProfile />} />
          {roleCheck() ? (
            <Route path="/tutor">
              <Route path="courses/:userid" element={<MyCourses />}></Route>
              <Route
                path="messages/:userid"
                element={<TeacherMessages />}
              ></Route>
              <Route
                path="profile/:userid"
                element={<TeacherProfile />}
              ></Route>
              <Route
                path="assignments/:userid"
                element={<TeacherAssignments />}
              ></Route>
              <Route
                path="create/assignments/:userid"
                element={<Assignments />}
              ></Route>
            </Route>
          ) : (
            <Route path="/student">
              <Route
                path="courses/:userid"
                element={<StudentCourses />}
              ></Route>
              <Route
                path="message/:userid"
                element={<StudentMessage />}
              ></Route>
              <Route
                path="profile/:userid"
                element={<StudentProfile />}
              ></Route>
              <Route
                path="assignments/:userid"
                element={<StudentAssignments />}
              ></Route>
            </Route>
          )}
          <Route
            path="/assignments/:assignmentId/submissions"
            element={<SubmittedAssignments />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      {/* <LandingPage /> */}
      {/* <Courses /> */}
      {/* <SingleCourse /> */}
    </>
  );
}

export default App;
