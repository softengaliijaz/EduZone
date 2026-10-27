import React from "react";
import HomeBanner from "../../../components/app/home/HomeBanner";
import StatisticPartners from "../../../components/app/home/StatisticPartners";
import EduZoneBenefits from "../../../components/app/home/EduZoneBenefits";
import AboutUs from "../../../components/app/about/AboutUs";
import CourseRecommendations from "../../../components/app/courses/CourseRecommendations";
import CoursesFeedBack from "../../../components/app/courses/CoursesFeedBack";
import AskedQuestions from "../frequently-asked-questions/AskedQuestions";
import ReadHomeBlogs from "../../../components/app/blogs/ReadHomeBlogs";
import ContactUs from "../../../components/app/contact/ContactUs";
import TrustedBySection from "../../../components/app/about/TrustedBy";

const HomePage = () => {
  return (
    <>
      {/* Banner Section */}
      <HomeBanner />

      {/* Trusted By Section */}
      <TrustedBySection />

      {/* Statistics Partners Section */}
      <StatisticPartners />

      {/* Benefits Section */}
      <EduZoneBenefits />

      {/* About Us Section */}
      <AboutUs />

      {/* Course Section Group */}
      <CourseRecommendations />

      {/* Courses Feed Back Section */}
      <CoursesFeedBack />

      {/* Asked Questions Section */}
      <AskedQuestions />

      {/* Blogs Section */}
      <ReadHomeBlogs />

      {/* Contact Us Section */}
      <ContactUs />

    </>
  );
};

export default HomePage;
