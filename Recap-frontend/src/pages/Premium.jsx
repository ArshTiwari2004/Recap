import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard, Check, Sparkles, Star, ShieldCheck, User, Mail, Phone,
  BookOpen, Bell, Zap, Book, Users, Brain, Calendar
} from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import Sidebar from '../components/Sidebar';
import toast from 'react-hot-toast';
import Notification from '@/components/Notifications';
import NavBar from '@/components/NavBar';
import Chatbot from './ChatBot';

const Premium = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [user, setUser] = useState(null);
  
    useEffect(() => {
          // Retrieve user data from localStorage
          const storedUser = JSON.parse(localStorage.getItem('user'));
          setUser(storedUser);
        }, []);
        console.log(user)

        const getPaymentAmount = () => {
          // Convert display prices to paise
          const amounts = {
            monthly: 79900, // ₹799
            yearly: 749900  // ₹7,499
          };
          return amounts[selectedPlan];
        };

        const handlePaymentSuccess = (response) => {
          toast.success("Payment successful!");
          // Here you would typically:
          // 1. Call your backend API to verify payment
          // 2. Update user's subscription status
          // 3. Store payment details in your database
          try {
            // Example API call
            // await axios.post('/api/verify-payment', {
            //   paymentId: response.razorpay_payment_id,
            //   orderId: response.razorpay_order_id,
            //   signature: response.razorpay_signature,
            //   plan: selectedPlan
            // });
            
            // Update local user state
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
            
            // Show success message and redirect
            toast.success("Welcome to Premium! Redirecting to dashboard...", {
              duration: 3000,
            });
            
            // Redirect after a short delay to ensure toast is visible
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
            // Ideally, you should create an order on your backend
            // const order = await axios.post('/api/create-order', {
            //   amount: getPaymentAmount(),
            //   plan: selectedPlan
            // });

            const options = {
              key:  "rzp_test_fRN4LCYqz2Cmxc",
              amount: getPaymentAmount(),
              currency: "INR",
              name: "Recap Learning",
              description: `${selectedPlan === 'monthly' ? 'Monthly' : 'Yearly'} Premium Subscription`,
              image: "/path/to/your/logo.png", // Add your logo here
              // order_id: order.id, // Get this from backend
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
              },
              // Enable this for multiple payment methods
              config: {
                display: {
                  blocks: {
                    upi: {
                      name: "Pay using UPI",
                      instruments: [
                        {
                          method: "upi"
                        },
                        {
                          method: "google_pay"
                        },
                        {
                          method: "paytm"
                        }
                      ]
                    },
                    card: {
                      name: "Pay using Card",
                      instruments: [
                        {
                          method: "card"
                        }
                      ]
                    },
                    netbanking: {
                      name: "Pay using Netbanking",
                      instruments: [
                        {
                          method: "netbanking"
                        }
                      ]
                    }
                  },
                  sequence: ["block.upi", "block.card", "block.netbanking"],
                  preferences: {
                    show_default_blocks: true
                  }
                }
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
        
  

  const plans = {
    free: {
      price: '$0',
      period: 'forever',
      features: [
        'Manual note uploads (PDF, text, image)',
        'Basic flashcards and quizzes',
        'Limited AI features (2 sessions/week)',
        'Basic study analytics'
      ]
    },
    monthly: {
      price: '$7.99',
      period: 'month',
      features: [
        'Unlimited AI-powered features',
        'Audio transcription & analysis',
        'Advanced flashcards & quizzes',
        'Collaborative study groups',
        'Weekly study analytics',
        'Priority customer support'
      ]
    },
    yearly: {
      price: '$74.99',
      period: 'year',
      features: [
        'All monthly features included',
        'Save over 20% annually',
        'Exclusive study resources',
        'Advanced analytics dashboard',
        'Priority email support',
        'Early access to new features'
      ]
    }
  };


  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Learning',
      description: 'Smart flashcards and quizzes generated from your notes'
    },
    {
      icon: Users,
      title: 'Collaborative Study',
      description: 'Create and join study groups for better learning'
    },
    {
      icon: Zap,
      title: 'Real-time Analytics',
      description: 'Track your progress and identify knowledge gaps'
    },
    {
      icon: Calendar,
      title: 'Study Streaks',
      description: 'Stay motivated with gamified learning experiences'
    }
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Sidebar */}
      
    <div className="flex h-screen bg-gray-900">
        <Sidebar />
      </div>

      <div className="flex-1 flex-col">
        {/* Navbar */}

        <NavBar
          icon={<BookOpen className="w-6 h-6 text-purple-400" />}
          header={"Premium"}
          button1={"Feedback"}
          button2={"Help"}
          button3={"Docs"}
        />

        {/* Main content */}
        <div className="max-w-6xl mx-auto w-full space-y-12 p-6 mt-8">
          {/* Header section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center px-4 py-2 bg-purple-900/30 rounded-full">
              <Sparkles className="h-4 w-4 text-purple-400 mr-2" />
              <span className="text-sm text-purple-300">Special Launch Offer - Save 20%</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Unlock Your Learning Potential
            </h1>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Choose the perfect plan for your learning journey. All plans include a 7-day free trial.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="grid md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <feature.icon className="h-8 w-8 text-purple-400 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Plan selection */}
          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(plans).map(([plan, details]) => (
              <div
                key={plan}
                onClick={() => plan !== 'free' && setSelectedPlan(plan)}
                className={`relative rounded-2xl p-8 transition-all duration-300 ${
                  selectedPlan === plan
                    ? 'bg-gradient-to-br from-purple-900 to-purple-700 border border-purple-500/50'
                    : 'bg-gray-800/50 hover:bg-gray-800/80 border border-gray-700'
                } backdrop-blur-xl ${plan !== 'free' ? 'cursor-pointer' : ''} group`}
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
                    <h3 className="text-xl font-medium text-white capitalize">
                      {plan === 'free' ? 'Basic' : `${plan} Plan`}
                    </h3>
                    <div className="text-4xl font-bold text-white">
                      {details.price}
                      <span className="text-base font-normal text-gray-300">/{details.period}</span>
                    </div>
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
                    onClick={() => plan !== 'free' && loadRazorpay()}
                    className={`w-full py-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
                      plan === 'free'
                        ? 'bg-gray-700 text-white cursor-not-allowed'
                        : selectedPlan === plan
                        ? 'bg-white text-purple-900 hover:bg-gray-100'
                        : 'bg-gray-700/50 text-white hover:bg-gray-700'
                    } font-medium`}
                  >
                    {plan === 'free' ? (
                      'Current Plan'
                    ) : selectedPlan === plan ? (
                      <>
                        <CreditCard className="w-4 h-4" />
                        Buy Now
                      </>
                    ) : (
                      'Choose Plan'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Features comparison table */}
          <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
            <h3 className="text-xl font-medium text-white mb-6">Feature Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                <tr className="border-b border-gray-700">
                    <th className="py-4 text-left text-gray-400">Feature</th>
                    <th className="py-4 text-center text-gray-400">Basic</th>
                    <th className="py-4 text-center text-gray-400">Premium Monthly</th>
                    <th className="py-4 text-center text-gray-400">Premium Yearly</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700">
                    <td className="py-4 text-gray-300">Note Uploads</td>
                    <td className="py-4 text-center text-gray-300">Limited</td>
                    <td className="py-4 text-center text-gray-300">Unlimited</td>
                    <td className="py-4 text-center text-gray-300">Unlimited</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-4 text-gray-300">AI Features</td>
                    <td className="py-4 text-center text-gray-300">2/week</td>
                    <td className="py-4 text-center text-gray-300">Unlimited</td>
                    <td className="py-4 text-center text-gray-300">Unlimited</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-4 text-gray-300">Study Groups</td>
                    <td className="py-4 text-center text-gray-300">—</td>
                    <td className="py-4 text-center text-gray-300">✓</td>
                    <td className="py-4 text-center text-gray-300">✓</td>
                  </tr>
                  <tr>
                    <td className="py-4 text-gray-300">Priority Support</td>
                    <td className="py-4 text-center text-gray-300">—</td>
                    <td className="py-4 text-center text-gray-300">✓</td>
                    <td className="py-4 text-center text-gray-300">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Subscription footer */}
          <div className="bg-gradient-to-br from-purple-900 to-purple-700 rounded-2xl p-8 text-white flex justify-between items-center">
            <div>
              <h3 className="text-xl font-medium">Not sure yet?</h3>
              <p className="text-sm text-purple-200">
                Sign up for our free plan and explore the benefits of premium at your own pace.
              </p>
            </div>
            <button className="bg-white text-purple-900 py-4 px-6 rounded-xl font-medium">
              Try Free Plan
            </button>
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default Premium;