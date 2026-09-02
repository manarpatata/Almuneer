const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add StoreModal import
if (!content.includes('StoreModal')) {
  content = content.replace(
    /import \{ WalletModal \} from '\.\/components\/WalletModal';/,
    "import { WalletModal } from './components/WalletModal';\nimport { StoreModal } from './components/StoreModal';"
  );
  content = content.replace(
    /import \{ BookOpen, Settings, Menu, X, AlertTriangle, RotateCcw, CheckCircle, HelpCircle, Trophy, Gift, Scale, Skull, Search, Shield, Star, Snowflake, FileText \}/,
    "import { BookOpen, Settings, Menu, X, AlertTriangle, RotateCcw, CheckCircle, HelpCircle, Trophy, Gift, Scale, Skull, Search, Shield, Star, Snowflake, FileText, ShoppingCart }"
  );
}

// 2. Add state
if (!content.includes('showStoreModal')) {
  content = content.replace(
    /const \[showWalletModal, setShowWalletModal\] = useState\(false\);/,
    "const [showWalletModal, setShowWalletModal] = useState(false);\n  const [showStoreModal, setShowStoreModal] = useState(false);"
  );
}

// 3. Add Store Button in Header (hidden md:flex)
content = content.replace(
  /<div className="flex gap-2 hidden md:flex">/,
  `<div className="flex gap-2 hidden md:flex">
              <button 
                onClick={() => setShowStoreModal(true)} 
                className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 hover:bg-indigo-100 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>`
);

// 4. Add Store Button in Header (mobile hidden md:flex)
content = content.replace(
  /<div className="flex flex-col md:hidden gap-1">/,
  `<div className="flex flex-col md:hidden gap-1">
              <button 
                onClick={() => setShowStoreModal(true)} 
                className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 hover:bg-indigo-100 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>`
);

// 5. Add StoreModal Component Render
if (!content.includes('<StoreModal')) {
  content = content.replace(
    /\{showWalletModal && \(/,
    `{showStoreModal && (
        <StoreModal
          user={user}
          points={currentScore + (state.points || 0)}
          onClose={() => setShowStoreModal(false)}
          showToast={(msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(''), 3000); }}
        />
      )}
      
      {showWalletModal && (`
  );
}

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx patched');
