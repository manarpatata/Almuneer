const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('const [activeTab, setActiveTab] = useState')) {
    code = code.replace(
        "const [showDashboard, setShowDashboard] = useState(false);",
        "const [showDashboard, setShowDashboard] = useState(false);\n  const [activeTab, setActiveTab] = useState<'home' | 'lessons'>('home');"
    );
}

// Add the tabs UI right under header
code = code.replace(
    "</header>",
    `</header>\n\n      <div className="flex gap-2 p-2 bg-slate-200/50 rounded-xl max-w-sm mx-auto mt-4 shrink-0">\n        <button onClick={() => setActiveTab('home')} className={\`flex-1 py-2 rounded-lg font-bold transition-all \${activeTab === 'home' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:bg-slate-200'}\`}>الرئيسية</button>\n        <button onClick={() => setActiveTab('lessons')} className={\`flex-1 py-2 rounded-lg font-bold transition-all \${activeTab === 'lessons' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:bg-slate-200'}\`}>الدروس</button>\n      </div>`
);

fs.writeFileSync('src/App.tsx', code);
