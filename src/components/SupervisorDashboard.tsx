import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, onSnapshot, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import { AppState, SupervisorGift } from '../types';
import { Users, Search, Gift, Skull, ShieldBan, X, AlertTriangle, ShieldCheck, ArrowRight, UserPlus, Trash2 } from 'lucide-react';
import { calculateTotalScore, getWeeklyLessons, getTodayDateString } from '../utils';
import { SupervisorReports } from './SupervisorReports';

export function SupervisorDashboard({ onClose, supervisorId, trackedUsers = [], showToast }: { onClose: () => void, supervisorId: string, trackedUsers?: string[], showToast?: (msg: string) => void }) {
  const [usersMap, setUsersMap] = useState<Record<string, AppState>>({});
  const [newUserId, setNewUserId] = useState('');
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [error, setError] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [pointsChange, setPointsChange] = useState(0);
  
  // Modals state
  const [selectedUser, setSelectedUser] = useState<{ id: string; data: AppState } | null>(null);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showPunishModal, setShowPunishModal] = useState(false);
  const [punishReason, setPunishReason] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  
  // Gift form
  const [giftMessage, setGiftMessage] = useState('');
  const [giftType, setGiftType] = useState<'points'|'freeze'|'pardon'>('points');
  const [giftFrom, setGiftFrom] = useState('مشرفك');

  useEffect(() => {
    const unsubscribes = trackedUsers.map(id => {
      return onSnapshot(doc(db, 'users', id), (docSnap) => {
        if (docSnap.exists()) {
          setUsersMap(prev => ({ ...prev, [id]: docSnap.data() as AppState }));
        }
      });
    });
    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [trackedUsers]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const uid = newUserId.trim();
    if (!uid) return;
    if (trackedUsers.includes(uid)) {
      setError('هذا المستخدم مضاف مسبقاً للقائمة.');
      return;
    }
    
    setLoadingAdd(true);
    setError('');
    
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        await updateDoc(doc(db, 'users', supervisorId), {
          trackedUsers: arrayUnion(uid)
        });
        setNewUserId('');
      } else {
        setError('كود المشارك غير صحيح أو الحساب غير موجود.');
      }
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء الإضافة. تأكد من اتصالك.');
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleRemoveUser = async (uid: string) => {
    if (!confirm('هل أنت متأكد من إزالة هذا المستخدم من قائمتك؟')) return;
    try {
      await updateDoc(doc(db, 'users', supervisorId), {
        trackedUsers: arrayRemove(uid)
      });
      setUsersMap(prev => {
        const next = { ...prev };
        delete next[uid];
        return next;
      });
    } catch (e) {
      console.error(e);
      showToast ? showToast('حدث خطأ أثناء الإزالة') : alert('حدث خطأ أثناء الإزالة');
    }
  };

  const handleSendGift = async () => {
    if (!selectedUser) return;
    try {
      const userRef = doc(db, 'users', selectedUser.id);
      const newGift: SupervisorGift = {
        id: Date.now().toString(),
        message: giftMessage,
        from: giftFrom || 'مشرفك',
        claimed: false,
        timestamp: Date.now(),
        giftType: giftType
      };
      
      const currentGifts = selectedUser.data.supervisorGifts || [];
      const updatedGifts = [...currentGifts, newGift];
      await updateDoc(userRef, { supervisorGifts: updatedGifts });
      
      setShowGiftModal(false);
      showToast ? showToast('تم إرسال الهدية بنجاح! ✨') : alert('تم إرسال الهدية بنجاح!');
    } catch (e) {
      console.error(e);
      showToast ? showToast('حدث خطأ أثناء الإرسال') : alert('حدث خطأ أثناء الإرسال');
    }
  };

  const handleSendPunishment = async () => {
    if (!selectedUser) return;
    try {
      const userRef = doc(db, 'users', selectedUser.id);
      await updateDoc(userRef, {
        supervisorPunishments: arrayUnion({
          id: Date.now().toString(),
          reason: punishReason || 'عقاب من المشرف',
          sender: 'المشرف',
          timestamp: Date.now()
        })
      });
      
      setShowPunishModal(false);
      setPunishReason('');
      showToast ? showToast('تم إرسال العقوبة بنجاح! 💀') : alert('تم إرسال العقوبة بنجاح!');
    } catch (e) {
      console.error(e);
      showToast ? showToast('حدث خطأ أثناء الإرسال') : alert('حدث خطأ أثناء الإرسال');
    }
  };

  
  const handleUpdatePoints = async () => {
    if (!selectedUser || pointsChange === 0) return;
    try {
      const userRef = doc(db, 'users', selectedUser.id);
      const newPoints = (selectedUser.data.points || 0) + pointsChange;
      await updateDoc(userRef, { points: newPoints });
      
      setShowPointsModal(false);
      showToast ? showToast('تم تعديل النقاط بنجاح! 🌟') : alert('تم تعديل النقاط بنجاح!');
    } catch (e) {
      console.error(e);
      showToast ? showToast('حدث خطأ أثناء تعديل النقاط') : alert('حدث خطأ أثناء تعديل النقاط');
    }
  };

  const handleKickUser = async (uid: string) => {
    if (!confirm(`هل أنت متأكد من طرد هذا المستخدم لمدة 24 ساعة؟`)) return;
    try {
      const userRef = doc(db, 'users', uid);
      const expelledUntil = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
      await updateDoc(userRef, { expelledUntil });
      
      showToast ? showToast('تم تطبيق الطرد لمدة 24 ساعة بنجاح! 🚫') : alert('تم تطبيق الطرد لمدة 24 ساعة بنجاح!');
    } catch (e) {
      console.error(e);
      showToast ? showToast('حدث خطأ أثناء الطرد') : alert('حدث خطأ أثناء الطرد');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 leading-tight">لوحة المشرف</h1>
              <p className="text-xs font-bold text-slate-500">إدارة المستخدمين التابعين لك</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span className="hidden sm:inline">العودة للتطبيق</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Add User Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-indigo-500" />
              إضافة مستخدم جديد للقائمة
            </h2>
            {!showAddInput && (
              <button 
                onClick={() => setShowAddInput(true)}
                className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold rounded-xl flex items-center gap-2 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                إضافة مستخدم
              </button>
            )}
          </div>
          {showAddInput && (
            <form onSubmit={handleAddUser} className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-top-4">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder="أدخل كود المشارك الخاص بالمستخدم..."
                  value={newUserId}
                  onChange={(e) => setNewUserId(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 rounded-xl py-3 px-4 outline-none font-mono text-sm transition-colors"
                  dir="ltr"
                />
                {error && <p className="text-red-500 text-xs font-bold mt-2 absolute -bottom-5 right-0">{error}</p>}
              </div>
              <button 
                type="submit"
                disabled={loadingAdd || !newUserId.trim()}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50 min-w-[140px]"
              >
                {loadingAdd ? 'جاري الإضافة...' : 'إضافة للقائمة'}
              </button>
              <button 
                type="button"
                onClick={() => { setShowAddInput(false); setError(''); }}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl flex items-center justify-center transition-colors"
              >
                إلغاء
              </button>
            </form>
          )}
        </div>

        {/* Users List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-500" />
              المستخدمين المضافين ({trackedUsers.length})
            </h2>
          </div>
          
          {trackedUsers.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center text-slate-500">
              <Users className="w-16 h-16 text-slate-200 mb-4" />
              <p className="font-bold text-lg mb-1">لا يوجد مستخدمين بعد</p>
              <p className="text-sm">اطلب من الأعضاء أكواد المشاركة الخاصة بهم لإضافتهم هنا.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                  <tr>
                    <th className="py-4 px-6 font-bold w-[30%]">المستخدم</th>
                    <th className="py-4 px-6 font-bold text-center">النقاط</th>
                    <th className="py-4 px-6 font-bold text-center">العقوبات غير المنفذة</th>
                    <th className="py-4 px-6 font-bold text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {trackedUsers.map(uid => {
                    const uData = usersMap[uid];
                    if (!uData) return (
                      <tr key={uid} className="animate-pulse">
                        <td className="py-4 px-6"><div className="h-4 bg-slate-200 rounded w-1/2"></div></td>
                        <td className="py-4 px-6"><div className="h-4 bg-slate-200 rounded w-8 mx-auto"></div></td>
                        <td className="py-4 px-6"><div className="h-4 bg-slate-200 rounded w-8 mx-auto"></div></td>
                        <td className="py-4 px-6"><div className="h-8 bg-slate-200 rounded w-32 mx-auto"></div></td>
                      </tr>
                    );

                    const isExpelled = uData.expelledUntil && uData.expelledUntil > Date.now();
                    const pendingPunishments = uData.pendingPunishmentsCount || 0;

                    return (
                      <tr key={uid} className={`hover:bg-slate-50 transition-colors ${isExpelled ? 'bg-red-50/30' : ''}`}>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0 overflow-hidden">
                              <img src={uData.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${uData.email}&backgroundColor=e2e8f0`} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="font-black text-slate-800 flex items-center gap-2">
                                {uData.displayName || 'بدون اسم'}
                                {isExpelled && <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full font-bold">مطرود</span>}
                              </div>
                              <div className="text-xs text-slate-500 font-mono mt-0.5">{uid}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className="inline-flex items-center justify-center px-3 py-1 bg-indigo-50 text-indigo-700 font-black rounded-lg">
                              {calculateTotalScore(uData)}
                            </span>
                            <button 
                              onClick={() => { setSelectedUser({ id: uid, data: uData }); setPointsChange(0); setShowPointsModal(true); }}
                              className="w-7 h-7 rounded bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-600 flex items-center justify-center transition-colors font-bold text-lg"
                              title="تعديل النقاط"
                            >
                              ±
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-flex items-center justify-center px-3 py-1 font-black rounded-lg ${pendingPunishments > 0 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'}`}>
                            {pendingPunishments}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => { setSelectedUser({ id: uid, data: uData }); setShowGiftModal(true); }}
                              className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors"
                              title="إرسال هدية"
                            >
                              <Gift className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => { setSelectedUser({ id: uid, data: uData }); setShowPunishModal(true); }}
                              className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition-colors"
                              title="إضافة عقوبة"
                            >
                              <Skull className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleKickUser(uid)}
                              className="w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors"
                              title="طرد لـ 24 ساعة"
                            >
                              <ShieldBan className="w-4 h-4" />
                            </button>
                            <div className="w-px h-6 bg-slate-200 mx-1"></div>
                            <button 
                              onClick={() => handleRemoveUser(uid)}
                              className="w-9 h-9 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 flex items-center justify-center transition-colors"
                              title="إزالة من القائمة"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Gift Modal */}
      {showGiftModal && selectedUser && (
        <div className="fixed inset-0 z-[210] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-md border-4 border-emerald-100">
            <h3 className="text-xl font-black text-slate-800 mb-1 flex items-center gap-2">
              <Gift className="w-6 h-6 text-emerald-500" />
              إرسال هدية لـ {selectedUser.data.displayName}
            </h3>
            <p className="text-slate-500 text-sm mb-6 font-medium">سيتم إضافة الهدية المحددة لحساب المستخدم بمجرد استلامها.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">نوع الهدية</label>
                <select 
                  value={giftType}
                  onChange={(e) => setGiftType(e.target.value as any)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500 transition-colors font-bold"
                >
                  <option value="points">مكافأة 300 نقطة ✨</option>
                  <option value="freeze">كرت تجميد الستريك 🧊</option>
                  <option value="pardon">كرت إعفاء من عقوبة 🛡️</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">اسم المرسل</label>
                <input 
                  type="text" 
                  value={giftFrom}
                  onChange={(e) => setGiftFrom(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">الرسالة المكتوبة</label>
                <textarea
                  placeholder="اكتب رسالة الهدية هنا..."
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500 transition-colors h-24 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button 
                onClick={() => setShowGiftModal(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
              >
                إلغاء
              </button>
              <button 
                onClick={handleSendGift}
                className="px-5 py-2.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors flex items-center gap-2 shadow-lg shadow-emerald-200"
              >
                إرسال الهدية
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Punish Modal */}
      {showPunishModal && selectedUser && (
        <div className="fixed inset-0 z-[210] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-md border-4 border-amber-100">
            <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
              <Skull className="w-6 h-6 text-amber-500" />
              إضافة عقوبة لـ {selectedUser.data.displayName}
            </h3>
            
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-amber-800 font-bold mb-1">
                رصيد عقوباته الحالية: {selectedUser.data.pendingPunishmentsCount || 0}
              </p>
              <p className="text-amber-700/80 text-sm">
                سيتم إضافة عقوبة جديدة ليقوم بتنفيذها حتى يستطيع تصفح التطبيق مجدداً.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setShowPunishModal(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
              >
                إلغاء
              </button>
              <button 
                onClick={handleSendPunishment}
                className="px-5 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white transition-colors flex items-center gap-2 shadow-lg shadow-amber-200"
              >
                تنفيذ العقوبة
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Points Modal */}
      {showPointsModal && selectedUser && (
        <div className="fixed inset-0 z-[210] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-md border-4 border-indigo-100">
            <h3 className="text-xl font-black text-slate-800 mb-4">
              تعديل نقاط {selectedUser.data.displayName}
            </h3>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
              <p className="text-slate-600 font-bold mb-4 text-center">
                إجمالي النقاط الحالي: <span className="text-indigo-600 text-xl">{calculateTotalScore(selectedUser.data)}</span>
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={() => setPointsChange(prev => prev - 10)}
                  className="w-12 h-12 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl font-black text-xl flex items-center justify-center transition-colors"
                >-10</button>
                
                <div className="w-24 text-center font-black text-2xl text-slate-800" dir="ltr">
                  {pointsChange > 0 ? '+' : ''}{pointsChange}
                </div>
                
                <button 
                  onClick={() => setPointsChange(prev => prev + 10)}
                  className="w-12 h-12 bg-emerald-100 hover:bg-emerald-200 text-emerald-600 rounded-xl font-black text-xl flex items-center justify-center transition-colors"
                >+10</button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setShowPointsModal(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
              >
                إلغاء
              </button>
              <button 
                onClick={handleUpdatePoints}
                disabled={pointsChange === 0}
                className="px-5 py-2.5 rounded-xl font-bold bg-indigo-500 hover:bg-indigo-600 text-white transition-colors disabled:opacity-50"
              >
                حفظ التعديل
              </button>
            </div>
          </div>
        </div>
      )}

      <SupervisorReports usersMap={usersMap} supervisorId={supervisorId} />
    </div>
  );
}
