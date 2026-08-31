const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileMenu.tsx', 'utf8');

code = code.replace(
  "            ) : (\n                            <button",
  "            ) : (\n              <>\n              <button"
);

code = code.replace(
  "                  لوحة المشرف\n              </button>\n            )}",
  "                  لوحة المشرف\n              </button>\n              </>\n            )}"
);

fs.writeFileSync('src/components/ProfileMenu.tsx', code);
