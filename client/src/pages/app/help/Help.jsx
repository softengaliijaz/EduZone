import React from "react";
import { Link } from "react-router-dom";

const Help = () => {
  return (
    <>
      <section className="bg-[#F4F6FC] min-h-screen py-16 px-4 flex items-center justify-center">
        <div className=" w-full  rounded-2xl  p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-[#1C1E53] mb-6">
            How can we help you?
          </h1>
          <p className="text-center text-gray-600 mb-10 max-w-xl mx-auto">
            Browse through our frequently asked questions or reach out to our
            support team. We're here to help you make the most of EduZone.
          </p>

          <div className="space-y-6">
            {[
              {
                question: "How do I enroll in a course?",
                answer:
                  "Visit the course page and click on the 'Enroll Now' button. You can pay and access content instantly.",
              },
              {
                question: "Can I get a certificate after completing a course?",
                answer:
                  "Yes, most courses offer a certificate of completion that you can download or share.",
              },
              {
                question: "What payment methods are supported?",
                answer:
                  "We accept all major credit/debit cards, PayPal, and localized payment options for some regions.",
              },
              {
                question: "I forgot my password. How do I reset it?",
                answer:
                  "Go to the login page and click on 'Forgot Password' to reset it via email.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="border-b pb-4 transition-all duration-300 group"
              >
                <h3 className="text-lg font-semibold text-[#000000] mb-2 group-hover:text-[#FCD980]">
                  {faq.question}
                </h3>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA */}
      <div className="flex flex-col md:flex-row justify-center place-items-center md:gap-5 mt-12 bg-[#1C1E53] bg-opacity-20 p-10  text-center">
        <p className="text-[#FFFFFF] font-semibold mb-2">
          Still can't find what you're looking for?
        </p>
        <br />
        <Link
          to="/contact"
          className="inline-block bg-[#FFFFFF] text-[#000000] font-medium py-2 px-6 rounded hover:bg-[#f4c44f] transition-colors duration-300"
        >
          Contact Our Support Team
        </Link>
      </div>
      <br />

    </>
  );
};

export default Help;
