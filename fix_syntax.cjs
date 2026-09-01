const fs = require('fs');
let content = fs.readFileSync('src/components/SupervisorReports.tsx', 'utf8');

content = content.replace(
  /                    \s*<\/>\s*\)\s*:\s*\(/m,
  "                    </div>\n                    </>\n                  ) : ("
);

fs.writeFileSync('src/components/SupervisorReports.tsx', content);
