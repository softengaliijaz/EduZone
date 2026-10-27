import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, CheckCircle2, Clock3, GraduationCap, Users } from "lucide-react";
import useFetchData from "../../../hooks/useCustomHooks";
import { BASE_URL } from "../../../utils/constants";
import UserProfileView from "../UserProfileView";
import Loader from "../../common/Loader";
import ErrorBox from "../../common/ErrorBox";

const Metric = ({ icon, label, value }) => (
  <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
    <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-soft)] text-[var(--brand-strong)]">{React.createElement(icon, { size: 19 })}</span><div><p className="text-sm text-[var(--text-muted)]">{label}</p><strong className="text-xl text-[var(--text)]">{value}</strong></div></div>
  </div>
);

const UserProfilePage = () => {
  const { id } = useParams();
  const { data: records, loading, error } = useFetchData(`${BASE_URL}/api/admin/users/${id}/records`);

  if (loading) return <Loader title="Loading account records…" />;
  if (error) return <ErrorBox message={error} />;
  if (!records?.user) return <ErrorBox message="Account records are unavailable." />;

  const isStudent = records.type === "student";
  const backPath = isStudent ? "/admin/get-all-students" : "/admin/get-all-instructors";

  return (
    <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
      <Link to={backPath} className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--brand-strong)] hover:underline"><ArrowLeft size={16} /> Back to {isStudent ? "students" : "instructors"}</Link>
      <header className="mb-6"><p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[var(--brand-strong)]"><GraduationCap size={16} /> Admin · {isStudent ? "Student record" : "Instructor record"}</p><h1 className="text-3xl font-bold text-[var(--text)]">{records.user.name}</h1><p className="mt-1 text-[var(--text-muted)]">{isStudent ? "Account details and learning history" : "Account details and teaching portfolio"}</p></header>

      <section className="mb-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label={isStudent ? "Student summary" : "Instructor summary"}>
        {isStudent ? <>
          <Metric icon={BookOpen} label="Enrolled courses" value={records.summary.enrolledCourses} />
          <Metric icon={CheckCircle2} label="Completed courses" value={records.summary.completedCourses} />
          <Metric icon={GraduationCap} label="Average progress" value={`${records.summary.averageProgress}%`} />
          <Metric icon={Clock3} label="Attendance records" value={records.summary.attendanceRecords} />
        </> : <>
          <Metric icon={BookOpen} label="Courses created" value={records.summary.courses} />
          <Metric icon={Users} label="Course enrollments" value={records.summary.learners} />
          <Metric icon={GraduationCap} label="Lessons created" value={records.summary.lessons} />
          <Metric icon={Clock3} label="Joined" value={records.user.createdAt ? new Date(records.user.createdAt).toLocaleDateString() : "—"} />
        </>}
      </section>

      {isStudent ? (
        <div className="mb-8 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(18rem,1fr)]">
          <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <div className="border-b border-[var(--border)] p-5"><h2 className="text-lg font-semibold text-[var(--text)]">Course enrollments</h2><p className="mt-1 text-sm text-[var(--text-muted)]">Enrollment state and progress recorded for this student.</p></div>
            {records.enrollments.length ? <div className="divide-y divide-[var(--border)]">{records.enrollments.map((enrollment) => <article key={enrollment._id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><h3 className="font-medium text-[var(--text)]">{enrollment.courseId?.title || "Course no longer available"}</h3><p className="mt-1 text-sm text-[var(--text-muted)]">{[enrollment.courseId?.category, enrollment.courseId?.level, enrollment.courseId?.courseCreatedBy?.name ? `Instructor: ${enrollment.courseId.courseCreatedBy.name}` : ""].filter(Boolean).join(" · ")}</p><p className="mt-1 text-xs text-[var(--text-muted)]">Enrolled {enrollment.enrollmentDate ? new Date(enrollment.enrollmentDate).toLocaleDateString() : "—"}</p></div><div className="flex items-center gap-4"><div className="min-w-28"><div className="mb-1 flex justify-between text-xs text-[var(--text-muted)]"><span>Progress</span><span>{enrollment.progress || 0}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-raised)]"><div className="h-full rounded-full bg-[var(--brand-strong)]" style={{ width: `${Math.min(100, enrollment.progress || 0)}%` }} /></div></div><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${enrollment.completed ? "bg-green-100 text-green-800" : "bg-blue-50 text-blue-800"}`}>{enrollment.completed ? "Completed" : "In progress"}</span></div></article>)}</div> : <p className="p-6 text-sm text-[var(--text-muted)]">This student has no course enrollments yet.</p>}
          </section>

          <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <div className="border-b border-[var(--border)] p-5"><h2 className="text-lg font-semibold text-[var(--text)]">Attendance history</h2><p className="mt-1 text-sm text-[var(--text-muted)]">Attendance records currently stored for this student.</p></div>
            {records.attendance.length ? <div className="max-h-[32rem] divide-y divide-[var(--border)] overflow-y-auto">{records.attendance.map((record) => <article key={record._id} className="p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-medium text-[var(--text)]">{record.course?.title || "Course unavailable"}</h3><time className="text-xs text-[var(--text-muted)]">{record.sessionDate ? new Date(record.sessionDate).toLocaleDateString() : "Date unavailable"}</time></div><span className="rounded-full bg-[var(--surface-raised)] px-2.5 py-1 text-xs font-medium capitalize text-[var(--text)]">{record.status}</span></div>{record.remarks && <p className="mt-2 text-sm text-[var(--text-muted)]">{record.remarks}</p>}</article>)}</div> : <p className="p-6 text-sm text-[var(--text-muted)]">No attendance records are available.</p>}
          </section>
        </div>
      ) : (
        <section className="mb-8 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="border-b border-[var(--border)] p-5"><h2 className="text-lg font-semibold text-[var(--text)]">Courses created by {records.user.name}</h2><p className="mt-1 text-sm text-[var(--text-muted)]">Inspect each course, its actual learner count, and curriculum size.</p></div>
          {records.courses.length ? <div className="divide-y divide-[var(--border)]">{records.courses.map((course) => <article key={course._id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><h3 className="font-medium text-[var(--text)]">{course.title}</h3><p className="mt-1 text-sm text-[var(--text-muted)]">{[course.category, course.level, course.duration].filter(Boolean).join(" · ")}</p></div><div className="flex flex-wrap items-center gap-3"><span className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)]"><Users size={16} /> {course.students} learners</span><span className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)]"><BookOpen size={16} /> {course.lessons} lessons</span><Link to={`/admin/courses-management/course/${course._id}`} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-raised)]">View details</Link><Link to={`/admin/courses-management/update-course/${course._id}`} className="rounded-lg bg-[var(--brand-strong)] px-3 py-2 text-sm font-medium text-white">Manage</Link></div></article>)}</div> : <p className="p-6 text-sm text-[var(--text-muted)]">This instructor has not created any courses yet.</p>}
        </section>
      )}

      <UserProfileView key={id} user={records.user} />
    </div>
  );
};

export default UserProfilePage;
