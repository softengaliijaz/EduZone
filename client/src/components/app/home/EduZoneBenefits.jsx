import React from "react";
import { useNavigate } from "react-router-dom";
import useFetchData from "../../../hooks/useCustomHooks";
import {
  Sparkles,
  Target,
  Users,
  Zap,
  Award,
  Globe,
  BookOpen,
  Shield,
} from "lucide-react";

const EduZoneBenefits = () => {
  const navigate = useNavigate();
  const { data, loading, error } = useFetchData("/api/benefits/all");

  // Default icons if data doesn't have icons
  const defaultIcons = [
    <Sparkles className="w-6 h-6" />,
    <Target className="w-6 h-6" />,
    <Users className="w-6 h-6" />,
    <Zap className="w-6 h-6" />,
    <Award className="w-6 h-6" />,
    <Globe className="w-6 h-6" />,
    <BookOpen className="w-6 h-6" />,
    <Shield className="w-6 h-6" />,
  ];

  const gradientColors = [
    "from-blue-500 to-cyan-400",
    "from-purple-500 to-pink-400",
    "from-green-500 to-emerald-400",
    "from-orange-500 to-yellow-400",
    "from-red-500 to-rose-400",
    "from-indigo-500 to-blue-400",
    "from-teal-500 to-green-400",
    "from-violet-500 to-purple-400",
  ];

  return (
    <section className="relative bg-gradient-to-b from-white to-gray-50 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            PREMIUM ADVANTAGES
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Transform Your{" "}
            <span className="home-gradient-text">
              Learning Experience
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the unique benefits that make EDU-ZONE the preferred choice
            for ambitious learners worldwide.
          </p>
        </div>

        {/* See All Button */}
        <div className="flex justify-end mb-12">
          <button
            onClick={() => navigate("/see-all-benefits")}
            className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center gap-2">
              Explore All Benefits
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-gray-600">
              Discovering amazing benefits...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && (!data || data.length === 0) && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Benefits Available
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We're currently updating our benefits list. Check back soon for
              exciting updates!
            </p>
          </div>
        )}

        {/* Benefits Grid */}
        {!loading && !error && data && data.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {data.slice(0, 6).map((benefit, idx) => (
                <div
                  key={benefit._id}
                  className="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                >
                  {/* Gradient Background Effect */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradientColors[idx % gradientColors.length]} opacity-0 group-hover:opacity-5 transition-opacity duration-500 -z-10`}
                  ></div>

                  {/* Icon Badge */}
                  <div className="absolute -top-4 left-8">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradientColors[idx % gradientColors.length]} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <div className="text-white">
                        {defaultIcons[idx % defaultIcons.length]}
                      </div>
                    </div>
                  </div>

                  {/* Number Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-white transition-colors">
                      <span className="home-benefit-number text-lg font-bold">
                        {idx + 1}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {benefit.description}
                    </p>

                    {/* Impact Indicator */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
                            ></div>
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-gray-500">
                          HIGH IMPACT
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-blue-600">
                        LEARN MORE →
                      </span>
                    </div>
                  </div>

                  {/* Hover Line Effect */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-3/4 transition-all duration-700 rounded-full"></div>
                </div>
              ))}
            </div>

            {/* Stats Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12 mt-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="home-stat-value text-4xl font-bold mb-2">
                    100%
                  </div>
                  <p className="text-gray-700 font-medium">
                    Student Satisfaction
                  </p>
                  <p className="text-gray-500 text-sm">
                    Based on recent surveys
                  </p>
                </div>
                <div className="text-center">
                  <div className="home-stat-value text-4xl font-bold mb-2">
                    24/7
                  </div>
                  <p className="text-gray-700 font-medium">Learning Support</p>
                  <p className="text-gray-500 text-sm">
                    Expert guidance available
                  </p>
                </div>
                <div className="text-center">
                  <div className="home-stat-value text-4xl font-bold mb-2">
                    ∞
                  </div>
                  <p className="text-gray-700 font-medium">Lifetime Access</p>
                  <p className="text-gray-500 text-sm">
                    To all course materials
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="text-center mt-16">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg mb-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full border-2 border-white"
                    ></div>
                  ))}
                </div>
                <span className="text-gray-700 font-medium">
                  Join 21,000+ successful learners
                </span>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto italic">
                "The benefits extend beyond the classroom. EDU-ZONE provides a
                complete ecosystem for personal and professional growth."
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default EduZoneBenefits;
