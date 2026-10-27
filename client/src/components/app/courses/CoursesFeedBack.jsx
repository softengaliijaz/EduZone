import React, { useState } from "react";
import {
  Quote,
  Star,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import {
  coursesFeedBackStatsData,
  coursesFeedBackTestimonialsData,
} from "../../../utils/AppUtils";

const CoursesFeedBack = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const handlePrev = () => {
    setActiveTestimonial((prev) =>
      prev === 0 ? coursesFeedBackTestimonialsData.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setActiveTestimonial((prev) =>
      prev === coursesFeedBackTestimonialsData.length - 1 ? 0 : prev + 1,
    );
  };

  const testimonial = coursesFeedBackTestimonialsData[activeTestimonial];

  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-blue-50 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            LEARNER TESTIMONIALS
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Voices of{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Success
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from our community of learners who have transformed their
            careers through our comprehensive courses and expert guidance.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {coursesFeedBackStatsData.map((stat, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`p-2 rounded-lg ${stat.color.replace("text", "bg")}/10`}
                >
                  <div className={stat.color}>{stat.icon}</div>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 text-blue-700 font-semibold mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                TRUSTED BY INDUSTRY LEADERS
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Professionals Say
                </span>
              </h3>
              <p className="text-gray-600 text-lg">
                Our courses have empowered thousands of professionals to achieve
                their career goals through practical, industry-relevant
                education.
              </p>
            </div>

            {/* Achievement Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                    <Star className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    Top Rated
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Consistently high ratings across all courses
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
                    <TrendingUp className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    Career Impact
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Proven results in professional advancement
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Testimonial Card */}
          <div className="relative">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100">
              {/* Quote Icon */}
              <div className="absolute top-6 right-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
                  <Quote className="w-6 h-6 text-blue-600" />
                </div>
              </div>

              {/* Content */}
              <div className="mb-8">
                <p className="text-xl md:text-2xl text-gray-800 leading-relaxed italic mb-6">
                  "{testimonial.content}"
                </p>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-5 h-5">
                      {i < testimonial.rating ? (
                        <div className="text-yellow-400">★</div>
                      ) : (
                        <div className="text-gray-300">★</div>
                      )}
                    </div>
                  ))}
                  <span className="ml-2 text-sm font-semibold text-gray-700">
                    {testimonial.rating}.0 Rating
                  </span>
                </div>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center shadow-lg`}
                >
                  <span className="text-white text-xl font-bold">
                    {testimonial.initials}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">
                    {testimonial.author}
                  </h4>
                  <p className="text-gray-600">{testimonial.role}</p>
                  <p className="text-sm text-gray-500">{testimonial.company}</p>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="absolute -bottom-6 right-6 flex items-center gap-4">
                <button
                  onClick={handlePrev}
                  className="w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:shadow-xl hover:border-gray-300 transition-all"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:shadow-xl hover:border-gray-300 transition-all"
                >
                  <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Testimonial Dots */}
            <div className="flex justify-center gap-2 mt-12">
              {coursesFeedBackTestimonialsData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === activeTestimonial
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 w-6"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg transform rotate-45"></div>
            <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-400 rounded-lg transform rotate-45"></div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Ready to Share Your Success Story?
          </h3>
          <button className="group relative bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold py-4 px-10 rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
            <span className="relative flex items-center gap-3">
              Join Our Learning Community
              <svg
                className="w-6 h-6 group-hover:translate-x-2 transition-transform"
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
      </div>
    </section>
  );
};

export default CoursesFeedBack;
