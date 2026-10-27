import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  PlayCircle,
} from "lucide-react";
import axiosInstance from "../../../services/axios";

const ContinueLearning = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const course = state?.course || null;
  const enrollmentId = state?.enrollmentId || null;
  const initialProgress = Number(state?.initialProgress || 0);

  const [lessons, setLessons] = useState([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLessons = async () => {
      if (!course?._id) {
        navigate("/user/learning-room", { replace: true });
        return;
      }

      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/lessons", {
          params: { courseId: course._id },
        });
        const allLessons = response?.data?.data || [];

        const courseLessons = allLessons.map((lesson) => ({
            id: lesson._id,
            title: lesson.title,
            content: lesson.content || "No description available.",
            videoUrl: lesson.videoUrl || null,
            duration: lesson.duration || "00:00",
            completed: false,
        }));

        const completedCount = Math.floor(
          (Math.max(0, Math.min(100, initialProgress)) / 100) * courseLessons.length,
        );

        const hydrated = courseLessons.map((lesson, index) => ({
          ...lesson,
          completed: index < completedCount,
        }));

        setLessons(hydrated);
        setError("");
      } catch {
        setError("Failed to load lessons for this course.");
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [course?._id, initialProgress, navigate]);

  const currentLesson = lessons[currentLessonIndex];
  const completedLessons = lessons.filter((lesson) => lesson.completed).length;
  const progress = useMemo(
    () => (lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0),
    [completedLessons, lessons.length],
  );

  const persistProgress = async (nextProgress) => {
    if (!enrollmentId) return;
    try {
      await axiosInstance.put(`/api/courses/enrollments/${enrollmentId}`, {
        progress: nextProgress,
        completed: nextProgress >= 100,
      });
    } catch {
      // Keep UX optimistic.
    }
  };

  const markCompleted = async () => {
    if (!currentLesson) return;
    if (currentLesson.completed) return;

    const updated = lessons.map((lesson, index) =>
      index === currentLessonIndex ? { ...lesson, completed: true } : lesson,
    );
    setLessons(updated);

    const nextProgress = Math.round(
      (updated.filter((lesson) => lesson.completed).length / updated.length) * 100,
    );
    await persistProgress(nextProgress);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-700">Loading course lessons...</p>
        </div>
      </div>
    );
  }

  if (error || lessons.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lessons unavailable</h2>
          <p className="text-gray-600 mb-6">
            {error || "No lessons are available for this course yet."}
          </p>
          <button
            onClick={() => navigate("/user/learning-room")}
            className="px-6 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-colors"
          >
            Back to Learning Room
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{course?.title || "Course"}</h1>
            <p className="text-sm text-gray-500">
              Lesson {currentLessonIndex + 1} of {lessons.length}
            </p>
          </div>
          <div className="ml-auto text-sm font-semibold text-blue-700">{progress}% complete</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {currentLesson.videoUrl ? (
            <div className="lesson-player">
              <iframe
                src={currentLesson.videoUrl}
                title={`${currentLesson.title} video`}
                className="w-full aspect-video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="lesson-player lesson-player--empty" role="status">
              No video is attached to this lesson. Use the lesson notes below to continue.
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-gray-900">{currentLesson.title}</h2>
              {currentLesson.completed && (
                <span className="inline-flex items-center gap-1 text-green-600 text-sm font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  Completed
                </span>
              )}
            </div>
            <p className="text-gray-600 mb-6">{currentLesson.content}</p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setCurrentLessonIndex((prev) => Math.max(prev - 1, 0))}
                disabled={currentLessonIndex === 0}
                className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 disabled:opacity-40"
              >
                Previous Lesson
              </button>
              <button
                onClick={markCompleted}
                disabled={currentLesson.completed}
                aria-pressed={currentLesson.completed}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
              >
                {currentLesson.completed ? "Completed" : "Mark Completed"}
              </button>
              <button
                onClick={() =>
                  setCurrentLessonIndex((prev) => Math.min(prev + 1, lessons.length - 1))
                }
                disabled={currentLessonIndex === lessons.length - 1}
                className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 disabled:opacity-40"
              >
                Next Lesson
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4 h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Course Content</h3>
          <div className="space-y-3">
            {lessons.map((lesson, index) => (
              <button
                key={lesson.id}
                onClick={() => setCurrentLessonIndex(index)}
                className={`w-full text-left p-3 rounded-xl border transition ${
                  index === currentLessonIndex
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {lesson.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <PlayCircle className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{lesson.title}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {lesson.duration}
                    </p>
                  </div>
                  {index === currentLessonIndex && <ArrowRight className="w-4 h-4 text-blue-600" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContinueLearning;
