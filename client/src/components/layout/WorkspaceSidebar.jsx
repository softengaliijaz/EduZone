import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Award,
  BookOpen,
  Compass,
  FileText,
  GraduationCap,
  Home,
  MessageCircle,
  Settings,
  Users,
} from "lucide-react";

const roleNavigation = {
  admin: [
    {
      label: "Workspace",
      items: [
        ["/admin/dashboard-page", "Overview", Home],
        ["/admin/courses-management/get-all-courses", "Courses", BookOpen],
      ],
    },
    {
      label: "People",
      items: [
        ["/admin/get-all-students", "Students", Users],
        ["/admin/get-all-instructors", "Instructors", GraduationCap],
      ],
    },
    {
      label: "Content",
      items: [["/admin/blog/get-all-blogs", "Articles", FileText]],
    },
    { label: "Account", items: [["/admin/settings", "Settings", Settings]] },
  ],
  instructor: [
    {
      label: "Workspace",
      items: [
        ["/instructor/instructor-dashboard-page", "Overview", Home],
        [
          "/instructor/courses-management/get-all-courses",
          "My courses",
          BookOpen,
        ],
        [
          "/instructor/courses-management/create-course",
          "Create course",
          Compass,
        ],
      ],
    },
    {
      label: "Account",
      items: [["/instructor/settings", "Settings", Settings]],
    },
  ],
  student: [
    {
      label: "Learning",
      items: [
        ["/user/learning-room", "My learning", GraduationCap],
        ["/user/explore-courses", "Explore courses", Compass],
        ["/user/certificates", "Certificates", Award],
        ["/user/community", "Community", MessageCircle],
      ],
    },
    { label: "Account", items: [["/user/settings", "Settings", Settings]] },
  ],
};

const WorkspaceSidebar = ({ role, open = false, onNavigate }) => {
  const { pathname } = useLocation();
  return <>
    {open && (
      <button
        type="button"
        className="workspace-backdrop"
        aria-label="Close navigation"
        onClick={onNavigate}
      />
    )}
    <aside
      id="workspace-navigation"
      className="workspace-sidebar"
      data-open={open}
      aria-label="Workspace navigation"
    >
      {!role && (
        <p className="workspace-sidebar__eyebrow" role="status">
          Loading your navigation…
        </p>
      )}
      {roleNavigation[role]?.map((group) => (
        <section className="workspace-sidebar__group" key={group.label}>
          <h2 className="workspace-sidebar__eyebrow">{group.label}</h2>
          <nav aria-label={group.label}>
            {group.items.map(([to, label, icon]) => (
              <NavLink
                className={({ isActive }) =>
                  isActive ||
                  ((label === "Courses" && pathname.includes("/courses-management/")) ||
                    (label === "My courses" &&
                      pathname.includes("/courses-management/") &&
                      !pathname.endsWith("/create-course")))
                    ? "workspace-sidebar__link is-active"
                    : "workspace-sidebar__link"
                }
                to={to}
                key={to}
                onClick={onNavigate}
                end={
                  to.endsWith("dashboard-page") || to.endsWith("learning-room")
                }
              >
                {React.createElement(icon, {
                  size: 17,
                  strokeWidth: 1.8,
                  "aria-hidden": true,
                })}
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </section>
      ))}
    </aside>
  </>;
};

export default WorkspaceSidebar;
