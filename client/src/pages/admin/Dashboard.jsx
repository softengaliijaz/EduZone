import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, FileText, GraduationCap, Plus, Users } from "lucide-react";
import { fetchCourses } from "../../features/admin/courseSlice";
import { fetchBlogs } from "../../features/admin/blogSlice";
import { fetchAdminAnalytics } from "../../features/analytics/analyticsSlice";
import AdminDashboardStatsCards from "../../components/admin/AdminStatsCards";
import AdminDashboardCourses from "../../components/admin/AdminDashboardCourses";
import AdminDashboardBlogs from "../../components/admin/AdminDashboardBlogs";
import DeferredDashboardCharts from "../../components/admin/DeferredDashboardCharts";

const quickLinks = [
  { label: "Manage courses", to: "/admin/courses-management/get-all-courses", icon: BookOpen },
  { label: "Students", to: "/admin/get-all-students", icon: Users },
  { label: "Instructors", to: "/admin/get-all-instructors", icon: GraduationCap },
  { label: "Articles", to: "/admin/blog/get-all-blogs", icon: FileText },
];

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { courses = [], loading: coursesLoading, error: coursesError } = useSelector((state) => state.course);
  const { blogs = [], loading: blogsLoading, error: blogsError } = useSelector((state) => state.blogs);
  const { admin: analytics, loading: analyticsLoading, error: analyticsError } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchBlogs());
    dispatch(fetchAdminAnalytics());
  }, [dispatch]);

  const counts = analytics?.counts || {};
  const trends = analytics?.trends || {};

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard__header">
        <div>
          <p className="admin-dashboard__eyebrow">EDUZONE · ADMINISTRATION</p>
          <h1>Good to see you, {user?.name?.split(" ")[0] || "Admin"}</h1>
          <p>Manage your learning platform and review its latest activity.</p>
        </div>
        <Link className="btn btn-primary" to="/admin/courses-management/create-course">
          <Plus size={17} aria-hidden="true" /> Create course
        </Link>
      </header>

      <AdminDashboardStatsCards
        variant="admin"
        loading={analyticsLoading || !analytics}
        studentsCount={counts.students ?? 0}
        instructorsCount={counts.instructors ?? 0}
        coursesCount={counts.courses ?? courses.length}
        blogsCount={counts.blogs ?? blogs.length}
        adminsCount={counts.admins ?? 0}
      />

      <nav className="admin-quick-links" aria-label="Admin shortcuts">
        {quickLinks.map(({ label, to, icon }) => (
          <Link to={to} className="admin-quick-link" key={to}>
            <span className="admin-quick-link__icon">{React.createElement(icon, { size: 17, "aria-hidden": true })}</span>
            <span>{label}</span>
            <ArrowRight className="admin-quick-link__arrow" size={15} aria-hidden="true" />
          </Link>
        ))}
      </nav>

      {analyticsError && !analytics && <p className="admin-dashboard__notice" role="status">Analytics are temporarily unavailable. Counts will appear when the analytics service responds.</p>}

      <DeferredDashboardCharts
        userTrend={trends.users || []}
        enrollmentTrend={trends.enrollments || []}
      />

      <div className="admin-dashboard__content-grid">
        <AdminDashboardCourses
          courses={courses}
          loading={coursesLoading}
          error={coursesError}
          onRetry={() => dispatch(fetchCourses())}
        />
        <AdminDashboardBlogs
          blogs={blogs}
          loading={blogsLoading}
          error={blogsError}
          onRetry={() => dispatch(fetchBlogs())}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
