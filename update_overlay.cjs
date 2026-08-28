const fs = require('fs');

const code = `import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, X, Star, Snowflake, Shield } from 'lucide-react';
import { SupervisorGift } from '../types';

interface SupervisorGiftOverlayProps {
  gifts: SupervisorGift[];
  onClaim: (giftId: string) => void;
}

export function SupervisorGiftOverlay({ gifts, onClaim }: SupervisorGiftOverlayProps) {
  const [openedGifts, setOpenedGifts] = useState<Record<string, boolean>>({});
  
  const unclaimedGifts = gifts.filter(g => !g.claimed);
  
  if (unclaimedGifts.length === 0) return null;
  const gift = unclaimedGifts[0]; // Process one at a time
  const isOpened = openedGifts[gift.id];

  const handleOpen = () => {
    setOpenedGifts(prev => ({ ...prev, [gift.id]: true }));
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm" dir="rtl">
      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.div
            key="closed-box"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.2, opacity: 0, filter: 'blur(10px)' }}
            transition={{ type: "spring", bounce: 0.5 }}
            onClick={handleOpen}
            className="relative w-64 h-64 sm:w-72 sm:h-72 bg-gradient-to-br from-fuchsia-400 to-fuchsia-600 rounded-2xl overflow-hidden shadow-2xl shadow-fuchsia-500/50 cursor-pointer hover:scale-[1.03] active:scale-95 transition-all border-4 border-fuchsia-300"
          >
            {/* Vertical Ribbon */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-14 sm:w-16 bg-gradient-to-b from-pink-300 to-pink-500 shadow-sm"></div>
            {/* Horizontal Ribbon */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-14 sm:h-16 bg-gradient-to-r from-pink-300 to-pink-500 shadow-sm"></div>
            {/* Knot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-pink-400 to-pink-600 rotate-45 rounded-2xl shadow-xl border-[4px] border-pink-300"></div>
            
            {/* Gift Tag */}
            <div className="absolute bottom-6 right-6 bg-[#fdf8e6] px-4 py-3 rounded-xl shadow-2xl border-2 border-fuchsia-300 rotate-[-12deg] z-10 w-[150px] sm:w-[170px] pointer-events-none">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 bg-[#fdf8e6] rounded-full border-2 border-fuchsia-300 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-fuchsia-500 rounded-full"></div>
              </div>
              <p className="text-sm sm:text-base font-black text-fuchsia-900 mb-1.5 leading-tight text-center mt-1">هدية خاصة 🎁</p>
              <p className="text-xs text-fuchsia-700 font-bold border-t border-fuchsia-200 pt-1.5 text-center">من: {gift.from}</p>
            </div>
            
            <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity"></div>
          </motion.div>
        ) : (
          <motion.div
            key="opened-card"
            initial={{ scale: 0.5, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="w-full max-w-sm bg-fuchsia-50 border-[6px] border-fuchsia-400 rounded-3xl p-8 shadow-2xl relative text-center overflow-hidden"
          >
            <div className="absolute inset-2 border-2 border-dashed border-fuchsia-300 rounded-2xl pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-fuchsia-500 text-white rounded-full flex items-center justify-center mb-4 shadow-inner">
                {gift.giftType === 'freeze' ? <Snowflake className="w-8 h-8" /> : 
                 gift.giftType === 'pardon' ? <Shield className="w-8 h-8" /> : 
                 <Star className="w-8 h-8 fill-current" />}
              </div>
              
              <h3 className="font-black text-fuchsia-800 text-2xl uppercase tracking-widest mb-4">
                {gift.giftType === 'freeze' ? 'كرت استعادة ستريك' : 
                 gift.giftType === 'pardon' ? 'كرت إعفاء' : 
                 'مكافأة 300 نقطة!'}
              </h3>
              
              {gift.message && (
                <div className="bg-white rounded-2xl p-5 mb-6 border border-fuchsia-100 shadow-sm w-full">
                  <p className="text-fuchsia-700 font-bold text-lg leading-relaxed">"{gift.message}"</p>
                </div>
              )}
              
              <div className="inline-block bg-fuchsia-100 px-5 py-2 rounded-full text-sm font-black text-fuchsia-800 border border-fuchsia-200 mb-8">
                من: {gift.from}
              </div>

              <button 
                onClick={() => onClaim(gift.id)}
                className="w-full bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-lg shadow-fuchsia-200 hover:shadow-fuchsia-300 hover:-translate-y-1 text-lg flex items-center justify-center gap-2"
              >
                {gift.giftType === 'freeze' ? 'استلام كرت التجميد 🧊' : 
                 gift.giftType === 'pardon' ? 'استلام كرت الإعفاء 🛡️' : 
                 'استلام النقاط ✨'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
`;
fs.writeFileSync('src/components/SupervisorGiftOverlay.tsx', code);
console.log("Updated SupervisorGiftOverlay");
