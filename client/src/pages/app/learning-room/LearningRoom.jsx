import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowRight, Award, BookOpen, ChartNoAxesColumnIncreasing, Compass, GraduationCap } from "lucide-react";
import axiosInstance from "../../../services/axios";
import EnrolledCoursesCard from "../../../components/app/learning-room/EnrolledCoursesCard";

const LearningRoom = () => {
  const user = useSelector((state) => state.auth.user);
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    axiosInstance.get("/api/analytics/student")
      .then((response) => {
        if (active) {
          setAnalytics(response?.data?.data || null);
          setAnalyticsLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setAnalytics(null);
          setAnalyticsLoading(false);
        }
      });
    return () => { active = false; };
  }, []);

  const stats = useMemo(() => {
    const counts = analytics?.counts || {};
    const performance = analytics?.performance || {};
    return [
      { label: "In progress", value: analyticsLoading ? "—" : analytics ? counts.inProgressCourses || 0 : "—", icon: BookOpen, tone: "blue" },
      { label: "Completed", value: analyticsLoading ? "—" : analytics ? counts.completedCourses || 0 : "—", icon: Award, tone: "green" },
      { label: "Courses enrolled", value: analyticsLoading ? "—" : analytics ? counts.enrolledCourses || 0 : "—", icon: GraduationCap, tone: "violet" },
      { label: "Average progress", value: analyticsLoading ? "—" : analytics ? `${Math.round(performance.averageProgress || 0)}%` : "—", icon: ChartNoAxesColumnIncreasing, tone: "amber" },
    ];
  }, [analytics, analyticsLoading]);

  return (
    <div className="student-dashboard">
      <header className="student-dashboard__header">
        <div>
          <p className="student-dashboard__eyebrow">STUDENT WORKSPACE</p>
          <h1>Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}</h1>
          <p>Pick up where you left off or find your next course.</p>
        </div>
        <Link className="btn btn-primary" to="/user/explore-courses">
          <Compass size={17} aria-hidden="true" /> Explore courses <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </header>

      <section className="student-dashboard__stats" aria-label="Your learning statistics">
        {stats.map((stat) => (
          <article className="student-stat" key={stat.label}>
            <span className={`student-stat__icon student-stat__icon--${stat.tone}`}>{React.createElement(stat.icon, { size: 19, "aria-hidden": true })}</span>
            <div><p>{stat.label}</p><strong>{stat.value}</strong></div>
          </article>
        ))}
      </section>

      <section className="student-dashboard__courses" aria-labelledby="enrolled-courses-title">
        <div className="student-dashboard__section-heading">
          <div>
            <h2 id="enrolled-courses-title">Your learning</h2>
            <p>Your enrolled courses and progress in one place.</p>
          </div>
          <Link to="/user/explore-courses">Browse catalog <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
        <EnrolledCoursesCard />
      </section>
    </div>
  );
};

export default LearningRoom;
