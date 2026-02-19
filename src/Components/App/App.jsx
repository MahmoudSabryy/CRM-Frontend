import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LeadComponent from "../Lead/LeadComponent";
import Logincomponent from "../Auth/Login/Logincomponent";
import RegisterComponent from "../Auth/Register/Registercomponent";
import ContactComponent from "../Contact/ContactComponent";
import DealComponent from "../Deal/DealComponent";
import Main from "../Main/MainComponent";
import Dashboard from "../Dashboard/Dashboard";
import ActivityComponent from "../Activity/ActivityComponent";
import ReportsComponent from "../Reports/ReportsComponent";
import LeadDetails from "../Lead Details/LeadDetails";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import ProfileComponent from "../Profile/ProfileComponent";
import ContactDetails from "../Contact Details/ContactDetails";
import DealDetailsComponent from "../Deal Details/DealDetailsComponent";

export default function App() {
  const userData = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const data = jwtDecode(token);
    return data;
  };

  const logOut = () => {
    localStorage.removeItem("token");
  };
  useEffect(() => {
    userData();
  }, []);
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Main userData={userData()} logOut={logOut} />,
      children: [
        {
          path: "/",
          element: <Dashboard userData={userData()} />,
        },
        {
          path: "dashboard",
          element: <Dashboard userData={userData()} />,
        },
        {
          path: "profile",
          element: <ProfileComponent userData={userData()} />,
        },
        {
          path: "lead",
          element: <LeadComponent userData={userData()} />,
        },

        {
          path: "contact",
          element: <ContactComponent userData={userData()} />,
        },
        {
          path: "deal",
          element: <DealComponent userData={userData()} />,
        },
        {
          path: "activity",
          element: <ActivityComponent userData={userData()} />,
        },
        {
          path: "report",
          element: <ReportsComponent userData={userData()} />,
        },
        {
          path: "lead/:id",
          element: <LeadDetails userData={userData()} />,
        },
        {
          path: "contact/:id",
          element: <ContactDetails userData={userData()} />,
        },
        {
          path: "deal/:id",
          element: <DealDetailsComponent userData={userData()} />,
        },
      ],
    },

    {
      path: "login",
      element: <Logincomponent />,
    },
    {
      path: "register",
      element: <RegisterComponent />,
    },
  ]);

  return (
    <>
      <Toaster position="top-center" />
      <RouterProvider router={routes} />
    </>
  );
}
