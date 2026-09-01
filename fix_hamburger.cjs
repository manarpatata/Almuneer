const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace ChevronDown import with Menu
content = content.replace('ChevronDown,', 'Menu,');

const dropdownRegex = /\{\/\* Navigation Dropdown \*\/\}\s*\{!showDashboard && \([\s\S]*?\}\s*<\/div>\s*\)\}/;

const newNav = `{/* Navigation Menu */}
          {!showDashboard && (
            <div className="relative shrink-0 z-[60]">
              <button 
                onClick={() => setShowNavMenu(!showNavMenu)}
                className="flex items-center justify-center p-2 md:p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors border border-slate-200 shadow-sm"
              >
                <Menu className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              
              {showNavMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNavMenu(false)}></div>
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 flex flex-col">
                    <button 
                      onClick={() => { setActiveTab('home'); setShowNavMenu(false); }}
                      className={\`w-full text-right px-4 py-3 font-bold transition-colors text-sm md:text-base \${activeTab === 'home' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-700'}\`}
                    >
                      الرئيسية
                    </button>
                    <button 
                      onClick={() => { setActiveTab('lessons'); setShowNavMenu(false); }}
                      className={\`w-full text-right px-4 py-3 font-bold transition-colors text-sm md:text-base \${activeTab === 'lessons' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-700'}\`}
                    >
                      الدروس
                    </button>
                  </div>
                </>
              )}
            </div>
          )}`;

content = content.replace(dropdownRegex, newNav);

const returnBtnRegex = /\{showDashboard && \(\s*<button onClick=\{\(\) => setShowDashboard\(false\)\} className="flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold transition-colors">\s*العودة\s*<\/button>\s*\)\}/;

content = content.replace(returnBtnRegex, '');

const supervisorBtnRegex = /<button \s*onClick=\{\(\) => \{\s*setShowDashboard\(true\);\s*setShowSettings\(false\);\s*\}\}\s*className="mt-2 w-full flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-100 transition-colors"\s*>\s*التحول إلى مشرف\s*<\/button>/;

const newSupervisorBtn = `<button 
                  onClick={() => {
                    setShowDashboard(!showDashboard);
                    setShowSettings(false);
                  }}
                  className="mt-2 w-full flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-100 transition-colors"
                >
                  {showDashboard ? 'الدخول كطالب' : 'التحول إلى مشرف'}
                </button>`;

content = content.replace(supervisorBtnRegex, newSupervisorBtn);

fs.writeFileSync('src/App.tsx', content);
console.log('Done');
