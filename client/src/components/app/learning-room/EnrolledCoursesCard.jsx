import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowRight, BookOpen, Clock3, Play, RotateCw } from "lucide-react";
import { fetchEnrolledCourses } from "../../../features/course/enrollSlice";
import { getUploadUrl } from "../../../utils/constants";
import ImageWithFallback from "../../common/ImageWithFallback";

const EnrolledCoursesCard = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?._id);
  const { status, courses = [], error } = useSelector((state) => state.enroll);

  useEffect(() => {
    if (userId) dispatch(fetchEnrolledCourses(userId));
  }, [dispatch, userId]);

  if (status === "loading" || status === null) {
    return <div className="student-state" role="status"><span className="student-state__spinner" /><p>Loading your courses…</p></div>;
  }

  if (status === "failed") {
    return (
      <div className="student-state" role="alert">
        <AlertCircle size={24} aria-hidden="true" />
        <h3>We couldn’t load your courses</h3>
        <p>{error || "Check your connection and try again."}</p>
        <button className="btn btn-secondary" type="button" onClick={() => userId && dispatch(fetchEnrolledCourses(userId))}>
          <RotateCw size={16} aria-hidden="true" /> Try again
        </button>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="student-state student-state--empty">
        <span className="student-state__empty-icon"><BookOpen size={23} aria-hidden="true" /></span>
        <h3>Your learning starts here</h3>
        <p>You haven’t enrolled in a course yet. Browse the catalog to find something you’d like to learn.</p>
        <Link className="btn btn-primary" to="/user/explore-courses">Explore courses <ArrowRight size={16} aria-hidden="true" /></Link>
      </div>
    );
  }

  return (
    <div className="enrolled-course-grid">
      {courses.map((enrollment) => {
        const course = enrollment.courseId || {};
        const progress = Math.min(100, Math.max(0, Number(enrollment.progress) || 0));
        const image = getUploadUrl(course.imageUrl || course.image);
        return (
          <article className="enrolled-course" key={enrollment._id}>
            <Link className="enrolled-course__image" to={`/user/courses/${course._id}`} aria-label={`View ${course.title || "course"}`}>
              {image ? <ImageWithFallback src={image} alt="" className="h-full w-full object-cover" loading="lazy" /> : <span>{course.title?.charAt(0)?.toUpperCase() || <BookOpen size={24} aria-hidden="true" />}</span>}
            </Link>
            <div className="enrolled-course__body">
              <p className="enrolled-course__category">{course.category || "Enrolled course"}{course.level ? ` · ${course.level}` : ""}</p>
              <h3>{course.title || "Untitled course"}</h3>
              <p className="enrolled-course__description">{course.description || "Continue with the next lesson in your course."}</p>
              <div className="enrolled-course__progress-copy"><span>Course progress</span><strong>{progress}%</strong></div>
              <div className="enrolled-course__track" role="progressbar" aria-label={`${course.title || "Course"} progress`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}><span style={{ width: `${progress}%` }} /></div>
              {course.duration && <p className="enrolled-course__duration"><Clock3 size={14} aria-hidden="true" />{course.duration}</p>}
              <Link className="btn btn-primary enrolled-course__action" to="/user/continue-learning" state={{ course, enrollmentId: enrollment._id, initialProgress: progress }}>
                <Play size={15} aria-hidden="true" /> Continue learning
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default EnrolledCoursesCard;
