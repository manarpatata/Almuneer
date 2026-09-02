import React, { useState } from 'react';
import { X, Shield, Snowflake, ShoppingCart, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { User } from 'firebase/auth';

interface StoreModalProps {
  user: User | null;
  points: number;
  onClose: () => void;
  showToast?: (msg: string) => void;
}

export function StoreModal({ user, points, onClose, showToast }: StoreModalProps) {
  const [buying, setBuying] = useState(false);

  const IMMUNITY_COST = 500;
  const FREEZE_COST = 300;

  const handleBuy = async (type: 'immunity' | 'freeze', cost: number) => {
    if (!user) {
      if (showToast) showToast('يجب تسجيل الدخول أولاً');
      return;
    }
    if (points < cost) {
      if (showToast) showToast('نقاطك لا تكفي 😢');
      return;
    }

    setBuying(true);
    try {
      const updates: any = {
        points: increment(-cost)
      };
      
      if (type === 'immunity') {
        updates.immunityCards = increment(1);
      } else if (type === 'freeze') {
        updates.extraStreakFreezes = increment(1);
      }
      
      await updateDoc(doc(db, 'users', user.uid), updates);
      if (showToast) showToast('تم الشراء بنجاح! 🎉');
    } catch (e) {
      console.error(e);
      if (showToast) showToast('حدث خطأ أثناء الشراء');
    }
    setBuying(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-md p-6 sm:p-8 shadow-2xl relative overflow-y-auto max-h-[90vh]" dir="rtl">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">المتجر</h2>
              <p className="text-slate-500 font-bold text-sm">استبدل نقاطك ببطاقات مفيدة</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 bg-yellow-50 text-yellow-700 py-3 px-6 rounded-2xl border border-yellow-200 mb-8 font-black text-lg">
          <Trophy className="w-5 h-5 text-yellow-500" />
          رصيدك: <span className="font-mono text-xl">{points}</span> نقطة
        </div>

        <div className="flex flex-col gap-4">
          <div className="border-2 border-yellow-200 bg-yellow-50/50 rounded-2xl p-5 flex items-center justify-between gap-4 transition-transform hover:scale-[1.02]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center shrink-0">
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-lg mb-1">كرت إعفاء</h3>
                <p className="text-slate-500 text-xs font-bold leading-relaxed">يعفيك من العقوبة إذا لم تدرس</p>
              </div>
            </div>
            <button 
              disabled={buying || points < IMMUNITY_COST}
              onClick={() => handleBuy('immunity', IMMUNITY_COST)}
              className={`shrink-0 px-5 py-2.5 rounded-xl font-black text-sm transition-all ${points >= IMMUNITY_COST ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg shadow-yellow-500/30' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
            >
              {IMMUNITY_COST} نقطة
            </button>
          </div>

          <div className="border-2 border-blue-200 bg-blue-50/50 rounded-2xl p-5 flex items-center justify-between gap-4 transition-transform hover:scale-[1.02]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                <Snowflake className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-lg mb-1">تجميد الستريك</h3>
                <p className="text-slate-500 text-xs font-bold leading-relaxed">يحمي الستريك الخاص بك من الضياع</p>
              </div>
            </div>
            <button 
              disabled={buying || points < FREEZE_COST}
              onClick={() => handleBuy('freeze', FREEZE_COST)}
              className={`shrink-0 px-5 py-2.5 rounded-xl font-black text-sm transition-all ${points >= FREEZE_COST ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
            >
              {FREEZE_COST} نقطة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
