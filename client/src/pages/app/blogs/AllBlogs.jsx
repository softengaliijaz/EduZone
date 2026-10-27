import React, { useEffect, useState } from "react";
import { getUploadUrl } from "../../../utils/constants";
import ImageWithFallback from "../../../components/common/ImageWithFallback";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../../../features/admin/blogSlice";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Calendar,
  User,
  BookOpen,
  TrendingUp,
  Clock,
  ChevronRight,
  Sparkles,
  Hash,
  Eye,
  Bookmark,
  Share2,
  Grid,
  List,
} from "lucide-react";
import Loader from "../../../components/common/Loader";

const ReadAllBlogs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blogs, loading, error } = useSelector((state) => state.blogs);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  // Extract categories from blogs
  const categories = [
    "all",
    ...new Set(blogs.map((blog) => blog.category).filter(Boolean)),
  ];

  // Filter and sort blogs
  const filteredBlogs = blogs
    .filter((blog) => {
      const matchesSearch =
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || blog.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.publish_date) - new Date(a.publish_date);
      if (sortBy === "oldest")
        return new Date(a.publish_date) - new Date(b.publish_date);
      if (sortBy === "title") return a.title?.localeCompare(b.title);
      return 0;
    });

  // Reading time calculator
  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min read`;
  };

  const handleBlogClick = (blog) => {
    navigate(`/view-blog-details/${blog._id}`, { state: { blog } });
  };

  const handleBookmark = (e, blog) => {
    e.stopPropagation();
    console.log("Bookmarking:", blog.title);
    // Implement bookmark logic
  };

  const handleShare = (e, blog) => {
    e.stopPropagation();
    console.log("Sharing:", blog.title);
    // Implement share logic
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to Load Content
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
          <button
            onClick={() => dispatch(fetchBlogs())}
            className="px-6 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!blogs.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Insights Available
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            We're currently preparing valuable content. Check back soon for the
            latest insights and updates.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold mb-4">
                <BookOpen className="w-4 h-4" />
                KNOWLEDGE HUB
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Discover <span className="text-yellow-300">Insights</span> That
                Matter
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Explore our collection of articles, tutorials, and industry
                insights to stay ahead in your learning journey.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles by title, content, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors">
                  Search
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{blogs.length}</div>
                <div className="text-white/80">Total Articles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {categories.length - 1}
                </div>
                <div className="text-white/80">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">42K+</div>
                <div className="text-white/80">Monthly Readers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">98%</div>
                <div className="text-white/80">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Filters and Controls */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Categories Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-xl transition-all ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category === "all" ? "All Topics" : category}
                  </button>
                ))}
              </div>

              {/* View Controls */}
              <div className="flex items-center gap-6">
                {/* Sort By */}
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title">Title A-Z</option>
                  </select>
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "grid"
                        ? "bg-white shadow"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "list"
                        ? "bg-white shadow"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Info */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  <span>
                    Showing {filteredBlogs.length} of {blogs.length} articles
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>
                    {Math.round((filteredBlogs.length / blogs.length) * 100)}%
                    match
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Blog Grid/List */}
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-8"
            }
          >
            {filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                onClick={() => handleBlogClick(blog)}
                className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer border border-gray-100 hover:border-transparent ${
                  viewMode === "list" ? "flex flex-col md:flex-row" : ""
                }`}
              >
                {/* Blog Image */}
                <div
                  className={`${
                    viewMode === "list" ? "md:w-1/3 h-64 md:h-auto" : "h-56"
                  } relative overflow-hidden`}
                >
                  {getUploadUrl(blog.imageUrl || blog.image) ? (
                    <>
                      <ImageWithFallback
                        src={getUploadUrl(blog.imageUrl || blog.image)}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-blue-600" />
                    </div>
                  )}

                  {/* Category Badge */}
                  {blog.category && (
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-bold rounded-full shadow">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                        {blog.category}
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={(e) => handleBookmark(e, blog)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                    >
                      <Bookmark className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      onClick={(e) => handleShare(e, blog)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                    >
                      <Share2 className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                </div>

                {/* Blog Content */}
                <div
                  className={`p-6 flex flex-col flex-1 ${
                    viewMode === "list" ? "md:w-2/3" : ""
                  }`}
                >
                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(blog.publish_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {calculateReadingTime(blog.content)}
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {blog.author?.name || "EDU-ZONE Team"}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {blog.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 mb-6 line-clamp-3 flex-1">
                    {blog.content}
                  </p>

                  {/* Tags (if available) */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {blog.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Read More Button */}
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-blue-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                      Read Full Article
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span>0 views</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredBlogs.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No Articles Found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                We couldn't find any articles matching your search. Try
                different keywords or browse all categories.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  View All Articles
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Pagination */}
          {filteredBlogs.length > 0 && (
            <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-sm text-gray-600">
                Page <span className="font-semibold text-gray-900">1</span> of{" "}
                <span className="font-semibold text-gray-900">5</span>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                  Previous
                </button>
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className={`w-10 h-10 rounded-xl transition-all ${
                      page === 1
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Newsletter CTA */}
          <div className="mt-20 bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-white overflow-hidden">
            <div className="relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    Never Miss an Insight
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Subscribe to our newsletter and get the latest articles,
                    tutorials, and industry insights delivered directly to your
                    inbox.
                  </p>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-4 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                  <button className="absolute right-2 top-2 bg-white text-gray-900 font-semibold px-6 py-2 rounded-lg hover:bg-gray-100 transition">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReadAllBlogs;
