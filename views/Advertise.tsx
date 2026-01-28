import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const Advertise: React.FC = () => {
    const [semPendencia, setSemPendencia] = useState(true);
    const [pendencias, setPendencias] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const togglePendencia = (pendencia: string) => {
        if (pendencias.includes(pendencia)) {
            setPendencias(pendencias.filter(p => p !== pendencia));
        } else {
            setPendencias([...pendencias, pendencia]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            nome_completo: formData.get('nome_completo') as string,
            telefone: formData.get('telefone') as string,
            marca: formData.get('marca') as string,
            ano_fabricacao: parseInt(formData.get('ano_fabricacao') as string) || null,
            modelo: formData.get('modelo') as string,
            ano_modelo: parseInt(formData.get('ano_modelo') as string) || null,
            cor: formData.get('cor') as string,
            quilometragem: parseInt(formData.get('quilometragem') as string) || null,
            possui_pendencia: !semPendencia,
            pendencias: pendencias
        };

        const { error } = await supabase.from('advertise_messages').insert([data]);

        if (error) {
            alert('Erro ao enviar proposta: ' + error.message);
        } else {
            setSubmitted(true);
        }
        setLoading(false);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen">
            <section className="relative min-h-[60vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        alt="Carros de luxo"
                        className="w-full h-full object-cover scale-105"
                        src="https://raw.githubusercontent.com/rk-fox/mge-pcar/refs/heads/main/public/capa-youtube.png"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent dark:from-black dark:via-black/80"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 pt-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent font-bold text-xs mb-6 tracking-widest uppercase">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                            </span>
                            Consultoria Exclusiva
                        </div>
                        <h1 className="font-display text-5xl md:text-7xl font-black text-white mb-6 uppercase leading-[0.9] tracking-tighter">
                            Anuncie <br />
                            <span className="text-accent drop-shadow-[0_2px_10px_rgba(250,204,21,0.3)]">Seu Veículo</span>
                        </h1>
                        <p className="text-slate-300 text-lg md:text-xl max-w-xl leading-relaxed font-medium">
                            A MGE Personal Car oferece a melhor consultoria para você vender seu carro com rapidez, segurança e valorização de mercado.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24 relative z-10 -mt-10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-white dark:bg-card-dark p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-white/5">
                                <h3 className="font-display text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
                                    <span className="material-symbols-outlined text-primary text-3xl">verified</span> Por que conosco?
                                </h3>
                                <ul className="space-y-6">
                                    <li className="flex gap-4">
                                        <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg h-fit text-primary"><span className="material-symbols-outlined">analytics</span></div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white">Avaliação Real</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Análise técnica detalhada seguindo padrões de mercado.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg h-fit text-primary"><span className="material-symbols-outlined">photo_camera</span></div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white">Fotos Profissionais</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Destaque seu veículo com as melhores imagens para o anúncio.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg h-fit text-primary"><span className="material-symbols-outlined">security</span></div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white">Segurança Total</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Garantimos a idoneidade de todo o processo de venda.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-card-dark p-8 md:p-12 rounded-2xl shadow-xl border border-slate-100 dark:border-white/5">
                                <h2 className="font-display text-3xl font-bold mb-8 text-slate-900 dark:text-white">Preencha os dados do veículo</h2>

                                {submitted ? (
                                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 p-10 rounded-3xl text-center space-y-6 animate-in zoom-in-95 duration-500">
                                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/20">
                                            <span className="material-symbols-outlined text-white text-4xl">check_circle</span>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-green-800 dark:text-green-400 uppercase tracking-tighter">Proposta Recebida!</h3>
                                            <p className="text-green-600 dark:text-green-500/80 font-bold mt-2">Em breve nossa equipe entrará em contato com você.</p>
                                        </div>
                                        <button
                                            onClick={() => setSubmitted(false)}
                                            className="text-green-800 dark:text-green-400 text-sm font-black underline underline-offset-4 hover:text-green-600 transition-colors"
                                        >
                                            ENVIAR OUTRO VEÍCULO
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="md:col-span-2">
                                                <h3 className="text-primary font-bold text-sm uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/10 pb-2">Seus Contatos</h3>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Nome Completo</label>
                                                <input name="nome_completo" required className="w-full bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary dark:text-white" placeholder="Ex: João Silva" type="text" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Telefone/WhatsApp</label>
                                                <input name="telefone" required className="w-full bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary dark:text-white" placeholder="(21) 99999-9999" type="tel" />
                                            </div>
                                            <div className="md:col-span-2 mt-4">
                                                <h3 className="text-primary font-bold text-sm uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/10 pb-2">Sobre o Veículo</h3>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Marca</label>
                                                <input name="marca" className="w-full bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary dark:text-white" placeholder="Ex: BMW" type="text" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Modelo</label>
                                                <input name="modelo" className="w-full bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary dark:text-white" placeholder="Ex: 320i" type="text" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Ano de Fabricação</label>
                                                <input name="ano_fabricacao" className="w-full bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary dark:text-white" placeholder="Ex: 2017" type="text" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Ano do Modelo</label>
                                                <input name="ano_modelo" className="w-full bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary dark:text-white" placeholder="Ex: 2017" type="text" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Cor</label>
                                                <input name="cor" className="w-full bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary dark:text-white" placeholder="Ex: Preto" type="text" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Quilometragem</label>
                                                <input name="quilometragem" className="w-full bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary dark:text-white" placeholder="Ex: 12000" type="text" />
                                            </div>

                                            <div className="space-y-4 col-span-2 mt-4 pt-4 border-t border-slate-100 dark:border-white/10">
                                                <label className="text-sm font-bold text-primary dark:text-accent uppercase tracking-widest">
                                                    Alguma pendência documental ou financeira?
                                                </label>

                                                <div className="flex flex-wrap gap-8 p-4 bg-slate-50 dark:bg-background-dark rounded-xl border border-slate-100 dark:border-white/5">
                                                    {/* OPÇÕES DE RÁDIO */}
                                                    <div className="flex gap-6 border-r border-slate-200 dark:border-white/10 pr-6">
                                                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 cursor-pointer group">
                                                            <input
                                                                type="radio"
                                                                name="possui_pendencia"
                                                                checked={semPendencia}
                                                                onChange={() => {
                                                                    setSemPendencia(true);
                                                                    setPendencias([]);
                                                                }}
                                                                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                            />
                                                            Nenhuma
                                                        </label>

                                                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 cursor-pointer group">
                                                            <input
                                                                type="radio"
                                                                name="possui_pendencia"
                                                                checked={!semPendencia}
                                                                onChange={() => setSemPendencia(false)}
                                                                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                            />
                                                            Sim, possui
                                                        </label>
                                                    </div>

                                                    {/* CHECKBOXES (Habilitados apenas se semPendencia for falso) */}
                                                    <div className={`flex flex-wrap gap-6 transition-opacity duration-300 ${semPendencia ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                                                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={pendencias.includes('multa')}
                                                                onChange={() => togglePendencia('multa')}
                                                                disabled={semPendencia}
                                                                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                            />
                                                            Multas
                                                        </label>

                                                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={pendencias.includes('financiamento')}
                                                                onChange={() => togglePendencia('financiamento')}
                                                                disabled={semPendencia}
                                                                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                            />
                                                            Financiamento
                                                        </label>

                                                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={pendencias.includes('outro')}
                                                                onChange={() => togglePendencia('outro')}
                                                                disabled={semPendencia}
                                                                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                            />
                                                            Outros
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            disabled={loading}
                                            className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                                            type="submit"
                                        >
                                            {loading ? (
                                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined">send</span> ENVIAR PROPOSTA DE ANÚNCIO
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Advertise;
