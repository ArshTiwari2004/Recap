import React, { useState } from 'react';
import { CreditCard, Check, Sparkles, Star, ShieldCheck, User, Mail, Phone } from 'lucide-react';
import { BookOpen, Bell } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const Premium = () => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  const plans = {
    monthly: {
      price: '$7.95',
      period: 'month',
      features: [
        'Unlimited written exams',
        'Multiple choice tests',
        'Real-time feedback system',
        'All Smart Study features'
      ]
    },
    yearly: {
      price: '$35.95',
      period: 'year',
      features: [
        'All monthly features included',
        'Save over 60% annually',
        'Priority support access',
        'Early access to new features'
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-start p-6">

      
    
      {/* Navbar */}
      <div className="h-16 bg-gray-800 border-b border-gray-700 px-6 flex items-center justify-between w-full fixed top-0 left-0 z-10">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-purple-400" />
            <span className="text-lg font-semibold text-white">Premium features</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <button className="text-gray-300 hover:text-white transition-colors">
              Feedback
            </button>
            <button className="text-gray-300 hover:text-white transition-colors">
              Help
            </button>
            <button className="text-gray-300 hover:text-white transition-colors">
              Docs
            </button>
            <button className="relative text-gray-300 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">U</span>
            </div>
          </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl w-full space-y-10 mt-24">
        {/* Header section  */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center px-4 py-2 bg-purple-900/30 rounded-full mb-4">
            <Sparkles className="h-4 w-4 text-purple-400 mr-2" />
            <span className="text-sm text-purple-300">Limited Time Offer</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-400">Start your journey today with a 7-day free trial</p>
        </div>

        {/* Plan selection */}
        <div className="grid md:grid-cols-2 gap-8">
          {['monthly', 'yearly'].map((plan) => (
            <div
              key={plan}
              onClick={() => setSelectedPlan(plan)}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${selectedPlan === plan
                ? 'bg-gradient-to-br from-purple-900 to-purple-700 border border-purple-500/50'
                : 'bg-gray-800/50 hover:bg-gray-800/80 border border-gray-700'
              } backdrop-blur-xl cursor-pointer group`}
            >
              {plan === 'yearly' && (
                <div className="absolute -top-3 -right-3">
                  <div className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full flex items-center">
                    <Star className="h-3 w-3 mr-1" />
                    Best Value
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-medium text-white capitalize">{plan} Plan</h3>
                  <div className="text-4xl font-bold text-white">
                    {plans[plan].price}
                    <span className="text-base font-normal text-gray-300">/{plans[plan].period}</span>
                  </div>
                </div>

                <ul className="space-y-4">
                  {plans[plan].features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-1">
                        <Check className="h-4 w-4 text-purple-400" />
                      </div>
                      <span className="text-gray-300 text-sm leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-4 rounded-xl transition-all ${selectedPlan === plan
                    ? 'bg-white text-purple-900 hover:bg-gray-100'
                    : 'bg-gray-700/50 text-white hover:bg-gray-700'
                  } font-medium`}
                >
                  {selectedPlan === plan ? 'Selected Plan' : 'Choose Plan'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Purchase section */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700">
          <div className="flex items-center gap-2 mb-8">
            <ShieldCheck className="h-5 w-5 text-purple-400" />
            <h3 className="text-xl font-medium text-white">Complete Your Purchase</h3>
          </div>

          <div className="space-y-8">
            {/* Personal Details Section */}
            <div className="space-y-6">
              <h4 className="text-lg text-white font-medium">Personal Details</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">First Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-4 h-14 bg-gray-900/50 rounded-xl border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pl-11"
                    />
                    <User className="absolute left-4 top-4 h-5 w-5 text-gray-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Last Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-4 h-14 bg-gray-900/50 rounded-xl border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pl-11"
                    />
                    <User className="absolute left-4 top-4 h-5 w-5 text-gray-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    className="w-full px-4 h-14 bg-gray-900/50 rounded-xl border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pl-11"
                  />
                  <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-500" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    className="w-full px-4 h-14 bg-gray-900/50 rounded-xl border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pl-11"
                  />
                  <Phone className="absolute left-4 top-4 h-5 w-5 text-gray-500" />
                </div>
              </div>
            </div>

            {/* Payment Details Section */}
            <div className="space-y-6">
              <h4 className="text-lg text-white font-medium">Payment Details</h4>
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Card Information</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="1234 1234 1234 1234"
                    className="w-full px-4 h-14 bg-gray-900/50 rounded-xl border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pl-11"
                  />
                  <CreditCard className="absolute left-4 top-4 h-5 w-5 text-gray-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 h-14 bg-gray-900/50 rounded-xl border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 h-14 bg-gray-900/50 rounded-xl border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-purple-600 to-purple-500 h-14 rounded-xl text-white font-medium hover:opacity-90 transition-opacity">
              Start your Journey
            </button>

            <p className="text-center text-sm text-gray-400 flex items-center justify-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Secured with 256-bit encryption. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;
