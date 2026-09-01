import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, onSnapshot, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import { AppState, SupervisorGift } from '../types';
import { Users, Search, Gift, Skull, ShieldBan, X, AlertTriangle, ShieldCheck, ArrowRight, UserPlus, Trash2, FileText, CheckCircle2, Circle, Plus } from 'lucide-react';
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
  const [toastMessage, setToastMessage] = useState("");

  // Quiz state
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([{ question: '', options: ['', ''], correctIndex: 0 }]);

  const displayToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };
  
  // Custom Confirm Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void } | null>(null);

  
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
    if (supervisorId === 'guest') {
      showToast?.('عذراً، يجب تسجيل الدخول بحساب مشرف لإجراء هذه العملية!');
      return;
    }
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

  const confirmAction = (title: string, message: string, onConfirm: () => void) => {
    setConfirmDialog({ isOpen: true, title, message, onConfirm });
  };

  const handleRemoveUser = (uid: string) => {
    if (supervisorId === 'guest') {
      showToast?.('عذراً، يجب تسجيل الدخول بحساب مشرف لإجراء هذه العملية!');
      return;
    }
    confirmAction(
      'تأكيد الإزالة',
      'هل أنت متأكد من إزالة هذا المستخدم من قائمتك؟',
      () => executeRemoveUser(uid)
    );
  };

  const executeRemoveUser = async (uid: string) => {
    try {
      await updateDoc(doc(db, 'users', supervisorId), {
        trackedUsers: arrayRemove(uid)
      });
      setUsersMap(prev => {
        const next = { ...prev };
        delete next[uid];
        return next;
      });
      displayToast('تم إزالة المستخدم من القائمة بنجاح!');
    } catch (e) {
      console.error(e);
      displayToast('حدث خطأ أثناء الإزالة');
    }
  };

  const handleSendGift = async () => {
    if (!selectedUser) return;
    if (supervisorId === 'guest') {
      showToast?.('عذراً، يجب تسجيل الدخول بحساب مشرف لإجراء هذه العملية!');
      return;
    }
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
      displayToast('تم إرسال الهدية بنجاح! ✨');
    } catch (e) {
      console.error(e);
      displayToast('حدث خطأ أثناء الإرسال');
    }
  };

  const [punishSender, setPunishSender] = useState('المشرف');

  const handleSendPunishment = async () => {
    if (!selectedUser) return;
    if (supervisorId === 'guest') {
      showToast?.('عذراً، يجب تسجيل الدخول بحساب مشرف لإجراء هذه العملية!');
      return;
    }
    try {
      const userRef = doc(db, 'users', selectedUser.id);
      await updateDoc(userRef, {
        supervisorPunishments: arrayUnion({
          id: Date.now().toString(),
          reason: punishReason || 'عقاب من المشرف',
          sender: punishSender || 'المشرف',
          timestamp: Date.now()
        })
      });
      
      setShowPunishModal(false);
      setPunishReason('');
      setPunishSender('المشرف');
      displayToast('تم إرسال العقوبة بنجاح! 💀');
    } catch (e) {
      console.error(e);
      displayToast('حدث خطأ أثناء الإرسال');
    }
  };

  
  const handleUpdatePoints = async () => {
    if (!selectedUser || pointsChange === 0) return;
    try {
      const userRef = doc(db, 'users', selectedUser.id);
      const newPoints = (selectedUser.data.points || 0) + pointsChange;
      await updateDoc(userRef, { points: newPoints });
      
      setShowPointsModal(false);
      displayToast('تم تعديل النقاط بنجاح! 🌟');
    } catch (e) {
      console.error(e);
      displayToast('حدث خطأ أثناء تعديل النقاط');
    }
  };

  const handleKickUser = (uid: string) => {
    if (supervisorId === 'guest') {
      showToast?.('عذراً، يجب تسجيل الدخول بحساب مشرف لإجراء هذه العملية!');
      return;
    }
    confirmAction(
      'تأكيد الطرد',
      'هل أنت متأكد من طرد هذا المستخدم لمدة 24 ساعة؟',
      () => executeKickUser(uid)
    );
  };

  const executeKickUser = async (uid: string) => {
    try {
      const userRef = doc(db, 'users', uid);
      const expelledUntil = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
      await updateDoc(userRef, { expelledUntil });
      
      displayToast('تم تطبيق الطرد لمدة 24 ساعة بنجاح! 🚫');
    } catch (e) {
      console.error(e);
      displayToast('حدث خطأ أثناء الطرد');
    }
  };

  const handleAddQuestion = () => {
    setQuizQuestions([...quizQuestions, { question: '', options: ['', ''], correctIndex: 0 }]);
  };

  const handleAddOption = (qIndex: number) => {
    const newQs = [...quizQuestions];
    newQs[qIndex].options.push('');
    setQuizQuestions(newQs);
  };

  const handleUpdateQuestion = (qIndex: number, val: string) => {
    const newQs = [...quizQuestions];
    newQs[qIndex].question = val;
    setQuizQuestions(newQs);
  };

  const handleUpdateOption = (qIndex: number, oIndex: number, val: string) => {
    const newQs = [...quizQuestions];
    newQs[qIndex].options[oIndex] = val;
    setQuizQuestions(newQs);
  };

  const handleSetCorrect = (qIndex: number, oIndex: number) => {
    const newQs = [...quizQuestions];
    newQs[qIndex].correctIndex = oIndex;
    setQuizQuestions(newQs);
  };

  const handleSendQuiz = async () => {
    if (!quizTitle.trim()) return displayToast('الرجاء كتابة عنوان الاختبار');
    if (quizQuestions.some(q => !q.question.trim() || q.options.some(o => !o.trim()))) {
      return displayToast('الرجاء تعبئة جميع الأسئلة والخيارات');
    }

    try {
      const quiz = {
        id: Date.now().toString(),
        title: quizTitle,
        questions: quizQuestions,
        sender: 'المشرف',
        timestamp: Date.now()
      };

      await Promise.all(trackedUsers.map(uid => 
        updateDoc(doc(db, 'users', uid), { pendingQuizzes: arrayUnion(quiz) })
      ));
      
      setShowQuizModal(false);
      setQuizTitle('');
      setQuizQuestions([{ question: '', options: ['', ''], correctIndex: 0 }]);
      displayToast('تم إرسال الاختبار لجميع الطلاب بنجاح! 📝');
    } catch (e) {
      console.error(e);
      displayToast('حدث خطأ أثناء إرسال الاختبار');
    }
  };

  return (
    <div className="flex flex-col font-sans text-slate-800 w-full" dir="rtl">
      

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Users List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-500" />
                المستخدمين المضافين ({trackedUsers.length})
              </h2>
              {!showAddInput && (
                <button 
                  onClick={() => setShowAddInput(true)}
                  className="w-10 h-10 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold rounded-xl flex items-center justify-center transition-colors"
                  title="إضافة مستخدم"
                >
                  <Plus className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {showAddInput && (
              <form onSubmit={handleAddUser} className="mt-4 flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    placeholder="أدخل كود المشارك الخاص بالمستخدم..."
                    value={newUserId}
                    onChange={(e) => setNewUserId(e.target.value)}
                    className="w-full bg-white border-2 border-slate-200 focus:border-indigo-500 rounded-xl py-2 px-4 outline-none font-mono text-sm transition-colors"
                    dir="ltr"
                  />
                  {error && <p className="text-red-500 text-xs font-bold mt-1 absolute -bottom-5 right-0">{error}</p>}
                </div>
                <button 
                  type="submit"
                  disabled={loadingAdd || !newUserId.trim()}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50 min-w-[120px]"
                >
                  {loadingAdd ? 'جاري الإضافة...' : 'إضافة'}
                </button>
                <button 
                  type="button"
                  onClick={() => { setShowAddInput(false); setError(''); }}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl flex items-center justify-center transition-colors"
                >
                  إلغاء
                </button>
              </form>
            )}
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
                    <th className="py-4 px-6 font-bold text-center">الإنجاز الأسبوعي</th>
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
                          <span className="inline-flex items-center justify-center px-3 py-1 bg-blue-50 text-blue-700 font-black rounded-lg">
                            {getWeeklyLessons(uData.history || {}, getTodayDateString())}
                          </span>
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

        
        

        {/* Create Quiz Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-8">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <FileText className="w-6 h-6 text-indigo-500" />
               <div>
                 <h2 className="text-lg font-black text-slate-800">إنشاء اختبار جديد</h2>
                 <p className="text-sm font-bold text-slate-500">إنشاء اختبار وإرساله لجميع الطلاب</p>
               </div>
             </div>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">عنوان الاختبار</label>
                <input 
                  type="text" 
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="مثال: اختبار في الحزب الأول..."
                />
              </div>

              <div className="space-y-8">
                {quizQuestions.map((q, qIndex) => (
                  <div key={qIndex} className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-black text-slate-800">السؤال {qIndex + 1}</label>
                      {quizQuestions.length > 1 && (
                        <button 
                          onClick={() => setQuizQuestions(quizQuestions.filter((_, i) => i !== qIndex))}
                          className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <textarea
                      value={q.question}
                      onChange={(e) => handleUpdateQuestion(qIndex, e.target.value)}
                      className="w-full bg-white border-2 border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-500 transition-colors mb-4 h-24 resize-none"
                      placeholder="اكتب السؤال هنا..."
                    />
                    
                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-slate-500">الخيارات (اختر الإجابة الصحيحة)</label>
                      {q.options.map((opt, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-3">
                          <button 
                            onClick={() => handleSetCorrect(qIndex, oIndex)}
                            className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${q.correctIndex === oIndex ? 'bg-emerald-500 text-white shadow-md' : 'bg-white border-2 border-slate-300 text-slate-300 hover:border-emerald-500 hover:text-emerald-500'}`}
                          >
                            {q.correctIndex === oIndex ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                          </button>
                          <input 
                            type="text" 
                            value={opt}
                            onChange={(e) => handleUpdateOption(qIndex, oIndex, e.target.value)}
                            className={`flex-1 bg-white border-2 rounded-xl py-2 px-4 focus:outline-none transition-colors ${q.correctIndex === oIndex ? 'border-emerald-400' : 'border-slate-200 focus:border-indigo-500'}`}
                            placeholder={`الخيار ${oIndex + 1}`}
                          />
                          {q.options.length > 2 && (
                            <button 
                              onClick={() => {
                                const newQs = [...quizQuestions];
                                newQs[qIndex].options = newQs[qIndex].options.filter((_, i) => i !== oIndex);
                                if (newQs[qIndex].correctIndex === oIndex) newQs[qIndex].correctIndex = 0;
                                else if (newQs[qIndex].correctIndex > oIndex) newQs[qIndex].correctIndex--;
                                setQuizQuestions(newQs);
                              }}
                              className="text-slate-400 hover:text-red-500 p-2"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button 
                        onClick={() => handleAddOption(qIndex)}
                        className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:underline mt-2 px-2"
                      >
                        <Plus className="w-4 h-4" />
                        إضافة خيار
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={handleAddQuestion}
                className="w-full py-4 border-2 border-dashed border-slate-300 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                إضافة سؤال جديد
              </button>
            </div>

            <div className="flex gap-3 pt-6 mt-6 border-t border-slate-100">
              <button 
                onClick={handleSendQuiz}
                className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                إرسال الاختبار للكل
              </button>
            </div>
          </div>
        </div>

        {/* Completed Quizzes Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-8">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-black text-slate-800">إجابات الطلاب على الاختبارات</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(() => {
              const allCompleted = trackedUsers.flatMap(uid => {
                const uData = usersMap[uid];
                if (!uData || !uData.completedQuizzes) return [];
                return uData.completedQuizzes.map(cq => ({ ...cq, studentName: uData.displayName || 'بدون اسم' }));
              }).sort((a, b) => b.timestamp - a.timestamp);

              if (allCompleted.length === 0) {
                return <div className="col-span-full text-center text-slate-500 py-8 font-bold">لا توجد إجابات بعد.</div>;
              }

              return allCompleted.map((quiz, i) => {
                const gradeColor = 
                  quiz.grade === 'A' ? 'text-emerald-600' :
                  quiz.grade === 'B' ? 'text-blue-600' :
                  quiz.grade === 'C' ? 'text-yellow-600' :
                  quiz.grade === 'D' ? 'text-orange-600' : 'text-red-600';

                return (
                  <div key={i} className="bg-[#fcfaf5] border-2 border-slate-200 rounded-xl p-6 shadow-sm relative overflow-hidden flex flex-col gap-4">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-full flex items-center justify-center">
                      <span className={`font-black text-3xl rotate-12 ${gradeColor} drop-shadow-sm`}>{quiz.grade}</span>
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-lg mb-1 pr-12">{quiz.title}</h4>
                      <p className="text-sm font-bold text-slate-500">الطالب: <span className="text-indigo-600">{quiz.studentName}</span></p>
                    </div>
                    <div className="space-y-4 mt-2">
                      {quiz.questions.map((q, idx) => {
                        const studentAnswer = quiz.answers[idx];
                        const isCorrect = studentAnswer === q.correctIndex;
                        return (
                          <div key={idx} className="text-sm border-t border-dashed border-slate-200 pt-3">
                            <p className="font-bold text-slate-700 mb-2">{idx + 1}. {q.question}</p>
                            <p className="text-slate-600 flex items-center gap-2">
                              {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-red-500" />}
                              <span className={isCorrect ? 'font-bold text-emerald-700' : 'text-red-600 line-through'}>{q.options[studentAnswer]}</span>
                            </p>
                            {!isCorrect && (
                              <p className="text-emerald-600 font-bold mt-1 text-xs bg-emerald-50 p-1.5 rounded inline-block">
                                الصحيح: {q.options[q.correctIndex]}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
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

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">اسم المشرف (المرسل)</label>
                <input 
                  type="text" 
                  value={punishSender}
                  onChange={(e) => setPunishSender(e.target.value)}
                  className="w-full bg-amber-50 border-2 border-amber-200 rounded-xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="اكتب اسمك هنا..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">سبب العقوبة</label>
                <textarea
                  value={punishReason}
                  onChange={(e) => setPunishReason(e.target.value)}
                  className="w-full bg-amber-50 border-2 border-amber-200 rounded-xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-colors h-24 resize-none"
                  placeholder="مثال: عدم كتابة الفوائد..."
                />
              </div>
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

      {/* Confirm Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[220] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col gap-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-slate-800">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              <h3 className="font-bold text-lg">{confirmDialog.title}</h3>
            </div>
            <p className="text-sm font-bold text-slate-600">{confirmDialog.message}</p>
            <div className="flex gap-3 w-full mt-2">
              <button onClick={() => { confirmDialog.onConfirm(); setConfirmDialog(null); }} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-bold transition-colors">نعم، متأكد</button>
              <button onClick={() => setConfirmDialog(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-bold transition-colors">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-4 rounded-2xl shadow-2xl z-[300] flex items-center gap-3 animate-in slide-in-from-top-10">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="font-bold text-sm whitespace-nowrap">{toastMessage}</span>
        </div>
      )}

      <SupervisorReports usersMap={usersMap} supervisorId={supervisorId} />
{/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-xl font-bold z-[300] animate-in slide-in-from-bottom-5">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
