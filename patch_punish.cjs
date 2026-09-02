const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /reason: 'لم تنهي ٢٠ درسًا في اليومين الماضيين🔪'/,
  "reason: 'لم تنجز المطلوب في اليومين الماضيين! تحمل العواقب الوخيمة🔪'"
);

const oldSig = `{punishment.signature ? (
                        <img src={punishment.signature} alt="Signature" className="h-10 w-24 object-contain -rotate-6 opacity-80" />
                      ) : (
                        <div className="text-lg font-[Brush_Script_MT,cursive] text-red-700/80 -rotate-12 opacity-80" style={{ fontFamily: '"Caveat", "Dancing Script", cursive' }}>
                          {punishment.sender}
                        </div>
                      )}`;

const newSig = `{punishment.signature ? (
                        <img src={punishment.signature} alt="Signature" className="h-10 w-24 object-contain -rotate-6 opacity-80" />
                      ) : punishment.sender === 'لجنة العقوبات' ? (
                        <svg className="h-10 w-24 -rotate-6 opacity-80 text-red-700" viewBox="0 0 200 60" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20,40 C30,10 50,20 40,50 C35,60 10,40 20,30 C30,20 60,30 70,40 C80,50 90,20 110,30 C130,40 100,50 120,40 C140,30 160,20 180,30 C190,35 170,50 160,40 C150,30 180,40 190,20" />
                          <path d="M45,25 L48,25 M115,20 L118,20 M145,20 L148,20" strokeWidth="4" />
                        </svg>
                      ) : (
                        <div className="text-lg font-[Brush_Script_MT,cursive] text-red-700/80 -rotate-12 opacity-80" style={{ fontFamily: '"Caveat", "Dancing Script", cursive' }}>
                          {punishment.sender}
                        </div>
                      )}`;

content = content.replace(oldSig, newSig);
fs.writeFileSync('src/App.tsx', content);
console.log('App patched.');
