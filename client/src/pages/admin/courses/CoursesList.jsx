import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllCourses,
  deleteCourse,
} from "../../../features/admin/courseSlice";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/common/Loader";
import ErrorBox from "../../../components/common/ErrorBox";
import {
  Edit,
  Trash2,
  Eye,
  Plus,
  Search,
  Filter,
  BookOpen,
  User,
  Clock,
  TrendingUp,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { getUploadUrl } from "../../../utils/constants";
import ImageWithFallback from "../../../components/common/ImageWithFallback";
import useConfirmDialog from "../../../components/common/useConfirmDialog";

const CoursesListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const confirm = useConfirmDialog();

  const { courses, loading, error } = useSelector((state) => state.course);
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.user_type === "admin";
  const workspaceBase = user?.user_type === "instructor" ? "/instructor" : "/admin";

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    dispatch(fetchAllCourses());
  }, [dispatch]);

  const handleDelete = async (id, title) => {
    const confirmed = await confirm({
      title: "Delete course?",
      message: `“${title}” will be permanently removed. Existing enrollment records are not automatically deleted.`,
      confirmLabel: "Delete course",
    });
    if (!confirmed) return;
    try {
      await dispatch(deleteCourse({ id })).unwrap();
      toast.success("Course deleted successfully!");
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to delete course");
    }
  };

  const handleView = (id) => {
    navigate(`${workspaceBase}/courses-management/course/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`${workspaceBase}/courses-management/update-course/${id}`);
  };

  /** helpers */
  const isCreatorObject = (creator) => typeof creator === "object";

  const getCreatorName = (creator) =>
    isCreatorObject(creator) ? creator?.name || "Unknown" : "Unknown";

  const getImageUrl = (course) =>
    getUploadUrl(course.imageUrl || course.image);

  /** filter only current user's courses */
  const visibleCourses = isAdmin ? courses : courses?.filter((course) =>
    isCreatorObject(course.courseCreatedBy)
      ? course.courseCreatedBy?._id === user?._id
      : course.courseCreatedBy === user?._id,
  );

  // Get unique categories
  const categories = [
    "all",
    ...new Set(visibleCourses?.map((c) => c.category).filter(Boolean)),
  ];

  // Filter courses based on search and category
  const filteredCourses = visibleCourses?.filter((course) => {
    const matchesSearch =
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || course.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <Loader title="Loading courses..." />;
  if (error) return <ErrorBox message={error} />;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {isAdmin ? "Course Catalog" : "My Courses"}
            </h1>
            <p className="text-gray-600">
              {isAdmin ? "Review and manage courses created across the platform" : "Manage and edit your uploaded courses"}
            </p>
          </div>
          <button
            onClick={() => navigate(`${workspaceBase}/courses-management/create-course`)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            New Course
          </button>
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
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      {filteredCourses?.length === 0 ? (
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
              : "You haven't uploaded any courses yet"}
          </p>
          <button
            onClick={() => navigate(`${workspaceBase}/courses-management/create-course`)}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Your First Course
          </button>
        </div>
      ) : (
        <>
          {/* Mobile Cards */}
          <div className="grid gap-4 md:hidden">
            {filteredCourses?.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {getImageUrl(course) ? (
                        <ImageWithFallback
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
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-1">
                          {course.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration}
                        </span>
                        <span>•</span>
                        <span>{course.level}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(course._id)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(course._id)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course._id, course.title)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCourses?.map((course) => (
                    <tr
                      key={course._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {getImageUrl(course) ? (
                              <ImageWithFallback
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
                            <div className="font-medium text-gray-900">
                              {course.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {getCreatorName(course.courseCreatedBy)}
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
                        <span className="text-gray-700">{course.students ?? 0}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(course._id)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Preview course details"
                            aria-label={`Preview ${course.title}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(course._id)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(course._id, course.title)
                            }
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
          </div>
        </>
      )}
    </div>
  );
};

export default CoursesListPage;
