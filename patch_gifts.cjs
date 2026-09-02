const fs = require('fs');

// Patch App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove SupervisorGiftOverlay import
appContent = appContent.replace(
  /import \{ SupervisorGiftOverlay \} from '\.\/components\/SupervisorGiftOverlay';\n/,
  ''
);

// 2. Remove the SupervisorGiftOverlay component usage
appContent = appContent.replace(
  /<SupervisorGiftOverlay gifts=\{state\.supervisorGifts \|\| \[\]\} onClaim=\{handleClaimSupervisorGift\} \/>/g,
  ''
);

// 3. Add supervisor gifts to the gift rendering loop
const giftsContainerTarget = `{Array.from({ length: totalGiftsToday }).map((_, idx) => (`;
const supervisorGiftsRender = `          {(state.supervisorGifts || []).map((gift) => {
            const isOpened = gift.claimed;
            return !isOpened ? (
              <div key={gift.id} onClick={() => handleClaimSupervisorGift(gift.id)} className="relative w-full h-48 bg-fuchsia-500 rounded-xl overflow-hidden shadow-2xl cursor-pointer hover:scale-[1.03] active:scale-95 transition-all border-4 border-fuchsia-600 shrink-0">
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-12 bg-pink-400 shadow-sm"></div>
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-12 bg-pink-400 shadow-sm"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-pink-500 rotate-45 rounded-xl shadow-lg border-[3px] border-pink-400"></div>
                
                <div className="absolute bottom-2 right-2 bg-[#fdf8e6] px-2 py-1.5 rounded-lg shadow-xl border-2 border-fuchsia-300 rotate-[-8deg] z-10 w-[160px] pointer-events-none flex flex-col items-center">
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#fdf8e6] rounded-full border-2 border-fuchsia-300 flex items-center justify-center">
                    <div className="w-1 h-1 bg-fuchsia-500 rounded-full"></div>
                  </div>
                  <p className="text-[10px] font-black text-fuchsia-900 mb-1 leading-tight text-center mt-1">"{gift.message}"</p>
                  <p className="text-[9px] text-fuchsia-700 font-bold border-t border-fuchsia-200 pt-1 text-center w-full">من: {gift.from}</p>
                </div>
              </div>
            ) : (
              <div key={gift.id} className="bg-fuchsia-50 border-[6px] border-fuchsia-400 rounded-xl p-5 shadow-2xl relative flex flex-col items-center justify-center text-center transform -rotate-2 hover:rotate-0 transition-transform cursor-default h-48 overflow-hidden shrink-0">
                <div className="absolute inset-1 border-2 border-dashed border-fuchsia-300 rounded-lg pointer-events-none"></div>
                <div className="w-12 h-12 bg-fuchsia-500 text-white rounded-full flex items-center justify-center mb-3 shadow-inner z-10">
                  {gift.giftType === 'freeze' ? <Snowflake className="w-6 h-6" /> :
                   gift.giftType === 'pardon' ? <Shield className="w-6 h-6" /> :
                   <Star className="w-6 h-6 fill-current" />}
                </div>
                <h3 className="font-black text-fuchsia-800 text-xl uppercase tracking-widest mb-1 z-10">
                  {gift.giftType === 'freeze' ? 'استعادة ستريك' :
                   gift.giftType === 'pardon' ? 'كرت الإعفاء' :
                   '300 نقطة'}
                </h3>
                <p className="text-xs text-fuchsia-600 font-bold z-10 mt-1">من: {gift.from}</p>
              </div>
            );
          })}
          
          `;

appContent = appContent.replace(giftsContainerTarget, supervisorGiftsRender + giftsContainerTarget);

fs.writeFileSync('src/App.tsx', appContent);
console.log('App.tsx patched for supervisor gifts');
