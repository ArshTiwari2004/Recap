import React, { useState } from "react";
import { Search, Lock, User, MessageSquare, Settings, Phone, Mail } from "lucide-react";

const HelpPage = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "How to reset password?",
      answer:
        "Go to the login page and click 'Forgot Password'. Enter your registered email and follow the link sent to your inbox."
    },
    {
      question: "How to submit feedback?",
      answer:
        "Click the Feedback button in the navigation bar. You can share suggestions or report issues, and our team will review them."
    },
    {
      question: "How to update my profile?",
      answer:
        "Click your avatar at the top-right, go to Profile Settings, and update your details like name, photo, or email."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <div className="bg-gray-800 py-12 px-6 text-center shadow-md">
        <h1 className="text-3xl font-bold text-purple-400">Help & Support</h1>
        <p className="text-gray-400 mt-2">Find answers, troubleshoot issues, and get in touch with us.</p>

        {/* Search Bar */}
        <div className="mt-6 max-w-xl mx-auto relative">
          <input
            type="text"
            placeholder="Search help articles..."
            className="w-full px-4 py-3 rounded-xl bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Search className="absolute right-3 top-3 text-gray-400" size={20} />
        </div>
      </div>

      {/* Quick Categories */}
      <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
          <Lock className="text-purple-400 mb-3" size={28} />
          <h3 className="text-lg font-semibold">Account & Security</h3>
          <p className="text-gray-400 text-sm mt-1">Manage login, passwords, and account settings.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
          <MessageSquare className="text-purple-400 mb-3" size={28} />
          <h3 className="text-lg font-semibold">Feedback & Support</h3>
          <p className="text-gray-400 text-sm mt-1">Submit feedback or report issues with the platform.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
          <User className="text-purple-400 mb-3" size={28} />
          <h3 className="text-lg font-semibold">Using the Platform</h3>
          <p className="text-gray-400 text-sm mt-1">Guides on updating profiles and using features.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
          <Settings className="text-purple-400 mb-3" size={28} />
          <h3 className="text-lg font-semibold">Troubleshooting</h3>
          <p className="text-gray-400 text-sm mt-1">Fix common problems and technical issues.</p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-800 rounded-xl shadow-md">
              <button
                className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium text-gray-200">{faq.question}</span>
                <span className="text-purple-400">{openFAQ === index ? "−" : "+"}</span>
              </button>
              {openFAQ === index && (
                <div className="px-6 pb-4 text-gray-400">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-800 py-12 px-6 mt-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">Still Need Help?</h2>
          <p className="text-gray-400 mb-6">Reach out to our support team for further assistance.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="text-purple-400" size={22} />
              <span className="text-gray-300">arshtiwari12345@gmail.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="text-purple-400" size={22} />
              <span className="text-gray-300">+91 9170352674</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-4">Available Mon–Fri, 9 AM – 6 PM</p>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
