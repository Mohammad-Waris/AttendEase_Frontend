import React from "react";
import Login from "./Components/Login/Login";
import ForgotPassword from "./Components/Login/ForgotPassword";
import ResetPassword from "./Components/Login/ResetPassword";
import MiniDrawer from "./Components/Teacher/Dashboard/Drawer/MiniDrawer";
import Attendance from "./Components/Teacher/Attendance/Attendance";
import CreateEvents from "./Components/Teacher/CreateEvents/CreateEvents";
import EventsFeed from "./Components/Teacher/EventsFeed/EventsFeed";
import Students from "./Components/Teacher/Students/Students";
import MiniDrawerStudent from "./Components/Student/Drawer/MiniDrawerStudent";
import StudentCalendarPage from "./Components/Student/CalendarPage/StudentCalendarPage";
import CoursesComponent from "./Components/Student/Courses/CoursesComponent";
import Assignments from "./Components/Student/Assignments/Assignments";
import SettingsStudent from "./Components/Student/Settings/SettingsStudent";
import Notifications from "./Components/Teacher/Notification/Notification";
import SettingsTeacher from "./Components/Teacher/Settings/SettingsTeacher";
import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/reset/:uid/:token",
    element: <ResetPassword />,
  },
  {
    path: "/forgotPassword",
    element: <ForgotPassword />,
  },
  {
    path: "/teacher",
    element: <MiniDrawer />,
  },
  {
    path: "/teacher/attendance",
    element: <Attendance />,
  },
  {
    path: "/teacher/createEvents",
    element: <CreateEvents />,
  },
  {
    path: "/teacher/eventsFeed",
    element: <EventsFeed />, // CORRECTED: Changed from CreateEvents to EventsFeed
  },
  {
    path: "/teacher/students",
    element: <Students />,
  },
  {
    path: "/teacher/notifications",
    element: <Notifications />,
  },
  {
    path: "/teacher/settings",
    element: <SettingsTeacher />,
  },
  {
    path: "/student",
    element: <MiniDrawerStudent />,
  },
  {
    path: "/student/myCourses",
    element: <CoursesComponent />,
  },
  {
    path: "/student/calendar",
    element: <StudentCalendarPage />,
  },
  {
    path: "/student/assignments",
    element: <Assignments />,
  },
  {
    path: "/student/settings",
    element: <SettingsStudent />,
  },
]);
function App() {

  return (
    <>
      <RouterProvider router={router} />
      {/* <MiniDrawer></MiniDrawer> */}{" "}
    </>
  );
}

export default App;
