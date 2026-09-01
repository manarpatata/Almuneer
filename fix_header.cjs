const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const navMenuRegex = /\{\/\* Navigation Menu \*\/\}\n\s*\{!showDashboard && \([\s\S]*?<\/div>\s*\)\}/;

const match = content.match(navMenuRegex);
if (match) {
  const navMenuStr = match[0];
  content = content.replace(navMenuRegex, '');
  
  // Find the end of the last div block in header
  // It ends right before </div>\n        </div>\n      </header>
  const insertPoint = /<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*<\/header>/;
  
  content = content.replace(insertPoint, `</div>\n            ${navMenuStr}\n          </div>\n        </div>\n      </header>`);
  fs.writeFileSync('src/App.tsx', content);
  console.log('Moved navigation menu');
} else {
  console.log('Could not find nav menu');
}
