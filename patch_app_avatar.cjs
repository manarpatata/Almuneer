const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. handleClaimSupervisorGift
const oldClaim = `  const handleClaimSupervisorGift = (giftId: string) => {
    setState(prev => {
      const newGifts = (prev.supervisorGifts || []).map(g => 
        g.id === giftId ? { ...g, claimed: true } : g
      );
      return {
        ...prev,
        supervisorGifts: newGifts,
        points: (prev.points || 0) + 300 // default reward for supervisor gift
      };
    });
    setToastMessage("تم استلام هدية المشرف! ✨");
    setTimeout(() => setToastMessage(""), 3000);
  };`;

const newClaim = `  const handleClaimSupervisorGift = (giftId: string) => {
    setState(prev => {
      const gift = prev.supervisorGifts?.find(g => g.id === giftId);
      const newGifts = (prev.supervisorGifts || []).map(g => 
        g.id === giftId ? { ...g, claimed: true } : g
      );
      const giftType = gift?.giftType || 'points';
      
      let msg = "تم استلام هدية المشرف! ✨";
      if (giftType === 'freeze') msg = "تم إضافة كرت تجميد ستريك! 🧊";
      if (giftType === 'pardon') msg = "تم إضافة كرت إعفاء من العقوبة! 🛡️";
      
      setToastMessage(msg);
      setTimeout(() => setToastMessage(""), 3000);
      
      return {
        ...prev,
        supervisorGifts: newGifts,
        points: giftType === 'points' ? (prev.points || 0) + 300 : prev.points,
        extraStreakFreezes: giftType === 'freeze' ? (prev.extraStreakFreezes || 0) + 1 : prev.extraStreakFreezes,
        immunityCards: giftType === 'pardon' ? (prev.immunityCards || 0) + 1 : prev.immunityCards
      };
    });
  };`;

if(!code.includes("const giftType = gift?.giftType")) {
  code = code.replace(oldClaim, newClaim);
}

// 2. Avatar state
if(!code.includes("const [showAvatarModal, setShowAvatarModal] = useState(false);")) {
  code = code.replace(
    "const [showDashboard, setShowDashboard] = useState(false);",
    "const [showDashboard, setShowDashboard] = useState(false);\n  const [showAvatarModal, setShowAvatarModal] = useState(false);"
  );
}

// 3. ProfileMenu props
code = code.replace(
  "<ProfileMenu user={user} onLogin={() => setShowAuthModal(true)} onOpenDashboard={() => setShowDashboard(true)} />",
  "<ProfileMenu user={user} avatarUrl={state.avatarUrl} onLogin={() => setShowAuthModal(true)} onOpenDashboard={() => setShowDashboard(true)} onChangeAvatar={() => setShowAvatarModal(true)} />"
);

// 4. Avatar Modal JSX
const avatarModalJSX = `
      {/* Avatar Modal */}
      {showAvatarModal && user && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border-4 border-indigo-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-800">اختر صورة شخصية</h3>
              <button onClick={() => setShowAvatarModal(false)} className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {Array.from({length: 12}).map((_, i) => {
                const styles = ['avataaars', 'bottts', 'fun-emoji', 'lorelei'];
                const style = styles[i % styles.length];
                const seed = \`\${user.email}\${i}\`;
                const url = \`https://api.dicebear.com/7.x/\${style}/svg?seed=\${seed}&backgroundColor=e2e8f0,c7d2fe,fef08a,fbcfe8\`;
                const isSelected = state.avatarUrl === url || (!state.avatarUrl && i===0);
                
                return (
                  <button 
                    key={i} 
                    onClick={() => setState(prev => ({...prev, avatarUrl: url}))}
                    className={\`aspect-square rounded-2xl overflow-hidden border-4 transition-all hover:scale-105 \${isSelected ? 'border-indigo-500 shadow-lg scale-105' : 'border-transparent bg-slate-50'}\`}
                  >
                    <img src={url} alt="avatar" className="w-full h-full object-cover" />
                  </button>
                )
              })}
            </div>
            <button onClick={() => setShowAvatarModal(false)} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-lg">
              حفظ الصورة
            </button>
          </div>
        </div>
      )}
`;

if(!code.includes("Avatar Modal")) {
  code = code.replace("      <ProfileOverlay />", avatarModalJSX + "\n      <ProfileOverlay />");
}

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx for gifts and avatars");
