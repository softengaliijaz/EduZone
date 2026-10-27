import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getWorkspaceHome } from "../../../utils/roleNavigation";

const HomeBanner = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  return (
    <section className="home-hero relative min-h-screen text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-400/5 rounded-full mix-blend-screen filter blur-2xl animate-pulse delay-500"></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-[linear-gradient(90deg,#888_1px,transparent_1px)] bg-[size:40px]"></div>
          <div className="h-full w-full bg-[linear-gradient(180deg,#888_1px,transparent_1px)] bg-[size:40px]"></div>
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 px-6 md:px-16 py-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          {/* Main Content - Single Responsive Layout */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
            {/* Left Content */}
            <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
              {/* Tagline */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-yellow-100">
                  Future-Ready Education
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block text-white">Build and Achieve</span>
                <span className="block mt-2">
                  Your{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent animate-gradient">
                      Dreams
                    </span>
                    <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-amber-300 rounded-full"></div>
                  </span>
                </span>
                <span className="block mt-4 text-xl sm:text-2xl md:text-3xl text-gray-300">
                  with{" "}
                  <span className="font-black text-yellow-400">EDU-ZONE</span>
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl leading-relaxed">
                Transform your potential into expertise with our comprehensive
                learning ecosystem.{" "}
                <span className="text-yellow-300 font-medium">EDU-ZONE</span>{" "}
                delivers cutting-edge technology education through immersive
                courses, hands-on projects, and industry mentorship.
              </p>

              {/* Stats Bar */}
              <div className="flex flex-wrap gap-6 py-6 border-y border-white/10">
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-yellow-400">21K+</div>
                  <div className="text-sm text-gray-400">Active Learners</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-yellow-400">150+</div>
                  <div className="text-sm text-gray-400">Courses</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-yellow-400">98%</div>
                  <div className="text-sm text-gray-400">Success Rate</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => navigate("/courses/courses-list")}
                  className="group relative bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 font-semibold py-4 px-8 rounded-xl hover:shadow-2xl hover:shadow-yellow-500/30 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    Explore Courses
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

                <button
                  onClick={() => navigate(user ? getWorkspaceHome(user.user_type) : "/login")}
                  className="group bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-4 px-8 rounded-xl hover:bg-white/20 hover:border-white/40 transition-all duration-300"
                >
                  <span className="flex items-center justify-center gap-2">
                    Start Learning Journey
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
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>

            {/* Right Visual - Abstract Design */}
            <div className="lg:w-1/2 relative">
              <div className="relative w-full max-w-2xl mx-auto aspect-square">
                {/* Main abstract circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-4/5 h-4/5">
                    {/* Outer rings */}
                    <div className="absolute inset-0 border-2 border-yellow-400/30 rounded-full animate-spin-slow"></div>
                    <div className="absolute inset-8 border-2 border-blue-400/20 rounded-full animate-spin-slow-reverse"></div>

                    {/* Floating elements */}
                    <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl transform rotate-12 animate-float shadow-2xl shadow-yellow-500/30"></div>
                    <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl transform -rotate-12 animate-float-delayed shadow-2xl shadow-blue-500/30"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl transform rotate-45 animate-float-delayed-2 shadow-2xl shadow-purple-500/30"></div>

                    {/* Central element */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-gray-900 to-[#1C1E53] rounded-3xl shadow-2xl flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">
                          EZ
                        </div>
                        <div className="text-sm text-gray-400 mt-2">
                          EDU-ZONE
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative dots */}
                <div className="absolute top-0 left-0 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="absolute top-0 right-0 w-4 h-4 bg-blue-400 rounded-full animate-ping delay-300"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 bg-purple-400 rounded-full animate-ping delay-700"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full animate-ping delay-1000"></div>
              </div>

              {/* Floating text elements */}
              <div className="absolute top-1/4 left-0 transform -translate-y-1/2 text-sm text-yellow-300 font-medium bg-white/5 backdrop-blur-sm px-3 py-1 rounded-full border border-yellow-400/20">
                Interactive Learning
              </div>
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 text-sm text-blue-300 font-medium bg-white/5 backdrop-blur-sm px-3 py-1 rounded-full border border-blue-400/20">
                Expert Mentors
              </div>
              <div className="absolute bottom-1/4 left-4 transform translate-y-1/2 text-sm text-purple-300 font-medium bg-white/5 backdrop-blur-sm px-3 py-1 rounded-full border border-purple-400/20">
                Hands-on Projects
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes spin-slow-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(var(--tw-rotate));
          }
          50% {
            transform: translateY(-20px) rotate(var(--tw-rotate));
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 15s linear infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 7s ease-in-out infinite;
          animation-delay: 1s;
        }
        .animate-float-delayed-2 {
          animation: float 8s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
};

export default HomeBanner;
