import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock3, Users } from "lucide-react";
import { getUploadUrl } from "../../utils/constants";

const CourseCard = ({ course, buttonText = "View course", workspace = false }) => {
  const coursePath = workspace ? `/user/courses/${course._id}` : `/courses/course-details/course/${course._id}`;
  const courseUrl = course?.imageUrl || getUploadUrl(course?.image);
  const instructor = typeof course?.courseCreatedBy === "object" ? course.courseCreatedBy : null;
  const category = typeof course?.category === "string" ? course.category : course?.category?.name;

  return (
    <article className="course-card">
      <Link to={coursePath} className="course-card__image-link" aria-label={`View ${course.title}`}>
        {courseUrl ? (
          <img className="course-card__image" src={courseUrl} alt="" loading="lazy" />
        ) : (
          <div className="course-card__placeholder" aria-hidden="true"><span>{course?.title?.charAt(0)?.toUpperCase() || "C"}</span></div>
        )}
      </Link>
      <div className="course-card__body">
        <div className="course-card__metadata">
          <span className="course-card__category">{category || "Course"}</span>
          {course?.level && <span className="course-card__level">{course.level}</span>}
        </div>
        <h3 className="course-card__title"><Link to={coursePath}>{course?.title}</Link></h3>
        <p className="course-card__description">{course?.description || "Course details are available on the course page."}</p>
        {instructor?.name && <p className="course-card__instructor">By {instructor.name}</p>}
        <div className="course-card__facts">
          {course?.duration && <span><Clock3 size={15} aria-hidden="true" />{course.duration}</span>}
          {Number.isFinite(Number(course?.students)) && <span><Users size={15} aria-hidden="true" />{course.students} learners</span>}
        </div>
        {course?.progress !== undefined && (
          <div className="course-card__progress">
            <div className="course-card__progress-copy"><span>Progress</span><span>{course.progress}%</span></div>
            <div className="course-card__progress-track" role="progressbar" aria-valuenow={course.progress} aria-valuemin="0" aria-valuemax="100" aria-label={`${course.title} progress`}>
              <span style={{ width: `${Math.max(0, Math.min(100, Number(course.progress) || 0))}%` }} />
            </div>
          </div>
        )}
        <Link className="course-card__action" to={coursePath}>
          {buttonText}<ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
};

export default CourseCard;
