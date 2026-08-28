const fs = require('fs');
let code = fs.readFileSync('src/components/Auth.tsx', 'utf8');

// Replace export function Auth() with props
code = code.replace("export function Auth() {", `
interface AuthProps {
  onClose?: () => void;
}

export function Auth({ onClose }: AuthProps) {
`);

// Add X icon to imports
if (!code.includes("X,")) {
  code = code.replace("import { Mail, Lock, LogIn } from 'lucide-react';", "import { Mail, Lock, LogIn, X } from 'lucide-react';");
}

// Modify the return block to make it a fixed overlay and add the close button
const oldReturnStart = `<div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border-4 border-slate-100">`;

const newReturnStart = `<div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border-4 border-slate-100 relative">
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}`;

code = code.replace(oldReturnStart, newReturnStart);

fs.writeFileSync('src/components/Auth.tsx', code);
console.log("Updated Auth.tsx to act as a modal");
