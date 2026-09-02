const fs = require('fs');
let content = fs.readFileSync('src/components/SupervisorDashboard.tsx', 'utf8');

const regex = /\}\)\(\)\}\n          <\/div>\n        <\/div>\n          \)\}\n        <\/div>\n      <\/main>/;
const replacement = `})()}
          </div>
          )}
        </div>
      </main>`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/components/SupervisorDashboard.tsx', content);
