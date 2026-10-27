import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Camera, CalendarDays, Edit2, Loader2, Mail, Save, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { setUser, updateProfile } from "../../features/auth/userApiSlice";
import { getUploadUrl } from "../../utils/constants";

const getImageUrl = (image) => {
  if (!image) return null;
  if (/^(https?:|blob:|data:)/i.test(image)) return image;
  return getUploadUrl(image);
};

const InstructorProfileSettings = () => {
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

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file.");
      event.target.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Profile images must be smaller than 2 MB.");
      event.target.value = "";
      return;
    }
    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setFormData({ name: user?.name || "", bio: user?.bio || "" });
    setProfileImage(null);
    setImagePreview(getImageUrl(user?.profile_picture_url));
    setIsEditing(false);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const name = formData.name.trim();
    const bio = formData.bio.trim();
    if (!user?._id) {
      return toast.error("Your account could not be loaded. Sign in again.");
    }
    if (name.length < 2 || name.length > 100) {
      return toast.error("Name must be between 2 and 100 characters.");
    }
    if (bio.length > 300) {
      return toast.error("Bio must be 300 characters or fewer.");
    }

    const payload = new FormData();
    payload.append("name", name);
    payload.append("bio", bio);
    if (profileImage) payload.append("profile_picture_url", profileImage);

    setSaving(true);
    try {
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

  if (!user) {
    return <div className="mx-auto max-w-3xl p-8 text-center text-[var(--text-muted)]" role="status">Loading your instructor profile…</div>;
  }

  const initials = user.name?.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "I";

  return (
    <section className="mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8">
      <header className="mb-6"><p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--brand-strong)]">Instructor workspace · Account</p><h1 className="text-3xl font-bold text-[var(--text)]">Profile settings</h1><p className="mt-2 text-[var(--text-muted)]">Keep your instructor profile current for your learners.</p></header>

      <form onSubmit={handleSave} className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
        <div className="flex flex-col gap-5 border-b border-[var(--border)] p-5 sm:flex-row sm:items-center sm:p-7">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[var(--brand-soft)] text-2xl font-semibold text-[var(--brand-strong)]">{imagePreview ? <img src={imagePreview} alt={`${user.name}'s profile`} className="h-full w-full object-cover" /> : initials}</div>
          <div className="min-w-0 flex-1"><h2 className="truncate text-xl font-semibold text-[var(--text)]">{user.name}</h2><p className="mt-1 flex items-center gap-2 break-all text-sm text-[var(--text-muted)]"><Mail size={15} />{user.email}</p>{user.createdAt && <p className="mt-2 flex items-center gap-2 text-xs text-[var(--text-muted)]"><CalendarDays size={14} />Joined {new Date(user.createdAt).toLocaleDateString()}</p>}</div>
          {isEditing && <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-raised)]"><Camera size={16} /> Change photo<input type="file" accept="image/*" className="sr-only" onChange={handleImageChange} /></label>}
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7">
          <label className="block"><span className="mb-2 block text-sm font-medium text-[var(--text)]">Full name</span><input value={formData.name} onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))} disabled={!isEditing} maxLength={100} autoComplete="name" className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 text-[var(--text)] disabled:bg-[var(--surface-raised)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)]" /></label>
          <label className="block"><span className="mb-2 block text-sm font-medium text-[var(--text)]">Email address</span><input type="email" value={user.email || ""} readOnly aria-describedby="instructor-email-note" className="w-full cursor-not-allowed rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] px-3.5 py-3 text-[var(--text-muted)]" /><span id="instructor-email-note" className="mt-1.5 block text-xs text-[var(--text-muted)]">Login email is managed separately.</span></label>
          <label className="block sm:col-span-2"><span className="mb-2 block text-sm font-medium text-[var(--text)]">About you</span><textarea value={formData.bio} onChange={(event) => setFormData((current) => ({ ...current, bio: event.target.value }))} disabled={!isEditing} maxLength={300} rows={5} placeholder="Share your teaching background and areas of expertise." className="w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 text-[var(--text)] disabled:bg-[var(--surface-raised)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)]" /><span className="mt-1.5 block text-right text-xs text-[var(--text-muted)]">{formData.bio.length}/300</span></label>
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-[var(--border)] bg-[var(--surface-raised)] p-5 sm:px-7">
          {isEditing ? <><button type="button" onClick={cancelEditing} disabled={saving} className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--text)]"><X size={16} />Cancel</button><button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-strong)] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}{saving ? "Saving…" : "Save changes"}</button></> : <button type="button" onClick={() => setIsEditing(true)} className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-strong)] px-4 py-2.5 text-sm font-semibold text-white"><Edit2 size={16} />Edit profile</button>}
        </div>
      </form>
    </section>
  );
};

export default InstructorProfileSettings;
