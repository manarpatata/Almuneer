import React from 'react';
import { X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WalletModalProps {
  immunityCards: number;
  freezeCards: number;
  pointsCards: number; // calculated from points / 300
  onClose: () => void;
}

export function WalletModal({ immunityCards, freezeCards, pointsCards, onClose }: WalletModalProps) {
  const cards = [
    ...Array(immunityCards).fill('immunity'),
    ...Array(freezeCards).fill('freeze'),
    ...Array(pointsCards).fill('points')
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex flex-col items-center p-4">
      <div className="w-full max-w-sm flex justify-between items-center pt-8 pb-4">
        <h2 className="text-2xl font-black text-white">محفظة البطاقات</h2>
        <button 
          onClick={onClose}
          className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 w-full max-w-sm overflow-y-auto pb-24 scrollbar-hide">
        {cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-white/50">
            <span className="text-4xl mb-4">🪹</span>
            <p className="font-bold text-lg">المحفظة فارغة</p>
          </div>
        ) : (
          <div className="flex flex-col items-center pb-8 pt-8 px-4">
            {cards.map((type, idx) => {
              const zIndex = cards.length - idx;
              
              if (type === 'immunity') {
                return (
                  <div key={idx} style={{ zIndex }} className="bg-yellow-50 border-[6px] border-yellow-400 rounded-xl p-5 shadow-2xl relative flex flex-col items-center justify-center text-center transform hover:-translate-y-4 hover:scale-105 transition-transform cursor-pointer h-48 overflow-hidden shrink-0 w-full max-w-[280px] -mt-24 first:mt-0 group hover:!z-50">
                    <div className="absolute inset-1 border-2 border-dashed border-yellow-300 rounded-lg pointer-events-none"></div>
                    <div className="w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center mb-3 shadow-inner z-10">
                      <span className="text-2xl">🎫</span>
                    </div>
                    <h3 className="font-black text-yellow-800 text-2xl uppercase tracking-widest mb-1 z-10">إعفاء</h3>
                    <p className="text-yellow-600 font-bold text-sm z-10 leading-relaxed max-w-[85%]">
                      يلغي أي صندوق عقاب
                    </p>
                    <div className="absolute -bottom-2 right-1 w-32 h-32 rounded-full border-[6px] border-double border-yellow-500 flex flex-col items-center justify-center rotate-[-25deg] opacity-60 z-20">
                      <div className="w-10 h-10 text-yellow-600 mb-1 flex items-center justify-center font-bold text-4xl"><Search className="w-8 h-8 text-yellow-600" strokeWidth={2.5} /></div>
                      <span className="text-[12px] font-black text-yellow-600 leading-tight text-center">لجنة<br/>المتابعة</span>
                    </div>
                  </div>
                );
              }
              
              const isPoints = type === 'points';
              return (
                <div key={idx} style={{ zIndex }} className="bg-indigo-50 border-[6px] border-indigo-400 rounded-xl p-5 shadow-2xl relative flex flex-col items-center justify-center text-center transform hover:-translate-y-4 hover:scale-105 transition-transform cursor-pointer h-48 overflow-hidden shrink-0 w-full max-w-[280px] -mt-24 first:mt-0 group hover:!z-50">
                  <div className="absolute inset-1 border-2 border-dashed border-indigo-300 rounded-lg pointer-events-none"></div>
                  <div className="w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center mb-3 shadow-inner z-10">
                    <span className="text-2xl">{isPoints ? '🌟' : '🧊'}</span>
                  </div>
                  <h3 className="font-black text-indigo-800 text-xl uppercase tracking-widest mb-1 z-10">
                    {isPoints ? 'ربحت 300 نقطة!' : 'استعادة ستريك'}
                  </h3>
                  {!isPoints && (
                    <p className="text-indigo-600 font-bold text-sm z-10 leading-relaxed max-w-[85%]">
                      كرت استعادة أيام الانقطاع
                    </p>
                  )}
                  <div className="absolute -bottom-2 right-1 w-32 h-32 rounded-full border-[6px] border-double border-indigo-600 flex flex-col items-center justify-center rotate-[-25deg] opacity-60 z-20">
                    <div className="w-10 h-10 text-indigo-600 mb-1 flex items-center justify-center font-bold text-4xl"><Search className="w-8 h-8 text-indigo-600" strokeWidth={2.5} /></div>
                    <span className="text-[12px] font-black text-indigo-600 leading-tight text-center">لجنة<br/>المتابعة</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
