import React, { useState } from 'react';
import { Star, Send, Smile, Frown, Heart, Award, MessageSquare } from 'lucide-react';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    rating: 0,
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        category: '',
        rating: 0,
        message: ''
      });
    }, 3000);
  };

  const categories = [
    { icon: <Heart className="w-4 h-4" />, label: 'Overall Experience' },
    { icon: <Award className="w-4 h-4" />, label: 'Product Quality' },
    { icon: <MessageSquare className="w-4 h-4" />, label: 'Customer Service' },
    { icon: <Smile className="w-4 h-4" />, label: 'User Interface' }
  ];

  const getRatingEmoji = (rating) => {
    if (rating === 0) return '😶';
    if (rating <= 2) return '😔';
    if (rating <= 3) return '😊';
    if (rating <= 4) return '😄';
    return '🤩';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-950">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-grid-white/5" />
        </div>

        {/* Glowing Orbs */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />

        {!isSubmitted ? (
          <>
            <div className="relative text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                We Value Your Feedback
              </h2>
              <p className="text-gray-400 text-lg">Help us serve you better</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 relative">
              {/* Personal Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-300 mb-2 transition-all group-focus-within:text-purple-400">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField('')}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg 
                             focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                             text-white placeholder-gray-500 transition-all duration-300
                             backdrop-blur-sm"
                    placeholder="John Doe"
                    required
                  />
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-purple-500 transition-all duration-300
                                 ${focusedField === 'name' ? 'w-full' : 'w-0'}`} />
                </div>

                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-300 mb-2 transition-all group-focus-within:text-purple-400">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg 
                             focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                             text-white placeholder-gray-500 transition-all duration-300
                             backdrop-blur-sm"
                    placeholder="john@example.com"
                    required
                  />
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-purple-500 transition-all duration-300
                                 ${focusedField === 'email' ? 'w-full' : 'w-0'}`} />
                </div>
              </div>

              {/* Category Selection */}
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3">
                {categories.map(({ icon, label }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: label }))}
                    className={`p-4 rounded-lg border ${
                      formData.category === label
                        ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                        : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-purple-500/50'
                    } transition-all duration-300 flex flex-col items-center gap-2`}
                  >
                    {icon}
                    <span className="text-sm">{label}</span>
                  </button>
                ))}
              </div>

              {/* Rating */}
              <div className="space-y-4">
                <label className="block text-sm font-small text-gray-300">
                  How would you rate your experience?
                </label>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onMouseEnter={() => setHoverRating(num)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setFormData(prev => ({ ...prev, rating: num }))}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          formData.rating >= num || hoverRating >= num
                            ? 'bg-purple-500 text-white scale-110'
                            : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        <Star className={`w-5 h-5 ${
                          formData.rating >= num || hoverRating >= num ? 'fill-current' : ''
                        }`} />
                      </button>
                    ))}
                  </div>
                  <span className="text-3xl">{getRatingEmoji(hoverRating || formData.rating)}</span>
                </div>
              </div>

              {/* Message Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField('')}
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg 
                           focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                           text-white placeholder-gray-500 transition-all duration-300
                           backdrop-blur-sm resize-none"
                  placeholder="Share your thoughts with us..."
                  required
                />
                <div className={`absolute bottom-0 left-0 h-0.5 bg-purple-500 transition-all duration-300
                               ${focusedField === 'message' ? 'w-full' : 'w-0'}`} />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium 
                         py-4 rounded-lg transition-all duration-300 transform hover:translate-y-px 
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 
                         focus:ring-offset-gray-900 flex items-center justify-center gap-2 group"
              >
                <span>Submit Feedback</span>
                <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-3xl font-bold text-white mt-8 mb-4">Thank You!</h3>
            <p className="text-gray-400 text-lg">Your valuable feedback has been recorded.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm;
