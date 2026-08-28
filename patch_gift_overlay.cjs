const fs = require('fs');
let code = fs.readFileSync('src/components/SupervisorGiftOverlay.tsx', 'utf8');

const oldButton = `<button 
            onClick={() => onClaim(gift.id)}
            className="w-full mt-6 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-lg shadow-fuchsia-200 hover:shadow-fuchsia-300 hover:-translate-y-1 text-lg flex items-center justify-center gap-2"
          >
            استلام الهدية +300 نقطة ✨
          </button>`;

const newButton = `<button 
            onClick={() => onClaim(gift.id)}
            className="w-full mt-6 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-lg shadow-fuchsia-200 hover:shadow-fuchsia-300 hover:-translate-y-1 text-lg flex items-center justify-center gap-2"
          >
            {gift.giftType === 'freeze' ? 'استلام بطاقة تجميد الستريك 🧊' : 
             gift.giftType === 'pardon' ? 'استلام بطاقة إعفاء من العقوبة 🛡️' : 
             'استلام الهدية +300 نقطة ✨'}
          </button>`;

if(!code.includes("gift.giftType")) {
  code = code.replace(oldButton, newButton);
  fs.writeFileSync('src/components/SupervisorGiftOverlay.tsx', code);
}
console.log("Patched SupervisorGiftOverlay for gift types");
