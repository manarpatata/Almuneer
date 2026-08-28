import React, { useState, useRef, useEffect } from 'react';
import { User, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { LogOut, LogIn, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileMenuProps {
  user: User | null;
  onLogin: () => void;
}

export function ProfileMenu({ user, onLogin }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 shadow-sm border-2 border-slate-200 hover:border-emerald-500 transition-colors shrink-0 overflow-hidden"
      >
        {user?.photoURL ? (
          <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <UserIcon className="w-6 h-6 md:w-7 md:h-7" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-[100]"
          >
            {user ? (
              <>
                <div className="px-4 py-2 border-b border-slate-100 mb-2">
                  <p className="text-sm font-bold text-slate-800 truncate">{user.displayName || 'مستخدم'}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-right px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogin();
                }}
                className="w-full text-right px-4 py-2 text-sm font-bold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                تسجيل الدخول
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
