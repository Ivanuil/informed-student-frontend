import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import SubjectPanel from "./components/subjectPanel/SubjectPanel";
import FolderPanel from "./components/folderPanel/FolderPanel";
import NotFound from "./components/errorPages/NotFound";
import PostFeed from "./components/postFeed/PostFeed";
import InitialPanel from "./components/mainPage/InitialPanel";
import SignInForm from './components/signIn/SignInForm';
import MainPage from './components/mainPage/MainPage';
import SignUpForm from './components/signUp/SignUpForm';
import ProtectedRoute from './services/ProtectedRoute';
import Profile from './components/profile/Profile';
import Layout from './components/mainPage/layout/Layout';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import ViewProfile from './components/profile/ViewProfile';
import AdminControlsPanel from "./components/admin/AdminControlsPanel";
import Users from "./components/users/Users";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <ProtectedRoute><Layout /></ProtectedRoute>,
        children: [
          {
            path: "main",
            element: <MainPage />,
            children: [
              {
                index: true,
                element: <InitialPanel />
              },
              {
                path: "courses/:course",
                element: <SubjectPanel />
              },
              {
                path: "courses/:course/subjects/:subjectId",
                element: <FolderPanel />
              },
              {
                path: "courses/:course/subjects/:subjectId/folders/:folderId",
                element: <PostFeed />
              },
              {
                path: "profile",
                element: <Profile />
              }
            ]
          },
          {
            path: "profile",
            element: <Profile />
          },
          {
            path: "users/:username",
            element: <ViewProfile />
          },
          {
            path: "admin/controls",
            element: <ProtectedRoute allowedRoles={['ADMIN']}><AdminControlsPanel /></ProtectedRoute>
          },
          {
            path: "admin/users",
            element: <ProtectedRoute allowedRoles={['ADMIN']}><Users /></ProtectedRoute>
          },
        ]
      },
      {
        path: "login",
        element: <SignInForm />
      },
      {
        path: "signup",
        element: <SignUpForm />
      },
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <RouterProvider router={router} />
    </LocalizationProvider>
  </React.StrictMode>
);

reportWebVitals();
