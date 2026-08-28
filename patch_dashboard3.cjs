const fs = require('fs');
let code = fs.readFileSync('src/components/SupervisorDashboard.tsx', 'utf8');

// 1. Change +/- 100 to +/- 10
code = code.replace(
  "onClick={() => setPointsChange(prev => prev - 100)}",
  "onClick={() => setPointsChange(prev => prev - 10)}"
);
code = code.replace(
  ">-100</button>",
  ">-10</button>"
);
code = code.replace(
  "onClick={() => setPointsChange(prev => prev + 100)}",
  "onClick={() => setPointsChange(prev => prev + 10)}"
);
code = code.replace(
  ">+100</button>",
  ">+10</button>"
);

// 2. Change Image Avatar
code = code.replace(
  /src=\{\`https:\/\/api\.dicebear\.com\/7\.x\/avataaars\/svg\?seed=\$\{uData\.email\}&backgroundColor=e2e8f0\`\}/g,
  "src={uData.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${uData.email}&backgroundColor=e2e8f0`}"
);

// 3. Add giftType to state and update gift form
if (!code.includes("const [giftType, setGiftType]")) {
  code = code.replace(
    "const [giftMessage, setGiftMessage] = useState('هدية لانك اشطر شطور من لجنة العقوبات');",
    "const [giftMessage, setGiftMessage] = useState('هدية لانك اشطر شطور من لجنة العقوبات');\n  const [giftType, setGiftType] = useState<'points'|'freeze'|'pardon'>('points');"
  );
}

// 4. Update the Gift creation object
const oldGift = `      const newGift: SupervisorGift = {
        id: Date.now().toString(),
        message: giftMessage,
        from: giftFrom || 'مشرفك',
        claimed: false,
        timestamp: Date.now()
      };`;

const newGift = `      const newGift: SupervisorGift = {
        id: Date.now().toString(),
        message: giftMessage,
        from: giftFrom || 'مشرفك',
        claimed: false,
        timestamp: Date.now(),
        giftType: giftType
      };`;
code = code.replace(oldGift, newGift);

// 5. Update the Gift form JSX
const oldGiftForm = `            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">اسم المرسل</label>
                <input 
                  type="text" 
                  value={giftFrom}
                  onChange={(e) => setGiftFrom(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">الرسالة المكتوبة</label>
                <textarea 
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500 transition-colors h-24 resize-none"
                />
              </div>
            </div>`;

const newGiftForm = `            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">نوع الهدية</label>
                <select 
                  value={giftType}
                  onChange={(e) => setGiftType(e.target.value as any)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500 transition-colors font-bold"
                >
                  <option value="points">مكافأة 300 نقطة ✨</option>
                  <option value="freeze">كرت تجميد الستريك 🧊</option>
                  <option value="pardon">كرت إعفاء من عقوبة 🛡️</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">اسم المرسل</label>
                <input 
                  type="text" 
                  value={giftFrom}
                  onChange={(e) => setGiftFrom(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">الرسالة المكتوبة</label>
                <textarea 
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500 transition-colors h-24 resize-none"
                />
              </div>
            </div>`;
if(!code.includes("نوع الهدية")) {
  code = code.replace(oldGiftForm, newGiftForm);
}

// 6. Fix wording about points in gift modal
code = code.replace(
  "سيتم إضافة 300 نقطة لحساب المستخدم بمجرد استلامها.",
  "سيتم إضافة الهدية المحددة لحساب المستخدم بمجرد استلامها."
);

fs.writeFileSync('src/components/SupervisorDashboard.tsx', code);
console.log("Patched SupervisorDashboard for 10 pts, avatar, and gift types");
