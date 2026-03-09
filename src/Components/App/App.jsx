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
import LeadDetails from "../Lead Details/LeadDetails";
import ProfileComponent from "../Profile/ProfileComponent";
import ContactDetails from "../Contact Details/ContactDetails";
import DealDetailsComponent from "../Deal Details/DealDetailsComponent";
import ProtectedRoute from "../Protected Route/ProtectedRoute";
import { AuthProvider } from "../../Context/Auth Context/AuthContext";
import SettingsComponent from "../Settings/SettingsComponent";
import NotFoundcomponent from "../Not found/Notfoundcomponent";

export default function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Main />,
      errorElement:<NotFoundcomponent/>,
      children: [
        {
          path: "/",
          element: (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "dashboard",

          element: (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <ProfileComponent />
            </ProtectedRoute>
          ),
        },
        {
          path: "lead",
          element: (
            <ProtectedRoute>
              <LeadComponent />
            </ProtectedRoute>
          ),
        },

        {
          path: "contact",
          element: (
            <ProtectedRoute>
              <ContactComponent />
            </ProtectedRoute>
          ),
        },
        {
          path: "deal",
          element: (
            <ProtectedRoute>
              <DealComponent />
            </ProtectedRoute>
          ),
        },
        {
          path: "activity",
          element: (
            <ProtectedRoute>
              <ActivityComponent />
            </ProtectedRoute>
          ),
        },

        {
          path: "lead/:id",
          element: (
            <ProtectedRoute>
              <LeadDetails />
            </ProtectedRoute>
          ),
        },
        {
          path: "contact/:id",
          element: (
            <ProtectedRoute>
              <ContactDetails />
            </ProtectedRoute>
          ),
        },
        {
          path: "settings",
          element: (
            <ProtectedRoute>
              <SettingsComponent />
            </ProtectedRoute>
          ),
        },
        {
          path: "deal/:id",
          element: (
            <ProtectedRoute>
              <DealDetailsComponent />
            </ProtectedRoute>
          ),
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
    <AuthProvider>
      <Toaster position="top-center" />
      <RouterProvider router={routes} />
    </AuthProvider>
  );
}
