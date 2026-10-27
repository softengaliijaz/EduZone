import React from "react";
import {
  Target,
  Star,
  Award,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Globe,
  HelpCircle,
  Phone,
  Clock,
  Mail,
  MapPin,
} from "lucide-react";

// ============================================
// SECTION 1: ORGANIZATION & PARTNER DATA
// ============================================

/**
 * Shared partner records for both homepage partnership showcases.
 */
export const partnersData = [
  { name: "Al Jazeera", description: "Global media network" },
  {
    name: "Qatar Foundation",
    description: "Education and community development",
  },
  { name: "Dubai Future", description: "Innovation and future technologies" },
  { name: "Misk Foundation", description: "Youth empowerment and education" },
  { name: "STC", description: "Telecommunications leader" },
  { name: "Saudi Aramco", description: "Energy and technology" },
  { name: "Emirates Group", description: "Aviation and travel" },
  { name: "NEOM", description: "Future city development" },
  { name: "Mubadala", description: "Investment and innovation" },
  { name: "KAUST", description: "Scientific research" },
  {
    name: "Lorem Innovations",
    category: "Technology Solutions",
    color: "from-blue-500 to-cyan-400", // Tailwind gradient classes
  },
  {
    name: "Ditlance",
    category: "Digital Transformation",
    color: "from-purple-500 to-pink-400",
  },
  {
    name: "Owthest",
    category: "E-Learning Platform",
    color: "from-green-500 to-emerald-400",
  },
  {
    name: "Neovasi",
    category: "AI & Analytics",
    color: "from-orange-500 to-yellow-400",
  },
  {
    name: "Onago",
    category: "Cloud Infrastructure",
    color: "from-red-500 to-rose-400",
  },
  {
    name: "TechSphere",
    category: "EdTech Solutions",
    color: "from-indigo-500 to-blue-400",
  },
];

export const organizations = partnersData.filter((partner) => !partner.category);
export const statisticPartnersData = partnersData.filter(
  (partner) => partner.category,
);

// ============================================
// SECTION 2: PLATFORM STATISTICS
// ============================================

/**
 * Key platform statistics for dashboard/hero sections
 * Uses emoji icons for visual appeal
 */
export const statisticsScreenData = [
  {
    value: "21,000+",
    label: "Registered Students",
    description: "Active learners across our platform",
    icon: "👨‍🎓",
  },
  {
    value: "100+",
    label: "Expert Instructors",
    description: "Industry professionals & educators",
    icon: "👩‍🏫",
  },
  {
    value: "150+",
    label: "Free Courses",
    description: "Comprehensive learning materials",
    icon: "📚",
  },
  {
    value: "98%",
    label: "Satisfaction Rate",
    description: "Positive learner feedback",
    icon: "⭐",
  },
];

// ============================================
// SECTION 3: ABOUT US / WHY CHOOSE US
// ============================================

/**
 * Main about us section content
 */
export const aboutUsData = {
  heading: "Why Choose EduZone",
  subheading: "Empowering Learners Across the Globe",
  description:
    "EduZone provides a platform for quality learning with industry-standard content, expert mentors, and hands-on projects. We are committed to delivering knowledge that drives success, fostering growth for students of all levels.",
};

/**
 * Feature highlights for the about us section
 * Each feature includes an icon, title, description and gradient color
 */
export const aboutUsScreenFeaturesData = [
  {
    icon: <Target className="w-6 h-6" />,
    title: "Clear Learning Paths",
    description: "Structured curriculum designed for career success",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Expert Community",
    description: "Learn alongside peers and industry professionals",
    gradient: "from-purple-500 to-pink-400",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Global Accessibility",
    description: "Access courses from anywhere, anytime",
    gradient: "from-green-500 to-emerald-400",
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Certified Excellence",
    description: "Industry-recognized certifications",
    gradient: "from-orange-500 to-yellow-400",
  },
];

/**
 * Statistics for about us section with colored text
 */
export const aboutUsScreenStatsData = [
  { value: "21K+", label: "Active Learners", color: "text-blue-600" },
  { value: "150+", label: "Courses", color: "text-purple-600" },
  { value: "98%", label: "Success Rate", color: "text-green-600" },
  { value: "24/7", label: "Support", color: "text-orange-600" },
];

// ============================================
// SECTION 4: COURSE FEEDBACK & TESTIMONIALS
// ============================================

/**
 * Customer testimonials/reviews for courses
 * Includes author details, ratings, and gradient backgrounds
 */
export const coursesFeedBackTestimonialsData = [
  {
    id: 1,
    content:
      "The learning material is exceptionally clear and well-structured. The instructors demonstrate deep expertise and provide timely, valuable feedback. This course has transformed my approach to development.",
    author: "Sarah Johnson",
    role: "Senior Software Engineer",
    company: "TechVision Inc.",
    rating: 5,
    gradient: "from-blue-500 to-cyan-400",
    initials: "SJ",
  },
  {
    id: 2,
    content:
      "An outstanding platform that bridges theory with practical application. The hands-on projects are industry-relevant and the community support is exceptional. Highly recommended for career advancement.",
    author: "Michael Chen",
    role: "Product Manager",
    company: "Innovate Labs",
    rating: 5,
    gradient: "from-purple-500 to-pink-400",
    initials: "MC",
  },
  {
    id: 3,
    content:
      "The course exceeded my expectations in every aspect. The curriculum is comprehensive, the delivery is engaging, and the skills I've gained have already impacted my professional trajectory significantly.",
    author: "Elena Rodriguez",
    role: "Data Scientist",
    company: "Analytics Pro",
    rating: 4,
    gradient: "from-green-500 to-emerald-400",
    initials: "ER",
  },
  {
    id: 4,
    content:
      "A transformative learning experience. The balance between theoretical concepts and practical implementation is perfect. The certification has added substantial value to my professional profile.",
    author: "David Kim",
    role: "Cloud Architect",
    company: "Digital Solutions",
    rating: 5,
    gradient: "from-orange-500 to-yellow-400",
    initials: "DK",
  },
];

/**
 * Feedback statistics with icons and colors
 */
export const coursesFeedBackStatsData = [
  {
    value: "10K+",
    label: "Student Reviews",
    icon: <Users className="w-5 h-5" />,
    color: "text-blue-600",
  },
  {
    value: "4.9/5",
    label: "Average Rating",
    icon: <Star className="w-5 h-5" />,
    color: "text-purple-600",
  },
  {
    value: "98%",
    label: "Satisfaction Rate",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "text-green-600",
  },
  {
    value: "21K+",
    label: "Learners Impacted",
    icon: <Award className="w-5 h-5" />,
    color: "text-orange-600",
  },
];

// ============================================
// SECTION 5: FAQ / HELP CATEGORIES
// ============================================

/**
 * FAQ categories with icons and question counts
 * Used to organize help/support questions
 */
export const askedQuestionsCategoriesData = [
  {
    icon: <Shield className="w-5 h-5" />,
    label: "Account & Security",
    count: 3,
  },
  {
    icon: <Zap className="w-5 h-5" />,
    label: "Courses & Learning",
    count: 5,
  },
  {
    icon: <Globe className="w-5 h-5" />,
    label: "Platform Features",
    count: 4,
  },
  {
    icon: <HelpCircle className="w-5 h-5" />,
    label: "General Support",
    count: 3,
  },
];

// ============================================
// SECTION 6: CONTACT INFORMATION
// ============================================

/**
 * Contact information cards with icons, links, and gradient colors
 */
export const contactUsScreenData = [
  {
    icon: <Phone className="w-5 h-5" />,
    title: "Phone Number",
    value: "+92 302 8186660",
    href: "tel:+923028186660",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: <Mail className="w-5 h-5" />,
    title: "Email Address",
    value: "softeng.aliijaz@gmail.com",
    href: "mailto:softeng.aliijaz@gmail.com",
    color: "from-purple-500 to-pink-400",
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    title: "Location",
    value: "Lahore, Pakistan",
    href: "#",
    color: "from-green-500 to-emerald-400",
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: "Office Hours",
    value: "Mon - Fri, 9am - 5pm",
    href: "#",
    color: "from-orange-500 to-yellow-400",
  },
];
