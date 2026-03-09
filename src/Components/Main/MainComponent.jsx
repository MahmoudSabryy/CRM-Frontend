import { useContext, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/Auth Context/AuthContext";
import { ThemeContext } from "../../Context/Theme/ThemeContext";

export default function Main() {
  const { userData, logOut } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200
     ${
       isActive
         ? "bg-blue-600 text-white"
         : "text-gray-300 hover:bg-gray-700 hover:text-white"
     }`;

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gray-900 dark:bg-black text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gray-800">
          <h1 className="text-xl font-bold">
            {sidebarOpen ? "CRM System" : "CRM"}
          </h1>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          <NavLink to="/dashboard" className={navItemClass}>
            📊 {sidebarOpen && "Dashboard"}
          </NavLink>

          <NavLink to="/lead" className={navItemClass}>
            🎯 {sidebarOpen && "Leads"}
          </NavLink>

          <NavLink to="/contact" className={navItemClass}>
            👥 {sidebarOpen && "Contacts"}
          </NavLink>

          <NavLink to="/deal" className={navItemClass}>
            💼 {sidebarOpen && "Deals"}
          </NavLink>

          <NavLink to="/activity" className={navItemClass}>
            ✨ {sidebarOpen && "Activities"}
          </NavLink>

          {/* <NavLink to="/settings" className={navItemClass}>
            ⚙️ {sidebarOpen && "Settings"}
          </NavLink> */}
        </nav>
      </aside>

      {/* Main Section */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-gray-800 shadow flex items-center justify-between px-6 transition-colors duration-300">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 dark:text-gray-300 text-xl"
            >
              ☰
            </button>
          </div>

          {/* Right */}
          <div className="flex items-center gap-6 relative">
            {/* 🌙 Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white transition"
            >
              {darkMode ? "🌙" : "☀️"}
            </button>



            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-full">
                  {userData?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block text-gray-700 dark:text-gray-200 font-medium">
                  {userData?.role}
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-40 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg py-2">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Profile
                  </Link>

                  {/* <Link
                    to="/settings"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Settings
                  </Link> */}

                  <button
                    onClick={() => {
                      logOut();
                      navigate("/login");
                    }}
                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
