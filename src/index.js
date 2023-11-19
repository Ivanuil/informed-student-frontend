import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import SubjectPanel from "./components/subjectPanel/SubjectPanel";
import FolderPanel from "./components/folderPanel/FolderPanel";
import NotFound from "./components/errorPages/NotFound";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: "courses/:course",
        element: <SubjectPanel />
      },
      {
        path: "courses/:course/subjects/:subjectId/*",
        element: <FolderPanel />
      }
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
