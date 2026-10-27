import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBlogThunk } from "../../../features/admin/blogSlice";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Upload,
  FileText,
  Tag,
  Layers,
  Image as ImageIcon,
  Sparkles,
  Loader2,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import ImageWithFallback from "../../../components/common/ImageWithFallback";

const CreateBlogPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.blogs || {});

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [characterCount, setCharacterCount] = useState(0);

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

  // ===== handlers =====
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "content") {
      setCharacterCount(value.length);
    }
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
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim() || !formData.category.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title.trim());
    data.append("content", formData.content.trim());
    data.append("category", formData.category.trim());
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
      await dispatch(createBlogThunk(data)).unwrap();
      toast.success("🎉 Blog created successfully!");
      navigate("/admin/blog/get-all-blogs");
    } catch (err) {
      toast.error(err || "Failed to create blog");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Create New Blog
            </h1>
            <p className="text-gray-600">
              Share your knowledge and insights with the world
            </p>
          </div>
        </div>

      </div>

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
              placeholder="e.g., How to Master React Hooks in 2024"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
            <p className="text-xs text-gray-500 mt-2">
              Make it catchy and descriptive
            </p>
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
              rows={12}
              maxLength={5000}
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              placeholder="Write your blog content here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">Separate paragraphs with a blank line to make the article easier to read.</p>
            <div className="flex justify-between mt-2">
              <p className="text-xs text-gray-500">
                Add enough detail to make the article useful
              </p>
              <p
                className={`text-xs ${characterCount >= 500 ? "text-green-600" : "text-gray-500"}`}
              >
                {characterCount}/5000
              </p>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Blog Image
            </label>

            <div className="space-y-4">
              {/* Upload Area */}
              <label
                className={`
                block border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
                transition-all hover:border-blue-400 hover:bg-blue-50
                ${preview ? "border-blue-300 bg-blue-50" : "border-gray-300"}
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
                      {preview ? "Change image" : "Upload blog image"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      PNG, JPG, or WebP • Max 5MB • 1200×630px recommended
                    </p>
                  </div>
                </div>
              </label>

              {/* Preview */}
              {preview && (
                <div className="relative">
                  <div className="text-sm font-medium text-gray-900 mb-2">
                    Preview
                  </div>
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 max-w-xs">
                    <ImageWithFallback
                      src={preview}
                      alt="Blog image preview"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-3 right-3 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">
                  Tips for a great blog
                </h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• Start with an engaging hook or question</li>
                  <li>• Use subheadings to break up content</li>
                  <li>• Add code snippets or examples when relevant</li>
                  <li>• Include a clear call-to-action at the end</li>
                  <li>• Use relevant tags for better discoverability</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Blog...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Publish Blog
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm">❌ {error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateBlogPage;
