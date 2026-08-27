const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /<StatsModal([\s\S]*?)immunityCards=\{state\.immunityCards \|\| 0\}([\s\S]*?)onClose=\{.*?\}\s*\/>/g,
  '<StatsModal$1immunityCards={state.immunityCards || 0} extraPoints={state.points || 0}$2onClose={() => setShowStats(false)} />'
);

fs.writeFileSync('src/App.tsx', code);
