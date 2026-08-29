const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `            );
            });
          })()}
          
          
          {(() => {`;

const corrected1 = `            );
          })}
          
          {(() => {`;

code = code.replace(target1, corrected1);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed App.tsx JSX structure 1");
