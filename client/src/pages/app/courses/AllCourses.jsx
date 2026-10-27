import React, { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../../services/axios";
import CourseCard from "../../../components/common/CourseCard";
import { SearchComp } from "../../../components/common/SearchComp";
import { BookOpen, RotateCw, SearchX } from "lucide-react";

const SeeAllCoursesList = ({ workspace = false }) => {
  const [courses, setCourses] = useState([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    level: "all",
  });

  const fetchCourses = async (currentFilters, signal) => {
    setLoading(true);
    try {
      const { search, category, level } = currentFilters;
      const query = new URLSearchParams();
      if (search) query.append("search", search);
      if (category && category !== "all") query.append("category", category);
      if (level && level !== "all") query.append("level", level);

      query.set("limit", "100");
      const response = await axiosInstance.get(`/api/courses/?${query.toString()}`, { signal });
      const result = response.data?.data || [];
      setCourses(result);
      setTotalCourses(response.data?.meta?.total ?? result.length);
      if (!search && category === "all" && level === "all") {
        setCategories([...new Set(result.map((course) => course.category).filter(Boolean))].sort());
      }
      setError(null);
    } catch (requestError) {
      if (requestError.code === "ERR_CANCELED") return;
      setError(requestError.response?.data?.message || "We couldn’t load courses. Check your connection and try again.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchCourses(filters, controller.signal);
    return () => controller.abort();
  }, [filters]);

  const handleSearch = useCallback((term) => {
    setFilters((prev) => ({ ...prev, search: term }));
  }, []);

  const handleFilter = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = () => {
    setFilters({ search: "", category: "all", level: "all" });
    setResetSignal((current) => current + 1);
  };

  return (
    <>
      <section className={`catalog-page${workspace ? " catalog-page--workspace" : ""}`}>
        <header className="catalog-page__header">
          <div>
            <p className="catalog-page__eyebrow">{workspace ? "COURSE CATALOG" : "LEARN SOMETHING NEW"}</p>
            <h1>{workspace ? "Explore courses" : "All courses for you"}</h1>
            <p>Find a course that fits your interests and goals.</p>
          </div>
          <span className="catalog-page__count">{totalCourses} {totalCourses === 1 ? "course" : "courses"}</span>
        </header>

        <SearchComp onSearch={handleSearch} onFilter={handleFilter} categories={categories} resetSignal={resetSignal} />

        {loading && <div className="catalog-state" role="status"><span className="student-state__spinner" /><p>Loading courses…</p></div>}

        {error && <div className="catalog-state" role="alert"><p>{error}</p><button type="button" className="btn btn-secondary" onClick={() => fetchCourses(filters)}><RotateCw size={16} aria-hidden="true" /> Try again</button></div>}

        {!loading && !error && courses.length === 0 && (
          <div className="catalog-state catalog-state--empty">
            <span className="student-state__empty-icon">{filters.search || filters.category !== "all" || filters.level !== "all" ? <SearchX size={23} aria-hidden="true" /> : <BookOpen size={23} aria-hidden="true" />}</span>
            <h2>{filters.search || filters.category !== "all" || filters.level !== "all" ? "No courses match those filters" : "No courses have been published yet"}</h2>
            <p>{filters.search || filters.category !== "all" || filters.level !== "all" ? "Try a different search or reset your filters." : "Courses will appear here as soon as an instructor publishes them."}</p>
            {(filters.search || filters.category !== "all" || filters.level !== "all") ? <button type="button" className="btn btn-secondary" onClick={resetFilters}>Reset filters</button> : <button type="button" className="btn btn-secondary" onClick={() => fetchCourses(filters)}><RotateCw size={16} aria-hidden="true" /> Refresh catalog</button>}
          </div>
        )}

        <div className="catalog-page__grid">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} workspace={workspace} />
          ))}
        </div>
      </section>
    </>
  );
};

export default SeeAllCoursesList;
