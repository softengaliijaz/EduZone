import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  contactUs,
} from "../../../features/contact-us/contactUsSlice";
import {
  Send,
  Mail,
  User,
  MessageSquare,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { contactUsScreenData } from "../../../utils/AppUtils";

const ContactUs = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    subject: "",
    message: "",
  });

  const { loading, error, message } = useSelector((state) => state.contactUs);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullname ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      return;
    }

    try {
      await dispatch(contactUs(formData)).unwrap();
      setFormData({ fullname: "", email: "", subject: "", message: "" });
    } catch {
      // Keep the entered values so the visitor can correct or retry.
    }
  };

  return (
    <>
      <section className="relative bg-gradient-to-b from-white to-gray-50 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-sm font-semibold mb-4">
              <MessageSquare className="w-4 h-4" />
              GET IN TOUCH
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Let's{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Connect
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions, feedback, or ideas? We're here to help. Reach out
              and our team will get back to you promptly.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information Sidebar */}
            <div className="space-y-6">
              {contactUsScreenData.map((info, index) => (
                <a
                  key={index}
                  href={info.href}
                  className="group block bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${info.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <div className="text-white">{info.icon}</div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-1">
                        {info.title}
                      </h3>
                      <p className="text-lg font-bold text-gray-900">
                        {info.value}
                      </p>
                    </div>
                  </div>
                </a>
              ))}

              {/* Support Stats */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Our Support Promise
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Response Time</span>
                    <span className="font-semibold text-blue-600">
                      Within 24 hours
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Support Hours</span>
                    <span className="font-semibold text-purple-600">
                      24/7 Available
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Satisfaction Rate</span>
                    <span className="font-semibold text-green-600">98%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="p-8 md:p-12">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Send Us a Message
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Fill out the form below and we'll get back to you as soon as
                    possible.
                  </p>

                  <form className="space-y-6" onSubmit={handleFormSubmit}>
                    {/* Two Column Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <User className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          name="fullname"
                          type="text"
                          placeholder="Full Name"
                          value={formData.fullname}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          name="email"
                          type="email"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    {/* Subject Input */}
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <MessageSquare className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        name="subject"
                        type="text"
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Message Textarea */}
                    <div className="relative">
                      <div className="absolute left-4 top-4">
                        <MessageSquare className="w-5 h-5 text-gray-400" />
                      </div>
                      <textarea
                        name="message"
                        rows="6"
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      ></textarea>
                    </div>

                    {/* Status Messages */}
                    <div className="space-y-3">
                      {loading && (
                        <div className="flex items-center gap-2 text-blue-600">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Sending your message...</span>
                        </div>
                      )}

                      {error && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl">
                          <svg
                            className="w-5 h-5"
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
                          <span>Error: {error}</span>
                        </div>
                      )}

                      {message && (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-xl">
                          <CheckCircle className="w-5 h-5" />
                          <span>
                            Message sent successfully! We'll get back to you
                            soon.
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold py-4 rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                      <span className="relative flex items-center justify-center gap-3">
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </span>
                    </button>
                  </form>

                  {/* Privacy Note */}
                  <p className="text-center text-gray-500 text-sm mt-6">
                    We respect your privacy. Your information will only be used
                    to respond to your inquiry.
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    24/7
                  </div>
                  <p className="text-gray-700">Support Available</p>
                </div>
                <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100">
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    100%
                  </div>
                  <p className="text-gray-700">Response Rate</p>
                </div>
                <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    Secure
                  </div>
                  <p className="text-gray-700">Encrypted Communication</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Link */}
          <div className="text-center mt-16">
            <p className="text-gray-600">
              Need immediate help? Check out our{" "}
              <a
                href="/faq"
                className="text-blue-600 font-semibold hover:underline"
              >
                Frequently Asked Questions
              </a>
            </p>
          </div>
        </div>
      </section>

    </>
  );
};

export default ContactUs;
