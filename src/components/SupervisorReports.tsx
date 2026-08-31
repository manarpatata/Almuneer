import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Trophy, X, Download, Share2, Eye, EyeOff } from 'lucide-react';
import { AppState, LeaderboardEntry } from '../types';
import { getWeeklyLessons, getMostRecentThursday } from '../utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import html2canvas from 'html2canvas';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface SupervisorReportsProps {
  usersMap: Record<string, AppState>;
  supervisorId: string;
}

export function SupervisorReports({ usersMap, supervisorId }: SupervisorReportsProps) {
  const [showModal, setShowModal] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [currentWeekEntries, setCurrentWeekEntries] = useState<LeaderboardEntry[]>([]);
  const [showGlobal, setShowGlobal] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Calculate current week's leaderboard
    const todayStr = new Date().toISOString().split('T')[0];
    const entries: LeaderboardEntry[] = Object.entries(usersMap)
      .map(([uid, data]) => ({
        uid,
        displayName: data.displayName || 'مستخدم غير معروف',
        weeklyLessons: getWeeklyLessons(data.history, todayStr),
        avatarUrl: data.avatarUrl || null
      }))
      .filter(u => u.weeklyLessons > 0)
      .sort((a, b) => b.weeklyLessons - a.weeklyLessons);
    
    setCurrentWeekEntries(entries);
  }, [usersMap]);

  useEffect(() => {
    // Check if global leaderboard is enabled for users
    // We assume the supervisor toggles a field in their own doc, and we also need to push this to tracked users, or just use a global doc.
    // For simplicity, let's just keep track of it in supervisor's doc.
    const fetchSupData = async () => {
      const snap = await getDoc(doc(db, 'users', supervisorId));
      if (snap.exists()) {
        const data = snap.data();
        setShowGlobal(!!data.leaderboardSettings?.show);
        if (data.weeklyReports) {
          setReports(data.weeklyReports);
        }
      }
    };
    fetchSupData();
  }, [supervisorId]);

  const handleToggleGlobal = async () => {
    if (supervisorId === 'guest') {
      // Just toggle locally if guest
      setShowGlobal(!showGlobal);
      return;
    }
    const newState = !showGlobal;
    setShowGlobal(newState);
    
    // Update all tracked users with the current leaderboard so they can see it
    // Wait, users need the entries.
    const settings = {
      show: newState,
      entries: currentWeekEntries.slice(0, 10), // top 10
      lastUpdated: Date.now()
    };
    
    // Update supervisor doc just to save preference
    await updateDoc(doc(db, 'users', supervisorId), {
      leaderboardSettings: settings
    });
    
    // Update all users
    Object.keys(usersMap).forEach(async (uid) => {
      try {
        await updateDoc(doc(db, 'users', uid), { leaderboardSettings: settings });
      } catch (e) {
        console.error("Failed to update user", uid, e);
      }
    });
  };

  const handleDownload = async () => {
    if (chartRef.current) {
      try {
        const canvas = await html2canvas(chartRef.current, { backgroundColor: '#f8fafc' });
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${new Date().toISOString().split('T')[0]}.png`;
        a.click();
      } catch (e) {
        console.error("Failed to capture chart", e);
      }
    }
  };

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 left-6 z-50 bg-indigo-600 text-white p-4 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border-4 border-indigo-200"
      >
        <FileText className="w-8 h-8" />
        <span className="font-black">لوحة الأبطال 🦸‍♀️</span>
      </button>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[300] bg-slate-900/80 backdrop-blur-sm flex justify-center items-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-50 w-full max-w-4xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden relative border-4 border-slate-200"
              dir="rtl"
            >
              <div className="flex justify-between items-center p-6 bg-white border-b border-slate-200 shrink-0">
                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-amber-500" />
                  التقرير الأسبوعي ولوحة الأبطال ⭐️
                </h2>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleToggleGlobal}
                    className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors ${showGlobal ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}
                  >
                    {showGlobal ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    {showGlobal ? 'معروض للمستخدمين' : 'إظهار للمستخدمين'}
                  </button>
                  <button onClick={() => setShowModal(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                    <X className="w-6 h-6 text-slate-600" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6" ref={chartRef}>
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
                  <h3 className="text-center font-black text-3xl text-slate-800 mb-8">أبطال الأسبوع 👑</h3>
                  <div className="flex justify-center items-end gap-4 sm:gap-8 mb-12">
                    {currentWeekEntries[1] && (
                      <div className="flex flex-col items-center gap-2 mb-4">
                        <div className="w-16 h-16 bg-slate-200 rounded-full border-4 border-slate-300 flex items-center justify-center text-xl font-bold">2</div>
                        <span className="font-bold text-slate-700 text-lg">{currentWeekEntries[1].displayName}</span>
                        <span className="text-slate-500 font-bold bg-slate-100 px-3 py-1 rounded-full">{currentWeekEntries[1].weeklyLessons} درس</span>
                      </div>
                    )}
                    {currentWeekEntries[0] && (
                      <div className="flex flex-col items-center gap-2">
                        <Trophy className="w-12 h-12 text-amber-400 mb-2" />
                        <div className="w-24 h-24 bg-amber-100 rounded-full border-4 border-amber-400 flex items-center justify-center text-3xl font-black text-amber-600">1</div>
                        <span className="font-black text-amber-600 text-2xl">{currentWeekEntries[0].displayName}</span>
                        <span className="text-amber-700 font-black bg-amber-50 px-4 py-1.5 rounded-full border border-amber-200">{currentWeekEntries[0].weeklyLessons} درس</span>
                      </div>
                    )}
                    {currentWeekEntries[2] && (
                      <div className="flex flex-col items-center gap-2 mb-6">
                        <div className="w-14 h-14 bg-orange-100 rounded-full border-4 border-orange-300 flex items-center justify-center text-lg font-bold text-orange-700">3</div>
                        <span className="font-bold text-slate-700 text-lg">{currentWeekEntries[2].displayName}</span>
                        <span className="text-slate-500 font-bold bg-slate-100 px-3 py-1 rounded-full">{currentWeekEntries[2].weeklyLessons} درس</span>
                      </div>
                    )}
                  </div>
                  
                  {currentWeekEntries.length > 0 ? (
                    <div className="h-[400px] w-full mt-12" dir="ltr">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={currentWeekEntries} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                          <XAxis dataKey="displayName" angle={-45} textAnchor="end" height={80} interval={0} stroke="#64748b" tick={{fill: '#475569', fontWeight: 600}} />
                          <YAxis stroke="#64748b" tick={{fill: '#475569', fontWeight: 600}} />
                          <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', fontWeight: 'bold'}} />
                          <Bar dataKey="weeklyLessons" radius={[8, 8, 0, 0]} name="الدروس">
                            {currentWeekEntries.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 0 ? '#fbbf24' : index === 1 ? '#cbd5e1' : index === 2 ? '#fdba74' : '#818cf8'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="text-center text-slate-500 py-12 font-bold">لا يوجد بيانات كافية لهذا الأسبوع.</div>
                  )}
                </div>
              </div>
              
              <div className="p-4 bg-white border-t border-slate-200 flex justify-end shrink-0">
                <button 
                  onClick={handleDownload}
                  className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  تحميل ومشاركة التقرير كصورة
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
