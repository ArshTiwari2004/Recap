import { useState, useEffect } from "react";
import { MessageCircle, X, Send, Maximize, Minimize } from "lucide-react";
import { motion } from "framer-motion";
import Groq from "groq-sdk";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const groq = new Groq({ apiKey: GROQ_API_KEY, dangerouslyAllowBrowser: true });

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasWelcomed, setHasWelcomed] = useState(false);

  useEffect(() => {
    if (isOpen && !hasWelcomed) {
      setChatHistory([{ text: "Hey Student, I will be your teacher at RECAP.", sender: "gyaanSetu" }]);
      setHasWelcomed(true);
    }
  }, [isOpen, hasWelcomed]);

  const fetchAIResponse = async (userMessage) => {
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: userMessage }],
        model: "llama-3.3-70b-versatile",
        temperature: 1,
        max_completion_tokens: 1024,
        top_p: 1,
        stream: false,
      });
      return chatCompletion.choices?.[0]?.message?.content || "Failed to get response";
    } catch (error) {
      console.error("Error fetching AI response:", error);
      return "Error getting response. Try again!";
    }
  };

  const handleSend = async () => {
    if (message.trim() === "") return;

    const userMessage = { text: message, sender: "user" };
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    const aiMessageText = await fetchAIResponse(userMessage.text);
    const aiMessage = { text: aiMessageText, sender: "gyaanSetu" };

    setChatHistory((prev) => [...prev, aiMessage]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-7 right-7 flex flex-col items-end">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.1 }}
          className={`bg-white shadow-xl rounded-2xl p-4 flex flex-col border transition-all ease-in-out duration-300 ${
            isExpanded ? "w-[85vw] h-[85vh] md:w-[70vw] md:h-[80vh]" : "w-80 h-96 md:w-96 md:h-[500px]"
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">GyaanSetu</h2>
              <p className="text-sm text-gray-500">Your AI Study Companion</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-full hover:bg-gray-200 transition"
              >
                {isExpanded ? <Minimize size={20} /> : <Maximize size={20} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-200 transition"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Chat Body */}
          <motion.div
            className="flex-1 flex flex-col gap-2 overflow-y-auto p-4 border rounded-xl mt-3 bg-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {chatHistory.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: msg.sender === "user" ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-3 rounded-lg text-white shadow-md max-w-[75%] ${
                  msg.sender === "user" ? "bg-blue-600 self-end" : "bg-gray-500 self-start"
                }`}
              >
                {msg.text}
              </motion.div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
                className="self-start p-2 text-sm text-gray-500"
              >
                Typing...
              </motion.div>
            )}
          </motion.div>

          {/* Chat Input */}
          <div className="flex items-center gap-3 mt-2 border rounded-lg p-3 bg-white shadow-md">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 focus:outline-none bg-gray-100 rounded-lg text-gray-700"
            />
            <motion.button
              onClick={handleSend}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
              disabled={loading}
            >
              <Send size={20} />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="w-16 h-16 flex items-center mt-4 justify-center bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition font-bold"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </motion.button>
    </div>
  );
};

export default Chatbot;
