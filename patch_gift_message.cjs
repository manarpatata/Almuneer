const fs = require('fs');
let code = fs.readFileSync('src/components/SupervisorDashboard.tsx', 'utf8');

code = code.replace(
  "const [giftMessage, setGiftMessage] = useState('هدية لانك اشطر شطور من لجنة العقوبات');",
  "const [giftMessage, setGiftMessage] = useState('');"
);

// Add a placeholder to the textarea if it doesn't have one
code = code.replace(
  /<textarea\s*\n\s*value=\{giftMessage\}/g,
  '<textarea\n                  placeholder="اكتب رسالة الهدية هنا..."\n                  value={giftMessage}'
);

fs.writeFileSync('src/components/SupervisorDashboard.tsx', code);
console.log("Removed default gift message");
