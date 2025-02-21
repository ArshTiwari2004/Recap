import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { fireDB } from '../config/Firebaseconfig';

const FeedbackDisplay = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const q = query(
          collection(fireDB, 'feedback'),
          orderBy('createdAt', 'desc'),
          limit(15)
        );
        
        const querySnapshot = await getDocs(q);
        const feedbackData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate()
        }));
        
        setFeedbacks(feedbackData);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400; // Adjust scroll amount as needed
      const newScrollPosition = scrollContainerRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-800" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">What Our Users Say</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover how Recap is helping students transform their learning experience
          </p>
        </div>

        <div className="relative px-12"> {/* Added padding here to prevent overlap */}
          {/* Scroll Buttons - Positioned further away from content */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800 p-2 rounded-full text-white hover:bg-gray-700 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800 p-2 rounded-full text-white hover:bg-gray-700 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Scrollable Container with proper spacing */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto hide-scrollbar gap-8 pb-4 px-2 snap-x snap-mandatory"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {feedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="flex-none w-80 snap-center bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 mx-2"
              >
                <div className="flex items-center space-x-4 mb-4">
                  {/* User Profile */}
                  <div className="flex-shrink-0">
                    {feedback.userPhotoURL ? (
                      <img
                        src={feedback.userPhotoURL}
                        alt="User"
                        className="w-12 h-12 rounded-full object-cover border-2 border-purple-500"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                        <span className="text-white text-lg font-semibold">
                          {feedback.userEmail?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {feedback.userName || feedback.userEmail?.split('@')[0]}
                    </p>
                    <p className="text-sm text-gray-400">
                      {feedback.createdAt?.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex mb-4">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`w-5 h-5 ${
                        index < feedback.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-500'
                      }`}
                    />
                  ))}
                </div>

                {/* Feedback Text */}
                <p className="text-gray-300 mb-4 line-clamp-4">{feedback.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default FeedbackDisplay;