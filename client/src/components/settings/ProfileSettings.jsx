import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Camera,
  CalendarDays,
  Check,
  Edit2,
  GraduationCap,
  Loader2,
  Mail,
  Save,
  Shield,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { updateProfile } from "../../features/auth/userApiSlice";
import { getUploadUrl } from "../../utils/constants";

const roleSettings = {
  admin: {
    label: "Administrator",
    description:
      "Manage the profile information associated with your admin account.",
    bioPlaceholder: "Add a short introduction.",
    Icon: Shield,
  },
  instructor: {
    label: "Instructor",
    description: "Keep your instructor profile current for your learners.",
    bioPlaceholder:
      "Share your teaching background and areas of expertise.",
    Icon: UserRound,
  },
  student: {
    label: "Student",
    description:
      "Manage the profile information associated with your student account.",
    bioPlaceholder: "Share a little about your learning interests.",
    Icon: GraduationCap,
  },
};

const getInitials = (name) =>
  name
    ?.trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "U";

const getFormattedJoinedDate = (user) => {
  const joinedDate = user?.createdAt || user?.registration_date;
  if (!joinedDate || Number.isNaN(new Date(joinedDate).getTime())) {
    return "Date unavailable";
  }

  return new Date(joinedDate).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
};

const ProfileSettings = ({ role }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const settings = roleSettings[role] || roleSettings.student;
  const RoleIcon = settings.Icon;
  const [formData, setFormData] = useState({ name: "", bio: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    setFormData({ name: user?.name || "", bio: user?.bio || "" });
    setImagePreview(getUploadUrl(user?.profile_picture_url));
  }, [user]);

  useEffect(
    () => () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    },
    [imagePreview],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleImageChange = (event) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Profile images must be smaller than 2 MB.");
      return;
    }

    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({ name: user?.name || "", bio: user?.bio || "" });
    setProfileImage(null);
    setImagePreview(getUploadUrl(user?.profile_picture_url));
    setIsEditing(false);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!user?._id) {
      toast.error("Your account could not be found. Sign in again and retry.");
      return;
    }

    const name = formData.name.trim();
    const bio = formData.bio.trim();
    if (name.length < 2 || name.length > 100) {
      toast.error("Name must be between 2 and 100 characters.");
      return;
    }
    if (bio.length > 300) {
      toast.error("Bio must be 300 characters or fewer.");
      return;
    }

    const payload = new FormData();
    payload.append("name", name);
    payload.append("bio", bio);
    if (profileImage) {
      payload.append("profile_picture_url", profileImage);
    }

    setSaving(true);
    try {
      await dispatch(
        updateProfile({ userId: user._id, formData: payload }),
      ).unwrap();
      setProfileImage(null);
      setIsEditing(false);
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Profile update failed.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-settings">
        <div className="profile-settings__empty" role="status">
          Loading your profile…
        </div>
      </div>
    );
  }

  return (
    <main className="profile-settings">
      <header className="profile-settings__header">
        <div>
          <p className="profile-settings__eyebrow">ACCOUNT</p>
          <h1>Profile settings</h1>
          <p>{settings.description}</p>
        </div>
        {isEditing ? (
          <div className="profile-settings__actions">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={handleCancel}
              disabled={saving}
            >
              <X size={16} aria-hidden="true" /> Cancel
            </button>
            <button
              className="btn btn-primary"
              type="submit"
              form="profile-settings-form"
              disabled={saving}
            >
              {saving ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Save size={16} aria-hidden="true" />
              )}
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        ) : (
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 size={16} aria-hidden="true" /> Edit profile
          </button>
        )}
      </header>

      <section
        className="profile-settings__identity"
        aria-label="Account identity"
      >
        <div className="profile-settings__avatar-wrap">
          {imagePreview ? (
            <img
              className="profile-settings__avatar"
              src={imagePreview}
              alt={`${user.name || settings.label} profile`}
            />
          ) : (
            <span className="profile-settings__avatar profile-settings__avatar--initials">
              {getInitials(formData.name)}
            </span>
          )}
          {isEditing && (
            <label
              className="profile-settings__avatar-upload"
              aria-label="Upload profile picture"
            >
              <Camera size={15} aria-hidden="true" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>
        <div className="profile-settings__identity-copy">
          <h2>{formData.name || settings.label}</h2>
          <p>
            <Mail size={15} aria-hidden="true" /> {user.email}
          </p>
          <p>
            <CalendarDays size={14} aria-hidden="true" /> Joined{" "}
            {getFormattedJoinedDate(user)}
          </p>
        </div>
        <span className="profile-settings__role">
          <RoleIcon size={14} aria-hidden="true" /> {settings.label}
        </span>
      </section>

      <form
        id="profile-settings-form"
        onSubmit={handleSave}
        className="profile-settings__form"
      >
        <section
          className="profile-settings__panel"
          aria-labelledby="profile-personal-title"
        >
          <div className="profile-settings__panel-heading">
            <span>
              <UserRound size={17} aria-hidden="true" />
            </span>
            <div>
              <h2 id="profile-personal-title">Personal information</h2>
              <p>Basic information used on your account.</p>
            </div>
          </div>
          <div className="profile-settings__fields">
            <label className="profile-settings__field">
              <span>Full name</span>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                minLength={2}
                maxLength={100}
                autoComplete="name"
                required
              />
            </label>
            <label className="profile-settings__field">
              <span>Email address</span>
              <input
                type="email"
                value={user.email || ""}
                disabled
                readOnly
                autoComplete="email"
              />
              <small>Email is managed by your sign-in account.</small>
            </label>
          </div>
        </section>

        <section
          className="profile-settings__panel"
          aria-labelledby="profile-bio-title"
        >
          <div className="profile-settings__panel-heading">
            <span>
              <Edit2 size={17} aria-hidden="true" />
            </span>
            <div>
              <h2 id="profile-bio-title">About you</h2>
              <p>A short bio shown with your profile.</p>
            </div>
          </div>
          <label className="profile-settings__field">
            <span>Bio</span>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={!isEditing}
              rows={7}
              maxLength={300}
              placeholder={settings.bioPlaceholder}
            />
            <small>{formData.bio.length}/300 characters</small>
          </label>
        </section>
      </form>

      {!isEditing && (
        <p className="profile-settings__saved-note">
          <Check size={14} aria-hidden="true" /> Profile information is up to
          date.
        </p>
      )}
    </main>
  );
};

export default ProfileSettings;
