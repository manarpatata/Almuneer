const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The block to replace:
//           {/* Desktop Tabs */}
//           {!showDashboard && <div className="hidden md:flex gap-2 p-1.5 bg-slate-200/50 rounded-xl mx-auto w-full max-w-sm">
//             <button onClick={() => setActiveTab('home')} className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${activeTab === 'home' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:bg-slate-200'}`}>الرئيسية</button>
//             <button onClick={() => setActiveTab('lessons')} className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${activeTab === 'lessons' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:bg-slate-200'}`}>الدروس</button>
//           </div>}

const desktopTabsRegex = /\{\/\* Desktop Tabs \*\/\}\n\s*\{!showDashboard && <div className="hidden md:flex gap-2 p-1\.5 bg-slate-200\/50 rounded-xl mx-auto w-full max-w-sm">[\s\S]*?<\/div>\}/;

content = content.replace(desktopTabsRegex, `{/* Navigation Dropdown */}
          {!showDashboard && (
            <div className="relative mx-auto w-[130px] md:w-[180px] shrink-0 z-[60]">
              <button 
                onClick={() => setShowNavMenu(!showNavMenu)}
                className="flex items-center justify-between w-full px-3 md:px-4 py-1.5 md:py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition-colors border border-slate-200 shadow-sm"
              >
                <span className="text-sm md:text-base">{activeTab === 'home' ? 'الرئيسية' : 'الدروس'}</span>
                <ChevronDown className={\`w-4 h-4 md:w-5 md:h-5 transition-transform \${showNavMenu ? 'rotate-180' : ''}\`} />
              </button>
              
              {showNavMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNavMenu(false)}></div>
                  <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 flex flex-col">
                    <button 
                      onClick={() => { setActiveTab('home'); setShowNavMenu(false); }}
                      className={\`w-full text-right px-4 py-2.5 font-bold transition-colors text-sm md:text-base \${activeTab === 'home' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-700'}\`}
                    >
                      الرئيسية
                    </button>
                    <button 
                      onClick={() => { setActiveTab('lessons'); setShowNavMenu(false); }}
                      className={\`w-full text-right px-4 py-2.5 font-bold transition-colors text-sm md:text-base \${activeTab === 'lessons' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-700'}\`}
                    >
                      الدروس
                    </button>
                  </div>
                </>
              )}
            </div>
          )}`);

const mobileTabsRegex = /\{\/\* Mobile Tabs \*\/\}\n\s*\{!showDashboard && <div className="md:hidden flex gap-2 p-1\.5 bg-slate-200\/50 rounded-xl mt-3 w-full">[\s\S]*?<\/div>\}/;

content = content.replace(mobileTabsRegex, '');

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx navigation updated 2');
