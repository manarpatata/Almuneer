const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldBox = `<div className="text-[9px] text-[#4a3424] leading-tight mb-2 bg-white/40 p-1 rounded border border-[#d4b483]/40">
                      {punishment.reason}
                    </div>
                    
                    <div className="flex justify-between items-end border-t border-dashed border-[#8c6b44] pt-1.5 mt-1.5">
                      <span className="text-[8px] text-[#8c6b44]">التوقيع:</span>
                      <div className="text-lg font-[Brush_Script_MT,cursive] text-red-700/80 -rotate-12 opacity-80" style={{ fontFamily: '"Caveat", "Dancing Script", cursive' }}>
                        {punishment.sender}
                      </div>
                    </div>`;

const newBox = `<div className="text-[9px] text-[#4a3424] font-bold leading-tight mb-2 py-1">
                      {punishment.reason}
                    </div>
                    
                    <div className="flex justify-between items-end border-t border-dashed border-[#8c6b44] pt-1.5 mt-1.5 h-12">
                      <span className="text-[8px] text-[#8c6b44]">التوقيع:</span>
                      {punishment.signature ? (
                        <img src={punishment.signature} alt="Signature" className="h-10 w-24 object-contain -rotate-6 opacity-80" />
                      ) : (
                        <div className="text-lg font-[Brush_Script_MT,cursive] text-red-700/80 -rotate-12 opacity-80" style={{ fontFamily: '"Caveat", "Dancing Script", cursive' }}>
                          {punishment.sender}
                        </div>
                      )}
                    </div>`;

content = content.replace(oldBox, newBox);
fs.writeFileSync('src/App.tsx', content);
console.log('App Box Patched');
