const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Import WalletModal
code = code.replace("import { StatsModal } from './components/StatsModal';", "import { StatsModal } from './components/StatsModal';\nimport { WalletModal } from './components/WalletModal';");

// 2. Add showWalletModal state
code = code.replace("const [showStats, setShowStats] = useState(false);", "const [showStats, setShowStats] = useState(false);\n  const [showWalletModal, setShowWalletModal] = useState(false);");

// 3. Update Opened Points Gift Card Text
const oldPointsCardLogic = `
                <h3 className="font-black text-indigo-800 text-2xl uppercase tracking-widest mb-1 z-10">
                  {outcome === 'points' ? '300 نقطة!' : 'استعادة ستريك'}
                </h3>
                <p className="text-indigo-600 font-bold text-sm z-10 leading-relaxed max-w-[85%]">
                  {outcome === 'points' ? 'ربحت 300 نقطة إضافية!' : 'كرت استعادة أيام الانقطاع'}
                </p>
`;
const newPointsCardLogic = `
                <h3 className="font-black text-indigo-800 text-xl uppercase tracking-widest mb-1 z-10">
                  {outcome === 'points' ? 'ربحت 300 نقطة!' : 'استعادة ستريك'}
                </h3>
                {outcome !== 'points' && (
                  <p className="text-indigo-600 font-bold text-sm z-10 leading-relaxed max-w-[85%]">
                    كرت استعادة أيام الانقطاع
                  </p>
                )}
`;
code = code.replace(oldPointsCardLogic.trim(), newPointsCardLogic.trim());

// 4. Render WalletModal
const statsModalStr = `{showStats && (`;
const walletModalStr = `{showWalletModal && (
        <WalletModal
          immunityCards={state.immunityCards || 0}
          freezeCards={freezesAvailable}
          pointsCards={Math.floor((state.points || 0) / 300)}
          onClose={() => setShowWalletModal(false)}
        />
      )}
      
      {showStats && (`
code = code.replace(statsModalStr, walletModalStr);

// 5. Redesign the Wallet Trigger button (remove text, make it look like a wallet)
const oldWalletBox = `
            {/* Cards Box (Right side in RTL) */}
            <div className="flex-1 bg-gradient-to-b from-white to-slate-50 border border-slate-200 rounded-3xl p-3 shadow-sm flex flex-col relative overflow-hidden">
              <div className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5 justify-center">
                <Gift className="w-3.5 h-3.5" />
                محفظة البطاقات
              </div>
              <div className="flex-1 flex items-center justify-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center border-2 border-yellow-300 shadow-sm relative">
                    <span className="text-lg">🎫</span>
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white">
                      {state.immunityCards || 0}
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-yellow-700">إعفاء</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center border-2 border-blue-300 shadow-sm relative">
                    <span className="text-lg">🧊</span>
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white">
                      {freezesAvailable}
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-blue-700">استعادة</span>
                </div>
              </div>
            </div>
`;

const newWalletBox = `
            {/* Wallet Box (Right side in RTL) */}
            <div 
              onClick={() => setShowWalletModal(true)}
              className="flex-1 bg-amber-800 rounded-3xl relative overflow-hidden shadow-inner border-b-[6px] border-amber-900 cursor-pointer hover:bg-amber-700 transition-colors group"
            >
              {/* Flap */}
              <div className="absolute top-0 left-0 right-0 h-[55%] bg-amber-700 rounded-b-[2rem] border-b-4 border-amber-800 shadow-md flex items-end justify-center pb-2.5 transition-transform group-hover:-translate-y-1">
                {/* Clasp */}
                <div className="w-5 h-5 bg-yellow-600 rounded-full shadow-inner border-2 border-yellow-700 relative flex items-center justify-center">
                  <div className="w-2 h-2 bg-yellow-800/80 rounded-full"></div>
                </div>
              </div>
              {/* Stitching */}
              <div className="absolute inset-2 border-2 border-dashed border-amber-900/30 rounded-2xl pointer-events-none"></div>
            </div>
`;

code = code.replace(oldWalletBox.trim(), newWalletBox.trim());

fs.writeFileSync('src/App.tsx', code);
