const fs = require('fs');
let code = fs.readFileSync('src/components/SupervisorDashboard.tsx', 'utf8');

code = code.replace(
  "import { Users, Search, Gift, Skull, ShieldBan, X, AlertTriangle, ShieldCheck, ArrowRight, UserPlus, Trash2 } from 'lucide-react';",
  "import { Users, Search, Gift, Skull, ShieldBan, X, AlertTriangle, ShieldCheck, ArrowRight, UserPlus, Trash2 } from 'lucide-react';\nimport { calculateTotalScore } from '../utils';"
);

fs.writeFileSync('src/components/SupervisorDashboard.tsx', code);
console.log("Patched imports");
