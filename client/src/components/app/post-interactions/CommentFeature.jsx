import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "../../../features/post-interactions/commentSlice";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import useConfirmDialog from "../../common/useConfirmDialog";

const CommentFeature = () => {
  const dispatch = useDispatch();
  const confirm = useConfirmDialog();
  const { id } = useParams();
  const [commentText, setCommentText] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const { comments, status, error } = useSelector((state) => state.comment);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) dispatch(getComments(id));
  }, [id, dispatch]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) {
      toast.error("Sign in to add a comment.");
      return;
    }
    if (!commentText.trim()) return;
    setIsAdding(true);
    try {
      await dispatch(createComment({ courseId: id, text: commentText.trim() })).unwrap();
      setCommentText("");
      dispatch(getComments(id));
      toast.success("Comment posted");
    } catch (submitError) {
      toast.error(typeof submitError === "string" ? submitError : "Could not post comment");
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdate = async (commentId) => {
    try {
      await dispatch(updateComment({ id: commentId, text: editText.trim() })).unwrap();
      setEditingId(null);
      setEditText("");
      toast.success("Comment updated");
    } catch (updateError) {
      toast.error(typeof updateError === "string" ? updateError : "Could not update comment");
    }
  };

  const handleDelete = async (commentId) => {
    const confirmed = await confirm({
      title: "Delete comment?",
      message: "This comment will be permanently removed.",
      confirmLabel: "Delete comment",
    });
    if (!confirmed) return;
    try {
      await dispatch(deleteComment(commentId)).unwrap();
      toast.success("Comment deleted");
    } catch (deleteError) {
      toast.error(typeof deleteError === "string" ? deleteError : "Could not delete comment");
    }
  };

  return (
    <>
      <form onSubmit={handleCommentSubmit} className="mb-4">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write your comment..."
          className="w-full p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
          rows={3}
          maxLength={2000}
          disabled={isAdding}
        ></textarea>

        <button
          type="submit"
          className="mt-2 px-6 py-2 bg-[#1C1E53] text-white rounded-md hover:bg-[#FCD980] hover:text-[#1C1E53] transition"
          disabled={isAdding}
        >
          {isAdding ? "Posting..." : "Post Comment"}
        </button>
      </form>

      {/* Feedback UI */}
      {status === "loading" && (
        <p className="text-gray-500 text-sm">Loading comments...</p>
      )}
      {status === "failed" && (
        <p className="text-red-500 text-sm">Failed to load comments: {error}</p>
      )}

      {/* Comments List */}
      {Array.isArray(comments) && comments.length > 0 ? (
        <div className="mt-4 space-y-3">
          <h3 className="font-medium text-gray-800 text-lg">Comments</h3>
          {comments.map((c, index) => {
            const isOwner = c.user?._id === user?._id;
            return (
            <div
              key={c._id || `comment-${index}`}
              className="bg-gray-100 p-3 rounded-md text-sm text-gray-700 relative"
            >
              <div className="font-semibold">{c.user?.name || "Anonymous"}</div>
              {editingId === c._id ? (
                <div className="mt-2 space-y-2">
                  <textarea
                    value={editText}
                    onChange={(event) => setEditText(event.target.value)}
                    maxLength={2000}
                    rows={3}
                    aria-label="Edit your comment"
                    className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => handleUpdate(c._id)} disabled={!editText.trim()} className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-white disabled:opacity-50"><Check size={15} /> Save</button>
                    <button type="button" onClick={() => setEditingId(null)} className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-gray-700"><X size={15} /> Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="whitespace-pre-line break-words">{c.text}</div>
              )}
              <div className="text-xs text-gray-500">
                {new Date(c.createdAt).toLocaleString()}
              </div>
              {isOwner && editingId !== c._id && (
                <div className="mt-2 flex gap-2">
                  <button type="button" onClick={() => { setEditingId(c._id); setEditText(c.text); }} aria-label="Edit your comment" className="inline-flex items-center gap-1 text-xs text-blue-700 hover:underline"><Pencil size={13} /> Edit</button>
                  <button type="button" onClick={() => handleDelete(c._id)} aria-label="Delete your comment" className="inline-flex items-center gap-1 text-xs text-red-700 hover:underline"><Trash2 size={13} /> Delete</button>
                </div>
              )}
            </div>
            );
          })}
        </div>
      ) : (
        status === "succeeded" && (
          <p className="text-gray-500 text-sm mt-4">No comments yet.</p>
        )
      )}
    </>
  );
};

export default CommentFeature;
