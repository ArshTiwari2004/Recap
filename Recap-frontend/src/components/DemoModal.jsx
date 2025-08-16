"use client";

import React, { useState } from "react";
import { X, Smile } from "lucide-react";
import { fireDB } from "../config/Firebaseconfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";

const DemoModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    requirements: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hasSubmitted) return; // prevent multiple submissions

    setIsSubmitting(true);

    try {
      await addDoc(collection(fireDB, "demos"), {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        requirements: formData.requirements,
        createdAt: serverTimestamp(),
      });
      toast.success("Demo request submitted successfully!");
      setFormData({ name: "", email: "", company: "", requirements: "" });
      setHasSubmitted(true);
    } catch (error) {
      console.error("Error submitting demo request:", error);
      toast.error("Failed to submit demo request. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl w-full max-w-lg mx-4 relative p-8 border border-gray-700">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>

        {!hasSubmitted ? (
          <>
            <h2 className="text-3xl font-bold text-white mb-2 text-center">
              Request a Demo
            </h2>
            <p className="text-gray-400 mb-6 text-center">
              Fill out this form and we’ll get back to you shortly.
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Email / Phone</label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Company / Role</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-5 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Requirements / Notes</label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-5 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 text-center py-12">
            <Smile className="w-12 h-12 text-yellow-400 animate-bounce" />
            <h3 className="text-2xl font-bold text-white">Thank you!</h3>
            <p className="text-gray-400">
              You have submitted a demo request. We’ll get back to you shortly.
            </p>
            <button
              onClick={onClose}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-semibold transition-all"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoModal;
