// RecapSpinner.jsx
import React from "react";
import { motion } from "framer-motion";

const letters = ["R"];

const RecapSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-gray-900">
      {/* Outer spinning ring */}
      <motion.div
        className="relative w-40 h-40 rounded-full border-4 border-t-blue-400 border-b-purple-500"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      >
        {/* Glowing core */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full shadow-[0_0_20px_rgba(128,0,255,0.7)]"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          style={{ translate: "-50% -50%" }}
        ></motion.div>

        {/* Orbiting letters */}
        {letters.map((letter, i) => {
          const angle = (360 / letters.length) * i;
          return (
            <motion.div
              key={i}
              className="absolute text-white font-extrabold text-xl"
              style={{
                top: "50%",
                left: "50%",
                translate: "-50% -50%",
                rotate: `${angle}deg`,
                transformOrigin: "0 -70px",
              }}
              animate={{ rotate: 360 + angle }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            >
              {letter}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default RecapSpinner;
