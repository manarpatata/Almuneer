const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const newImports = `import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import { Auth } from './components/Auth';`;

code = code.replace(
  "import { BookOpen, Settings, X, AlertTriangle, RotateCcw, CheckCircle, HelpCircle, Trophy, Gift, Scale, Skull, Search, Shield, Star, Snowflake } from 'lucide-react';",
  "import { BookOpen, Settings, X, AlertTriangle, RotateCcw, CheckCircle, HelpCircle, Trophy, Gift, Scale, Skull, Search, Shield, Star, Snowflake } from 'lucide-react';\n" + newImports
);

const stateInitStart = "export default function App() {\n  const [state, setState] = useState<AppState>(() => {";
const authStateInit = `export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const [state, setState] = useState<AppState>(() => {`;

code = code.replace(stateInitStart, authStateInit);

const returnStart = "return (";
const newReturnStart = `  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
        <div className="text-xl font-bold text-slate-700 animate-pulse flex items-center gap-3">
          <div className="w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          جارٍ التحميل...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (`;

code = code.replace("  return (", newReturnStart);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx with auth");
