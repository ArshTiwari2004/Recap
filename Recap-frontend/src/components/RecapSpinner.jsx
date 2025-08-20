// RecapSpinner.jsx
import React from "react";
import { motion } from "framer-motion";

const RecapSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-gray-900">
      {/* Outer rotating ring */}
      <motion.div
        className="relative w-32 h-32 border-4 border-transparent border-t-blue-500 border-b-purple-500 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
      >
        {/* Inner glowing orb */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg"
          animate={{
            y: ["-50%", "-60%", "-50%"],
            x: ["-50%", "-60%", "-50%"],
            scale: [1, 1.5, 1],
          }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        ></motion.div>

        {/* Company letters spinning along ring */}
        {["R", "E", "C", "A", "P"].map((letter, i) => (
          <motion.div
            key={i}
            className="absolute text-white font-bold text-lg"
            style={{
              transformOrigin: "50% 50%",
              rotate: `${i * 72}deg`,
              top: "50%",
              left: "50%",
              translate: "-50% -50%",
            }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          >
            {letter}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default RecapSpinner;
