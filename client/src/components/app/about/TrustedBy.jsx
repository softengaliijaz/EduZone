import React from "react";
import { organizations } from "../../../utils/AppUtils";

const TrustedBySection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex flex-col items-center justify-center py-20 px-6">
      {/* Header Section */}
      <div className="text-center max-w-3xl mb-16">
        <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
          TRUSTED PARTNERSHIPS
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Trusted by{" "}
          <span className="home-gradient-text">
            Visionary Organizations
          </span>
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          We collaborate with leading institutions, foundations, and technology
          pioneers across the Middle East to shape the future of learning.
        </p>
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl w-full">
        {organizations.map((org, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
          >
            {/* Decorative Corner Accent */}
            <div className="home-partner-card__corner" aria-hidden="true" />

            {/* Organization Initial Badge */}
            <div className="absolute -top-5 left-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-xl">
                  {org.name.charAt(0)}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="pt-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                {org.name}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {org.description}
              </p>

              {/* Partnership Indicator */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                  Strategic Partner
                </span>
                <div className="flex space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hover Effect Background */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <div className="home-gradient-text text-5xl font-bold mb-4">
            50+
          </div>
          <p className="text-gray-600 font-medium">Active Partnerships</p>
        </div>
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <div className="home-gradient-text text-5xl font-bold mb-4">
            15+
          </div>
          <p className="text-gray-600 font-medium">Countries Reached</p>
        </div>
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <div className="home-gradient-text text-5xl font-bold mb-4">
            100K+
          </div>
          <p className="text-gray-600 font-medium">Learners Impacted</p>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-16 text-center max-w-2xl">
        <p className="text-gray-500 text-sm italic">
          "Together with our partners, we're building bridges to knowledge and
          creating opportunities for generations to come."
        </p>
      </div>
    </div>
  );
};

export default TrustedBySection;
