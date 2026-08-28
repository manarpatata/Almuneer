const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldKickedLogic = `  if (state.kicked) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-white" dir="rtl">
        <div className="w-24 h-24 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-6 border-4 border-red-500">
          <AlertTriangle className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-black mb-4">لقد تم طردك من المجموعة</h1>
        <p className="text-slate-400 font-medium max-w-md">نأسف لإبلاغك بأنه قد تم إنهاء صلاحية وصولك بناءً على قرار المشرف.</p>
        <button onClick={() => { auth.signOut(); localStorage.removeItem('alMuneerState_v4'); window.location.reload(); }} className="mt-8 px-6 py-3 bg-slate-800 rounded-xl font-bold hover:bg-slate-700 transition-colors">
          تسجيل الخروج والبدء من جديد
        </button>
      </div>
    );
  }`;

const newBgLogic = `  const isExpelled = state.expelledUntil && state.expelledUntil > Date.now();
  
  const mainBgClasses = isExpelled 
    ? "bg-gradient-to-br from-red-50 to-red-100/80 text-red-950" 
    : "bg-gradient-to-br from-slate-50 to-slate-100/80 text-slate-800";`;

code = code.replace(oldKickedLogic, newBgLogic);

// Then update the main container classes
const oldContainer = `<div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100/80 font-sans text-slate-800" dir="rtl">`;
const newContainer = `<div className={\`flex flex-col min-h-screen w-full font-sans \${mainBgClasses}\`} dir="rtl">
      {isExpelled && (
        <div className="bg-red-600 text-white text-center py-2 px-4 font-bold text-sm shadow-md flex items-center justify-center gap-2 sticky top-0 z-[60]">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>أنت مطرود بقرار من المشرف لمدة 24 ساعة، لكن يمكنك متابعة مهامك لتجنب خسارة الستريك!</span>
        </div>
      )}`;

code = code.replace(oldContainer, newContainer);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx for expelled logic");
