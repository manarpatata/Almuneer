const fs = require('fs');

function fixStamp(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');

  // Regex to match the stamp block
  // <div className="absolute -bottom-2 right-1 w-32 h-32 rounded-full border-[6px] border-double border-indigo-600 flex flex-col items-center justify-center rotate-[-25deg] opacity-80 z-20">
  //   <div className="w-10 h-10 text-indigo-600 mb-1 flex items-center justify-center font-bold text-4xl"><Search className="w-8 h-8 text-indigo-600" strokeWidth={2.5} /></div>
  //   <span className="text-[12px] font-black text-indigo-600 leading-tight text-center">لجنة<br/>المتابعة</span>
  // </div>
  
  // To make it easy, we'll replace pieces:
  // w-32 h-32 -> w-24 h-24
  // border-[6px] -> border-[5px]
  // w-10 h-10 text-xxx mb-1 -> w-8 h-8 text-xxx mb-0.5
  // w-8 h-8 text-xxx -> w-5 h-5 text-xxx
  // text-[12px] -> text-[10px]

  // Actually, since there are only 3 specific blocks, I can just replace them using exact strings, or regex.

  // 1. App.tsx - indigo-600 opacity-80
  const appOld = `<div className="absolute -bottom-2 right-1 w-32 h-32 rounded-full border-[6px] border-double border-indigo-600 flex flex-col items-center justify-center rotate-[-25deg] opacity-80 z-20">
                  <div className="w-10 h-10 text-indigo-600 mb-1 flex items-center justify-center font-bold text-4xl"><Search className="w-8 h-8 text-indigo-600" strokeWidth={2.5} /></div>
                  <span className="text-[12px] font-black text-indigo-600 leading-tight text-center">لجنة<br/>المتابعة</span>
                </div>`;
  const appNew = `<div className="absolute -bottom-2 right-2 w-24 h-24 rounded-full border-[5px] border-double border-indigo-600 flex flex-col items-center justify-center rotate-[-25deg] opacity-80 z-20">
                  <div className="w-6 h-6 text-indigo-600 mb-0.5 flex items-center justify-center font-bold text-xl"><Search className="w-5 h-5 text-indigo-600" strokeWidth={2.5} /></div>
                  <span className="text-[10px] font-black text-indigo-600 leading-tight text-center">لجنة<br/>المتابعة</span>
                </div>`;
  code = code.replace(appOld, appNew);

  // 2. WalletModal.tsx - yellow-500 opacity-60
  const walletYellowOld = `<div className="absolute -bottom-2 right-1 w-32 h-32 rounded-full border-[6px] border-double border-yellow-500 flex flex-col items-center justify-center rotate-[-25deg] opacity-60 z-20">
                      <div className="w-10 h-10 text-yellow-600 mb-1 flex items-center justify-center font-bold text-4xl"><Search className="w-8 h-8 text-yellow-600" strokeWidth={2.5} /></div>
                      <span className="text-[12px] font-black text-yellow-600 leading-tight text-center">لجنة<br/>المتابعة</span>
                    </div>`;
  const walletYellowNew = `<div className="absolute -bottom-2 right-2 w-24 h-24 rounded-full border-[5px] border-double border-yellow-500 flex flex-col items-center justify-center rotate-[-25deg] opacity-60 z-20">
                      <div className="w-6 h-6 text-yellow-600 mb-0.5 flex items-center justify-center font-bold text-xl"><Search className="w-5 h-5 text-yellow-600" strokeWidth={2.5} /></div>
                      <span className="text-[10px] font-black text-yellow-600 leading-tight text-center">لجنة<br/>المتابعة</span>
                    </div>`;
  code = code.replace(walletYellowOld, walletYellowNew);

  // 3. WalletModal.tsx - indigo-600 opacity-60
  const walletIndigoOld = `<div className="absolute -bottom-2 right-1 w-32 h-32 rounded-full border-[6px] border-double border-indigo-600 flex flex-col items-center justify-center rotate-[-25deg] opacity-60 z-20">
                    <div className="w-10 h-10 text-indigo-600 mb-1 flex items-center justify-center font-bold text-4xl"><Search className="w-8 h-8 text-indigo-600" strokeWidth={2.5} /></div>
                    <span className="text-[12px] font-black text-indigo-600 leading-tight text-center">لجنة<br/>المتابعة</span>
                  </div>`;
  const walletIndigoNew = `<div className="absolute -bottom-2 right-2 w-24 h-24 rounded-full border-[5px] border-double border-indigo-600 flex flex-col items-center justify-center rotate-[-25deg] opacity-60 z-20">
                    <div className="w-6 h-6 text-indigo-600 mb-0.5 flex items-center justify-center font-bold text-xl"><Search className="w-5 h-5 text-indigo-600" strokeWidth={2.5} /></div>
                    <span className="text-[10px] font-black text-indigo-600 leading-tight text-center">لجنة<br/>المتابعة</span>
                  </div>`;
  code = code.replace(walletIndigoOld, walletIndigoNew);

  fs.writeFileSync(filePath, code);
}

fixStamp('src/App.tsx');
fixStamp('src/components/WalletModal.tsx');
console.log("Stamps updated");
