const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const searchStr = `
          {Array.from({ length: state.pendingPunishmentsCount || (state.pendingPunishment ? 1 : 0) }).map((_, idx) => {
`;

const followUpGiftStr = `
          {Array.from({ length: totalFollowUpGiftsToday }).map((_, idx) => {
            const outcome = state.claimedFollowUpGiftsByDate?.[todayStr]?.[idx] || 'points';
            return !openedFollowUpBoxes[idx] ? (
              <div key={\`fu-gift-\${idx}\`} onClick={() => handleClaimFollowUpGift(idx)} className="relative w-full h-48 bg-indigo-500 rounded-xl overflow-hidden shadow-2xl cursor-pointer hover:scale-[1.03] active:scale-95 transition-all border-4 border-indigo-600 shrink-0">
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-12 bg-fuchsia-400 shadow-sm"></div>
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-12 bg-fuchsia-400 shadow-sm"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-fuchsia-500 rotate-45 rounded-xl shadow-lg border-[3px] border-fuchsia-400"></div>
                
                <div className="absolute bottom-4 right-4 bg-indigo-50 px-3 py-2 rounded-lg shadow-xl border-2 border-indigo-300 rotate-[-8deg] z-10 w-[140px] pointer-events-none">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-indigo-50 rounded-full border-2 border-indigo-300 flex items-center justify-center">
                    <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
                  </div>
                  <p className="text-sm font-black text-indigo-900 mb-1.5 leading-tight text-center mt-1">هدية لاستمراريتك الرهيبة 🚀</p>
                  <p className="text-[10px] text-indigo-700 font-bold border-t border-indigo-200 pt-1.5 text-center">من: لجنة المتابعة</p>
                </div>
              </div>
            ) : (
              <div key={\`opened-fu-gift-\${idx}\`} className="bg-indigo-50 border-[6px] border-indigo-400 rounded-xl p-5 shadow-2xl relative flex flex-col items-center justify-center text-center transform -rotate-2 hover:rotate-0 transition-transform cursor-default h-48 overflow-hidden shrink-0">
                <div className="absolute inset-1 border-2 border-dashed border-indigo-300 rounded-lg pointer-events-none"></div>
                <div className="w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center mb-3 shadow-inner z-10">
                  <span className="text-2xl">{outcome === 'points' ? '🌟' : '🧊'}</span>
                </div>
                <h3 className="font-black text-indigo-800 text-2xl uppercase tracking-widest mb-1 z-10">
                  {outcome === 'points' ? '300 نقطة!' : 'استعادة ستريك'}
                </h3>
                <p className="text-indigo-600 font-bold text-sm z-10 leading-relaxed max-w-[85%]">
                  {outcome === 'points' ? 'ربحت 300 نقطة إضافية!' : 'كرت استعادة أيام الانقطاع'}
                </p>
                
                <div className="absolute -bottom-2 right-1 w-32 h-32 rounded-full border-[6px] border-double border-indigo-600 flex flex-col items-center justify-center rotate-[-25deg] opacity-80 z-20">
                  <div className="w-10 h-10 text-indigo-600 mb-1 flex items-center justify-center font-bold text-4xl">🔍</div>
                  <span className="text-[12px] font-black text-indigo-600 leading-tight text-center">لجنة<br/>المتابعة</span>
                </div>
              </div>
            );
          })}
          
`;

code = code.replace(searchStr, followUpGiftStr + searchStr);
fs.writeFileSync('src/App.tsx', code);
