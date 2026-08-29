const fs = require('fs');
let code = fs.readFileSync('src/components/SupervisorDashboard.tsx', 'utf8');

// Add punishReason state
code = code.replace(
  "const [showPunishModal, setShowPunishModal] = useState(false);",
  "const [showPunishModal, setShowPunishModal] = useState(false);\n  const [punishReason, setPunishReason] = useState('');\n  const [showLeaderboard, setShowLeaderboard] = useState(false);\n"
);

// Modify handleSendPunishment
const oldPunish = `  const handleSendPunishment = async () => {
    if (!selectedUser) return;
    try {
      const userRef = doc(db, 'users', selectedUser.id);
      const newCount = (selectedUser.data.pendingPunishmentsCount || 0) + 1;
      await updateDoc(userRef, {
        pendingPunishment: true,
        pendingPunishmentsCount: newCount
      });
      
      setShowPunishModal(false);
      showToast ? showToast('تم إرسال العقوبة بنجاح! 💀') : alert('تم إرسال العقوبة بنجاح!');
    } catch (e) {
      console.error(e);
      showToast ? showToast('حدث خطأ أثناء الإرسال') : alert('حدث خطأ أثناء الإرسال');
    }
  };`;

const newPunish = `  const handleSendPunishment = async () => {
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
  };`;
code = code.replace(oldPunish, newPunish);

// Add punishReason input to modal
const oldPunishModalInput = `<h3 className="text-xl font-black text-slate-800 mb-2 flex items-center gap-2">
              <ShieldBan className="w-6 h-6 text-amber-500" />
              توجيه عقاب
            </h3>
            <p className="text-slate-500 mb-6 font-bold text-sm">
              هل أنت متأكد من توجيه عقاب جديد لـ {selectedUser.data.displayName}؟ سيظهر صندوق العقاب في صفحته.
            </p>`;
const newPunishModalInput = `<h3 className="text-xl font-black text-slate-800 mb-2 flex items-center gap-2">
              <ShieldBan className="w-6 h-6 text-amber-500" />
              توجيه عقاب
            </h3>
            <p className="text-slate-500 mb-4 font-bold text-sm">
              هل أنت متأكد من توجيه عقاب جديد لـ {selectedUser.data.displayName}؟ سيظهر صندوق العقاب في صفحته.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">سبب العقاب (سيظهر على بوليصة الشحن)</label>
              <textarea 
                value={punishReason}
                onChange={e => setPunishReason(e.target.value)}
                placeholder="مثال: لم تقم بحل الواجب..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                rows={3}
              />
            </div>`;
code = code.replace(oldPunishModalInput, newPunishModalInput);

fs.writeFileSync('src/components/SupervisorDashboard.tsx', code);
console.log("Updated Supervisor Dashboard with reason and punishments array");
