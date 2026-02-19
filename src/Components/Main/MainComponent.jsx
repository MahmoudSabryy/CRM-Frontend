import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

export default function Main({ userData, logOut }) {
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
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

          <NavLink to="/report" className={navItemClass}>
            📈 {sidebarOpen && "Reports"}
          </NavLink>

          <NavLink to="/settings" className={navItemClass}>
            ⚙️ {sidebarOpen && "Settings"}
          </NavLink>
        </nav>
      </aside>

      {/* Main Section */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-gray-900 text-xl"
            >
              ☰
            </button>

            <div className="hidden md:block">
              <input
                type="text"
                placeholder="Search..."
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-6 relative">
            {/* Notifications */}
            <div className="relative cursor-pointer">
              <span className="text-xl">🔔</span>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                3
              </span>
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-full">
                  {userData?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block text-gray-700 font-medium">
                  {userData?.role}
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-40 bg-white border rounded-lg shadow-lg py-2">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <a
                    href="/settings"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Settings
                  </a>
                  <button
                    onClick={() => {
                      logOut();
                      navigate("/login");
                    }}
                    className="block px-4 py-2 text-red-500 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
