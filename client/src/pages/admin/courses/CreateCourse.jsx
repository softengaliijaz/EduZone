import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCourse } from "../../../features/admin/courseSlice";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  BookOpen,
  Clock,
  Layers,
  Award,
  FileText,
  X,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

const CreateCoursePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.course);
  const { user } = useSelector((state) => state.auth);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const levels = [
    {
      value: "Beginner",
      label: "Beginner",
      icon: "👶",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      value: "Intermediate",
      label: "Intermediate",
      icon: "🚀",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      value: "Advanced",
      label: "Advanced",
      icon: "🏆",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  const popularCategories = [
    "Programming",
    "Design",
    "Business",
    "Marketing",
    "Data Science",
    "Personal Development",
  ];

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

    if (!title.trim() || !description.trim() || !duration.trim() || !category.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("duration", duration.trim());
    formData.append("level", level);
    formData.append("category", category.trim());
    if (image) formData.append("image", image);

    try {
      await dispatch(createCourse(formData)).unwrap();

      toast.success("🎉 Course created successfully!");
      navigate(
        user?.user_type === "admin"
          ? "/admin/courses-management/get-all-courses"
          : "/instructor/courses-management/get-all-courses",
      );
    } catch (err) {
      toast.error(err || "Failed to create course");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Create New Course
            </h1>
            <p className="text-gray-600">Share your knowledge with the world</p>
          </div>
        </div>

      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Course Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Course Title *
            </label>
            <input
              type="text"
              name="title"
              autoComplete="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g., Complete Web Development Bootcamp"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
            <p className="text-xs text-gray-500 mt-2">
              Make it descriptive and engaging
            </p>
          </div>

          {/* Category & Duration */}
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
                  autoComplete="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  placeholder="Enter category..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {popularCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        category === cat
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
                <Clock className="w-4 h-4 text-orange-600" />
                Duration *
              </label>
              <input
                type="text"
                name="duration"
                autoComplete="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                placeholder="e.g., 8 weeks, 30 hours"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-2">
                Estimated total learning time
              </p>
            </div>
          </div>

          {/* Level Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              Level *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {levels.map((lvl) => (
                <button
                  key={lvl.value}
                  type="button"
                  onClick={() => setLevel(lvl.value)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    level === lvl.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{lvl.icon}</span>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">
                        {lvl.label}
                      </div>
                      <div className={`text-xs ${lvl.color}`}>
                        Suitable for {lvl.value.toLowerCase()} learners
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              Course Description *
            </label>
            <textarea
              rows={6}
              name="description"
              autoComplete="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Describe what students will learn, prerequisites, and key takeaways..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">Separate paragraphs with a blank line; formatting is preserved on the course page.</p>
            <div className="flex justify-between mt-2">
              <p className="text-xs text-gray-500">
                Minimum 100 characters recommended
              </p>
              <p className="text-xs text-gray-500">{description.length}/500</p>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Course Thumbnail
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
                      {preview ? "Change thumbnail" : "Upload course thumbnail"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      PNG, JPG, or WebP • Max 5MB • 600×400px recommended
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
                  <div className="relative rounded-xl overflow-hidden border border-gray-200">
                    <img
                      src={preview}
                      alt="Course thumbnail preview"
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
                  Tips for a great course
                </h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>
                    • Use a clear, descriptive title that explains the value
                  </li>
                  <li>
                    • Choose an engaging thumbnail that represents your content
                  </li>
                  <li>• Be specific about what students will learn</li>
                  <li>
                    • Set realistic expectations for duration and difficulty
                  </li>
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
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Course...
                </>
              ) : (
                <>
                  Create Course
                  <CheckCircle className="w-5 h-5" />
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

export default CreateCoursePage;
