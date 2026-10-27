import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCourse } from "../../../features/admin/courseSlice";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../services/axios";
import {
  Save,
  Upload,
  BookOpen,
  Clock,
  Layers,
  Award,
  FileText,
  X,
  ArrowLeft,
  RotateCcw,
  Eye,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { getUploadUrl } from "../../../utils/constants";
import ImageWithFallback from "../../../components/common/ImageWithFallback";

const UpdateCoursePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.course);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    level: "Beginner",
    category: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

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

  // ===== Fetch course =====
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axiosInstance.get(`/api/courses/${id}`);
        const course = res.data.data;

        setFormData({
          title: course.title || "",
          description: course.description || "",
          duration: course.duration || "",
          level: course.level || "Beginner",
          category: course.category || "",
        });

        const imageUrl = getUploadUrl(course.imageUrl || course.image);

        if (imageUrl) {
          setPreview(imageUrl);
          setOriginalImage(imageUrl);
        }
      } catch (err) {
        console.error("Failed to load course", err);
        toast.error("Failed to load course details");
      } finally {
        setLoadingCourse(false);
      }
    };

    fetchCourse();
  }, [id]);

  // Check for changes
  useEffect(() => {
    if (!loadingCourse) {
      const hasFormChanges = Object.values(formData).some(
        (value) => value !== "",
      );
      const hasImageChanges = image !== null;
      setHasChanges(hasFormChanges || hasImageChanges);
    }
  }, [formData, image, loadingCourse]);

  // ===== Handlers =====
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

  const resetForm = () => {
    setImage(null);
    if (preview !== originalImage) {
      URL.revokeObjectURL(preview);
    }
    setPreview(originalImage);
    // Reset form to original values would require storing original form data
    toast.success("Changes reset");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.duration ||
      !formData.category
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (image) data.append("image", image);

    try {
      await dispatch(
        updateCourse({ id, courseData: data }),
      ).unwrap();
      toast.success("✅ Course updated successfully!");
      navigate("/admin/courses-management/get-all-courses");
    } catch (err) {
      toast.error(err || "Failed to update course");
    }
  };

  if (loadingCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-700">Loading course details...</p>
        </div>
      </div>
    );
  }

  return (
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
                Edit Course
              </h1>
              <p className="text-gray-600">
                Update course details and improve content
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetForm}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={() => window.open(`/courses/course-details/course/${id}`, "_blank")}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>
        </div>

        {/* Changes Indicator */}
        {hasChanges && (
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
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Complete Web Development Bootcamp"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
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
                <Clock className="w-4 h-4 text-orange-600" />
                Duration *
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                placeholder="e.g., 8 weeks, 30 hours"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, level: lvl.value }))
                  }
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.level === lvl.value
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
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe what students will learn, prerequisites, and key takeaways..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">Separate paragraphs with a blank line; formatting is preserved on the course page.</p>
            <div className="flex justify-between mt-2">
              <p className="text-xs text-gray-500">
                Detailed descriptions help students understand the course value
              </p>
              <p className="text-xs text-gray-500">
                {formData.description.length}/2000
              </p>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Course Thumbnail
            </label>

            <div className="space-y-4">
              {/* Current Image */}
              {preview && (
                <div>
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 max-w-xs">
                    <ImageWithFallback
                      src={preview}
                      alt="Course Thumbnail Preview"
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
                      {image ? "Change thumbnail" : "Upload new thumbnail"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      PNG, JPG, or WebP • Max 5MB • 600×400px recommended
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
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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

export default UpdateCoursePage;
