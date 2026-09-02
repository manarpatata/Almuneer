const fs = require('fs');
let content = fs.readFileSync('src/components/SupervisorDashboard.tsx', 'utf8');

// Add Pencil to imports
content = content.replace(
  /import \{ (.*) \} from 'lucide-react';/,
  "import { $1, Pencil } from 'lucide-react';"
);

// Add states
content = content.replace(
  /const \[isQuizAnswersOpen, setIsQuizAnswersOpen\] = useState\(false\);/,
  `const [isQuizAnswersOpen, setIsQuizAnswersOpen] = useState(false);
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [editNameValue, setEditNameValue] = useState('');`
);

// Add action button
const actionBtns = `<div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => { setSelectedUser({ id: uid, data: uData }); setShowGiftModal(true); }}`;
const actionBtnsWithEdit = `<div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => { setSelectedUser({ id: uid, data: uData }); setEditNameValue(uData.displayName || ''); setShowEditNameModal(true); }}
                              className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center transition-colors"
                              title="تعديل الاسم"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => { setSelectedUser({ id: uid, data: uData }); setShowGiftModal(true); }}`;

content = content.replace(actionBtns, actionBtnsWithEdit);

// Add handler function
const handlerCode = `
  const handleEditName = async () => {
    if (supervisorId === 'guest') {
      showToast?.('عذراً، يجب تسجيل الدخول بحساب مشرف لإجراء هذه العملية!');
      return;
    }
    if (!selectedUser || !editNameValue.trim()) return;
    
    try {
      const userRef = doc(db, 'users', selectedUser.id);
      await updateDoc(userRef, {
        displayName: editNameValue.trim()
      });
      
      displayToast('تم تعديل الاسم بنجاح! ✏️');
      setShowEditNameModal(false);
      setEditNameValue('');
    } catch (e) {
      console.error(e);
      displayToast('حدث خطأ أثناء تعديل الاسم');
    }
  };

  const handleSendGift = async () => {`;

content = content.replace(/  const handleSendGift = async \(\) => \{/, handlerCode);

// Add Modal JSX
const modalJsx = `      {/* Edit Name Modal */}
      {showEditNameModal && selectedUser && (
        <div className="fixed inset-0 z-[210] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-md border-4 border-indigo-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
              <Pencil className="w-6 h-6 text-indigo-500" />
              تعديل اسم الطالب
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">الاسم الجديد</label>
                <input 
                  type="text" 
                  value={editNameValue}
                  onChange={(e) => setEditNameValue(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-500 transition-colors font-bold"
                  placeholder="أدخل اسم الطالب..."
                  autoFocus
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 mt-6">
              <button 
                onClick={() => setShowEditNameModal(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
              >
                إلغاء
              </button>
              <button 
                onClick={handleEditName}
                className="px-5 py-2.5 rounded-xl font-bold bg-indigo-500 hover:bg-indigo-600 text-white transition-colors shadow-lg shadow-indigo-200"
              >
                حفظ الاسم
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gift Modal */}`;

content = content.replace(/      \{\/\* Gift Modal \*\/\}/, modalJsx);

fs.writeFileSync('src/components/SupervisorDashboard.tsx', content);
console.log('Edit name modal added!');
