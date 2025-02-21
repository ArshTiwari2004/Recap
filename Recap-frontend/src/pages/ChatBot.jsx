import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion } from "framer-motion";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]); // Store chat messages

  const handleSend = () => {
    if (message.trim() !== "") {
      const userMessage = { text: message, sender: "user" };
      const aiResponse = { text: "This is a hardcoded AI response.", sender: "ai" }; // Hardcoded AI response

      setChatHistory([...chatHistory, userMessage, aiResponse]); // Add both messages to chat history
      setMessage(""); // Clear input after sending
    }
  };

  return (
    <div className="fixed bottom-7 right-7 flex flex-col items-end">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="w-80 h-96 bg-white shadow-lg rounded-2xl p-4 flex flex-col border mb-4 md:w-96 md:h-[500px]"
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-2">
            <div>
              <h2 className="text-lg font-bold truncate">Sarathi</h2>
              <p className="text-sm">Fulfill your doubts with us</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-gray-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Body */}
          <motion.div
            className="flex-1 flex flex-col gap-2 overflow-y-auto p-4 border rounded-xl mt-2"
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
                className={`p-2 rounded-lg text-white shadow-md max-w-[75%] ${
                  msg.sender === "user" ? "bg-blue-600 self-end" : "bg-gray-500 self-start"
                }`}
              >
                {msg.text}
              </motion.div>
            ))}
          </motion.div>

          {/* Chat Input */}
          <div className="flex items-center gap-2 mt-2 border rounded-lg p-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 focus:outline-none"
            />
            <motion.button
              onClick={handleSend}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
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
        className="w-14 h-14 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </motion.button>
    </div>
  );
};

export default Chatbot;
