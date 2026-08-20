import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertOctagon } from 'lucide-react';

export function HeavyPunishmentModal({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md w-full border-t-8 border-rose-500"
          >
            <div className="w-24 h-24 mx-auto bg-rose-100 rounded-full flex items-center justify-center mb-6">
              <AlertOctagon className="w-12 h-12 text-rose-600" />
            </div>
            <h2 className="text-3xl font-black text-rose-700 mb-4">عقاب التقصير ⚠️</h2>
            <p className="text-neutral-700 mb-8 font-medium text-lg leading-relaxed">
              لقد مر يومان متتاليان ولم تنجز 20 درساً كما هو مقرر!<br/>
              يجب عليك الآن مراجعة مكثفة وتعويض ما فاتك لعدم الانقطاع.
            </p>
            <button 
              onClick={onClose}
              className="px-6 py-4 bg-rose-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-rose-700 transition-colors w-full"
            >
              أعترف بالتقصير وسأعوضه
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
