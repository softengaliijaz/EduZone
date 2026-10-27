import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCourse,
  fetchCourses,
} from "../../../features/admin/courseSlice";
import Loader from "../../../components/common/Loader";
import ErrorBox from "../../../components/common/ErrorBox";
import {
  Search,
  Filter,
  Trash2,
  AlertTriangle,
  Shield,
  Eye,
  BookOpen,
  Clock,
  Users,
} from "lucide-react";
import { toast } from "react-hot-toast";
import useConfirmDialog from "../../../components/common/useConfirmDialog";
import { getUploadUrl } from "../../../utils/constants";

const DeleteCoursePage = () => {
  const dispatch = useDispatch();
  const confirm = useConfirmDialog();

  const {
    courses = [],
    loading: courseLoader,
    error: courseError,
  } = useSelector((state) => state.course);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  // Get unique categories
  const categories = [
    "all",
    ...new Set(courses.map((c) => c.category).filter(Boolean)),
  ];

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || course.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteClick = async (course) => {
    const confirmed = await confirm({
      title: "Delete course?",
      message: `“${course.title}” will be permanently removed. Existing enrollment records are not automatically deleted.`,
      confirmLabel: "Delete course",
    });
    if (!confirmed) return;
    try {
      await dispatch(deleteCourse({ id: course._id })).unwrap();
      toast.success(`“${course.title}” deleted successfully.`);
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to delete course.");
    }
  };

  const getImageUrl = (course) =>
    course.imageUrl ||
    getUploadUrl(course.image);

  if (courseLoader) {
    return <Loader title="Loading courses..." />;
  }

  if (courseError) {
    return <ErrorBox message={courseError} />;
  }

  return (
    <>

      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Manage Courses
                  </h1>
                  <p className="text-gray-600">
                    Delete courses from the platform
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Total Courses</div>
              <div className="text-2xl font-bold text-gray-900">
                {courses.length}
              </div>
            </div>
          </div>

          {/* Warning Banner */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 mb-1">Warning</h4>
                <p className="text-sm text-red-800">
                  Deleting a course will remove it permanently. All enrolled
                  students will lose access to this course.
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow border border-gray-100 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === "all" ? "All Categories" : cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Courses List */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterCategory !== "all"
                ? "Try adjusting your search or filters"
                : "There are no courses available"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCourses.map((course) => (
                    <tr
                      key={course._id}
                      className="hover:bg-red-50/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {course.image ? (
                              <img
                                src={getImageUrl(course)}
                                alt={course.title}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 line-clamp-1">
                              {course.title}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {course.description?.substring(0, 60)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {course.category || "Uncategorized"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {course.level}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {course.duration}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              window.open(
                                `/courses/course-details/course/${course._id}`,
                                "_blank",
                              )
                            }
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(course)}
                            disabled={courseLoader}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="grid gap-4 md:hidden p-4">
              {filteredCourses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-xl border border-gray-200 p-4 space-y-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {course.image ? (
                        <img
                          src={getImageUrl(course)}
                          alt={course.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                          <BookOpen className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {course.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {course.category}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {course.level}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() =>
                        window.open(`/courses/course-details/course/${course._id}`, "_blank")
                      }
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    <button
                      onClick={() => handleDeleteClick(course)}
                      disabled={courseLoader}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        {filteredCourses.length > 0 && (
          <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
            <div>
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredCourses.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {courses.length}
              </span>{" "}
              courses
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-400" />
              <span>Administrator access required</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DeleteCoursePage;

