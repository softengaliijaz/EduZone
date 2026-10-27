import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, GraduationCap, Search, Users, RotateCw, Eye } from "lucide-react";
import axiosInstance from "../../../services/axios";
import Loader from "../../../components/common/Loader";
import { getUploadUrl } from "../../../utils/constants";

const StudentsListPage = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [enrollmentFilter, setEnrollmentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    axiosInstance.get("/api/admin/students")
      .then(({ data }) => { if (active) setStudents(data.data || []); })
      .catch((requestError) => { if (active) setError(requestError.response?.data?.message || "Could not load student records."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [reloadKey]);

  const filteredStudents = useMemo(() => students
    .filter((student) => {
      const query = search.trim().toLowerCase();
      const matchesSearch = !query || [student.name, student.email, student.bio]
        .some((value) => value?.toLowerCase().includes(query));
      const enrolled = (student.learning?.enrolledCourses || 0) > 0;
      return matchesSearch && (enrollmentFilter === "all" || (enrollmentFilter === "enrolled" ? enrolled : !enrolled));
    })
    .sort((a, b) => {
      if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "courses") return (b.learning?.enrolledCourses || 0) - (a.learning?.enrolledCourses || 0);
      if (sortBy === "progress") return (b.learning?.averageProgress || 0) - (a.learning?.averageProgress || 0);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }), [students, search, enrollmentFilter, sortBy]);

  if (loading) return <Loader title="Loading student records…" />;

  return (
    <section className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
      <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[var(--brand-strong)]"><Users size={16} /> Admin · People</p>
          <h1 className="text-3xl font-bold text-[var(--text)]">Students</h1>
          <p className="mt-2 text-[var(--text-muted)]">Review student accounts, course enrollment, and learning progress.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"><span className="block text-xs text-[var(--text-muted)]">Students</span><strong className="text-xl text-[var(--text)]">{students.length}</strong></div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"><span className="block text-xs text-[var(--text-muted)]">Enrolled</span><strong className="text-xl text-[var(--text)]">{students.filter((student) => student.learning?.enrolledCourses > 0).length}</strong></div>
        </div>
      </header>

      <div className="mb-5 grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 md:grid-cols-[minmax(16rem,1fr)_12rem_12rem]">
        <label className="relative block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
          <input aria-label="Search students" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, or bio" className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-3 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)]" />
        </label>
        <select aria-label="Filter students by enrollment" value={enrollmentFilter} onChange={(event) => setEnrollmentFilter(event.target.value)} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[var(--text)]">
          <option value="all">All students</option><option value="enrolled">Has enrollments</option><option value="not-enrolled">No enrollments</option>
        </select>
        <select aria-label="Sort students" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[var(--text)]">
          <option value="newest">Recently joined</option><option value="name">Name A–Z</option><option value="courses">Most courses</option><option value="progress">Highest progress</option>
        </select>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800" role="alert"><p>{error}</p><button onClick={() => { setError(""); setReloadKey((key) => key + 1); }} className="mt-3 inline-flex items-center gap-2 font-medium"><RotateCw size={16} /> Retry</button></div>
      ) : filteredStudents.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center"><Users className="mx-auto mb-3 text-[var(--text-muted)]" size={30} /><h2 className="text-lg font-semibold text-[var(--text)]">{students.length ? "No matching students" : "No student accounts yet"}</h2><p className="mt-1 text-[var(--text-muted)]">{students.length ? "Try another search or enrollment filter." : "Student accounts will appear here when they register."}</p></div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="hidden grid-cols-[minmax(12rem,1.35fr)_minmax(10rem,1fr)_6rem_7rem_9rem] gap-4 border-b border-[var(--border)] bg-[var(--surface-raised)] px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] xl:grid"><span>Student</span><span>Learning activity</span><span>Enrolled</span><span>Progress</span><span className="text-right">Actions</span></div>
          {filteredStudents.map((student) => {
            const progress = student.learning?.averageProgress || 0;
            const avatarUrl = student.profile_picture_url
              ? student.profile_picture_url.startsWith("http")
                ? student.profile_picture_url
                : getUploadUrl(student.profile_picture_url)
              : null;
            return (
              <article key={student._id} className="grid gap-4 border-b border-[var(--border)] p-4 last:border-0 xl:grid-cols-[minmax(12rem,1.35fr)_minmax(10rem,1fr)_6rem_7rem_9rem] xl:items-center xl:px-5">
                <div className="flex min-w-0 items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--brand-soft)] font-semibold text-[var(--brand-strong)]">{avatarUrl ? <img src={avatarUrl} alt="" className="h-full w-full object-cover" /> : student.name?.charAt(0)?.toUpperCase() || "S"}</span><div className="min-w-0"><h2 className="truncate font-semibold text-[var(--text)]">{student.name}</h2><p className="truncate text-sm text-[var(--text-muted)]">{student.email}</p><time className="mt-1 block text-xs text-[var(--text-muted)]" dateTime={student.createdAt}>Joined {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : "—"}</time></div></div>
                <p className="text-sm text-[var(--text-muted)]">{student.learning?.completedCourses || 0} completed course{student.learning?.completedCourses === 1 ? "" : "s"}</p>
                <p className="inline-flex items-center gap-2 text-sm text-[var(--text)]"><BookOpen size={16} className="text-[var(--brand-strong)]" />{student.learning?.enrolledCourses || 0}</p>
                <div><div className="mb-1 flex justify-between text-xs text-[var(--text-muted)]"><span>Average</span><span>{progress}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-raised)]"><div className="h-full rounded-full bg-[var(--brand-strong)]" style={{ width: `${Math.min(100, progress)}%` }} /></div></div>
                <div className="flex justify-end"><button onClick={() => navigate(`/admin/students/${student._id}`)} className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-raised)]"><Eye size={16} /> View record</button></div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default StudentsListPage;
