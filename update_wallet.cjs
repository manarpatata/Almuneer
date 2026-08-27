const fs = require('fs');

// 1. Update WalletModal.tsx
let walletCode = fs.readFileSync('src/components/WalletModal.tsx', 'utf8');

// Import Shield instead of Ticket
walletCode = walletCode.replace(
  "import { X, Search, Scale, Ticket, Star, Snowflake } from 'lucide-react';",
  "import { X, Search, Scale, Shield, Star, Snowflake } from 'lucide-react';"
);

// Add useState to WalletModal
walletCode = walletCode.replace(
  "export function WalletModal({ immunityCards, freezeCards, pointsCards, onClose }: WalletModalProps) {",
  `export function WalletModal({ immunityCards, freezeCards, pointsCards, onClose }: WalletModalProps) {
  const [activeCard, setActiveCard] = React.useState<number | null>(null);`
);

// Reverse the array order conceptually so "points" (often oldest if we assume immunity is newest) or just keep it.
// Actually, let's make the visual stacking Z-Index handle the "oldest to newest" stack appearance.
// Replace zIndex calculation
walletCode = walletCode.replace(
  "const zIndex = cards.length - idx;",
  "const zIndex = activeCard === idx ? 100 : idx;"
);

// Add onClick to Immunity Card
walletCode = walletCode.replace(
  `className="bg-yellow-50 border-[6px] border-yellow-400 rounded-xl p-5 shadow-2xl relative flex flex-col items-center justify-center text-center transform hover:-translate-y-4 hover:scale-105 transition-transform cursor-pointer h-48 overflow-hidden shrink-0 w-full max-w-[280px] -mt-24 first:mt-0 group hover:!z-50"`,
  `onClick={() => setActiveCard(idx)} className="bg-yellow-50 border-[6px] border-yellow-400 rounded-xl p-5 shadow-2xl relative flex flex-col items-center justify-center text-center transform hover:-translate-y-4 transition-transform cursor-pointer h-48 overflow-hidden shrink-0 w-full max-w-[280px] -mt-24 first:mt-0 group hover:scale-105"`
);

// Add onClick to Points/Freeze Card
walletCode = walletCode.replace(
  `className="bg-indigo-50 border-[6px] border-indigo-400 rounded-xl p-5 shadow-2xl relative flex flex-col items-center justify-center text-center transform hover:-translate-y-4 hover:scale-105 transition-transform cursor-pointer h-48 overflow-hidden shrink-0 w-full max-w-[280px] -mt-24 first:mt-0 group hover:!z-50"`,
  `onClick={() => setActiveCard(idx)} className="bg-indigo-50 border-[6px] border-indigo-400 rounded-xl p-5 shadow-2xl relative flex flex-col items-center justify-center text-center transform hover:-translate-y-4 transition-transform cursor-pointer h-48 overflow-hidden shrink-0 w-full max-w-[280px] -mt-24 first:mt-0 group hover:scale-105"`
);

// Replace Ticket with Shield in Immunity card
walletCode = walletCode.replace(
  /<Ticket className="w-6 h-6" \/>/g,
  '<Shield className="w-6 h-6" />'
);

fs.writeFileSync('src/components/WalletModal.tsx', walletCode);

// 2. Update App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

// Replace Ticket with Shield in imports
appCode = appCode.replace(
  "import { BookOpen, Settings, X, AlertTriangle, RotateCcw, CheckCircle, HelpCircle, Trophy, Gift, Scale, Skull, Search, Ticket, Star, Snowflake } from 'lucide-react';",
  "import { BookOpen, Settings, X, AlertTriangle, RotateCcw, CheckCircle, HelpCircle, Trophy, Gift, Scale, Skull, Search, Shield, Star, Snowflake } from 'lucide-react';"
);

// Replace Ticket with Shield in App
appCode = appCode.replace(
  /<Ticket className="w-6 h-6" \/>/g,
  '<Shield className="w-6 h-6" />'
);

fs.writeFileSync('src/App.tsx', appCode);

console.log("Updated Wallet functionality and Shield icon");
