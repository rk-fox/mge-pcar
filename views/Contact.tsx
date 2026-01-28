import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const Contact: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            nome_completo: formData.get('nome_completo') as string,
            email: formData.get('email') as string,
            mensagem: formData.get('mensagem') as string
        };

        const { error } = await supabase.from('contact_messages').insert([data]);

        if (error) {
            alert('Erro ao enviar mensagem: ' + error.message);
        } else {
            setSubmitted(true);
        }
        setLoading(false);
    };
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen">
            <section className="relative h-[40vh] min-h-[300px] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        alt="Background"
                        className="w-full h-full object-cover scale-105"
                        src="https://raw.githubusercontent.com/rk-fox/mge-pcar/refs/heads/main/public/capa-youtube.png"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent dark:from-black dark:via-black/80"></div>
                </div>
                <div className="container mx-auto px-4 md:px-8 relative z-10 pt-10 text-center md:text-left">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent font-black text-[10px] mb-4 tracking-[0.2em] uppercase">
                            Canais de Atendimento
                        </div>
                        <h1 className="font-display text-4xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter leading-none">
                            VAMOS <br />
                            <span className="text-accent underline decoration-primary decoration-8 underline-offset-[-2px]">CONVERSAR.</span>
                        </h1>
                        <p className="text-slate-300 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">Nossa equipe de especialistas está pronta para oferecer um atendimento exclusivo e personalizado.</p>
                    </div>
                </div>
            </section>

            <section className="py-24 relative z-20">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        <div className="lg:col-span-7">
                            <div className="bg-white dark:bg-card-dark p-6 md:p-8 lg:p-12 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-5 rounded-full -mr-10 -mt-10 blur-3xl group-hover:opacity-10 transition-opacity"></div>
                                <div className="relative z-10">
                                    <h2 className="font-display text-4xl font-black mb-10 text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Envie uma <br /><span className="text-primary dark:text-accent">Mensagem</span></h2>

                                    {submitted ? (
                                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 p-10 rounded-3xl text-center space-y-6 animate-in zoom-in-95 duration-500">
                                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/20">
                                                <span className="material-symbols-outlined text-white text-4xl">check_circle</span>
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-green-800 dark:text-green-400 uppercase tracking-tighter">Mensagem Enviada!</h3>
                                                <p className="text-green-600 dark:text-green-500/80 font-bold mt-2">Obrigado por entrar em contato. Responderemos o mais breve possível.</p>
                                            </div>
                                            <button
                                                onClick={() => setSubmitted(false)}
                                                className="text-green-800 dark:text-green-400 text-sm font-black underline underline-offset-4 hover:text-green-600 transition-colors"
                                            >
                                                ENVIAR OUTRA MENSAGEM
                                            </button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Nome Completo</label>
                                                <input name="nome_completo" required className="w-full bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary dark:text-white font-bold transition-all text-sm" placeholder="Seu nome" type="text" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Seu E-mail</label>
                                                <input name="email" required className="w-full bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary dark:text-white font-bold transition-all text-sm" placeholder="exemplo@email.com" type="email" />
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Sua Mensagem</label>
                                                <textarea name="mensagem" required className="w-full bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary dark:text-white font-bold transition-all text-sm resize-none" placeholder="O que você procura?" rows={5}></textarea>
                                            </div>
                                            <button
                                                disabled={loading}
                                                className="md:col-span-2 w-full bg-primary hover:bg-blue-800 text-white font-black py-5 rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 uppercase tracking-[0.2em] text-sm mt-4 disabled:opacity-50"
                                            >
                                                {loading ? (
                                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                                                ) : (
                                                    "ENVIAR AGORA"
                                                )}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-5 flex flex-col gap-8">
                            <div className="bg-slate-900 text-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                                <div className="absolute bottom-0 right-0 w-40 h-40 bg-accent opacity-10 rounded-full -mb-10 -mr-10 blur-3xl"></div>
                                <h3 className="font-display text-2xl font-black mb-8 uppercase tracking-tighter">Fale Diretamente</h3>
                                <div className="space-y-8">
                                    <div className="flex items-center gap-6 group/item">
                                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover/item:bg-accent group-hover/item:text-slate-900 transition-all duration-300">
                                            <span className="material-symbols-outlined text-3xl">call</span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">WhatsApp</p>
                                            <p className="text-xl font-black tracking-tight">(21) 97922-5038</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 group/item">
                                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover/item:bg-accent group-hover/item:text-slate-900 transition-all duration-300">
                                            <span className="material-symbols-outlined text-3xl">mail</span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">E-mail</p>
                                            <p className="text-xl font-black tracking-tight">mgepersonalcar@gmail.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 group/item">
                                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover/item:bg-accent group-hover/item:text-slate-900 transition-all duration-300">
                                            <span className="material-symbols-outlined text-3xl">schedule</span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Atendimento</p>
                                            <p className="text-xl font-black tracking-tight">Seg a Sex • 08h às 17h</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-accent/10 p-10 rounded-[2.5rem] border-2 border-accent/20 flex flex-col justify-center items-center text-center">
                                <span className="material-symbols-outlined text-primary text-5xl mb-4 font-black">location_on</span>
                                <h4 className="font-display font-black text-slate-900 dark:text-white uppercase tracking-tighter text-xl mb-2">Visita Presencial</h4>
                                <p className="text-slate-600 dark:text-slate-400 font-bold">Rio de Janeiro, RJ <br /> <span className="text-xs uppercase tracking-widest text-primary/60 dark:text-accent/60 mt-1 block">Agendamento prévio necessário</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
