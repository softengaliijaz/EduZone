import React from "react";
import { BookOpen, FileText, GraduationCap, Shield, Users } from "lucide-react";

const AdminDashboardStatsCards = ({
  studentsCount = 0,
  instructorsCount = 0,
  coursesCount = 0,
  blogsCount = 0,
  adminsCount = 0,
  loading = false,
  variant = "admin",
}) => {
  const stats = variant === "instructor"
    ? [
        { label: "My students", value: studentsCount, icon: Users },
        { label: "My courses", value: coursesCount, icon: BookOpen },
        { label: "Lessons", value: blogsCount, icon: FileText },
        { label: "Assignments", value: adminsCount, icon: GraduationCap },
      ]
    : [
        { label: "Students", value: studentsCount, icon: Users },
        { label: "Instructors", value: instructorsCount, icon: GraduationCap },
        { label: "Courses", value: coursesCount, icon: BookOpen },
        { label: "Articles", value: blogsCount, icon: FileText },
        { label: "Administrators", value: adminsCount, icon: Shield },
      ];

  return (
    <section className={`admin-stats admin-stats--${variant}`} aria-label={variant === "admin" ? "Platform totals" : "Teaching totals"}>
      {stats.map((stat) => (
        <article className="admin-stat" key={stat.label}>
          <span className="admin-stat__icon">{React.createElement(stat.icon, { size: 18, "aria-hidden": true })}</span>
          <div className="admin-stat__copy">
            <span>{stat.label}</span>
            <strong>{loading ? "—" : stat.value}</strong>
          </div>
        </article>
      ))}
    </section>
  );
};

export default AdminDashboardStatsCards;
