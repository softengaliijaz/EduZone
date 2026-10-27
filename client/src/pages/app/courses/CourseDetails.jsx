import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../services/axios";
import { getUploadUrl } from "../../../utils/constants";
import {
  enrollInCourse,
  fetchEnrolledCourses,
} from "../../../features/course/enrollSlice";
import LikeFeature from "../../../components/app/post-interactions/LikeFeature";
import CommentFeature from "../../../components/app/post-interactions/CommentFeature";
import {
  BookOpen,
  Clock,
  Users,
  Star,
  ChevronRight,
  PlayCircle,
  Download,
  Share2,
  Bookmark,
  Award,
  CheckCircle,
  BarChart,
  Calendar,
  User,
  Target,
  ExternalLink,
  Heart,
  MessageCircle,
  Zap,
  TrendingUp,
  Shield,
  Globe,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Loader from "../../../components/common/Loader";
import { getReadableParagraphs } from "../../../utils/contentFormatting";
import ImageWithFallback from "../../../components/common/ImageWithFallback";

const CourseDetail = ({ workspace = false, managementView = false }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { status } = useSelector((state) => state.enroll);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [stats, setStats] = useState({
    students: 0,
    rating: 0,
    reviews: 0,
    duration: "Flexible",
    level: "Beginner",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(`/api/courses/${id}`);
        setCourse(data?.data);

        setStats((prev) => ({
          ...prev,
          students: data?.data?.students || 0,
          rating: data?.data?.rating || 0,
          duration: data?.data?.duration || "Flexible",
          level: data?.data?.level || "Beginner",
        }));
      } catch (err) {
        console.error("Error fetching course:", err);
        toast.error("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!id) return undefined;
    let active = true;

    const refreshEnrollmentCount = async () => {
      if (document.hidden) return;
      try {
        const { data } = await axiosInstance.get(`/api/courses/${id}`);
        if (active && Number.isFinite(data?.data?.students)) {
          setStats((current) => ({ ...current, students: data.data.students }));
        }
      } catch {
        // Keep the last known count; the main course request handles load errors.
      }
    };

    const intervalId = window.setInterval(refreshEnrollmentCount, 15000);
    document.addEventListener("visibilitychange", refreshEnrollmentCount);
    return () => {
      active = false;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", refreshEnrollmentCount);
    };
  }, [id]);

  useEffect(() => {
    if (user?._id && !managementView) {
      dispatch(fetchEnrolledCourses(user._id)).then((res) => {
        if (fetchEnrolledCourses.fulfilled.match(res)) {
          const enrolledCourses = res.payload || [];
          const isEnrolled = enrolledCourses.some((enroll) => {
            const enrolledCourseId = enroll.courseId?._id || enroll.courseId;
            return enrolledCourseId === id;
          });
          setEnrolled(isEnrolled);
        }
      });
    }
  }, [user, id, dispatch, managementView]);

  const handleEnroll = async () => {
    if (!user) {
      toast.error("Please login to enroll in this course");
      navigate("/login");
      return;
    }

    if (enrolled) {
      toast.success("You're already enrolled in this course!");
      navigate("/user/learning-room");
      return;
    }

    setShowEnrollModal(true);
  };

  const confirmEnrollment = async () => {
    if (user && id && !enrolled) {
      const res = await dispatch(
        enrollInCourse({ userId: user._id, courseId: id }),
      );

      if (enrollInCourse.fulfilled.match(res)) {
        toast.success(`🎉 Successfully enrolled in ${course.title}!`);
        setEnrolled(true);
        if (Number.isFinite(res.payload?.studentCount)) {
          setStats((current) => ({
            ...current,
            students: res.payload.studentCount,
          }));
        }
        setShowEnrollModal(false);

        // Redirect to course content after 2 seconds
        setTimeout(() => {
          navigate("/user/learning-room");
        }, 2000);
      } else if (enrollInCourse.rejected.match(res)) {
        const payload = res.payload;
        if (payload?.statusCode === 409) {
          toast.error("You are already enrolled in this course");
          setEnrolled(true);
        } else {
          toast.error(payload?.message || "Enrollment failed");
        }
      }
      setShowEnrollModal(false);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(
      !isBookmarked
        ? "Course added to bookmarks!"
        : "Course removed from bookmarks",
    );
  };

  const handleShare = async () => {
    const shareData = {
      title: course.title,
      text: `Check out this course: ${course.title}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Course Not Found
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() =>
              navigate(
                managementView
                  ? user?.user_type === "instructor"
                    ? "/instructor/courses-management/get-all-courses"
                    : "/admin/courses-management/get-all-courses"
                  : workspace
                    ? "/user/explore-courses"
                    : "/courses/courses-list",
              )
            }
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            {managementView ? "Back to course management" : "Browse Courses"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Enrollment Modal */}
      {!managementView && showEnrollModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-in slide-in-from-bottom-2">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Enroll in {course.title}
              </h3>
              <p className="text-gray-600">
                Confirm your enrollment to start learning immediately
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">Full course access</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Award className="w-5 h-5 text-yellow-600" />
                <span className="text-sm">Certificate of completion</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="text-sm">Access to community</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEnrollModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmEnrollment}
                disabled={status === "loading"}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition disabled:opacity-50"
              >
                {status === "loading" ? "Processing..." : "Confirm Enrollment"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4">
                  <BookOpen className="w-4 h-4" />
                  PREMIUM COURSE
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  {course.title}
                </h1>
                <p className="text-white/90 text-lg max-w-3xl">
                  Master new skills with expert-led training and hands-on
                  projects
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleBookmark}
                  className="p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition"
                >
                  <Bookmark
                    className={`w-5 h-5 ${isBookmarked ? "fill-white" : ""}`}
                  />
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div
            className={`grid grid-cols-1 ${managementView ? "lg:grid-cols-1" : "lg:grid-cols-3"} gap-8`}
          >
            {/* Main Content */}
            <div
              className={`${managementView ? "" : "lg:col-span-2 "}space-y-8`}
            >
              {/* Course Overview */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Course Overview
                  </h2>
                </div>

                <div className="prose max-w-[78ch] break-words text-gray-700 leading-8">
                  {getReadableParagraphs(course.description).map(
                    (paragraph, index) => (
                      <p
                        className="mb-5 last:mb-0 whitespace-pre-wrap"
                        key={`course-description-${index}`}
                      >
                        {paragraph}
                      </p>
                    ),
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-100">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="text-2xl font-bold text-gray-900">
                        {stats.students.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="text-2xl font-bold text-gray-900">
                        {stats.rating}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-green-600" />
                      <span className="text-2xl font-bold text-gray-900">
                        {stats.duration}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <BarChart className="w-5 h-5 text-purple-600" />
                      <span className="text-2xl font-bold text-gray-900">
                        {stats.level}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">Level</div>
                  </div>
                </div>
              </div>

              {/* Course Image */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="relative h-64 md:h-80 lg:h-96">
                  {getUploadUrl(course.imageUrl || course.image) ? (
                    <>
                      <ImageWithFallback
                        src={getUploadUrl(course.imageUrl || course.image)}
                        alt={course.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                      <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition">
                        <PlayCircle className="w-12 h-12 text-white" />
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <BookOpen className="w-24 h-24 text-blue-600 opacity-50" />
                    </div>
                  )}
                </div>
              </div>

              {/* Curriculum */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Target className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-bold text-gray-900">
                    What You'll Learn
                  </h2>
                </div>

                <div className="space-y-3">
                  {[
                    "Master fundamental concepts and principles",
                    "Build real-world projects and applications",
                    "Get expert feedback and guidance",
                    "Earn a recognized certificate",
                    "Join an active community of learners",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interaction Section */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Community & Feedback
                  </h2>
                </div>

                <div className="space-y-6">
                  <LikeFeature />
                  <CommentFeature />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Enrollment Card */}
              {!managementView && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-sm font-semibold mb-4">
                      <Zap className="w-4 h-4" />
                      INSTANT ACCESS
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Start Learning Today
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Join {stats.students.toLocaleString()}+ successful
                      students
                    </p>
                  </div>

                  <button
                    onClick={handleEnroll}
                    disabled={enrolled || status === "loading"}
                    className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                      enrolled
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                    }`}
                  >
                    {enrolled ? (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Enrolled ✓
                      </span>
                    ) : status === "loading" ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Enroll Now
                      </span>
                    )}
                  </button>

                  {enrolled && (
                    <button
                      onClick={() => navigate("/user/learning-room")}
                      className="w-full mt-4 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:shadow-lg transition"
                    >
                      Go to Dashboard
                    </button>
                  )}

                  <div className="space-y-4 mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Course Level</span>
                      <span className="font-semibold text-gray-900">
                        {stats.level}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-semibold text-gray-900">
                        {stats.duration}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Certificate</span>
                      <span className="font-semibold text-green-600">
                        Included
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Access</span>
                      <span className="font-semibold text-green-600">
                        Lifetime
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Instructor Info */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {course.courseCreatedBy?.name?.charAt(0) || "E"}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Instructor</h4>
                    <p className="text-sm text-gray-600">
                      {course.courseCreatedBy?.name || "EDU-ZONE Expert"}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Expert instructor with years of industry experience and
                  passion for teaching.
                </p>
                <button className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm">
                  View Profile
                </button>
              </div>

              {/* Features */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h4 className="font-bold text-gray-900 mb-4">
                  Course Features
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <PlayCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-700">
                      20+ Hours Video Content
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <Download className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700">
                      Downloadable Resources
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Award className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm text-gray-700">
                      Certificate of Completion
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-yellow-600" />
                    </div>
                    <span className="text-sm text-gray-700">
                      Money Back Guarantee
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetail;
