const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `
            <button
              onClick={() => setShowStats(true)}
              className="flex items-center gap-2 bg-yellow-50 hover:bg-yellow-100 transition-colors px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-yellow-200 text-yellow-700 shadow-sm"
            >
              <Trophy className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
              <span className="font-bold font-mono text-sm md:text-base">{currentScore}</span>
            </button>
`;

const replacementStr = `
            <div className="flex gap-2">
              <button
                onClick={() => setShowStats(true)}
                className="flex items-center gap-2 bg-yellow-50 hover:bg-yellow-100 transition-colors px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-yellow-200 text-yellow-700 shadow-sm"
              >
                <Trophy className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
                <span className="font-bold font-mono text-sm md:text-base">{currentScore + (state.points || 0)}</span>
              </button>
              
              <button
                onClick={() => setShowStats(true)}
                className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 transition-colors px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-orange-200 text-orange-700 shadow-sm"
              >
                <span className="text-sm md:text-base">🔥</span>
                <span className="font-bold font-mono text-sm md:text-base">{currentStreak}</span>
                {freezesAvailable > 0 && (
                  <span className="flex items-center gap-1 ml-1 pl-2 border-l border-orange-200">
                    <span className="text-xs md:text-sm text-blue-500">🧊</span>
                    <span className="font-bold font-mono text-xs md:text-sm text-blue-600">{freezesAvailable}</span>
                  </span>
                )}
              </button>
            </div>
`;
code = code.replace(targetStr.trim(), replacementStr.trim());
fs.writeFileSync('src/App.tsx', code);
