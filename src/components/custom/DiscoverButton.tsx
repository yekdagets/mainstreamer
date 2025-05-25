"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface DiscoverButtonProps {
  onDesktopClick: () => void;
}

export function DiscoverButton({ onDesktopClick }: DiscoverButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    // Check if mobile view
    if (window.innerWidth < 1024) {
      router.push("/watch/discover");
    } else {
      onDesktopClick();
    }
  };

  return (
    <motion.div
      className="fixed top-20 right-6 z-50"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
    >
      <Button
        onClick={handleClick}
        className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 rounded-full"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <span className="relative z-10 font-semibold">✨ Discover</span>
      </Button>
    </motion.div>
  );
}
