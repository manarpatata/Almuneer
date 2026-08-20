import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Droplets } from 'lucide-react';

export function WaterGunOverlay({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) {
  useEffect(() => {
    if (isVisible) {
      const t = setTimeout(() => onClose(), 5000);
      return () => clearTimeout(t);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-500/20 backdrop-blur-sm pointer-events-none"
        >
          <motion.div 
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 5, opacity: 0 }}
            transition={{ duration: 1, repeat: 4 }}
            className="absolute rounded-full bg-blue-400/50 w-32 h-32"
          />
          <motion.div 
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 1, repeat: 4, delay: 0.2 }}
            className="absolute rounded-full bg-cyan-400/50 w-48 h-48 -ml-32 mt-20"
          />
          <motion.div 
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 6, opacity: 0 }}
            transition={{ duration: 1.2, repeat: 4, delay: 0.1 }}
            className="absolute rounded-full bg-blue-300/50 w-40 h-40 ml-40 -mt-20"
          />

          <motion.div 
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white/90 p-8 rounded-3xl shadow-2xl text-center max-w-sm pointer-events-auto border-2 border-blue-200"
          >
            <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Droplets className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">رشة ماء! 💦</h2>
            <p className="text-blue-700 mb-6 font-medium text-lg">
              مر يوم أمس بدون أي إنجاز في المراجعة. لا تدع الكسل يغلبك اليوم!
            </p>
            <button 
              onClick={onClose}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700 transition-colors w-full"
            >
              حسناً، سأراجع اليوم
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
