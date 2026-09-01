const fs = require('fs');
let content = fs.readFileSync('src/components/SupervisorDashboard.tsx', 'utf8');

// Remove the standalone Add User Section completely
const addUserSectionRegex = /\{\/\* Add User Section \*\/\}\s*<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">[\s\S]*?<\/div>\s*\{\/\* Users List \*\/\}/;
content = content.replace(addUserSectionRegex, '{/* Users List */}');

// Now, rewrite the Users List header to include the + button and the inline add form
const usersListHeaderRegex = /<div className="p-6 border-b border-slate-100 bg-slate-50">\s*<h2 className="text-lg font-black text-slate-800 flex items-center gap-2">\s*<Users className="w-5 h-5 text-slate-500" \/>\s*المستخدمين المضافين \(\{trackedUsers\.length\}\)\s*<\/h2>\s*<\/div>/;

const newHeader = `<div className="p-6 border-b border-slate-100 bg-slate-50">
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
          </div>`;

content = content.replace(usersListHeaderRegex, newHeader);

// We need to remove the supervisor dashboard's header (the sticky top header with "لوحة المشرف")
// because we are in the main app now.
const dashboardHeaderRegex = /\{\/\* Header \*\/\}\s*<header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">[\s\S]*?<\/header>/;
content = content.replace(dashboardHeaderRegex, '');

// Also change the min-h-screen bg-slate-50 wrapper to just be a standard div since it's injected in main app
const wrapperStartRegex = /<div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800" dir="rtl">/;
content = content.replace(wrapperStartRegex, '<div className="flex flex-col font-sans text-slate-800 w-full" dir="rtl">');

fs.writeFileSync('src/components/SupervisorDashboard.tsx', content);
console.log('SupervisorDashboard updated');
