const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add Search to lucide-react imports
code = code.replace(/import \{ ([^}]+) \} from 'lucide-react';/, "import { $1, Search } from 'lucide-react';");

// Replace the magnifying glass emoji with the Search icon
const magnifyingEmojiStr = `<div className="w-10 h-10 text-indigo-600 mb-1 flex items-center justify-center font-bold text-4xl">🔍</div>`;
const searchIconStr = `<div className="w-10 h-10 text-indigo-600 mb-1 flex items-center justify-center font-bold text-4xl"><Search className="w-8 h-8 text-indigo-600" strokeWidth={2.5} /></div>`;
code = code.replace(magnifyingEmojiStr, searchIconStr);

// Update status box texts and layout
const statusBoxVarsStart = `  let statusBoxClasses = "rounded-[2rem] p-6 text-white flex flex-col justify-center items-center gap-4 relative overflow-hidden shrink-0 shadow-lg transition-all duration-300 ";`;

const oldStatusBoxLogic = `
  let statusBoxClasses = "rounded-[2rem] p-6 text-white flex flex-col justify-center items-center gap-4 relative overflow-hidden shrink-0 shadow-lg transition-all duration-300 ";
  let statusBoxContent;

  const cornerFraction = (
    <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg font-mono font-bold text-sm" dir="ltr">
      {total2Days}/{twoDayGoal}
    </div>
  );

  if (total2Days < dailyGoal) {
    statusBoxClasses += "bg-gradient-to-br from-amber-400 to-amber-500 text-amber-950 shadow-amber-200/50";
    statusBoxContent = (
      <>
        {cornerFraction}
        <h4 className="text-2xl font-bold z-10 text-center">{randomTexts.threatened}</h4>
      </>
    );
  } else if (total2Days >= dailyGoal && total2Days < twoDayGoal) {
    statusBoxClasses += "bg-gradient-to-br from-indigo-500 to-blue-600 shadow-blue-200/50";
    statusBoxContent = (
      <>
        {cornerFraction}
        <h4 className="text-xl font-bold z-10 text-center">{randomTexts.default}</h4>
      </>
    );
  } else {
    statusBoxClasses += "bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-emerald-200/50";
    statusBoxContent = (
      <>
        {cornerFraction}
        <h4 className="text-2xl font-bold z-10 text-center">{randomTexts.safe}</h4>
      </>
    );
  }
`;

const newStatusBoxLogic = `
  let statusBoxClasses = "rounded-3xl p-4 text-white flex flex-col justify-center items-center gap-2 relative overflow-hidden shadow-lg transition-all duration-300 h-full w-full ";
  let statusBoxContent;

  const cornerFraction = (
    <div className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded font-mono font-bold text-xs" dir="ltr">
      {total2Days}/{twoDayGoal}
    </div>
  );

  if (total2Days < dailyGoal) {
    statusBoxClasses += "bg-gradient-to-br from-amber-400 to-amber-500 text-amber-950 shadow-amber-200/50";
    statusBoxContent = (
      <>
        <AlertTriangle className="w-6 h-6 opacity-80" />
        <h4 className="text-sm font-bold z-10 text-center">تحت التهديد!</h4>
        {cornerFraction}
      </>
    );
  } else if (total2Days >= dailyGoal && total2Days < twoDayGoal) {
    statusBoxClasses += "bg-gradient-to-br from-indigo-500 to-blue-600 shadow-blue-200/50";
    statusBoxContent = (
      <>
        <RotateCcw className="w-6 h-6 opacity-80" />
        <h4 className="text-sm font-bold z-10 text-center text-white">نصف المسافة</h4>
        {cornerFraction}
      </>
    );
  } else {
    statusBoxClasses += "bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-emerald-200/50";
    statusBoxContent = (
      <>
        <CheckCircle className="w-6 h-6 opacity-80" />
        <h4 className="text-sm font-bold z-10 text-center">بر الأمان!</h4>
        {cornerFraction}
      </>
    );
  }
`;

code = code.replace(oldStatusBoxLogic.trim(), newStatusBoxLogic.trim());

// Render side by side
const oldRender = `
          <div className={statusBoxClasses}>
            {statusBoxContent}
          </div>
`;

const newRender = `
          <div className="flex gap-4 h-32 shrink-0">
            {/* Cards Box (Right side in RTL) */}
            <div className="flex-1 bg-gradient-to-b from-white to-slate-50 border border-slate-200 rounded-3xl p-3 shadow-sm flex flex-col relative overflow-hidden">
              <div className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5 justify-center">
                <Gift className="w-3.5 h-3.5" />
                محفظة البطاقات
              </div>
              <div className="flex-1 flex items-center justify-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center border-2 border-yellow-300 shadow-sm relative">
                    <span className="text-lg">🎫</span>
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white">
                      {state.immunityCards || 0}
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-yellow-700">إعفاء</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center border-2 border-blue-300 shadow-sm relative">
                    <span className="text-lg">🧊</span>
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white">
                      {freezesAvailable}
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-blue-700">استعادة</span>
                </div>
              </div>
            </div>

            {/* Status Box (Left side in RTL) */}
            <div className="flex-1">
              <div className={statusBoxClasses}>
                {statusBoxContent}
              </div>
            </div>
          </div>
`;

code = code.replace(oldRender.trim(), newRender.trim());

fs.writeFileSync('src/App.tsx', code);
