const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const avatarModalCode = `
      {showAvatarModal && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-md border border-slate-200" dir="rtl">
            <h3 className="text-xl font-black text-slate-800 mb-4 text-center">اختر صورتك الشخصية</h3>
            <div className="grid grid-cols-4 gap-3 mb-6">
              {Array.from({ length: 12 }).map((_, i) => {
                const seed = \`user-\${i + 1}\`;
                const url = \`https://api.dicebear.com/7.x/avataaars/svg?seed=\${seed}&backgroundColor=e2e8f0\`;
                return (
                  <button 
                    key={i} 
                    onClick={() => {
                      if (user) {
                        setDoc(doc(db, 'users', user.uid), { avatarUrl: url }, { merge: true });
                      }
                      setShowAvatarModal(false);
                    }}
                    className="aspect-square rounded-2xl bg-slate-100 overflow-hidden hover:ring-4 hover:ring-indigo-300 transition-all border border-slate-200"
                  >
                    <img src={url} alt="Avatar option" className="w-full h-full object-cover" />
                  </button>
                )
              })}
            </div>
            <button 
              onClick={() => setShowAvatarModal(false)}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
`;

content = content.replace(
  /\{showAuthModal && <Auth onClose=\{\(\) => setShowAuthModal\(false\)\} \/>\}/,
  `{showAuthModal && <Auth onClose={() => setShowAuthModal(false)} />}${avatarModalCode}`
);

fs.writeFileSync('src/App.tsx', content);
console.log('Added avatar modal');
