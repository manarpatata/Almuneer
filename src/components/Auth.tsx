import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup 
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { Mail, Lock, LogIn, X } from 'lucide-react';


interface AuthProps {
  onClose?: () => void;
}

export function Auth({ onClose }: AuthProps) {

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Return Arabic error messages for common Firebase Auth errors
  const getArabicErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'البريد الإلكتروني مسجل مسبقاً.';
      case 'auth/invalid-email':
        return 'البريد الإلكتروني غير صالح.';
      case 'auth/weak-password':
        return 'كلمة المرور ضعيفة جداً (يجب أن تكون 6 أحرف على الأقل).';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'هذا الحساب غير مسجل أو كلمة المرور غير صحيحة. يرجى التأكد أو إنشاء حساب جديد.';
      case 'auth/too-many-requests':
        return 'تم حظر الحساب مؤقتاً بسبب كثرة المحاولات. يرجى المحاولة لاحقاً.';
      default:
        return 'حدث خطأ ما. يرجى المحاولة مرة أخرى.';
    }
  };

  // Handle email/password sign up and sign in
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      if (onClose) onClose();
    } catch (err: any) {
      setError(getArabicErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth sign in
  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      if (onClose) onClose();
    } catch (err: any) {
      setError(getArabicErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl w-full max-w-md border-4 border-slate-100 relative max-h-[90vh] overflow-y-auto">
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-800">
            {isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
          </h2>
          <p className="text-slate-500 mt-2 text-sm font-medium">
            {isSignUp ? 'أنشئ حسابك للبدء في تتبع إنجازاتك' : 'مرحباً بعودتك! سجل دخولك للمتابعة'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 pr-12 pl-4 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-left font-sans"
                placeholder="email@example.com"
                dir="ltr"
                required
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">كلمة المرور</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 pr-12 pl-4 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-left font-sans"
                placeholder="••••••••"
                dir="ltr"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-70 mt-2"
          >
            {loading ? 'الرجاء الانتظار...' : (isSignUp ? 'إنشاء حساب' : 'تسجيل الدخول')}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="h-px bg-slate-200 flex-1"></div>
          <span className="text-slate-400 text-sm font-bold">أو</span>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        <button 
          onClick={handleGoogleAuth}
          disabled={loading}
          className="mt-6 w-full bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-3 shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          المتابعة باستخدام جوجل
        </button>

        <p className="mt-8 text-center text-slate-600 text-sm font-medium">
          {isSignUp ? 'لديك حساب بالفعل؟' : 'ليس لديك حساب؟'}
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-indigo-600 font-bold mr-2 hover:underline focus:outline-none"
          >
            {isSignUp ? 'تسجيل الدخول' : 'إنشاء حساب'}
          </button>
        </p>
      </div>
    </div>
  );
}
