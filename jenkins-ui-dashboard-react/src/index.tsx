import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./fonts.css";

import Login from "./routes/login";
import Dashboard from "./routes/dashbord"
import Integration from "./routes/integration"
import Conector from "./routes/conector"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/integration",
    element: <Integration />,
  },
  {
    path: "/conector",
    element: <Conector />,
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);