const fs = require('fs');
let code = fs.readFileSync('src/components/WaterGunOverlay.tsx', 'utf8');

code = code.replace(
    "<p className=\"text-blue-700 mb-6 font-medium text-lg\">\n              يتم تفتيقك لعدم مذاكرتك بالأمس! لا تدع الكسل يغلبك اليوم!\n            </p>",
    "<p className=\"text-blue-700 mb-6 font-bold text-lg\">\n              يتم تفتيقها لعدم مذاكرتها أي درس🔫!\n            </p>"
);

fs.writeFileSync('src/components/WaterGunOverlay.tsx', code);
