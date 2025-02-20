import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How does Smart Study work?",
    answer:
      "Smart Study uses AI to analyze your notes and learning patterns, automatically organizing content and creating personalized study materials. It converts various formats of notes into structured, searchable content and generates quizzes based on your material.",
  },
  {
    question: "Is my data secure and private?",
    answer:
      "Yes, we take data security seriously. All your notes and study materials are encrypted, and we follow strict privacy protocols. Your data is only used to improve your personal learning experience.",
  },
  {
    question: "Can I collaborate with other students?",
    answer:
      "You can share notes, create study groups, and collaborate in real-time. Our platform includes features for group discussions, shared flashcards, and collaborative note-taking.",
  },
  {
    question: "What file formats are supported?",
    answer:
      "We support a wide range of formats including PDF, Word documents, images of handwritten notes, audio recordings, and plain text. Our AI can process and convert all these formats into searchable, organized content.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes! You can try Smart Study free for 14 days with full access to all features. After the trial, you can choose between our Basic and Premium plans based on your needs.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-24" id="faq">
      <div className="text-center mb-16">
        <div className="inline-block px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium mb-4">
          FAQ
        </div>
        <h2 className="text-4xl font-bold text-white mb-4">
          Anything we can help you with?
        </h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="group">
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex items-center justify-between rounded-lg bg-gray-800/40 backdrop-blur-sm p-6 text-left text-white hover:bg-gray-800/60 transition-all"
            >
              <span className="font-medium">{faq.question}</span>
              <ChevronDown
                className={`h-5 w-5 text-purple-400 transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="overflow-hidden text-gray-300 animate-accordion-down">
                <div className="p-6">{faq.answer}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
