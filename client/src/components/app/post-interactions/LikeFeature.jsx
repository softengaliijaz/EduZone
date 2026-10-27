import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  toggleLike,
  getLikesByCourse,
} from "../../../features/post-interactions/likesSlice";
import { toast } from "react-hot-toast";

const LikeFeature = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { user } = useSelector((state) => state.auth);
  const { likes, status: likeStatus } = useSelector((state) => state.likes);

  const [localLikes, setLocalLikes] = useState([]);
  const [localUserLiked, setLocalUserLiked] = useState(false);

  useEffect(() => {
    if (id) dispatch(getLikesByCourse(id));
  }, [id, dispatch]);

  useEffect(() => {
    setLocalLikes(likes);
    setLocalUserLiked(likes?.some((l) => l.user?._id === user?._id));
  }, [likes, user]);

  const handleLike = async () => {
    if (!user?._id) {
      toast.error("Sign in to like this course.");
      return;
    }

    if (localUserLiked) {
      setLocalLikes(localLikes.filter((l) => l.user?._id !== user?._id));
      setLocalUserLiked(false);
    } else {
      setLocalLikes([...localLikes, { user: { _id: user._id } }]);
      setLocalUserLiked(true);
    }
    await dispatch(toggleLike(id));
    dispatch(getLikesByCourse(id));
  };

  return (
    <div className="flex items-center gap-3 mb-6">
      <button
        onClick={handleLike}
        disabled={likeStatus === "loading"}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
      >
        {localUserLiked ? "👎 Unlike" : "👍 Like"}
      </button>
      <span className="text-gray-700 font-medium">
        {localLikes.length} Likes
      </span>
      {localUserLiked && (
        <span className="text-green-500 text-sm">You liked this</span>
      )}
    </div>
  );
};

export default LikeFeature;
