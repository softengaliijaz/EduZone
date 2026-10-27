import React from "react";
import { UserIcon } from "./TabIcons";

const tabs = [{ id: "profile", label: "Profile", icon: UserIcon }];

const Sidebar = ({ activeTab, setActiveTab }) => (
  <aside className="w-full md:w-64 bg-white border-r px-4 py-6">
    <h2 className="text-xl font-semibold mb-6 text-[#1C1E53]">Settings</h2>
    <nav className="space-y-2">
      {tabs.map(({ id, label, icon }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={`flex items-center gap-2 w-full px-3 py-2 rounded-md text-left hover:bg-blue-100 ${
            activeTab === id
              ? "bg-blue-100 text-blue-600 font-medium"
              : "text-gray-700"
          }`}
        >
          {React.createElement(icon, { className: "w-5 h-5" })}
          {label}
        </button>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
