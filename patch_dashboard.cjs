const fs = require('fs');
let content = fs.readFileSync('src/components/SupervisorDashboard.tsx', 'utf8');

if (!content.includes('import SignatureCanvas from')) {
    content = content.replace(
        /import React, \{ useState, useEffect \} from 'react';/,
        "import React, { useState, useEffect, useRef } from 'react';\nimport SignatureCanvas from 'react-signature-canvas';"
    );
}

// Add signature state and ref
if (!content.includes('const [punishSignature, setPunishSignature] = useState(')) {
    content = content.replace(
        /const \[punishSender, setPunishSender\] = useState\('المشرف'\);/,
        `const [punishSender, setPunishSender] = useState('المشرف');
  const [punishSignature, setPunishSignature] = useState('');
  const sigCanvasRef = useRef<SignatureCanvas>(null);`
    );
}

// Update handleSendPunishment to use the signature and clear it
content = content.replace(
  /sender: punishSender \|\| 'المشرف',/,
  `sender: punishSender || 'المشرف',
          signature: punishSignature,`
);

content = content.replace(
  /setPunishSender\('المشرف'\);\s*setShowPunishModal\(false\);/,
  `setPunishSender('المشرف');
      setPunishSignature('');
      setShowPunishModal(false);`
);

// We should also clear it when modal is opened, but updating the state is fine. Let's add the UI.
const uiReplacement = `              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">توقيع المشرف</label>
                <div className="border-2 border-amber-200 rounded-xl bg-amber-50 overflow-hidden relative">
                  <SignatureCanvas 
                    ref={sigCanvasRef}
                    penColor="#b91c1c"
                    canvasProps={{className: "w-full h-24", style: { cursor: 'crosshair' }}}
                    onEnd={() => {
                      if (sigCanvasRef.current) {
                        setPunishSignature(sigCanvasRef.current.toDataURL());
                      }
                    }}
                  />
                  <button 
                    onClick={() => {
                      if (sigCanvasRef.current) {
                        sigCanvasRef.current.clear();
                        setPunishSignature('');
                      }
                    }}
                    className="absolute top-2 left-2 bg-white/80 p-1 text-xs font-bold text-amber-700 rounded shadow-sm hover:bg-white"
                  >
                    مسح
                  </button>
                </div>
              </div>
            </div>`;

content = content.replace(/<\/div>\s*<div className="flex items-center justify-end gap-3">/g, uiReplacement + '\n            <div className="flex items-center justify-end gap-3">');

fs.writeFileSync('src/components/SupervisorDashboard.tsx', content);
console.log('Dashboard Patched');
