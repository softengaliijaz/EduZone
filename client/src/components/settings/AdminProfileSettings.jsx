import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Camera, CalendarDays, Check, Edit2, Loader2, Mail, Save, Shield, UserRound, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { updateProfile, setUser } from "../../features/auth/userApiSlice";
import { getUploadUrl } from "../../utils/constants";

const getImageUrl = (image) => {
  return getUploadUrl(image);
};

const getInitials = (name) =>
  name?.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "A";

const AdminProfileSettings = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [formData, setFormData] = useState({ name: "", bio: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    setFormData({ name: user?.name || "", bio: user?.bio || "" });
    setImagePreview(getImageUrl(user?.profile_picture_url));
  }, [user]);

  useEffect(() => () => {
    if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file.");
      event.target.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB.");
      event.target.value = "";
      return;
    }
    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({ name: user?.name || "", bio: user?.bio || "" });
    setProfileImage(null);
    setImagePreview(getImageUrl(user?.profile_picture_url));
    setIsEditing(false);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!user?._id) {
      toast.error("Your account could not be found. Sign in again and retry.");
      return;
    }

    const name = formData.name.trim();
    if (name.length < 2 || name.length > 100) {
      toast.error("Name must be between 2 and 100 characters.");
      return;
    }
    if (formData.bio.length > 300) {
      toast.error("Bio must be 300 characters or fewer.");
      return;
    }

    setSaving(true);
    try {
      const payload = new FormData();
      payload.append("name", name);
      payload.append("bio", formData.bio.trim());
      if (profileImage) payload.append("profile_picture_url", profileImage);

      const updatedUser = await dispatch(updateProfile({ userId: user._id, formData: payload })).unwrap();
      dispatch(setUser(updatedUser));
      setProfileImage(null);
      setIsEditing(false);
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(typeof error === "string" ? error : error?.message || "Profile update failed.");
    } finally {
      setSaving(false);
    }
  };

  const joinedDate = user?.createdAt || user?.registration_date;
  const formattedJoinedDate = joinedDate && !Number.isNaN(new Date(joinedDate).getTime())
    ? new Date(joinedDate).toLocaleDateString(undefined, { month: "long", year: "numeric" })
    : "Date unavailable";

  if (!user) {
    return <div className="admin-settings"><div className="admin-settings__empty" role="status">Loading your profile…</div></div>;
  }

  return (
    <main className="admin-settings">
      <header className="admin-settings__header">
        <div>
          <p className="admin-settings__eyebrow">ACCOUNT</p>
          <h1>Profile settings</h1>
          <p>Manage the profile information associated with your admin account.</p>
        </div>
        {isEditing ? (
          <div className="admin-settings__actions">
            <button className="btn btn-secondary" type="button" onClick={handleCancel} disabled={saving}><X size={16} aria-hidden="true" /> Cancel</button>
            <button className="btn btn-primary" type="submit" form="admin-profile-form" disabled={saving}>
              {saving ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        ) : (
          <button className="btn btn-primary" type="button" onClick={() => setIsEditing(true)}><Edit2 size={16} aria-hidden="true" /> Edit profile</button>
        )}
      </header>

      <section className="admin-settings__identity" aria-label="Account identity">
        <div className="admin-settings__avatar-wrap">
          {imagePreview ? <img className="admin-settings__avatar" src={imagePreview} alt={`${user.name || "Admin"} profile`} /> : <span className="admin-settings__avatar admin-settings__avatar--initials">{getInitials(formData.name)}</span>}
          {isEditing && <label className="admin-settings__avatar-upload" aria-label="Upload profile picture"><Camera size={15} aria-hidden="true" /><input type="file" accept="image/*" onChange={handleImageChange} /></label>}
        </div>
        <div className="admin-settings__identity-copy">
          <h2>{formData.name || "Administrator"}</h2>
          <p><Mail size={15} aria-hidden="true" /> {user.email}</p>
          <p><CalendarDays size={15} aria-hidden="true" /> Joined {formattedJoinedDate}</p>
        </div>
        <span className="admin-settings__role"><Shield size={14} aria-hidden="true" /> Administrator</span>
      </section>

      <form id="admin-profile-form" onSubmit={handleSave} className="admin-settings__form">
        <section className="admin-settings__panel" aria-labelledby="admin-personal-title">
          <div className="admin-settings__panel-heading"><span><UserRound size={17} aria-hidden="true" /></span><div><h2 id="admin-personal-title">Personal information</h2><p>Basic information used on your account.</p></div></div>
          <div className="admin-settings__fields">
            <label className="admin-settings__field">
              <span>Full name</span>
              <input name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} minLength={2} maxLength={100} autoComplete="name" required />
            </label>
            <label className="admin-settings__field">
              <span>Email address</span>
              <input type="email" value={user.email || ""} disabled readOnly autoComplete="email" />
              <small>Email is managed by your sign-in account.</small>
            </label>
          </div>
        </section>

        <section className="admin-settings__panel" aria-labelledby="admin-bio-title">
          <div className="admin-settings__panel-heading"><span><Edit2 size={17} aria-hidden="true" /></span><div><h2 id="admin-bio-title">About you</h2><p>A short bio shown with your profile.</p></div></div>
          <label className="admin-settings__field">
            <span>Bio</span>
            <textarea name="bio" value={formData.bio} onChange={handleChange} disabled={!isEditing} rows={7} maxLength={300} placeholder="Add a short introduction." />
            <small>{formData.bio.length}/300 characters</small>
          </label>
        </section>
      </form>
      {!isEditing && <p className="admin-settings__saved-note"><Check size={14} aria-hidden="true" /> Profile information is up to date.</p>}
    </main>
  );
};

export default AdminProfileSettings;
