import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Car } from '../types';

interface CarDetailsProps {
    car: Car;
}

const CarDetails: React.FC<CarDetailsProps> = ({ car }) => {
    // Combine main image with secondary images, ensuring no duplicates if main is already in secondary
    const gallery = [car.image, ...(car.images || [])].filter((url, index, self) => url && self.indexOf(url) === index);
    const [selectedImage, setSelectedImage] = useState(car.image || (car.images && car.images.length > 0 ? car.images[0] : '/logo-MGE.png'));
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [interestForm, setInterestForm] = useState({
        nome: '',
        email: '',
        whatsapp: ''
    });

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInterestForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleInterestSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const { error } = await supabase
            .from('car_interests')
            .insert([{
                car_id: car.id,
                car_name: `${car.brand} ${car.model}`,
                nome: interestForm.nome,
                email: interestForm.email,
                whatsapp: interestForm.whatsapp
            }]);

        if (error) {
            alert('Erro ao enviar interesse: ' + error.message);
        } else {
            setSubmitted(true);
            setInterestForm({ nome: '', email: '', whatsapp: '' });
        }
        setIsSubmitting(false);
    };

    const currentIndex = gallery.indexOf(selectedImage);

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        const nextIndex = (currentIndex + 1) % gallery.length;
        setSelectedImage(gallery[nextIndex]);
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        const prevIndex = (currentIndex - 1 + gallery.length) % gallery.length;
        setSelectedImage(gallery[prevIndex]);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen py-12">
            {/* Fullscreen Modal */}
            {isFullscreen && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 animate-fade-in"
                    onClick={() => setIsFullscreen(false)}
                >
                    <button className="absolute top-8 right-8 text-white hover:text-accent font-black z-[110] flex items-center gap-2 uppercase tracking-widest text-sm">
                        <span className="material-symbols-outlined text-4xl">close</span>
                    </button>

                    <button
                        onClick={handlePrev}
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center backdrop-blur-xl transition-all hover:scale-110 z-[110] border border-white/10"
                    >
                        <span className="material-symbols-outlined text-4xl md:text-5xl">chevron_left</span>
                    </button>

                    <img
                        src={selectedImage}
                        alt="Visualização Full"
                        className="max-w-full max-h-full object-contain shadow-2xl rounded-xl animate-in zoom-in-95 duration-300"
                    />

                    <button
                        onClick={handleNext}
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center backdrop-blur-xl transition-all hover:scale-110 z-[110] border border-white/10"
                    >
                        <span className="material-symbols-outlined text-4xl md:text-5xl">chevron_right</span>
                    </button>
                </div>
            )}

            <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 text-left">
                {/* Breadcrumb */}
                <nav className="flex mb-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <span className="hover:text-primary cursor-pointer transition-colors">Estoque</span>
                    <span className="mx-3 text-slate-300">/</span>
                    <span className="text-slate-900 dark:text-white">{car.brand} {car.model}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Gallery */}
                        <div className="space-y-6">
                            <div className="relative group">
                                <div
                                    onClick={() => setIsFullscreen(true)}
                                    className="aspect-[16/9] w-full rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-2xl border-8 border-white dark:border-white/5 cursor-zoom-in relative"
                                >
                                    <div
                                        className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                                        style={{ backgroundImage: `url(${selectedImage})` }}
                                    ></div>

                                    {/* Overlay Gradient for discrete buttons */}
                                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                                    {/* Discreet Nav Buttons */}
                                    <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={handlePrev}
                                            className="bg-white/90 dark:bg-slate-900/90 hover:bg-primary hover:text-white text-slate-900 dark:text-white w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110"
                                        >
                                            <span className="material-symbols-outlined font-black">arrow_back</span>
                                        </button>
                                        <button
                                            onClick={handleNext}
                                            className="bg-white/90 dark:bg-slate-900/90 hover:bg-primary hover:text-white text-slate-900 dark:text-white w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110"
                                        >
                                            <span className="material-symbols-outlined font-black">arrow_forward</span>
                                        </button>
                                    </div>

                                    {/* Zoom Hint */}
                                    <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 border border-white/10">
                                        <span className="material-symbols-outlined text-sm">zoom_in</span>
                                        Clique para ampliar
                                    </div>
                                </div>
                            </div>

                            {/* Thumbnails */}
                            {gallery.length > 1 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4 px-2">
                                    {gallery.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(img)}
                                            className={`aspect-[16/9] rounded-2xl overflow-hidden border-2 cursor-pointer bg-cover bg-center shadow-lg transition-all hover:scale-105 ${selectedImage === img ? 'border-primary ring-4 ring-primary/20 scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                            style={{ backgroundImage: `url(${img})` }}
                                        ></button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Info Card */}
                        <div className="bg-white dark:bg-card-dark border border-slate-100 dark:border-white/5 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-5 rounded-full -mr-10 -mt-10 blur-3xl"></div>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-[10px] uppercase font-black tracking-widest">Procedência Garantida</span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                        <span className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">{car.fuel}</span>
                                    </div>
                                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white mb-2 uppercase leading-none">{car.brand} <span className="text-primary dark:text-accent">{car.model}</span></h1>
                                    <p className="text-slate-500 dark:text-slate-400 font-bold text-lg tracking-tight uppercase">
                                        {car.version} • {car.year_fab} Mod. {car.year_mod}
                                    </p>
                                </div>
                                <div className="text-left md:text-right w-full md:w-auto bg-slate-50 dark:bg-white/5 p-6 rounded-2xl border border-slate-100 dark:border-white/10">
                                    <p className="text-primary dark:text-accent text-5xl font-black leading-none tracking-tighter mb-1">R$ {car.price.toLocaleString('pt-BR')}</p>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Oportunidade Exclusiva</p>
                                </div>
                            </div>
                        </div>

                        {/* Specs */}
                        <section className="space-y-6 px-4">
                            <div className="flex items-center gap-4">
                                <div className="h-px flex-1 bg-slate-200 dark:bg-white/10"></div>
                                <h3 className="text-xs font-black flex items-center gap-3 text-slate-400 uppercase tracking-[0.3em]">
                                    <span className="material-symbols-outlined text-primary text-xl">analytics</span>
                                    Ficha Técnica
                                </h3>
                                <div className="h-px flex-1 bg-slate-200 dark:bg-white/10"></div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="bg-white dark:bg-card-dark border border-slate-100 dark:border-white/5 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow group">
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">Quilometragem</p>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{car.mileage.toLocaleString()} <span className="text-xs text-slate-400 font-medium tracking-normal">km</span></p>
                                </div>
                                <div className="bg-white dark:bg-card-dark border border-slate-100 dark:border-white/5 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow group">
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">Transmissão</p>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{car.transmission}</p>
                                </div>
                                <div className="bg-white dark:bg-card-dark border border-slate-100 dark:border-white/5 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow group">
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">Cor Externa</p>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{car.color}</p>
                                </div>
                                <div className="bg-white dark:bg-card-dark border border-slate-100 dark:border-white/5 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow group">
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">Final de Placa</p>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">7</p>
                                </div>
                            </div>
                        </section>

                        {/* Description & Features */}
                        <section className="grid grid-cols-1 md:grid-cols-12 gap-10 px-4">
                            <div className="md:col-span-12">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-6">Diferenciais do Veículo</h3>
                                <div className="bg-white dark:bg-card-dark border border-slate-100 dark:border-white/5 p-10 rounded-[2.5rem] shadow-xl">
                                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg font-medium mb-10">{car.description}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {car.features.map((feat, i) => (
                                            <div key={i} className="flex items-center gap-4 group">
                                                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center group-hover:bg-green-500 transition-colors">
                                                    <span className="material-symbols-outlined text-green-600 group-hover:text-white text-base font-black">check</span>
                                                </div>
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column (Form) */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-28 space-y-8">
                            <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-white/5">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                                <div className="relative z-10">
                                    <h4 className="text-3xl font-black mb-2 uppercase tracking-tighter leading-none">Tenho <br /><span className="text-accent">Interesse</span></h4>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">Consultoria Personalizada</p>
                                    {submitted ? (
                                        <div className="bg-green-500/10 border border-green-500/20 p-8 rounded-3xl text-center animate-in fade-in zoom-in duration-500">
                                            <span className="material-symbols-outlined text-green-500 text-5xl mb-4">check_circle</span>
                                            <h5 className="text-xl font-black uppercase tracking-tight text-white mb-2">Proposta Enviada!</h5>
                                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest leading-relaxed">Em breve um de nossos consultores entrará em contato com você.</p>
                                            <button
                                                onClick={() => setSubmitted(false)}
                                                className="mt-6 text-accent text-[10px] font-black uppercase tracking-widest hover:underline"
                                            >
                                                Enviar Nova Mensagem
                                            </button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleInterestSubmit} className="space-y-5">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Seu Nome</label>
                                                <input
                                                    name="nome"
                                                    value={interestForm.nome}
                                                    onChange={handleFormChange}
                                                    required
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl text-white text-sm p-4 focus:ring-2 focus:ring-accent transition-all font-bold"
                                                    placeholder="Digite seu nome completo"
                                                    type="text"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">E-mail</label>
                                                <input
                                                    name="email"
                                                    value={interestForm.email}
                                                    onChange={handleFormChange}
                                                    required
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl text-white text-sm p-4 focus:ring-2 focus:ring-accent transition-all font-bold"
                                                    placeholder="seu@email.com"
                                                    type="email"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">WhatsApp</label>
                                                <input
                                                    name="whatsapp"
                                                    value={interestForm.whatsapp}
                                                    onChange={handleFormChange}
                                                    required
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl text-white text-sm p-4 focus:ring-2 focus:ring-accent transition-all font-bold"
                                                    placeholder="(21) 99999-9999"
                                                    type="tel"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full bg-accent hover:bg-yellow-500 text-slate-900 font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-sm transition-all shadow-2xl shadow-accent/20 transform hover:scale-[1.02] active:scale-95 mt-4 disabled:opacity-50"
                                            >
                                                {isSubmitting ? 'Enviando...' : 'Enviar Proposta'}
                                            </button>
                                        </form>
                                    )}

                                    <div className="mt-10 pt-10 border-t border-white/5 space-y-4">
                                        <a
                                            href={`https://wa.me/5521979225038?text=Olá, tenho interesse no ${car.brand} ${car.model} ${car.year_fab}/${car.year_mod}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-full bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 border border-[#25D366]/20"
                                        >
                                            <span className="material-symbols-outlined text-lg font-black">chat</span> Chamar no WhatsApp
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-primary/5 dark:bg-accent/5 p-8 rounded-[2.5rem] border-2 border-primary/10 dark:border-accent/10 text-center">
                                <span className="material-symbols-outlined text-primary dark:text-accent text-4xl mb-3 font-black">verified_user</span>
                                <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-tight text-sm">Garantia de Procedência</h5>
                                <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Todos os nossos veículos passam por <br /> inspeção cautelar completa.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarDetails;
