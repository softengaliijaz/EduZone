import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserProfile,
  updateProfile,
  setUser,
} from "../../features/auth/userApiSlice";
import Sidebar from "../../components/settings/shared/Sidebar";
import { toast } from "react-hot-toast";

const StudentProfileSettings = () => {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.auth);
  const userId = user?._id;

  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({ name: "", email: "", bio: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(getUserProfile(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = () => {
    if (!user?._id) return;

    setSaving(true);
    dispatch(updateProfile({ userId: user._id, formData }))
      .unwrap()
      .then((updatedUser) => {
        dispatch(setUser(updatedUser));
        setIsEditing(false);
        toast.success("Profile updated successfully.");
      })
      .catch((err) => {
        toast.error(`Profile update failed: ${err}`);
      })
      .finally(() => setSaving(false));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        {activeTab === "profile" && (
          <div className="space-y-6 max-w-4xl bg-white p-4 sm:p-6 rounded-xl shadow">
            <h1 className="text-2xl font-bold text-[#1C1E53]">
              Student Profile
            </h1>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="Student Avatar"
                className="w-20 h-20 rounded-full border"
              />
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-semibold">{formData.name}</h2>
                <p className="text-gray-500">{formData.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 font-medium">Full Name</label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border rounded-md ${
                    isEditing ? "bg-white" : "bg-gray-100"
                  }`}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2 border rounded-md bg-gray-100"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 font-medium">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-md resize-none ${
                    isEditing ? "bg-white" : "bg-gray-100"
                  }`}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="border px-5 py-2 rounded-md text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {status === "failed" && (
              <p className="text-red-500 mt-2">Error: {error}</p>
            )}
          </div>
        )}

        {/* Stub Tabs */}
        {["password", "notifications", "preferences"].includes(activeTab) && (
          <div>
            <h2 className="text-xl font-semibold capitalize">
              {activeTab} Settings
            </h2>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              Feature not implemented yet.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentProfileSettings;
