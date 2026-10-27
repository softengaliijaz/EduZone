import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../../features/admin/courseSlice";
import { fetchInstructorAnalytics } from "../../features/analytics/analyticsSlice";
import UserProfileCard from "../../components/admin/UserProfileCard";
import AdminDashboardStatsCards from "../../components/admin/AdminStatsCards";
import AdminCoursesGrid from "../../components/admin/AdminDashboardCourses";
import { DashboardCharts } from "../../components/admin/DashboardCharts";

const InstructorDashboard = () => {
  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector((state) => state.course);
  const { instructor: analytics } = useSelector((state) => state.analytics);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchInstructorAnalytics());
  }, [dispatch]);

  const instructorCourses = (courses || []).filter((course) => {
    const creatorId =
      typeof course.courseCreatedBy === "object"
        ? course.courseCreatedBy?._id
        : course.courseCreatedBy;
    return creatorId === user?._id;
  });

  const counts = analytics?.counts || {};
  const trends = analytics?.trends || {};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-col md:flex-row flex-1">
        <main className="flex-1 p-4 md:p-8 space-y-6">
          <UserProfileCard />
          <AdminDashboardStatsCards
            variant="instructor"
            studentsCount={counts.students || counts.enrollments || 0}
            instructorsCount={1}
            coursesCount={counts.courses || instructorCourses.length}
            blogsCount={counts.lessons || 0}
            adminsCount={counts.assignments || 0}
          />
          <DashboardCharts
            userTrend={trends.courses || []}
            enrollmentTrend={trends.enrollments || []}
          />
          <AdminCoursesGrid
            workspace="instructor"
            courses={instructorCourses}
            loading={loading}
            error={error}
            onRetry={() => dispatch(fetchCourses())}
          />
        </main>
      </div>
    </div>
  );
};

export default InstructorDashboard;
