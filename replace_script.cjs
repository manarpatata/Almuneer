const fs = require('fs');

const original = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /\{\(state\.supervisorGifts \|\| \[\]\)\.map\(\(gift\) => \{[\s\S]*?\}\)\}/;

const replacement = `{(state.supervisorGifts || []).map((gift) => {
            const isOpened = gift.claimed;
            return !isOpened ? (
              <div key={gift.id} onClick={() => handleClaimSupervisorGift(gift.id)} className="relative w-full h-48 bg-[#fdfbf7] rounded-xl overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] cursor-pointer hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] active:scale-95 transition-all border border-[#e2dcd0] shrink-0 flex items-center justify-center group">
                <div className="absolute top-0 left-0 right-0 h-28 bg-[#f4ebd8] border-b border-[#e2dcd0] rounded-t-xl" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)', zIndex: 10 }}></div>
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-[#faf6ef] border-t border-[#e2dcd0]" style={{ clipPath: 'polygon(0 100%, 100% 100%, 50% 0)', zIndex: 5 }}></div>
                <div className="absolute top-0 left-0 bottom-0 w-1/2 bg-[#fdfbf7]" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)', zIndex: 6 }}></div>
                <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-[#fdfbf7]" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 50%)', zIndex: 6 }}></div>
                
                <div className="absolute top-[100px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-red-700 rounded-full shadow-[0_5px_15px_rgba(220,38,38,0.4)] border-[3px] border-red-800 z-20 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  <div className="w-10 h-10 rounded-full border border-red-500/50 flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-300 fill-yellow-300 opacity-90" />
                  </div>
                </div>
                
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-full text-center z-10">
                  <span className="text-xs font-bold text-[#8c7e61] tracking-wider bg-[#fdfbf7]/80 px-3 py-1 rounded-full backdrop-blur-sm border border-[#e2dcd0]/50">
                    رسالة مغلقة من المشرف
                  </span>
                </div>
              </div>
            ) : (
              <div key={gift.id} className="bg-[#fdfbf7] border-[2px] border-[#d4af37] rounded-md p-4 shadow-[0_15px_40px_-15px_rgba(212,175,55,0.2)] relative flex flex-col items-center justify-center text-center h-48 overflow-hidden shrink-0">
                <div className="absolute top-2 right-2 w-8 h-8 border-t-[3px] border-r-[3px] border-[#d4af37] rounded-tr-sm"></div>
                <div className="absolute top-2 left-2 w-8 h-8 border-t-[3px] border-l-[3px] border-[#d4af37] rounded-tl-sm"></div>
                <div className="absolute bottom-2 right-2 w-8 h-8 border-b-[3px] border-r-[3px] border-[#d4af37] rounded-br-sm"></div>
                <div className="absolute bottom-2 left-2 w-8 h-8 border-b-[3px] border-l-[3px] border-[#d4af37] rounded-bl-sm"></div>
                
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#d4af37 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }}></div>
                
                <div className="z-10 flex flex-col items-center justify-center w-full h-full relative">
                  <h3 className="font-black text-[#8c7e61] text-lg mb-2 tracking-widest border-b border-[#d4af37]/40 pb-1.5 w-[80%]">
                    {gift.giftType === 'freeze' ? 'بِطاقَةُ استِعادَة' : 
                     gift.giftType === 'pardon' ? 'صَكُّ إِعفَاء' : 
                     'مُكَافَأَةُ نِقَاط'}
                  </h3>
                  
                  <div className="flex items-center justify-center gap-2 my-1 text-[#b08d25]">
                    {gift.giftType === 'freeze' ? <Snowflake className="w-7 h-7" /> : 
                     gift.giftType === 'pardon' ? <Shield className="w-7 h-7" /> : 
                     <Star className="w-7 h-7 fill-current" />}
                    <span className="font-black text-2xl drop-shadow-sm">
                      {gift.giftType === 'freeze' ? 'ستريك' : 
                       gift.giftType === 'pardon' ? 'إعفاء من عقوبة' : 
                       '300 نقطة'}
                    </span>
                  </div>

                  {gift.message && (
                    <p className="text-[#8c7e61] font-bold text-xs italic max-w-[85%] leading-relaxed mt-2 bg-white/50 px-2 py-1 rounded">
                      "{gift.message}"
                    </p>
                  )}
                </div>
                
                <div className="absolute bottom-2 left-3 w-16 h-16 rounded-full border-[3px] border-double border-red-600/80 flex flex-col items-center justify-center rotate-[-15deg] opacity-85 z-20 shadow-sm mix-blend-multiply bg-red-50/50">
                  <div className="text-[8px] text-red-600 uppercase tracking-widest border-b border-red-600/40 mb-0.5 font-bold px-1">معتمد</div>
                  <span className="text-[11px] font-black text-red-700 leading-tight text-center truncate w-full px-1">{gift.sender || gift.from || 'المشرف'}</span>
                </div>
              </div>
            );
          })}`;

if (regex.test(original)) {
  const result = original.replace(regex, replacement);
  fs.writeFileSync('src/App.tsx', result);
  console.log("Successfully replaced gifts mapping");
} else {
  console.log("Regex didn't match anything");
}
