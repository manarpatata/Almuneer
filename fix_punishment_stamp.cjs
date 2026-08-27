const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldStamp = `<div className="absolute -bottom-2 right-1 w-32 h-32 rounded-full border-[6px] border-double border-red-600 flex flex-col items-center justify-center rotate-[-25deg] opacity-80 z-20">
                  <Scale className="w-10 h-10 text-red-600 mb-1" strokeWidth={2.5} />
                  <span className="text-[12px] font-black text-red-600 leading-tight text-center">لجنة<br/>العقوبات</span>
                </div>`;

const newStamp = `<div className="absolute -bottom-2 right-2 w-24 h-24 rounded-full border-[5px] border-double border-red-600 flex flex-col items-center justify-center rotate-[-25deg] opacity-80 z-20">
                  <Scale className="w-6 h-6 text-red-600 mb-0.5" strokeWidth={2.5} />
                  <span className="text-[10px] font-black text-red-600 leading-tight text-center">لجنة<br/>العقوبات</span>
                </div>`;

code = code.replace(oldStamp, newStamp);
fs.writeFileSync('src/App.tsx', code);
console.log("Updated punishment stamp");
