import React, { useEffect, useState } from "react";
import { getUploadUrl } from "../../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  getBlogById,
  incrementViewCount,
} from "../../../features/admin/blogSlice";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  BookOpen,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Twitter,
  Linkedin,
  Facebook,
  Copy,
  Check,
  Heart,
  Eye,
  Printer,
  Download,
  Tag,
  Home,
  ExternalLink,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../../services/axios";
import { getReadableParagraphs } from "../../../utils/contentFormatting";
import ImageWithFallback from "../../../components/common/ImageWithFallback";

const BlogsDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // Get the blog data passed from navigation
  const blogFromState = location.state?.blog;

  const { selectedBlog, loading, error } = useSelector((state) => state.blogs);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  // Calculate reading time
  const calculateReadingTime = (content) => {
    if (!content) return "0 min read";
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min read`;
  };

  // Priority: 1. selectedBlog (from Redux) 2. blogFromState (navigation) 3. null
  const blogData = selectedBlog || blogFromState;
  const blogId = blogData?._id;
  const blogCategory = blogData?.category;
  const blogTags = blogData?.tags;
  const hasBlogData = Boolean(selectedBlog || blogFromState);

  useEffect(() => {
    // Only fetch if we don't have the blog data already
    if (id && !hasBlogData) {
      dispatch(getBlogById(id));
    }

    const fetchRelatedBlogs = async () => {
      if (!blogId) return;
      try {
        const response = await axiosInstance.get("/api/blogs");
        const allBlogs = response?.data?.data || [];

        const related = allBlogs
          .filter((blog) => blog._id !== blogId)
          .filter((blog) => {
            const sameCategory =
              blogCategory && blog.category === blogCategory;
            const hasCommonTag =
              Array.isArray(blogTags) &&
              Array.isArray(blog.tags) &&
              blog.tags.some((tag) => blogTags.includes(tag));
            return sameCategory || hasCommonTag;
          })
          .slice(0, 3);

        setRelatedBlogs(related);
      } catch {
        setRelatedBlogs([]);
      }
    };

    fetchRelatedBlogs();

    // Increment view count (you need to implement this in your slice)
    if (blogId) {
      dispatch(incrementViewCount(blogId));
    }

    // Setup reading progress tracker
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const windowScrollTop = window.scrollY;
      if (totalHeight > 0) {
        setReadingProgress((windowScrollTop / totalHeight) * 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dispatch, id, hasBlogData, blogId, blogCategory, blogTags]);

  const handleShare = async (platform = null) => {
    if (!blogData) return;

    const shareData = {
      title: blogData.title,
      text: `Check out this article: ${blogData.title}`,
      url: window.location.href,
    };

    if (platform === "copy") {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setIsCopied(false), 2000);
        setShareMenuOpen(false);
      } catch {
        toast.error("Could not copy link");
      }
      return;
    }

    if (platform === "whatsapp") {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(shareData.text + " " + shareData.url)}`,
        "_blank",
      );
      return;
    }

    if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`,
        "_blank",
      );
      return;
    }

    if (platform === "linkedin") {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`,
        "_blank",
      );
      return;
    }

    if (platform === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`,
        "_blank",
      );
      return;
    }

    // Default Web Share API
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== "AbortError") {
          toast.error("Could not share this blog");
        }
      }
    } else {
      // Fallback to copy
      handleShare("copy");
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(
      !isBookmarked ? "Article bookmarked!" : "Article removed from bookmarks",
    );
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast.success("PDF download started!");
    // Implement actual PDF generation/download
  };

  if (loading && !blogData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin opacity-50"
              style={{ animationDirection: "reverse" }}
            ></div>
          </div>
          <p className="text-lg font-semibold text-gray-700">
            Loading Article...
          </p>
          <p className="text-gray-500 mt-2">
            Preparing your reading experience
          </p>
        </div>
      </div>
    );
  }

  if (error && !blogData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Article Not Found
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/view-all-blogs")}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              Browse Articles
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!blogData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Article Not Available
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            The article you're looking for is no longer available or has been
            moved.
          </p>
          <button
            onClick={() => navigate("/view-all-blogs")}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Explore Other Articles
          </button>
        </div>
      </div>
    );
  }

  return (
    <>

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Navigation Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Articles
              </button>
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePrint}
                  className="hidden md:flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Printer className="w-5 h-5" />
                  Print
                </button>
                <button
                  onClick={handleDownload}
                  className="hidden md:flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Article Header */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Home className="w-4 h-4" />
                Home
              </button>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <button
                onClick={() => navigate("/view-all-blogs")}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Insights
              </button>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              {blogData.category && (
                <>
                  <span className="text-sm text-gray-500">
                    {blogData.category}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </>
              )}
              <span className="text-sm font-medium text-blue-600 truncate">
                {blogData.title}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {blogData.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="font-medium">
                  {blogData.author?.name || "EDU-ZONE Team"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>
                  {new Date(blogData.publish_date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{calculateReadingTime(blogData.content)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                <span>{blogData.views || 0} views</span>
              </div>
            </div>

            {/* Category Badge */}
            {blogData.category && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full mb-8">
                <Sparkles className="w-4 h-4" />
                <span className="font-semibold">{blogData.category}</span>
              </div>
            )}
          </div>

          {/* Featured Image */}
          <div className="relative rounded-3xl overflow-hidden mb-12 shadow-2xl group">
            {getUploadUrl(blogData.imageUrl || blogData.image) ? (
              <>
                <ImageWithFallback
                  src={getUploadUrl(blogData.imageUrl || blogData.image)}
                  alt={blogData.title}
                  className="w-full h-[400px] md:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </>
            ) : (
              <div className="w-full h-[400px] md:h-[500px] bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <BookOpen className="w-24 h-24 text-blue-600 opacity-50" />
              </div>
            )}
          </div>

          {/* Article Content */}
          <article className="prose prose-lg max-w-none mb-16">
            <div className="mx-auto max-w-[75ch] text-lg md:text-xl leading-8 text-gray-700 break-words">
              {getReadableParagraphs(blogData.content).map((paragraph, index) => (
                <p className="mb-7 last:mb-0 whitespace-pre-wrap" key={`blog-content-${index}`}>
                  {paragraph}
                </p>
              ))}
            </div>
          </article>

          {/* Tags */}
          {blogData.tags && blogData.tags.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {blogData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="sticky bottom-8 mb-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                      isLiked
                        ? "bg-red-50 text-red-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${isLiked ? "fill-red-600" : ""}`}
                    />
                    <span className="font-medium">{likeCount}</span>
                  </button>

                  <button
                    onClick={handleBookmark}
                    className={`p-2 rounded-xl transition-all ${
                      isBookmarked
                        ? "bg-yellow-50 text-yellow-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Bookmark
                      className={`w-5 h-5 ${isBookmarked ? "fill-yellow-500" : ""}`}
                    />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  {/* Share Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShareMenuOpen(!shareMenuOpen)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                      <Share2 className="w-5 h-5" />
                      Share Article
                    </button>

                    {shareMenuOpen && (
                      <div className="absolute bottom-full right-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-200 p-3 animate-in slide-in-from-bottom-2">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleShare("twitter")}
                            className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <Twitter className="w-4 h-4 text-blue-400" />
                            Twitter
                          </button>
                          <button
                            onClick={() => handleShare("linkedin")}
                            className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <Linkedin className="w-4 h-4 text-blue-700" />
                            LinkedIn
                          </button>
                          <button
                            onClick={() => handleShare("facebook")}
                            className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <Facebook className="w-4 h-4 text-blue-600" />
                            Facebook
                          </button>
                          <button
                            onClick={() => handleShare("copy")}
                            className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            {isCopied ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-500" />
                            )}
                            {isCopied ? "Copied" : "Copy Link"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Author Bio */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                {blogData.author?.name?.charAt(0) || "E"}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {blogData.author?.name || "EDU-ZONE Team"}
                </h3>
                <p className="text-gray-600">Content Creator & Educator</p>
              </div>
            </div>
            <p className="text-gray-700">
              Passionate about sharing knowledge and insights in the field of
              education. With years of experience in teaching and curriculum
              development, dedicated to making learning accessible and engaging
              for everyone.
            </p>
          </div>

          {/* Related Articles */}
          {relatedBlogs.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Related Articles
                </h2>
                <button
                  onClick={() => navigate("/view-all-blogs")}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  View All
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map((blog) => (
                  <div
                    key={blog._id}
                    onClick={() =>
                      navigate(`/view-blog-details/${blog._id}`, {
                        state: { blog },
                      })
                    }
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer border border-gray-100 hover:border-transparent"
                  >
                    <div className="h-40 overflow-hidden">
                      {getUploadUrl(blog.imageUrl || blog.image) ? (
                        <ImageWithFallback
                          src={getUploadUrl(blog.imageUrl || blog.image)}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                          <BookOpen className="w-8 h-8 text-blue-600" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                          {blog.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(blog.publish_date).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" },
                          )}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {blog.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {blog.excerpt}
                      </p>
                      <span className="text-blue-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read Article
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section Placeholder */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-12">
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">
                Join the Discussion
              </h2>
            </div>
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Comments Coming Soon
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We're working on bringing you a space to share your thoughts and
                engage with other readers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogsDetails;
