import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import LoginModal from './LoginModal';
import { supabase } from '../lib/supabase';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [hasNotifications, setHasNotifications] = useState(false);

  const checkNotifications = async () => {
    if (!user) return;
    try {
      const [contact, advertise, interests, reviews] = await Promise.all([
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
        supabase.from('advertise_messages').select('id', { count: 'exact', head: true }),
        supabase.from('car_interests').select('id', { count: 'exact', head: true }),
        supabase.from('reviews').select('id', { count: 'exact', head: true })
      ]);

      const totalCount = (contact.count || 0) + (advertise.count || 0) + (interests.count || 0) + (reviews.count || 0);
      localStorage.setItem('mge_current_total_count', totalCount.toString());
      const lastSeenCount = parseInt(localStorage.getItem('mge_last_seen_total_count') || '0');

      setHasNotifications(totalCount > lastSeenCount);
    } catch (err) {
      console.error('Error checking notifications:', err);
    }
  };

  useEffect(() => {
    checkNotifications();
    const interval = setInterval(checkNotifications, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  if (currentView === 'ADMIN_CREATE') {
    return <>{children}</>; // Admin layout is handled separately inside the view or a specific wrapper
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Bar */}
      <div className="bg-primary text-white py-2 hidden lg:block border-b border-blue-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-xs font-medium">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-accent">call</span>
              (21) 97922-5038
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-accent">mail</span>
              mgepersonalcar@gmail.com
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-accent">schedule</span>
              Seg - Sex: 08:00 - 17:00
            </span>
            <div className="flex items-center gap-3 ml-4 border-l border-blue-800 pl-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="bg-accent/20 text-accent px-2 py-0.5 rounded text-[10px] font-black uppercase">ADMIN</span>
                  <button onClick={() => {
                    onChangeView('ADMIN_CREATE');
                    const currentTotal = localStorage.getItem('mge_current_total_count') || '0';
                    localStorage.setItem('mge_last_seen_total_count', currentTotal);
                    setHasNotifications(false);
                  }} className="hover:text-accent font-bold">Painel</button>
                  <div className="relative flex items-center group cursor-pointer" onClick={() => {
                    onChangeView('ADMIN_CREATE');
                    const currentTotal = localStorage.getItem('mge_current_total_count') || '0';
                    localStorage.setItem('mge_last_seen_total_count', currentTotal);
                    setHasNotifications(false);
                  }}>
                    <span className="material-symbols-outlined text-lg hover:text-accent transition-colors">notifications</span>
                    {hasNotifications && (
                      <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-600 rounded-full border border-primary animate-pulse"></span>
                    )}
                  </div>
                  <button onClick={() => supabase.auth.signOut()} className="text-slate-400 hover:text-red-400 transition-colors">
                    <span className="material-symbols-outlined text-sm">logout</span>
                  </button>
                </div>
              ) : (
                <button onClick={() => setIsLoginModalOpen(true)} className="hover:text-accent flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">lock</span> Admin
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => onChangeView('ADMIN_CREATE')}
      />

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-white/10 shadow-lg transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => onChangeView('HOME')}>
              <img
                alt="MGE Personal Car Logo"
                className="h-10 w-auto object-contain"
                src="https://raw.githubusercontent.com/rk-fox/mge-pcar/refs/heads/main/public/logo-MGE.png"
              />
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              <button onClick={() => onChangeView('HOME')} className={`font-bold text-sm hover:text-accent transition-colors ${currentView === 'HOME' ? 'text-accent border-b-2 border-accent' : ''}`}>HOME</button>
              <button onClick={() => onChangeView('STOCK')} className={`font-bold text-sm hover:text-accent transition-colors ${currentView === 'STOCK' || currentView === 'DETAILS' ? 'text-accent border-b-2 border-accent' : ''}`}>CARROS DISPONÍVEIS</button>
              <button onClick={() => onChangeView('ADVERTISE')} className={`font-bold text-sm hover:text-accent transition-colors ${currentView === 'ADVERTISE' ? 'text-accent border-b-2 border-accent' : ''}`}>ANUNCIE AQUI</button>
              <button onClick={() => onChangeView('ABOUT')} className={`font-bold text-sm hover:text-accent transition-colors ${currentView === 'ABOUT' ? 'text-accent border-b-2 border-accent' : ''}`}>SOBRE</button>
            </nav>

            <div className="flex items-center gap-4">
              <button onClick={() => onChangeView('CONTACT')} className="bg-accent text-slate-900 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-yellow-500 hover:shadow-lg transition-all duration-300 transform active:scale-95 hidden md:block">
                CONTATO
              </button>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-accent border border-transparent dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              >
                <span className="material-symbols-outlined">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
              </button>
              <button className="md:hidden p-2 text-slate-700 dark:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <span className="material-symbols-outlined text-3xl">menu</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-white/10 px-4 py-4 space-y-4">
            <button onClick={() => { onChangeView('HOME'); setMobileMenuOpen(false); }} className="block w-full text-left font-bold text-sm hover:text-accent">HOME</button>
            <button onClick={() => { onChangeView('STOCK'); setMobileMenuOpen(false); }} className="block w-full text-left font-bold text-sm hover:text-accent">CARROS DISPONÍVEIS</button>
            <button onClick={() => { onChangeView('ADVERTISE'); setMobileMenuOpen(false); }} className="block w-full text-left font-bold text-sm hover:text-accent">ANUNCIE AQUI</button>
            <button onClick={() => { onChangeView('ABOUT'); setMobileMenuOpen(false); }} className="block w-full text-left font-bold text-sm hover:text-accent">SOBRE</button>
            <button onClick={() => { onChangeView('CONTACT'); setMobileMenuOpen(false); }} className="block w-full text-left font-bold text-sm hover:text-accent">CONTATO</button>
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-[#0a0a0a] text-white pt-16 pb-8 border-t-4 border-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div className="col-span-1 text-center md:text-left">
              <img
                alt="MGE White Logo"
                className="h-10 w-auto brightness-0 invert mb-6 mx-auto md:mx-0"
                src="/logo-MGE.png"
              />
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
                A MGE Personal Car é referência em consultoria automotiva e venda de veículos selecionados, oferecendo exclusividade, procedência e segurança em cada negociação.
              </p>
            </div>

            <div className="col-span-1 text-center md:text-left">
              <h4 className="font-display font-bold text-lg mb-8 relative inline-block">
                LINKS ÚTEIS
                <span className="absolute -bottom-2 left-0 w-8 h-1 bg-accent rounded-full"></span>
              </h4>
              <ul class="space-y-4 text-sm font-medium">
                <li><button onClick={() => onChangeView('HOME')} className="text-slate-400 hover:text-accent transition-colors">Início</button></li>
                <li><button onClick={() => onChangeView('STOCK')} className="text-slate-400 hover:text-accent transition-colors">Estoque Completo</button></li>
                <li><button onClick={() => onChangeView('ADVERTISE')} className="text-slate-400 hover:text-accent transition-colors">Venda seu Carro</button></li>
                <li><button onClick={() => onChangeView('ABOUT')} className="text-slate-400 hover:text-accent transition-colors">Sobre a MGE</button></li>
                <li><button onClick={() => onChangeView('CONTACT')} className="text-slate-400 hover:text-accent transition-colors">Fale Conosco</button></li>
              </ul>
            </div>

            <div className="col-span-1 text-center md:text-left">
              <h4 className="font-display font-bold text-lg mb-8 relative inline-block">
                INFORMAÇÕES
                <span className="absolute -bottom-2 left-0 w-8 h-1 bg-accent rounded-full"></span>
              </h4>
              <ul class="space-y-6 text-sm font-medium">
                <li className="flex items-center md:items-start gap-4 justify-center md:justify-start group">
                  <span className="material-symbols-outlined text-accent bg-white/5 p-2 rounded-lg group-hover:bg-accent group-hover:text-primary transition-colors">phone</span>
                  <div>
                    <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">Telefone / WhatsApp</span>
                    (21) 97922-5038
                  </div>
                </li>
                <li className="flex items-center md:items-start gap-4 justify-center md:justify-start group">
                  <span className="material-symbols-outlined text-accent bg-white/5 p-2 rounded-lg group-hover:bg-accent group-hover:text-primary transition-colors">email</span>
                  <div>
                    <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">E-mail</span>
                    mgepersonalcar@gmail.com
                  </div>
                </li>
                <li className="flex items-center md:items-start gap-4 justify-center md:justify-start group">
                  <span className="material-symbols-outlined text-accent bg-white/5 p-2 rounded-lg group-hover:bg-accent group-hover:text-primary transition-colors">location_on</span>
                  <div>
                    <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">Localização</span>
                    Rio de Janeiro - RJ
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
            <p>© 2024 MGE Personal Car. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/5521979225038"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all duration-300"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.628 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
        </svg>
      </a>
    </div>
  );
};

export default Layout;
