const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const getPunishmentsStr = `
          {(() => {
            const systemPunishments = Array.from({ length: state.pendingPunishmentsCount || (state.pendingPunishment ? 1 : 0) }).map((_, i) => ({
              id: \`sys-\${i}\`,
              type: 'system',
              reason: 'لم تنهي ٢٠ درسًا في اليومين الماضيين🔪',
              sender: 'لجنة العقوبات'
            }));
            const supPunishments = state.supervisorPunishments || [];
            const allPunishments = [...systemPunishments, ...supPunishments];
            
            return allPunishments.map((punishment, idx) => {
              let classes = "rounded-[2rem] p-6 text-white flex flex-col justify-center items-center gap-4 relative overflow-hidden shrink-0 shadow-lg transition-all duration-300 ";
              const uiState = punishmentUIStates[idx] || 'idle';
              let content;`;

const mapStart = `{Array.from({ length: state.pendingPunishmentsCount || (state.pendingPunishment ? 1 : 0) }).map((_, idx) => {
            let classes = "rounded-[2rem] p-6 text-white flex flex-col justify-center items-center gap-4 relative overflow-hidden shrink-0 shadow-lg transition-all duration-300 ";
            const uiState = punishmentUIStates[idx] || 'idle';
            let content;`;

const boxContent = `                  {/* Seal */}
                  <div className="absolute bottom-2 right-2 w-24 h-24 rounded-full border-[5px] border-double border-red-700 flex flex-col items-center justify-center rotate-[-20deg] opacity-90 z-20">
                    <Scale className="w-6 h-6 text-red-700 mb-0.5" strokeWidth={2.5} />
                    <span className="text-[9px] font-black text-red-700 leading-tight text-center">لجنة<br/>العقوبات</span>
                  </div>
                </div>
              );`;

const newBoxContent = `                  {/* Seal */}
                  <div className="absolute bottom-2 right-2 w-24 h-24 rounded-full border-[5px] border-double border-red-700 flex flex-col items-center justify-center rotate-[-20deg] opacity-90 z-20">
                    <Scale className="w-6 h-6 text-red-700 mb-0.5" strokeWidth={2.5} />
                    <span className="text-[9px] font-black text-red-700 leading-tight text-center">{punishment.sender}</span>
                  </div>
                  
                  {/* Shipping Label */}
                  <div className="absolute top-4 left-4 bg-[#fdf8e6] px-3 py-2 rounded shadow-sm border border-[#d4b483] w-40 rotate-[5deg] z-20">
                    <div className="text-[8px] text-[#8c6b44] font-bold mb-1 border-b border-dashed border-[#8c6b44] pb-1">بيانات الشحن 📄</div>
                    <div className="text-[9px] text-[#4a3424] mb-1"><b>المرسل:</b> {punishment.sender}</div>
                    <div className="text-[9px] text-[#4a3424] mb-1"><b>السبب:</b> {punishment.reason}</div>
                    <div className="text-[8px] text-[#8c6b44] mt-1 pt-1 border-t border-dashed border-[#8c6b44]">التوقيع: {punishment.sender}</div>
                  </div>
                </div>
              );`;

const handlersOld = `<button onClick={() => handlePunishmentAction(idx, true)} className="flex-1 bg-white text-rose-600 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-rose-50 transition-colors">أتممت العقاب</button>
                    <button onClick={() => handlePunishmentAction(idx, false)} className="flex-1 bg-rose-800 text-white py-3 rounded-xl font-bold text-sm hover:bg-rose-900 transition-colors">لم أتمم</button>
                  </div>
                  {(state.immunityCards || 0) > 0 && (
                    <button onClick={() => handleUseCardAction(idx)} className="w-full bg-yellow-400 text-yellow-900 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-yellow-300 transition-colors flex justify-center items-center gap-2">`;

const handlersNew = `<button onClick={() => handlePunishmentAction(idx, true, punishment.id, punishment.type === 'system')} className="flex-1 bg-white text-rose-600 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-rose-50 transition-colors">أتممت العقاب</button>
                    <button onClick={() => handlePunishmentAction(idx, false, punishment.id, punishment.type === 'system')} className="flex-1 bg-rose-800 text-white py-3 rounded-xl font-bold text-sm hover:bg-rose-900 transition-colors">لم أتمم</button>
                  </div>
                  {(state.immunityCards || 0) > 0 && (
                    <button onClick={() => handleUseCardAction(idx, punishment.id, punishment.type === 'system')} className="w-full bg-yellow-400 text-yellow-900 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-yellow-300 transition-colors flex justify-center items-center gap-2">`;

code = code.replace(mapStart, getPunishmentsStr);
code = code.replace(boxContent, newBoxContent);
code = code.replace(handlersOld, handlersNew);

// Remember to close the IIFE for the map!
const closingTagOld = `            return (
              <div key={\`punishment-\${idx}\`} className={classes}>`;
const closingTagNew = `            return (
              <div key={\`punishment-\${idx}\`} className={classes}>`;

code = code.replace(`            );
          })}
          `, `            );
            });
          })()}
          `);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched rendering logic in App.tsx");
