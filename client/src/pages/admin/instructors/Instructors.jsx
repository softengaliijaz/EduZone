import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, GraduationCap, Search, Users, RotateCw, Eye } from "lucide-react";
import axiosInstance from "../../../services/axios";
import Loader from "../../../components/common/Loader";
import { getUploadUrl } from "../../../utils/constants";

const InstructorsListPage = () => {
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    axiosInstance.get("/api/admin/instructors")
      .then(({ data }) => { if (active) setInstructors(data.data || []); })
      .catch((requestError) => { if (active) setError(requestError.response?.data?.message || "Could not load instructor records."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [reloadKey]);

  const filteredInstructors = useMemo(() => instructors
    .filter((instructor) => {
      const query = search.trim().toLowerCase();
      return !query || [instructor.name, instructor.email, instructor.bio]
        .some((value) => value?.toLowerCase().includes(query));
    })
    .sort((a, b) => {
      if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "courses") return (b.teaching?.courses || 0) - (a.teaching?.courses || 0);
      if (sortBy === "learners") return (b.teaching?.learners || 0) - (a.teaching?.learners || 0);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }), [instructors, search, sortBy]);

  if (loading) return <Loader title="Loading instructor records…" />;

  const courseTotal = instructors.reduce((total, instructor) => total + (instructor.teaching?.courses || 0), 0);
  const learnerTotal = instructors.reduce((total, instructor) => total + (instructor.teaching?.learners || 0), 0);

  return (
    <section className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
      <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[var(--brand-strong)]"><GraduationCap size={16} /> Admin · People</p><h1 className="text-3xl font-bold text-[var(--text)]">Instructors</h1><p className="mt-2 text-[var(--text-muted)]">Review instructor accounts, their courses, and course enrollment totals.</p></div>
        <div className="flex flex-wrap gap-3"><div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"><span className="block text-xs text-[var(--text-muted)]">Instructors</span><strong className="text-xl text-[var(--text)]">{instructors.length}</strong></div><div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"><span className="block text-xs text-[var(--text-muted)]">Courses · enrollments</span><strong className="text-xl text-[var(--text)]">{courseTotal} · {learnerTotal}</strong></div></div>
      </header>

      <div className="mb-5 grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 md:grid-cols-[minmax(16rem,1fr)_12rem]">
        <label className="relative block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} /><input aria-label="Search instructors" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, or bio" className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-3 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)]" /></label>
        <select aria-label="Sort instructors" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[var(--text)]"><option value="newest">Recently joined</option><option value="name">Name A–Z</option><option value="courses">Most courses</option><option value="learners">Most enrollments</option></select>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800" role="alert"><p>{error}</p><button onClick={() => { setError(""); setReloadKey((key) => key + 1); }} className="mt-3 inline-flex items-center gap-2 font-medium"><RotateCw size={16} /> Retry</button></div>
      ) : filteredInstructors.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center"><GraduationCap className="mx-auto mb-3 text-[var(--text-muted)]" size={30} /><h2 className="text-lg font-semibold text-[var(--text)]">{instructors.length ? "No matching instructors" : "No instructors yet"}</h2><p className="mt-1 text-[var(--text-muted)]">{instructors.length ? "Try a different search." : "Instructor accounts will appear here when an admin assigns the instructor role."}</p></div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="hidden grid-cols-[minmax(16rem,1.5fr)_minmax(12rem,1fr)_9rem_9rem_10rem] gap-4 border-b border-[var(--border)] bg-[var(--surface-raised)] px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] md:grid"><span>Instructor</span><span>Profile</span><span>Courses</span><span>Enrollments</span><span className="text-right">Actions</span></div>
          {filteredInstructors.map((instructor) => {
            const avatarUrl = instructor.profile_picture_url
              ? instructor.profile_picture_url.startsWith("http")
                ? instructor.profile_picture_url
                : getUploadUrl(instructor.profile_picture_url)
              : null;
            return (
            <article key={instructor._id} className="grid gap-4 border-b border-[var(--border)] p-4 last:border-0 md:grid-cols-[minmax(16rem,1.5fr)_minmax(12rem,1fr)_9rem_9rem_10rem] md:items-center md:px-5">
              <div className="flex min-w-0 items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--brand-soft)] font-semibold text-[var(--brand-strong)]">{avatarUrl ? <img src={avatarUrl} alt="" className="h-full w-full object-cover" /> : instructor.name?.charAt(0)?.toUpperCase() || "I"}</span><div className="min-w-0"><h2 className="truncate font-semibold text-[var(--text)]">{instructor.name}</h2><p className="truncate text-sm text-[var(--text-muted)]">{instructor.email}</p></div></div>
              <p className="line-clamp-2 text-sm text-[var(--text-muted)]">{instructor.bio || "No instructor bio provided."}</p>
              <p className="inline-flex items-center gap-2 text-sm text-[var(--text)]"><BookOpen size={16} className="text-[var(--brand-strong)]" />{instructor.teaching?.courses || 0}</p>
              <p className="inline-flex items-center gap-2 text-sm text-[var(--text)]"><Users size={16} className="text-[var(--brand-strong)]" />{instructor.teaching?.learners || 0}</p>
              <div className="flex justify-end"><button onClick={() => navigate(`/admin/instructors/${instructor._id}`)} className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-raised)]"><Eye size={16} /> View courses</button></div>
            </article>
          ); })}
        </div>
      )}
    </section>
  );
};

export default InstructorsListPage;
