import { createBrowserRouter } from "react-router";
import { Login } from "./pages/Login";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Inventory } from "./pages/Inventory";
import { Loans } from "./pages/Loans";
import { Maintenance } from "./pages/Maintenance";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "inventory",
        element: <Inventory />,
      },
      {
        path: "loans",
        element: <Loans />,
      },
      {
        path: "maintenance",
        element: <Maintenance />,
      },
    ],
  },
]);
