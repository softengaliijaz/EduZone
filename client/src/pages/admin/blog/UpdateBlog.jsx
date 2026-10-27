import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBlogs,
  updateBlog,
  deleteBlog,
} from "../../../features/admin/blogSlice";
import { useParams, useNavigate } from "react-router-dom";
import {
  Save,
  Upload,
  FileText,
  Tag,
  Layers,
  Image as ImageIcon,
  AlertTriangle,
  ArrowLeft,
  RotateCcw,
  Eye,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import useConfirmDialog from "../../../components/common/useConfirmDialog";
import ImageWithFallback from "../../../components/common/ImageWithFallback";
import { getUploadUrl } from "../../../utils/constants";

const UpdateBlogPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const confirm = useConfirmDialog();

  const {
    blogs = [],
    loading,
    error,
  } = useSelector((state) => state.blogs || {});

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
    category: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [blogLoaded, setBlogLoaded] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const popularCategories = [
    "Technology",
    "Education",
    "Lifestyle",
    "Health",
    "Business",
    "Programming",
  ];
  const popularTags = [
    "react",
    "javascript",
    "webdev",
    "nodejs",
    "tutorial",
    "beginners",
  ];

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  useEffect(() => {
    const blog = blogs.find((b) => b._id === id);
    if (blog) {
      setFormData({
        title: blog.title || "",
        content: blog.content || "",
        tags: (blog.tags || []).join(", "),
        category: blog.category || "",
      });

      const imageUrl = getUploadUrl(blog.imageUrl || blog.image);

      if (imageUrl) {
        setPreview(imageUrl);
        setOriginalImage(imageUrl);
      }

      setBlogLoaded(true);
    }
  }, [blogs, id]);

  // Check for changes
  useEffect(() => {
    if (blogLoaded) {
      const hasFormChanges = Object.values(formData).some(
        (value) => value !== "",
      );
      const hasImageChanges = image !== null;
      setHasChanges(hasFormChanges || hasImageChanges);
    }
  }, [formData, image, blogLoaded]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImage(file);
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };

  const removeImage = () => {
    setImage(null);
    if (preview && preview !== originalImage) {
      URL.revokeObjectURL(preview);
    }
    setPreview(originalImage);
  };

  const resetImage = () => {
    setImage(null);
    if (preview !== originalImage) {
      URL.revokeObjectURL(preview);
    }
    setPreview(originalImage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.category) {
      toast.error("Please fill all required fields");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("category", formData.category);
    data.append(
      "tags",
      JSON.stringify(
        formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
      ),
    );
    if (image) data.append("image", image);

    try {
      await dispatch(updateBlog({ id, blogData: data })).unwrap();
      toast.success("✅ Blog updated successfully!");
      navigate("/admin/blog");
    } catch (err) {
      toast.error(err || "Failed to update blog");
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Delete article?",
      message: "This article will be permanently removed and will no longer be publicly available.",
      confirmLabel: "Delete article",
    });
    if (!confirmed) return;
    try {
      await dispatch(deleteBlog(id)).unwrap();
      toast.success("Blog deleted successfully!");
      navigate("/admin/blog");
    } catch {
      toast.error("Failed to delete blog");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-700">Loading blog details...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Delete Confirmation Modal */}
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Edit Blog
                </h1>
                <p className="text-gray-600">
                  Update your blog content and details
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  window.open(`/view-blog-details/${id}`, "_blank")
                }
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
            </div>
          </div>

          {/* Changes Indicator */}
          {hasChanges && blogLoaded && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                <p className="text-sm text-blue-800">
                  You have unsaved changes. Remember to save your updates.
                </p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700">⚠️ {error}</p>
          </div>
        )}

        {blogLoaded && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Blog Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Blog Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., How to Master React in 2024"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>

              {/* Category & Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-green-600" />
                    Category *
                  </label>
                  <div>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      placeholder="Enter category..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="flex flex-wrap gap-2 mt-3">
                      {popularCategories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, category: cat }))
                          }
                          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                            formData.category === cat
                              ? "bg-blue-100 text-blue-700 border border-blue-200"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-purple-600" />
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="react, javascript, webdev"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {popularTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          const currentTags = formData.tags
                            .split(",")
                            .map((t) => t.trim())
                            .filter((t) => t);
                          if (!currentTags.includes(tag)) {
                            setFormData((prev) => ({
                              ...prev,
                              tags: [...currentTags, tag].join(", "),
                            }));
                          }
                        }}
                        className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                          formData.tags.includes(tag)
                            ? "bg-purple-100 text-purple-700 border border-purple-200"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Content *
                </label>
                <textarea
                  rows={10}
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  placeholder="Write your blog content here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <div className="flex justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    Minimum 500 characters recommended
                  </p>
                  <p className="text-xs text-gray-500">
                    {formData.content.length}/5000
                  </p>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Blog Image
                </label>

                <div className="space-y-4">
                  {/* Current Image */}
                  {preview && (
                    <div>
                      <div className="text-sm font-medium text-gray-900 mb-2">
                        Current Image
                      </div>
                      <div className="relative rounded-xl overflow-hidden border border-gray-200 max-w-xs">
                        <ImageWithFallback
                          src={preview}
                          alt="Current blog image"
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute bottom-3 right-3 flex gap-2">
                          {image && (
                            <button
                              type="button"
                              onClick={resetImage}
                              className="p-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                              title="Reset to original"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          )}
                          {preview !== originalImage && (
                            <button
                              type="button"
                              onClick={removeImage}
                              className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                              title="Remove new image"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Upload Area */}
                  <label
                    className={`
                    block border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
                    transition-all hover:border-blue-400 hover:bg-blue-50
                    ${image ? "border-blue-300 bg-blue-50" : "border-gray-300"}
                  `}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                        <Upload className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {image ? "Change image" : "Upload new image"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          PNG, JPG, or WebP • Max 5MB • 1200×630px recommended
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !hasChanges}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {hasChanges ? "Save Changes" : "No Changes Made"}
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Danger Zone */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-900 mb-1">
                      Danger Zone
                    </h3>
                    <p className="text-sm text-red-800">
                      Deleting a blog is permanent and cannot be undone. All
                      data will be lost.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDelete}
                  className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                >
                  Delete Blog
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UpdateBlogPage;
