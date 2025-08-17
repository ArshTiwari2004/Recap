import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard, Check, Sparkles, Star, Building,
  BookOpen, Zap, Users, Brain, Calendar
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import toast from 'react-hot-toast';
import NavBar from '@/components/NavBar';
import Chatbot from './ChatBot';

const Premium = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  const getPaymentAmount = () => {
    const amounts = {
      monthly: 79900,  // ₹799
      yearly: 749900   // ₹7,499
    };
    return amounts[selectedPlan];
  };

  const handlePaymentSuccess = (response) => {
    toast.success("Payment successful!");
    try {
      const updatedUser = {
        ...user,
        subscription: {
          plan: selectedPlan,
          startDate: new Date().toISOString(),
          paymentId: response.razorpay_payment_id
        }
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast.success("Welcome to Premium! Redirecting to dashboard...", {
        duration: 3000,
      });
      
      setTimeout(() => {
        navigate('/main-dashboard');
      }, 2000);
      
    } catch (error) {
      toast.error("Error verifying payment. Please contact support.");
      console.error("Payment verification failed:", error);
    }
  };

  const handlePaymentError = (error) => {
    toast.error("Payment failed. Please try again.");
    console.error("Payment failed:", error);
  };

  const loadRazorpay = async () => {
    if (!user) {
      toast.error("Please login to continue");
      return;
    }

    try {
      const options = {
        key: "rzp_test_R6LEuwXNeExndG",
        amount: getPaymentAmount(),
        currency: "INR",
        name: "Recap",
        description: `${selectedPlan === 'monthly' ? 'Monthly' : 'Yearly'} Premium Subscription`,
        image: "R.svg",
        handler: handlePaymentSuccess,
        prefill: {
          name: user?.displayName || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: {
          color: "#9333EA",
        },
        modal: {
          confirm_close: true,
          animation: true,
        },
        retry: {
          enabled: true,
          max_count: 3,
        },
        notes: {
          plan: selectedPlan,
          user_id: user?.uid
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', handlePaymentError);
      rzp1.open();
    } catch (error) {
      toast.error("Unable to initialize payment. Please try again.");
      console.error("Payment initialization failed:", error);
    }
  };

  const handleInstitutionalContact = () => {
    toast.success("Our sales team will contact you shortly!");
  };

  const plans = {
    free: {
      price: '₹0',
      period: 'forever',
      features: [
        'Manual note uploads (PDF, text, image)',
        'Basic flashcards and quizzes',
        'Limited AI features (2 sessions/week)',
        'Basic study analytics',
        'Access to community forums',
        'Email support'
      ]
    },
    monthly: {
      price: '₹799',
      period: 'month',
      features: [
        'Unlimited AI-powered learning tools',
        'Audio transcription & detailed analysis',
        'Advanced spaced repetition flashcards',
        'Collaborative study groups (up to 5)',
        'Weekly performance analytics',
        'Priority 24/7 customer support',
        'Custom study plans & roadmaps',
        'Offline mode access'
      ]
    },
    yearly: {
      price: '₹7,499',
      period: 'year',
      features: [
        'All monthly features included',
        'Save ₹2,089 annually (22% off)',
        'Unlimited study groups',
        'Advanced AI performance insights',
        'Priority email & phone support',
        'Early access to new features',
        'Exclusive study resources library',
        'Personal learning coach sessions'
      ]
    },
    institutional: {
      price: '₹39,999',
      period: 'year',
      features: [
        'Everything in Yearly plan +',
        'Minimum 50 student licenses',
        'Dedicated account manager',
        'Custom branded platform',
        'Teacher/admin dashboard',
        'Performance tracking & reports',
        'API access & integrations',
        'On-premise deployment option'
      ]
    }
  };

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Learning',
      description: 'Advanced algorithms create personalized study paths'
    },
    {
      icon: Users,
      title: 'Collaborative Study',
      description: 'Form study groups and share resources'
    },
    {
      icon: Zap,
      title: 'Deep Analytics',
      description: 'Track progress with detailed insights'
    },
    {
      icon: Calendar,
      title: 'Structured Learning',
      description: 'Customized study schedules and tracking'
    }
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="flex h-screen bg-gray-900">
        <Sidebar />
      </div>

      <div className="flex-1 flex-col">
        <NavBar
          icon={<BookOpen className="w-6 h-6 text-purple-400" />}
          header={"Premium"}
          button1={"Feedback"}
          button2={"Help"}
          button3={"Docs"}
        />

        <div className="max-w-7xl mx-auto w-full space-y-12 p-6 mt-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center px-4 py-2 bg-purple-900/30 rounded-full">
              <Sparkles className="h-4 w-4 text-purple-400 mr-2" />
              <span className="text-sm text-purple-300">Special Launch Offer - Save 22% Yearly</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Transform Your Learning Journey
            </h1>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Join 10,000+ students and institutions achieving their academic goals
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <feature.icon className="h-8 w-8 text-purple-400 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {Object.entries(plans).map(([plan, details]) => (
              <div
                key={plan}
                onClick={() => plan !== 'free' && plan !== 'institutional' && setSelectedPlan(plan)}
                className={`relative rounded-2xl p-8 transition-all duration-300 ${
                  selectedPlan === plan
                    ? 'bg-gradient-to-br from-purple-900 to-purple-700 border border-purple-500/50'
                    : plan === 'institutional'
                    ? 'bg-gradient-to-br from-blue-900 to-blue-700 border border-blue-500/50'
                    : 'bg-gray-800/50 hover:bg-gray-800/80 border border-gray-700'
                } backdrop-blur-xl ${plan !== 'free' && plan !== 'institutional' ? 'cursor-pointer' : ''}`}
              >
                {plan === 'yearly' && (
                  <div className="absolute -top-3 -right-3">
                    <div className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full flex items-center">
                      <Star className="h-3 w-3 mr-1" />
                      Best Value
                    </div>
                  </div>
                )}
                {plan === 'institutional' && (
                  <div className="absolute -top-3 -right-3">
                    <div className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full flex items-center">
                      <Building className="h-3 w-3 mr-1" />
                      Enterprise
                    </div>
                  </div>
                )}
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium text-white capitalize">
                      {plan === 'free' ? 'Basic' : 
                       plan === 'institutional' ? 'Institutional' : 
                       `${plan} Plan`}
                    </h3>
                    <div className="text-4xl font-bold text-white">
                      {details.price}
                      <span className="text-base font-normal text-gray-300">/{details.period}</span>
                    </div>
                    {plan === 'institutional' && (
                      <div className="text-sm text-gray-300 mt-1">
                        Starting at 50 licenses
                      </div>
                    )}
                  </div>

                  <ul className="space-y-4">
                    {details.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="mt-1">
                          <Check className="h-4 w-4 text-purple-400" />
                        </div>
                        <span className="text-gray-300 text-sm leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (plan === 'institutional') {
                        handleInstitutionalContact();
                      } else if (plan !== 'free') {
                        loadRazorpay();
                      }
                    }}
                    className={`w-full py-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
                      plan === 'free'
                        ? 'bg-gray-700 text-white cursor-not-allowed'
                        : plan === 'institutional'
                        ? 'bg-white text-blue-900 hover:bg-gray-100'
                        : selectedPlan === plan
                        ? 'bg-white text-purple-900 hover:bg-gray-100'
                        : 'bg-gray-700/50 text-white hover:bg-gray-700'
                    } font-medium`}
                  >
                    {plan === 'free' ? 'Current Plan' :
                     plan === 'institutional' ? 'Contact Sales' :
                     selectedPlan === plan ? (
                      <>
                        <CreditCard className="w-4 h-4" />
                        Subscribe Now
                      </>
                    ) : 'Select Plan'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
            <h3 className="text-xl font-medium text-white mb-6">Complete Feature Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-4 text-left text-gray-400">Feature</th>
                    <th className="py-4 text-center text-gray-400">Basic</th>
                    <th className="py-4 text-center text-gray-400">Premium Monthly</th>
                    <th className="py-4 text-center text-gray-400">Premium Yearly</th>
                    <th className="py-4 text-center text-gray-400">Institutional</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700">
                    <td className="py-4 text-gray-300">AI Study Sessions</td>
                    <td className="py-4 text-center text-gray-300">2/week</td>
                    <td className="py-4 text-center text-gray-300">Unlimited</td>
                    <td className="py-4 text-center text-gray-300">Unlimited</td>
                    <td className="py-4 text-center text-gray-300">Unlimited</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-4 text-gray-300">Study Groups</td>
                    <td className="py-4 text-center text-gray-300">—</td>
                    <td className="py-4 text-center text-gray-300">Up to 5</td>
                    <td className="py-4 text-center text-gray-300">Unlimited</td>
                    <td className="py-4 text-center text-gray-300">Unlimited + Admin</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-4 text-gray-300">Analytics Dashboard</td>
                    <td className="py-4 text-center text-gray-300">Basic</td>
                    <td className="py-4 text-center text-gray-300">Advanced</td>
                    <td className="py-4 text-center text-gray-300">Advanced + AI</td>
                    <td className="py-4 text-center text-gray-300">Enterprise + API</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-4 text-gray-300">Customer Support</td>
                    <td className="py-4 text-center text-gray-300">Email</td>
                    <td className="py-4 text-center text-gray-300">24/7 Priority</td>
                    <td className="py-4 text-center text-gray-300">24/7 + Phone</td>
                    <td className="py-4 text-center text-gray-300">Dedicated Manager</td>
                  </tr>
                  <tr>
                    <td className="py-4 text-gray-300">Custom Branding</td>
                    <td className="py-4 text-center text-gray-300">—</td>
                    <td className="py-4 text-center text-gray-300">—</td>
                    <td className="py-4 text-center text-gray-300">—</td>
                    <td className="py-4 text-center text-gray-300">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900 to-purple-700 rounded-2xl p-8 text-white">
            <div className="text-center">
              <h3 className="text-xl font-medium">Still have questions?</h3>
              <p className="text-sm text-purple-200 mt-2">
                Our team is ready to help you choose the perfect plan for your needs
              </p>
              <button className="bg-white text-purple-900 py-3 px-6 rounded-xl font-medium mt-4">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default Premium;