import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs, deleteBlog } from "../../../features/admin/blogSlice";
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
  FileText,
  Calendar,
  Clock,
  Hash,
  TrendingUp,
} from "lucide-react";
import { toast } from "react-hot-toast";
import useConfirmDialog from "../../../components/common/useConfirmDialog";
import { getUploadUrl } from "../../../utils/constants";

const BlogListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const confirm = useConfirmDialog();

  const { blogs, loading, error } = useSelector((state) => state.blogs);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const handleDelete = async (id, title) => {
    const confirmed = await confirm({
      title: "Delete article?",
      message: `“${title}” will be permanently removed and will no longer be publicly available.`,
      confirmLabel: "Delete article",
    });
    if (!confirmed) return;
    try {
      await dispatch(deleteBlog(id)).unwrap();
      toast.success("Blog deleted successfully!");
      dispatch(fetchBlogs());
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to delete blog");
    }
  };

  const handleView = (id) => {
    navigate(`/view-blog-details/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/admin/blog/update-blog/${id}`);
  };

  const getImageUrl = (blog) =>
    getUploadUrl(blog.image);

  // Get unique categories
  const categories = [
    "all",
    ...new Set(blogs?.map((blog) => blog.category).filter(Boolean)),
  ];

  // Calculate reading time
  const calculateReadingTime = (content) => {
    if (!content) return "0 min read";
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min read`;
  };

  // Filter and sort blogs
  const filteredBlogs = blogs
    ?.filter((blog) => {
      const matchesSearch =
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        filterCategory === "all" || blog.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.publish_date) - new Date(a.publish_date);
      if (sortBy === "oldest")
        return new Date(a.publish_date) - new Date(b.publish_date);
      if (sortBy === "title") return a.title?.localeCompare(b.title);
      return 0;
    });

  if (loading) return <Loader title="Loading blogs..." />;
  if (error) return <ErrorBox message={error} />;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              My Blogs
            </h1>
            <p className="text-gray-600">
              Manage your articles and keep your learning community informed
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/blog/add-blog")}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
          >
            <Plus className="w-5 h-5" />
            New Blog
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Blogs</p>
                <p className="text-xl font-bold text-gray-900">
                  {blogs?.length || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Hash className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Categories</p>
                <p className="text-xl font-bold text-gray-900">
                  {categories.length - 1}
                </p>
              </div>
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
                  placeholder="Search blogs by title, content, or category..."
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
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blogs List */}
      {filteredBlogs?.length === 0 ? (
        <div className="flex min-h-[36vh] flex-col items-center justify-center py-12 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No blogs found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterCategory !== "all"
              ? "Try adjusting your search or filters"
              : "You haven't published any articles yet. Use New Blog above to get started."}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Cards */}
          <div className="grid gap-4 md:hidden">
            {filteredBlogs?.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {blog.image ? (
                        <img
                          src={getImageUrl(blog)}
                          alt={blog.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                          <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-1">
                          {blog.title}
                        </h3>
                        {blog.category && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            {blog.category}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {blog.content}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(blog.publish_date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {calculateReadingTime(blog.content)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(blog._id)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(blog._id)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id, blog.title)}
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
                      Blog
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Published Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Reading Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBlogs?.map((blog) => (
                    <tr
                      key={blog._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {blog.image ? (
                              <img
                                src={getImageUrl(blog)}
                                alt={blog.title}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-gray-900 line-clamp-1">
                              {blog.title}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-2 mt-1">
                              {blog.content?.substring(0, 100)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {blog.category ? (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            {blog.category}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            Uncategorized
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(blog.publish_date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {calculateReadingTime(blog.content)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(blog._id)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(blog._id)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(blog._id, blog.title)}
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

      {/* Summary */}
      {filteredBlogs?.length > 0 && (
        <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
          <div>
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredBlogs?.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">{blogs?.length}</span>{" "}
            blogs
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <span>
              {Math.round((filteredBlogs?.length / blogs?.length) * 100)}% match
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogListPage;
