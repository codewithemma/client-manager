import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import ClientDetail from "./pages/ClientDetail.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";

// 1. Define your routes in an array
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />, // Acts as the layout wrapper
    children: [
      {
        index: true, // Default page for path "/"
        element: <Dashboard />,
      },
      {
        path: "ClientDetail", // Matches "/about"
        element: <ClientDetail />,
      },
    ],
  },
]);

// 2. Render using RouterProvider
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
