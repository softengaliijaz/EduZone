import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Plus, RotateCw } from "lucide-react";
import { getUploadUrl } from "../../utils/constants";
import ImageWithFallback from "../common/ImageWithFallback";

const AdminDashboardCourses = ({ courses = [], loading, error, onRetry, workspace = "admin" }) => {
  const basePath = workspace === "instructor" ? "/instructor" : "/admin";
  const courseListPath = `${basePath}/courses-management/get-all-courses`;
  const createCoursePath = `${basePath}/courses-management/create-course`;

  return (
  <section className="admin-panel" aria-labelledby="admin-courses-title">
    <header className="admin-panel__header">
      <div>
        <h2 id="admin-courses-title">{workspace === "instructor" ? "My courses" : "Courses"}</h2>
        <p>{workspace === "instructor" ? "Your recently added courses" : "Recently added to the catalog"}</p>
      </div>
      <Link className="admin-panel__header-link" to={courseListPath}>Manage all <ArrowRight size={15} aria-hidden="true" /></Link>
    </header>

    {loading ? (
      <div className="admin-panel__state" role="status">Loading courses…</div>
    ) : error ? (
      <div className="admin-panel__state" role="alert"><p>{error}</p><button className="btn btn-secondary btn-sm" type="button" onClick={onRetry}><RotateCw size={15} aria-hidden="true" /> Retry</button></div>
    ) : courses.length === 0 ? (
      <div className="admin-panel__state">
        <span className="admin-panel__empty-icon"><BookOpen size={19} aria-hidden="true" /></span>
        <strong>No courses yet</strong>
        <p>Build the catalog by adding your first course.</p>
        <Link className="btn btn-primary btn-sm" to={createCoursePath}><Plus size={15} aria-hidden="true" /> Create course</Link>
      </div>
    ) : (
      <div className="admin-list">
        {courses.slice(0, 5).map((course) => {
          const imageUrl = getUploadUrl(course.imageUrl || course.image);
          return (
            <article className="admin-list-row admin-course-row" key={course._id}>
              <span className="admin-course-row__image">
                {imageUrl ? <ImageWithFallback src={imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" /> : <BookOpen size={18} aria-hidden="true" />}
              </span>
              <div className="admin-list-row__main">
                <strong>{course.title || "Untitled course"}</strong>
                <span>{[course.category, course.level].filter(Boolean).join(" · ") || "Course"}</span>
              </div>
              <span className="admin-list-row__meta">{course.duration || "Course"}</span>
              <Link className="admin-list-row__action" to={`${basePath}/courses-management/update-course/${course._id}`} aria-label={`Edit ${course.title || "course"}`}><ArrowRight size={16} aria-hidden="true" /></Link>
            </article>
          );
        })}
      </div>
    )}
  </section>
  );
};

export default AdminDashboardCourses;
