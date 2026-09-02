const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The replacement logic:
const oldShipping = `<div className="absolute top-4 left-4 bg-[#fdf8e6] px-3 py-2 rounded shadow-sm border border-[#d4b483] w-40 rotate-[5deg] z-20">
                    <div className="text-[8px] text-[#8c6b44] font-bold mb-1 border-b border-dashed border-[#8c6b44] pb-1">بيانات الشحن 📄</div>
                    <div className="text-[9px] text-[#4a3424] mb-1"><b>المرسل:</b> {punishment.sender}</div>
                    <div className="text-[9px] text-[#4a3424] mb-1"><b>السبب:</b> {punishment.reason}</div>
                    <div className="text-[8px] text-[#8c6b44] mt-1 pt-1 border-t border-dashed border-[#8c6b44]">التوقيع: {punishment.sender}</div>
                  </div>`;

const newShipping = `<div className="absolute top-4 left-4 bg-[#fdf8e6] px-3 py-2 rounded shadow-sm border border-[#d4b483] w-48 rotate-[5deg] z-20 font-mono" style={{ backgroundImage: 'radial-gradient(#d4b483 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
                    <div className="text-center font-bold text-[#8c6b44] border-b-2 border-double border-[#8c6b44] pb-1 mb-2">📄 بـيـانـات الـشـحـن 📄</div>
                    
                    <div className="flex justify-between items-center mb-1 text-[10px]">
                      <span className="text-[#8c6b44] font-bold">المرسل:</span>
                      <span className="text-[#4a3424]">{punishment.sender}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-2 text-[10px]">
                      <span className="text-[#8c6b44] font-bold">المرسل إليه:</span>
                      <span className="text-[#4a3424]">حضرة سيادتك</span>
                    </div>
                    
                    <div className="text-[10px] text-[#4a3424] leading-relaxed mb-3 bg-white/50 p-1.5 rounded border border-[#d4b483]/50">
                      {punishment.reason}
                    </div>
                    
                    <div className="flex justify-between items-end border-t border-dashed border-[#8c6b44] pt-2 mt-2">
                      <span className="text-[8px] text-[#8c6b44]">التوقيع:</span>
                      <div className="text-xl font-[Brush_Script_MT,cursive] text-red-700/80 -rotate-12 opacity-80" style={{ fontFamily: '"Caveat", "Dancing Script", cursive' }}>
                        {punishment.sender}
                      </div>
                    </div>
                  </div>`;

content = content.replace(oldShipping, newShipping);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx patched for shipping label');
