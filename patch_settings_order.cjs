const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const dangerZone = `              <div className="border-t border-slate-100 pt-8 flex flex-col gap-3">
                <h3 className="font-bold text-rose-600 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  منطقة الخطر
                </h3>
                <p className="text-xs text-slate-500">هذا الإجراء سيقوم بتصفير جميع إنجازاتك والبدء من جديد تماماً.</p>
                <button 
                  onClick={handleReset}
                  className="mt-2 w-full flex items-center justify-center gap-2 bg-rose-50 text-rose-600 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-rose-100 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  تصفير الإنجازات
                </button>
                <button 
                  onClick={() => setConfirmGenerate(true)}
                  className="mt-2 w-full flex items-center justify-center gap-2 bg-rose-50 text-rose-600 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-rose-100 transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" />
                  توليد بيانات اختبار عشوائية (أسبوع)
                </button>
              </div>`;

const supervisorZone = `              <div className="border-t border-slate-100 pt-8 flex flex-col gap-3">
                <h3 className="font-bold text-indigo-600 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  خيارات المشرف
                </h3>
                <button 
                  onClick={() => {
                    setShowDashboard(true);
                    setShowSettings(false);
                  }}
                  className="mt-2 w-full flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-100 transition-colors"
                >
                  التحول إلى مشرف
                </button>
              </div>`;

const oldOrder = dangerZone + "\n" + supervisorZone;
const newOrder = supervisorZone + "\n" + dangerZone;

if (code.includes(oldOrder)) {
  code = code.replace(oldOrder, newOrder);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Swapped order");
} else {
  console.log("Could not find the exact blocks to swap");
}
