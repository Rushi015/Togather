"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const word = "Gather.";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15, // time between each letter
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.7 },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Landing() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 1000); // 3 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-screen h-screen bg-white flex items-center justify-center">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.div
            key="gather"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex space-x-1 text-black text-9xl font-bold"
          >
            {word.split("").map((char, index) => (
              <motion.span key={index} variants={letterVariants}>
                {char}
              </motion.span>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="navbar"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 w-full px-30 py-6 flex justify-between items-center"
          >
            <h2 className="text-black text-3xl font-semibold">Gather</h2>

            <div className="flex items-center gap-6 text-black">
             
              <Link href="/landing">same3</Link>
              <Link href="/landing">same4</Link>
            </div>
                
            <button className="bg-white text-black px-6 py-2 rounded-md">
              Get Started
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
