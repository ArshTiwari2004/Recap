import React, { useState } from 'react';
import { Send, MapPin, Mail, Phone, Clock } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSend = () => {
    if (!email) {
      toast.error("Please enter an email!");
      return;
    }
    toast.success("Email registered successfully!");
    setEmail('');
  };

  return (
    <footer className="bg-gray-900 text-gray-300 py-8" id="contact">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         
          <div className="space-y-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 font-md">Recap</span>
            <p className="text-gray-400 text-sm">AI-driven notes, quick revision. Flashcards, collaboration, knowledge gaps solved.</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span className="text-sm">New Delhi, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400" />
                <a href="mailto:arshtiwari12345@gmail.com" className="hover:text-cyan-400 transition-colors text-sm">
                  arshtiwari12345@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-400" />
                <span className="text-sm">+91 5555566666</span>
              </div>
            </div>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-lg font-semibold text-purple-400 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-cyan-400 transition-colors text-sm" >Home</a></li>
              <li><a href="#features" className="hover:text-cyan-400 transition-colors text-sm "  >Features</a></li>
              <li><a href="#team" className="hover:text-cyan-400 transition-colors text-sm">Team</a></li>
              <li><a href= "#testimonials" className="hover:text-cyan-400 transition-colors text-sm">Testimonial</a></li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="text-lg font-semibold text-purple-400 mb-3">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-3">Subscribe for updates and offers.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-l outline-none focus:ring-2 focus:ring-purple-400 text-sm"
              />
              <button
                onClick={handleSend}
                className="bg-gradient-to-r from-purple-400 to-pink-600 p-2 rounded-r hover:bg-cyan-600 transition-colors"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold text-white mb-2 text-sm">Operating Hours:</h4>
              <div className="flex items-center gap-1 text-gray-400">
                <Clock className="w-3 h-3" />
                <span className="text-sm">Mon - Fri: 9:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">&copy; 2025 Recap. All rights reserved.</p>
          <div className="flex gap-4 mt-3 md:mt-0">
            <a href="/privacy" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Privacy Policy</a>
            <a href="/terms" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Terms of Service</a>
            <a href="/cookies" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Cookie Policy</a>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </footer>
  );
};

export default Footer;
