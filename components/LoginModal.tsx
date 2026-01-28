import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (loginError) {
            setError('Credenciais inválidas. Tente novamente.');
            setLoading(false);
        } else {
            onLoginSuccess();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-[#1a1a1a] w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-white/5 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:opacity-20 transition-opacity"></div>

                <div className="p-8 md:p-12 relative z-10">
                    <div className="flex justify-between items-center mb-10">
                        <img src="./logo-MGE.png" alt="MGE Logo" className="h-8 w-auto" />
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <h2 className="font-display text-3xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter italic">
                        Área <span className="text-accent underline decoration-primary decoration-4 underline-offset-4">RESTREITA</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-10">Acesso exclusivo para administradores MGE.</p>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">ID Email</label>
                            <div className="relative group/input">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-accent transition-colors">person</span>
                                <input
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:ring-2 focus:ring-accent dark:text-white font-bold transition-all text-sm outline-none"
                                    placeholder="admin@mge.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Senha</label>
                            <div className="relative group/input">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-accent transition-colors">lock</span>
                                <input
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:ring-2 focus:ring-accent dark:text-white font-bold transition-all text-sm outline-none"
                                    placeholder="••••••••"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-xs font-bold animate-in slide-in-from-top-2">
                                <span className="material-symbols-outlined text-sm">error</span>
                                {error}
                            </div>
                        )}

                        <button
                            disabled={loading}
                            className="w-full bg-primary hover:bg-slate-800 text-white font-black py-5 rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 uppercase tracking-[0.2em] text-sm mt-4 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-sm">login</span>
                                    AUTENTICAR
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
