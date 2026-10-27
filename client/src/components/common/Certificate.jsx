import React, { useState } from "react";
import {
  Award,
  Download,
  Share2,
  Filter,
  Search,
  CheckCircle,
  Calendar,
  Clock,
  Users,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Eye,
  Printer,
  Mail,
  Lock,
  Globe,
} from "lucide-react";

const CertificateView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Mock certificate data
  const certificates = [
    {
      id: 1,
      title: "React Mastery Certification",
      issuer: "EDU-ZONE Academy",
      issueDate: "2024-01-15",
      expiryDate: "2026-01-15",
      level: "Advanced",
      category: "Web Development",
      skills: ["React", "Redux", "Next.js", "TypeScript"],
      credentialId: "EZ-REACT-2024-001",
      status: "valid",
      verified: true,
      hours: 42,
      grade: "A+",
    },
    {
      id: 2,
      title: "Full Stack Development",
      issuer: "EDU-ZONE Academy",
      issueDate: "2024-02-20",
      expiryDate: "2026-02-20",
      level: "Professional",
      category: "Web Development",
      skills: ["Node.js", "Express", "MongoDB", "React"],
      credentialId: "EZ-FSD-2024-002",
      status: "valid",
      verified: true,
      hours: 68,
      grade: "A",
    },
    {
      id: 3,
      title: "UI/UX Design Fundamentals",
      issuer: "EDU-ZONE Academy",
      issueDate: "2024-03-10",
      expiryDate: null,
      level: "Intermediate",
      category: "Design",
      skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
      credentialId: "EZ-UIUX-2024-003",
      status: "valid",
      verified: true,
      hours: 36,
      grade: "A+",
    },
    {
      id: 4,
      title: "Data Science Essentials",
      issuer: "EDU-ZONE Academy",
      issueDate: "2023-11-05",
      expiryDate: "2025-11-05",
      level: "Intermediate",
      category: "Data Science",
      skills: ["Python", "Pandas", "Matplotlib", "Machine Learning"],
      credentialId: "EZ-DS-2023-004",
      status: "valid",
      verified: true,
      hours: 56,
      grade: "B+",
    },
    {
      id: 5,
      title: "Cloud Computing Basics",
      issuer: "EDU-ZONE Academy",
      issueDate: "2023-12-18",
      expiryDate: null,
      level: "Beginner",
      category: "Cloud",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      credentialId: "EZ-CLOUD-2023-005",
      status: "valid",
      verified: true,
      hours: 24,
      grade: "A",
    },
  ];

  const stats = [
    {
      label: "Total Certificates",
      value: certificates.length,
      icon: Award,
      color: "blue",
    },
    {
      label: "Verified",
      value: certificates.filter((c) => c.verified).length,
      icon: CheckCircle,
      color: "green",
    },
    {
      label: "Total Learning Hours",
      value: certificates.reduce((acc, c) => acc + c.hours, 0),
      icon: Clock,
      color: "purple",
    },
    { label: "Avg. Grade", value: "A", icon: TrendingUp, color: "yellow" },
  ];

  const handleDownload = (certificate) => {
    console.log(`Downloading certificate: ${certificate.title}`);
    // Implement download logic
  };

  const handleShare = (certificate) => {
    console.log(`Sharing certificate: ${certificate.title}`);
    // Implement share logic
  };

  const handleVerify = (credentialId) => {
    window.open(`/verify/${credentialId}`, "_blank");
  };

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesFilter =
      selectedFilter === "all" ||
      cert.category.toLowerCase() === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-full text-sm font-semibold mb-4">
                <Award className="w-4 h-4" />
                CERTIFICATION PORTFOLIO
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Your{" "}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Achievements
                </span>
              </h1>
              <p className="text-gray-600 max-w-3xl">
                Showcase your verified skills and credentials. Share your
                certificates with employers and add them to your professional
                profiles.
              </p>
            </div>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
              <Download className="w-5 h-5" />
              Export All as PDF
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}
                  >
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search certificates by title, skills, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="web development">Web Development</option>
                  <option value="design">Design</option>
                  <option value="data science">Data Science</option>
                  <option value="cloud">Cloud</option>
                </select>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span>{filteredCertificates.length} certificates found</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredCertificates.map((certificate) => (
            <div key={certificate.id} className="group relative">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                {/* Certificate Header */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-3">
                        <Globe className="w-3 h-3" />
                        {certificate.category}
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        {certificate.title}
                      </h3>
                      <p className="text-blue-100">{certificate.issuer}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {certificate.verified && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-green-500/20 backdrop-blur-sm rounded-full text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Verified
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Certificate Details */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Issued</div>
                      <div className="font-semibold text-gray-900">
                        {new Date(certificate.issueDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Level</div>
                      <div className="font-semibold text-gray-900">
                        {certificate.level}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Hours</div>
                      <div className="font-semibold text-gray-900">
                        {certificate.hours}h
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Grade</div>
                      <div className="font-semibold text-gray-900">
                        {certificate.grade}
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-6">
                    <div className="text-sm text-gray-500 mb-3">
                      Skills Acquired
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {certificate.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Certificate ID */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                    <div className="text-sm text-gray-500 mb-1">
                      Credential ID
                    </div>
                    <div className="font-mono font-bold text-gray-900">
                      {certificate.credentialId}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Use this ID to verify authenticity
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleDownload(certificate)}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                    <button
                      onClick={() => handleShare(certificate)}
                      className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    <button
                      onClick={() => handleVerify(certificate.credentialId)}
                      className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Verify
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCertificates.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <Award className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No Certificates Found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              You haven't earned any certificates yet, or no certificates match
              your search.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all">
                Browse Courses
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Certificate Verification Section */}
        <div className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Verify Certificates
              </h3>
              <p className="text-gray-300 mb-6">
                Employers and recruiters can verify the authenticity of any
                EDU-ZONE certificate using our secure verification system.
              </p>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter credential ID to verify..."
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button className="absolute right-2 top-2 bg-white text-gray-900 px-4 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                  Verify
                </button>
              </div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm mb-4">
                <Sparkles className="w-4 h-4" />
                Secured by Blockchain Technology
              </div>
              <div className="text-5xl font-bold mb-2">100%</div>
              <div className="text-gray-300">Verification Accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateView;
