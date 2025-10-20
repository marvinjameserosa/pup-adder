"use client"

import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

export default function LoadingScreen({ message = "Loading events..." }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2f3f7]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="flex flex-col items-center space-y-4"
      >
        <Loader2 className="h-12 w-12 text-[#a41e1d] animate-spin" />
        <motion.p 
          className="text-lg font-semibold text-[#a41e1d]" 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {message}
        </motion.p>
      </motion.div>
    </div>
  )
}
