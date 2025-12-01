
# 🎓 AttendEase Frontend

> Comprehensive documentation for the AttendEase Frontend application.  
> Author: **Mohd Waris**

---

## 📌 Overview

This is the frontend repository for the **AttendEase**, an integrated web application designed to streamline academic interactions for both **students** and **faculty**.

✨ Features:  
- Dedicated dashboards for teachers and students  
- Attendance management & performance monitoring  
- Course enrollment access  
- Personalized event feed and academic calendar  

The application is built using **React** as a Single-Page Application (SPA), with **Material-UI (MUI)** for a consistent and professional design.

---

## 🚀 Technology Stack

| Category            | Technology                           | Purpose                                             |
|---------------------|--------------------------------------|-----------------------------------------------------|
| Frontend Framework  | React                                | Core UI library for dynamic components              |
| Styling             | Material-UI (MUI)                    | Modern UI component design                          |
| Routing             | react-router-dom                     | Client-side navigation                              |
| State Management    | React Hooks (useState, useEffect, useMemo) | Local state & logic handling                 |
| Date Handling       | dayjs                                | Calendar & date formatting                          |
| Data Export         | xlsx                                 | Downloading attendance reports as Excel             |

---

## 🛠️ Project Structure

```bash

src/
├── Components/
│   ├── Login/
│   │   ├── Login.jsx
│   │   ├── ForgotPassword.jsx
│   │   └── ResetPassword.jsx
│   ├── Student/
│   │   ├── Assignments/
│   │   │   └── Assignments.jsx
│   │   ├── CalendarPage/
│   │   │   └── StudentCalendarPage.jsx
│   │   ├── Courses/
│   │   │   └── CoursesComponent.jsx
│   │   ├── DashboardPage/
│   │   │   ├── DashboardStudent.jsx
│   │   │   └── StudentAttendanceProgressBar.jsx
│   │   ├── Drawer/
│   │   │   ├── MiniDrawerStudent.jsx
│   │   │   ├── SideDrawer.jsx
│   │   │   └── TopDrawer.jsx
│   │   └── Settings/
│   │       └── SettingsStudent.jsx
│   └── Teacher/
│       ├── Attendance/
│       │   ├── Attendance.jsx
│       │   ├── AttendanceContent.jsx
│       │   ├── AttendanceTable.jsx
│       │   └── DownloadAttendanceDialog.jsx
│       ├── Dashboard/
│       │   ├── Drawer/
│       │   │   ├── MiniDrawer.jsx
│       │   │   └── TopBar.jsx
│       │   └── DashboardContent.jsx
│       ├── CreateEvents/
│       │   └── CreateEvents.jsx
│       ├── EventsFeed/
│       │   └── EventsFeed.jsx
│       ├── Students/
│       │   └── Students.jsx
│       ├── Notification/
│       │   └── Notifications.jsx
│       └── Settings/
│           └── SettingsTeacher.jsx
├── config.js        # Contains API_URL
├── App.jsx          # Routing
└── main.jsx         # Entry Point

```

---

## ⚙️ Local Setup & Installation

### 🔹 Prerequisites

- Node.js (LTS recommended)  
- Backend API instance running (required for API_URL and data fetching)  

---

### 🔹 Installation Steps

```bash
git clone https://github.com/Mohammad-Waris/AttendEase_Frontend
cd university-portal-frontend
npm install
# If xlsx isn’t installed automatically:
# npm install xlsx
````

Configure backend API URL:

```js
// src/config.js
export const API_URL = "http://127.0.0.1:8000/api";
```

Start the development server:

```bash
npm run dev
# or
npm start
```

The application should open automatically at:
`http://localhost:5173`

---

## 🌐 Application Routing

| Path                    | Component           | Role    | Description                          |
| ----------------------- | ------------------- | ------- | ------------------------------------ |
| `/`                     | Login               | Public  | Authentication entry point           |
| `/forgotPassword`       | ForgotPassword      | Public  | Password reset initiation            |
| `/reset/:uid/:token`    | ResetPassword       | Public  | Password update via token            |
| `/teacher`              | MiniDrawer          | Teacher | Main teacher dashboard               |
| `/teacher/attendance`   | Attendance          | Teacher | Attendance management module         |
| `/teacher/createEvents` | CreateEvents        | Teacher | Event creation (work-in-progress)    |
| `/teacher/eventsFeed`   | EventsFeed          | Teacher | Events/news feed for teachers        |
| `/teacher/students`     | Students            | Teacher | View assigned students               |
| `/teacher/settings`     | SettingsTeacher     | Teacher | Teacher settings (work-in-progress)  |
| `/student`              | MiniDrawerStudent   | Student | Main student dashboard               |
| `/student/myCourses`    | CoursesComponent    | Student | View enrolled courses                |
| `/student/calendar`     | StudentCalendarPage | Student | Attendance calendar view             |
| `/student/assignments`  | Assignments         | Student | Assignment module (work-in-progress) |
| `/student/settings`     | SettingsStudent     | Student | Student settings (work-in-progress)  |

---

