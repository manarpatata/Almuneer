const fs = require('fs');
let code = fs.readFileSync('src/components/SupervisorDashboard.tsx', 'utf8');

// 1. hide input behind a plus button
const oldAddUser = `<h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-indigo-500" />
            إضافة مستخدم جديد للقائمة
          </h2>
          <form onSubmit={handleAddUser} className="flex flex-col sm:flex-row gap-4">
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
          </form>`;

const newAddUser = `<div className="flex items-center justify-between mb-4">
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
          )}`;

code = code.replace(oldAddUser, newAddUser);

// add showAddInput to state
const stateAdd = `const [error, setError] = useState('');`;
const newStateAdd = `const [error, setError] = useState('');\n  const [showAddInput, setShowAddInput] = useState(false);\n  const [showPointsModal, setShowPointsModal] = useState(false);\n  const [pointsChange, setPointsChange] = useState(0);`;

code = code.replace(stateAdd, newStateAdd);

// Add edit points button and fix total score display
const oldPoints = `<td className="py-4 px-6 text-center">
                          <span className="inline-flex items-center justify-center px-3 py-1 bg-indigo-50 text-indigo-700 font-black rounded-lg">
                            {uData.points || 0}
                          </span>
                        </td>`;

const newPoints = `<td className="py-4 px-6 text-center">
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
                        </td>`;
code = code.replace(oldPoints, newPoints);

// add point modify logic
const pointModifyLogic = `
  const handleUpdatePoints = async () => {
    if (!selectedUser || pointsChange === 0) return;
    try {
      const userRef = doc(db, 'users', selectedUser.id);
      const newPoints = (selectedUser.data.points || 0) + pointsChange;
      await updateDoc(userRef, { points: newPoints });
      
      setShowPointsModal(false);
      alert('تم تعديل النقاط بنجاح!');
    } catch (e) {
      console.error(e);
      alert('حدث خطأ أثناء تعديل النقاط');
    }
  };
`;
code = code.replace("const handleKickUser", pointModifyLogic + "\n  const handleKickUser");

// add points modal
const pointsModalJSX = `
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
                  onClick={() => setPointsChange(prev => prev - 100)}
                  className="w-12 h-12 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl font-black text-xl flex items-center justify-center transition-colors"
                >-100</button>
                
                <div className="w-24 text-center font-black text-2xl text-slate-800" dir="ltr">
                  {pointsChange > 0 ? '+' : ''}{pointsChange}
                </div>
                
                <button 
                  onClick={() => setPointsChange(prev => prev + 100)}
                  className="w-12 h-12 bg-emerald-100 hover:bg-emerald-200 text-emerald-600 rounded-xl font-black text-xl flex items-center justify-center transition-colors"
                >+100</button>
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
`;

code = code.replace("    </div>\n  );\n}\n", pointsModalJSX + "\n    </div>\n  );\n}\n");

fs.writeFileSync('src/components/SupervisorDashboard.tsx', code);
console.log("Patched dashboard full");
