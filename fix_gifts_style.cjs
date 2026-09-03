const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /\{\(state\.supervisorGifts \|\| \[\]\)\.map\(\(gift\) => \{[\s\S]*?\}\)\}/;

const replacement = `{(state.supervisorGifts || []).map((gift) => {
            const isOpened = gift.claimed;
            
            if (gift.giftType === 'pardon') {
              return !isOpened ? (
                <div key={gift.id} onClick={() => handleClaimSupervisorGift(gift.id)} className="relative w-full h-48 bg-[#facc15] rounded-xl overflow-hidden shadow-2xl cursor-pointer hover:scale-[1.03] active:scale-95 transition-all border-4 border-[#eab308] shrink-0">
                  <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-12 bg-[#ef4444] shadow-sm"></div>
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-12 bg-[#ef4444] shadow-sm"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#dc2626] rotate-45 rounded-xl shadow-lg border-[3px] border-[#ef4444]"></div>
                  
                  <div className="absolute bottom-4 right-4 bg-[#fdf8e6] px-3 py-2 rounded-lg shadow-xl border-2 border-[#eab308] rotate-[-8deg] z-10 w-[140px] pointer-events-none">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#fdf8e6] rounded-full border-2 border-[#eab308] flex items-center justify-center">
                      <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    </div>
                    <p className="text-sm font-black text-[#b37012] mb-1.5 leading-tight text-center mt-1">"{gift.message || 'هدية مميزة لك 🌟'}"</p>
                    <p className="text-[10px] text-[#8c5508] font-bold border-t border-[#eab308]/40 pt-1.5 text-center">من: {gift.from || 'المشرف'}</p>
                  </div>
                </div>
              ) : (
                <div key={gift.id} className="bg-[#fdf3c8] border-[6px] border-[#e5a022] rounded-xl p-5 shadow-2xl relative flex flex-col items-center justify-center text-center transform -rotate-2 hover:rotate-0 transition-transform cursor-default h-48 overflow-hidden shrink-0">
                  <div className="absolute inset-1 border-2 border-dashed border-[#e5a022] rounded-lg pointer-events-none"></div>
                  <div className="w-12 h-12 bg-[#e5a022] text-white rounded-full flex items-center justify-center mb-3 shadow-inner z-10">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-[#b37012] text-2xl uppercase tracking-widest mb-1 z-10">كرت الإعفاء</h3>
                  <p className="text-[#8c5508] font-bold text-sm z-10 leading-relaxed max-w-[85%]">تعفيك من أي عقاب متى ما احتجتيه</p>
                  
                  <div className="absolute -bottom-2 right-2 w-24 h-24 rounded-full border-[5px] border-double border-red-700 flex flex-col items-center justify-center rotate-[-25deg] opacity-80 z-20">
                    <Scale className="w-6 h-6 text-red-700 mb-0.5" strokeWidth={2.5} />
                    <span className="text-[10px] font-black text-red-700 leading-tight text-center truncate px-2 w-full">{gift.from || 'المشرف'}</span>
                  </div>
                </div>
              );
            }
            
            // Points or Freeze
            return !isOpened ? (
              <div key={gift.id} onClick={() => handleClaimSupervisorGift(gift.id)} className="relative w-full h-48 bg-indigo-500 rounded-xl overflow-hidden shadow-2xl cursor-pointer hover:scale-[1.03] active:scale-95 transition-all border-4 border-indigo-600 shrink-0">
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-12 bg-fuchsia-400 shadow-sm"></div>
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-12 bg-fuchsia-400 shadow-sm"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-fuchsia-500 rotate-45 rounded-xl shadow-lg border-[3px] border-fuchsia-400"></div>
                
                <div className="absolute bottom-4 right-4 bg-indigo-50 px-3 py-2 rounded-lg shadow-xl border-2 border-indigo-300 rotate-[-8deg] z-10 w-[140px] pointer-events-none">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-indigo-50 rounded-full border-2 border-indigo-300 flex items-center justify-center">
                    <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
                  </div>
                  <p className="text-sm font-black text-indigo-900 mb-1.5 leading-tight text-center mt-1">"{gift.message || 'هدية مميزة لك 🚀'}"</p>
                  <p className="text-[10px] text-indigo-700 font-bold border-t border-indigo-200 pt-1.5 text-center">من: {gift.from || 'المشرف'}</p>
                </div>
              </div>
            ) : (
              <div key={gift.id} className="bg-indigo-50 border-[6px] border-indigo-400 rounded-xl p-5 shadow-2xl relative flex flex-col items-center justify-center text-center transform -rotate-2 hover:rotate-0 transition-transform cursor-default h-48 overflow-hidden shrink-0">
                <div className="absolute inset-1 border-2 border-dashed border-indigo-300 rounded-lg pointer-events-none"></div>
                <div className="w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center mb-3 shadow-inner z-10">
                  {gift.giftType === 'points' ? <Star className="w-6 h-6 fill-current" /> : <Snowflake className="w-6 h-6" />}
                </div>
                <h3 className="font-black text-indigo-800 text-xl uppercase tracking-widest mb-1 z-10">
                  {gift.giftType === 'points' ? 'ربحت 300 نقطة!' : 'استعادة ستريك'}
                </h3>
                {gift.giftType !== 'points' && (
                  <p className="text-indigo-600 font-bold text-sm z-10 leading-relaxed max-w-[85%]">
                    كرت استعادة أيام الانقطاع
                  </p>
                )}
                
                <div className="absolute -bottom-2 right-2 w-24 h-24 rounded-full border-[5px] border-double border-indigo-600 flex flex-col items-center justify-center rotate-[-25deg] opacity-80 z-20">
                  <div className="w-6 h-6 text-indigo-600 mb-0.5 flex items-center justify-center font-bold text-xl"><Search className="w-5 h-5 text-indigo-600" strokeWidth={2.5} /></div>
                  <span className="text-[10px] font-black text-indigo-600 leading-tight text-center truncate px-2 w-full">{gift.from || 'المشرف'}</span>
                </div>
              </div>
            );
          })}`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Successfully replaced supervisor gifts rendering to match system gifts.");
} else {
  console.log("Regex didn't match.");
}
