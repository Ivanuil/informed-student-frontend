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
import InitialPanel from "./components/sidebar/InitialPanel";
import SignInForm from './components/signIn/SignInForm';
import MainPage from './components/sidebar/MainPage';
import SignUpForm from './components/signUp/SignUpForm';
import ProtectedRoute from './services/protectedRoute';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: "main",
        element: <ProtectedRoute><MainPage /></ProtectedRoute>,
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
          }
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
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
