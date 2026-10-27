import React from "react";
import {
  statisticPartnersData,
  statisticsScreenData,
} from "../../../utils/AppUtils";

const StatisticPartners = () => {
  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-blue-50 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-white/80 backdrop-blur-sm text-blue-700 rounded-full text-sm font-semibold mb-4 shadow-sm">
            IMPACT & PARTNERSHIPS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Growing Together,{" "}
            <span className="home-gradient-text">
              Achieving More
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our journey is powered by remarkable numbers and strengthened by
            trusted partnerships that drive innovation in education.
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {statisticsScreenData.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200"
            >
              {/* Animated Background Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>

              {/* Content */}
              <div className="text-center">
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="home-gradient-text text-5xl font-bold mb-2">
                  {stat.value}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {stat.label}
                </h3>
                <p className="text-gray-500 text-sm">{stat.description}</p>
              </div>

              {/* Animated Border */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-3/4 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 rounded-full"></div>
            </div>
          ))}
        </div>

        {/* Partners Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-gray-100">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by{" "}
              <span className="home-gradient-text">
                Industry Leaders
              </span>
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We collaborate with visionary organizations that share our
              commitment to transforming education through technology.
            </p>
          </div>

          {/* Partners Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {statisticPartnersData.map((partner, index) => (
              <div
                key={index}
                className="home-stat-partner-card group relative rounded-2xl p-6 border transition-all duration-500 hover:border-transparent hover:shadow-2xl"
              >
                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${partner.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}
                ></div>

                {/* Partner Initial Circle */}
                <div className="absolute -top-3 -right-3">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${partner.color} flex items-center justify-center shadow-lg`}
                  >
                    <span className="text-white font-bold text-lg">
                      {partner.name.charAt(0)}
                    </span>
                  </div>
                </div>

                <div className="relative z-10">
                  <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                    {partner.name}
                  </h4>
                  <p className="text-gray-500 text-sm mb-4">
                    {partner.category}
                  </p>

                  {/* Partnership Indicator */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-gray-100 to-white text-gray-700">
                      Strategic Alliance
                    </span>
                    <div className="flex items-center space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hover Connection Line */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-700 rounded-full"></div>
              </div>
            ))}
          </div>

          {/* Partnership Stats */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">6+</div>
                <p className="text-gray-600">Years of Collaboration</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  50+
                </div>
                <p className="text-gray-600">Joint Initiatives</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">∞</div>
                <p className="text-gray-600">Future Opportunities</p>
              </div>
            </div>
          </div>
        </div>

        {/* Closing Note */}
        <div className="text-center mt-12">
          <p className="text-gray-500 italic">
            "Great partnerships are built on shared vision and mutual growth.
            Together, we're redefining the future of education."
          </p>
        </div>
      </div>
    </section>
  );
};

export default StatisticPartners;
