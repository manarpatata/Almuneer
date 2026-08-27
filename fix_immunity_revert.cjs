const fs = require('fs');

// 1. Update WalletModal.tsx
let walletCode = fs.readFileSync('src/components/WalletModal.tsx', 'utf8');

const walletRedBlock = `              if (type === 'immunity') {
                return (
                  <div key={idx} style={{ zIndex }} className="bg-red-50 border-[6px] border-red-500 rounded-xl p-5 shadow-2xl relative flex flex-col items-center justify-center text-center transform hover:-translate-y-4 hover:scale-105 transition-transform cursor-pointer h-48 overflow-hidden shrink-0 w-full max-w-[280px] -mt-24 first:mt-0 group hover:!z-50">
                    <div className="absolute inset-1 border-2 border-dashed border-red-300 rounded-lg pointer-events-none"></div>
                    <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center mb-3 shadow-inner z-10">
                      <span className="text-2xl">🎫</span>
                    </div>
                    <h3 className="font-black text-red-900 text-2xl uppercase tracking-widest mb-1 z-10">إعفاء</h3>
                    <p className="text-red-700 font-bold text-sm z-10 leading-relaxed max-w-[85%]">
                      يلغي أي صندوق عقاب
                    </p>
                    <div className="absolute -bottom-2 right-2 w-24 h-24 rounded-full border-[5px] border-double border-red-700 flex flex-col items-center justify-center rotate-[-25deg] opacity-80 z-20">
                      <Scale className="w-6 h-6 text-red-700 mb-0.5" strokeWidth={2.5} />
                      <span className="text-[10px] font-black text-red-700 leading-tight text-center">لجنة<br/>العقوبات</span>
                    </div>
                  </div>
                );
              }`;

const walletYellowBlock = `              if (type === 'immunity') {
                return (
                  <div key={idx} style={{ zIndex }} className="bg-yellow-50 border-[6px] border-yellow-400 rounded-xl p-5 shadow-2xl relative flex flex-col items-center justify-center text-center transform hover:-translate-y-4 hover:scale-105 transition-transform cursor-pointer h-48 overflow-hidden shrink-0 w-full max-w-[280px] -mt-24 first:mt-0 group hover:!z-50">
                    <div className="absolute inset-1 border-2 border-dashed border-yellow-300 rounded-lg pointer-events-none"></div>
                    <div className="w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center mb-3 shadow-inner z-10">
                      <span className="text-2xl">🎫</span>
                    </div>
                    <h3 className="font-black text-yellow-800 text-2xl uppercase tracking-widest mb-1 z-10">إعفاء</h3>
                    <p className="text-yellow-600 font-bold text-sm z-10 leading-relaxed max-w-[85%]">
                      يلغي أي صندوق عقاب
                    </p>
                    <div className="absolute -bottom-2 right-2 w-24 h-24 rounded-full border-[5px] border-double border-red-700 flex flex-col items-center justify-center rotate-[-25deg] opacity-80 z-20">
                      <Scale className="w-6 h-6 text-red-700 mb-0.5" strokeWidth={2.5} />
                      <span className="text-[10px] font-black text-red-700 leading-tight text-center">لجنة<br/>العقوبات</span>
                    </div>
                  </div>
                );
              }`;
              
walletCode = walletCode.replace(walletRedBlock, walletYellowBlock);
fs.writeFileSync('src/components/WalletModal.tsx', walletCode);

// 2. Update App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

const appRedBlock = `              <div key={\`opened-gift-\${idx}\`} className="bg-red-50 border-[6px] border-red-500 rounded-xl p-5 shadow-2xl relative flex flex-col items-center justify-center text-center transform -rotate-2 hover:rotate-0 transition-transform cursor-default h-48 overflow-hidden shrink-0">
                <div className="absolute inset-1 border-2 border-dashed border-red-300 rounded-lg pointer-events-none"></div>
                <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center mb-3 shadow-inner z-10">
                  <span className="text-2xl">🎫</span>
                </div>
                <h3 className="font-black text-red-900 text-2xl uppercase tracking-widest mb-1 z-10">إعفاء</h3>
                <p className="text-red-700 font-bold text-sm z-10 leading-relaxed max-w-[85%]">يلغي أي صندوق عقاب</p>
                
                <div className="absolute -bottom-2 right-2 w-24 h-24 rounded-full border-[5px] border-double border-red-700 flex flex-col items-center justify-center rotate-[-25deg] opacity-80 z-20">
                  <Scale className="w-6 h-6 text-red-700 mb-0.5" strokeWidth={2.5} />
                  <span className="text-[10px] font-black text-red-700 leading-tight text-center">لجنة<br/>العقوبات</span>
                </div>
              </div>`;

const appYellowBlock = `              <div key={\`opened-gift-\${idx}\`} className="bg-[#fdf3c8] border-[6px] border-[#e5a022] rounded-xl p-5 shadow-2xl relative flex flex-col items-center justify-center text-center transform -rotate-2 hover:rotate-0 transition-transform cursor-default h-48 overflow-hidden shrink-0">
                <div className="absolute inset-1 border-2 border-dashed border-[#e5a022] rounded-lg pointer-events-none"></div>
                <div className="w-12 h-12 bg-[#e5a022] text-white rounded-full flex items-center justify-center mb-3 shadow-inner z-10">
                  <span className="text-2xl">🎫</span>
                </div>
                <h3 className="font-black text-[#b37012] text-2xl uppercase tracking-widest mb-1 z-10">كرت الإعفاء</h3>
                <p className="text-[#8c5508] font-bold text-sm z-10 leading-relaxed max-w-[85%]">تعفيك من أي عقاب متى ما احتجتيه</p>
                
                <div className="absolute -bottom-2 right-2 w-24 h-24 rounded-full border-[5px] border-double border-red-700 flex flex-col items-center justify-center rotate-[-25deg] opacity-80 z-20">
                  <Scale className="w-6 h-6 text-red-700 mb-0.5" strokeWidth={2.5} />
                  <span className="text-[10px] font-black text-red-700 leading-tight text-center">لجنة<br/>العقوبات</span>
                </div>
              </div>`;

appCode = appCode.replace(appRedBlock, appYellowBlock);
fs.writeFileSync('src/App.tsx', appCode);

console.log("Reverted immunity cards to yellow theme with red stamp");
