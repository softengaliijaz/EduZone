import React, { useState } from "react";
import axiosInstance from "../../services/axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUploadUrl } from "../../utils/constants";
import { toast } from "react-hot-toast";
import useConfirmDialog from "../common/useConfirmDialog";
import {
  User,
  Mail,
  Edit2,
  Save,
  X,
  Trash2,
  Shield,
  Calendar,
  Award,
  BookOpen,
  TrendingUp,
  Clock,
  CheckCircle,
  Loader2,
  Sparkles,
  MessageSquare,
} from "lucide-react";

const UserProfileView = ({ user }) => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);
  const confirm = useConfirmDialog();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    user_type: user?.user_type || "student",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(`/api/users/${user._id}`, formData);
      setMsg("Profile updated successfully!");
      setErrorMsg("");
      setEditMode(false);
      const updatedRole = response.data?.data?.user_type || formData.user_type;
      if (updatedRole !== user.user_type) {
        navigate(updatedRole === "student" ? "/admin/get-all-students" : "/admin/get-all-instructors", { replace: true });
      }
      // Simulate data refresh
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Delete user account?",
      message: `This permanently removes ${user.name}'s account. Enrollment and attendance records are not automatically deleted.`,
      confirmLabel: "Delete account",
    });
    if (!confirmed) return;
    try {
      await axiosInstance.delete(`/api/users/${user._id}`);
      toast.success("User account deleted.");
      navigate(-1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">User data not available.</p>
        </div>
      </div>
    );
  }

  // Role-based configurations
  const roleConfig = {
    admin: {
      gradient: "from-red-500 to-orange-400",
      icon: <Shield className="w-6 h-6" />,
      label: "SYSTEM ADMIN",
      color: "text-red-600",
      bg: "bg-red-50",
    },
    instructor: {
      gradient: "from-green-500 to-emerald-400",
      icon: <Award className="w-6 h-6" />,
      label: "INSTRUCTOR",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    student: {
      gradient: "from-blue-500 to-cyan-400",
      icon: <User className="w-6 h-6" />,
      label: "STUDENT",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  };

  const config = roleConfig[user.user_type] || roleConfig.student;
  const userInitial = user.name?.charAt(0) || user.email?.charAt(0) || "U";
  const profileImage = getUploadUrl(user.profile_picture_url);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-linear-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-full text-sm font-semibold mb-3">
                <User className="w-4 h-4" />
                USER PROFILE MANAGEMENT
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                User Profile
              </h1>
              <p className="text-gray-600">
                View and manage user information and settings
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Back
              </button>
            </div>
          </div>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          {/* Profile Header */}
          <div
            className={`bg-linear-to-r ${config.gradient} p-8 text-white relative overflow-hidden`}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 border-4 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 border-4 border-white rounded-full transform translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* User Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-3xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full rounded-3xl object-cover"
                    />
                  ) : (
                    <span className="text-5xl font-bold">{userInitial}</span>
                  )}
                </div>
                <div
                  className={`absolute -bottom-3 -right-3 w-16 h-16 rounded-2xl ${config.bg} flex items-center justify-center shadow-xl border-2 border-white`}
                >
                  <div className={config.color}>{config.icon}</div>
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center lg:text-left">
                {editMode ? (
                  <div className="space-y-4 max-w-2xl">
                    <div>
                      <label className="block text-sm text-white/80 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/80 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        readOnly
                        aria-describedby="email-edit-note"
                        className="w-full cursor-not-allowed rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white/75"
                      />
                      <p id="email-edit-note" className="mt-1 text-xs text-white/75">Login email cannot be changed here.</p>
                    </div>
                    {currentUser?.user_type === "admin" && (
                      <div>
                        <label className="block text-sm text-white/80 mb-2">
                          User Role
                        </label>
                        <select
                          name="user_type"
                          value={formData.user_type}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                        >
                          <option value="student" className="text-gray-900">
                            Student
                          </option>
                          <option value="instructor" className="text-gray-900">
                            Instructor
                          </option>
                          <option value="admin" className="text-gray-900">
                            Admin
                          </option>
                        </select>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-3">
                      <Sparkles className="w-4 h-4" />
                      {config.label}
                    </div>
                    <h2 className="text-4xl font-bold mb-3">{user.name}</h2>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-white/90">
                        <Mail className="w-5 h-5" />
                        <span className="text-lg">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/80">
                        <Calendar className="w-5 h-5" />
                        <span>
                          Joined{" "}
                          {new Date(user.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8">
            {/* Messages */}
            <div className="mb-8 space-y-3">
              {msg && (
                <div className="flex items-center gap-3 bg-green-50 text-green-700 p-4 rounded-2xl">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">{msg}</span>
                </div>
              )}
              {errorMsg && (
                <div className="flex items-center gap-3 bg-red-50 text-red-700 p-4 rounded-2xl">
                  <X className="w-5 h-5" />
                  <span className="font-medium">{errorMsg}</span>
                </div>
              )}
            </div>

            {/* Bio Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-6 h-6 text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-900">About</h3>
              </div>
              {editMode ? (
                <textarea
                  name="bio"
                  rows={5}
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <div className="bg-gray-50 rounded-2xl p-6">
                  <p className="text-gray-700 leading-relaxed">
                    {user.bio ||
                      "No bio provided. This user hasn't added any information about themselves yet."}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {editMode ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="group flex items-center gap-3 px-8 py-3 bg-linear-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex items-center gap-3 px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditMode(true)}
                    className="group flex items-center gap-3 px-8 py-3 bg-linear-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                  >
                    <Edit2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Edit Profile
                  </button>
                </>
              )}

              {currentUser?.user_type === "admin" && !editMode && (
                <button
                  onClick={handleDelete}
                  className="group flex items-center gap-3 px-8 py-3 bg-linear-to-r from-red-600 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  <Trash2 className="w-5 h-5 group-hover:shake" />
                  Delete User
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 gap-8">
          {/* Account Information */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Account Details
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-500 mb-2">
                  Member Since
                </label>
                <p className="font-medium text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">
                  Account Type
                </label>
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 ${config.bg} ${config.color} rounded-full font-semibold`}
                >
                  {config.icon}
                  {config.label}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-5deg);
          }
          75% {
            transform: rotate(5deg);
          }
        }
        .hover\\:shake:hover {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default UserProfileView;
