const fs = require('fs');

// 1. Update WalletModal.tsx
let walletCode = fs.readFileSync('src/components/WalletModal.tsx', 'utf8');

// Add imports
walletCode = walletCode.replace(
  "import { X, Search, Scale } from 'lucide-react';",
  "import { X, Search, Scale, Ticket, Star, Snowflake } from 'lucide-react';"
);

// Replace Immunity Emoji
walletCode = walletCode.replace(
  '<span className="text-2xl">🎫</span>',
  '<Ticket className="w-6 h-6" />'
);

// Replace Points/Freeze Emoji
walletCode = walletCode.replace(
  `<span className="text-2xl">{isPoints ? '🌟' : '🧊'}</span>`,
  `{isPoints ? <Star className="w-6 h-6 fill-current" /> : <Snowflake className="w-6 h-6" />}`
);

fs.writeFileSync('src/components/WalletModal.tsx', walletCode);

// 2. Update App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

// Add imports
appCode = appCode.replace(
  "import { BookOpen, Settings, X, AlertTriangle, RotateCcw, CheckCircle, HelpCircle, Trophy, Gift, Scale, Skull, Search } from 'lucide-react';",
  "import { BookOpen, Settings, X, AlertTriangle, RotateCcw, CheckCircle, HelpCircle, Trophy, Gift, Scale, Skull, Search, Ticket, Star, Snowflake } from 'lucide-react';"
);

// Replace Immunity Emoji in opened gift box
appCode = appCode.replace(
  '<span className="text-2xl">🎫</span>',
  '<Ticket className="w-6 h-6" />'
);

// Replace Points/Freeze Emoji in opened follow-up gift box
appCode = appCode.replace(
  `<span className="text-2xl">{outcome === 'points' ? '🌟' : '🧊'}</span>`,
  `{outcome === 'points' ? <Star className="w-6 h-6 fill-current" /> : <Snowflake className="w-6 h-6" />}`
);

fs.writeFileSync('src/App.tsx', appCode);

console.log("Emojis replaced with lucide-react icons");
