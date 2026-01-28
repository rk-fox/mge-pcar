import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { TESTIMONIALS } from '../constants';

interface AboutProps {
    reviewToken?: string | null;
}

interface Review {
    id: number;
    nome: string;
    carro: string;
    ano_compra: number;
    estrelas: number;
    comentario: string;
    rede_social?: string;
    foto_url?: string;
}

const About: React.FC<AboutProps> = ({ reviewToken }) => {
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [tokenError, setTokenError] = useState<string | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    React.useEffect(() => {
        fetchReviews();
        if (reviewToken) {
            validateToken(reviewToken);
        }
    }, [reviewToken]);

    const fetchReviews = async () => {
        const { data } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) {
            setReviews(data);
        }
    };

    const nextSlide = () => {
        if (reviews.length > 0) {
            setCurrentSlide(prev => (prev + 1) % reviews.length);
        }
    };

    const prevSlide = () => {
        if (reviews.length > 0) {
            setCurrentSlide(prev => (prev - 1 + reviews.length) % reviews.length);
        }
    };

    const getVisibleReviews = () => {
        if (reviews.length === 0) return [];
        /* If fewer than 3 reviews, just show what we have without duplication logic complexity for now, or just repeat. 
           For simplicity and robustness:
           If < 3, show all.
           If >= 3, show 3 using modulo.
        */
        if (reviews.length < 3) return reviews;

        const items = [];
        for (let i = 0; i < 3; i++) {
            const index = (currentSlide + i) % reviews.length;
            items.push(reviews[index]);
        }
        return items;
    };

    const validateToken = async (token: string) => {
        const { data, error } = await supabase
            .from('review_tokens')
            .select('*')
            .eq('token', token)
            .single();

        if (error || !data) {
            setTokenError('Link de avaliação inválido ou já utilizado.');
            alert('Este link de avaliação é inválido ou já foi utilizado.');
        } else {
            setIsReviewModalOpen(true);
        }
    };
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [reviewForm, setReviewForm] = useState({
        nome: '',
        carro: '',
        ano_compra: new Date().getFullYear(),
        estrelas: 5,
        comentario: '',
        rede_social: '',
        foto_url: ''
    });

    const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setReviewForm(prev => ({ ...prev, [name]: name === 'ano_compra' || name === 'estrelas' ? parseInt(value) : value }));
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const { error } = await supabase
            .from('reviews')
            .insert([reviewForm]);

        if (error) {
            alert('Erro ao enviar avaliação: ' + error.message);
        } else {
            // Delete token if it was provided
            if (reviewToken) {
                await supabase
                    .from('review_tokens')
                    .delete()
                    .eq('token', reviewToken);
            }

            setSubmitted(true);
            setTimeout(() => {
                setIsReviewModalOpen(false);
                setSubmitted(false);
                setReviewForm({
                    nome: '', carro: '', ano_compra: new Date().getFullYear(),
                    estrelas: 5, comentario: '', rede_social: '', foto_url: ''
                });
                // Remove token from URL if possible without reload
                if (window.history.pushState) {
                    const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                    window.history.pushState({ path: newurl }, '', newurl);
                }
            }, 3000);
        }
        setSubmitting(false);
    };
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen">
            {/* Hero */}
            <section className="relative h-[50vh] min-h-[400px] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        alt="Entrega de chaves"
                        className="w-full h-full object-cover scale-105"
                        src="./capa-youtube.png"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent dark:from-black dark:via-black/80"></div>
                </div>
                <div className="relative container mx-auto px-4 md:px-8 z-10 pt-16">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent font-black text-[10px] mb-4 tracking-[0.2em] uppercase">
                            Nossa Essência
                        </div>
                        <h1 className="font-display text-4xl md:text-7xl font-black text-white mb-6 uppercase leading-[0.9] tracking-tighter">
                            A HISTÓRIA POR TRÁS <br />
                            <span className="text-accent underline decoration-primary decoration-8 underline-offset-[-2px]">DA EXCELÊNCIA.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-300 font-medium max-w-2xl leading-relaxed">Referência em consultoria automotiva personalizada para clientes que não abrem mão da qualidade.</p>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-24 bg-white dark:bg-background-dark relative overflow-hidden">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex flex-col lg:flex-row gap-20 items-center">
                        <div className="lg:w-1/2 relative group">
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity"></div>
                            <div className="relative z-10">
                                <img
                                    alt="Nossa Equipe"
                                    className="rounded-[2.5rem] shadow-2xl w-full object-cover aspect-[4/3] border-8 border-slate-50 dark:border-white/5 transition-transform duration-500 group-hover:scale-[1.02]"
                                    src="./logo-MGE.png"
                                />
                                <div className="absolute -bottom-8 -right-8 bg-primary text-white p-10 rounded-[2rem] shadow-2xl z-20 hidden md:block transform hover:scale-110 transition-transform">
                                    <p className="text-6xl font-black mb-1 tracking-tighter">10+</p>
                                    <p className="text-xs font-black uppercase tracking-[0.2em]">Anos de <br /> Mercado</p>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                            <div className="text-primary font-black text-sm tracking-[0.3em] uppercase mb-6">MGE Personal Car</div>
                            <h2 className="font-display text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-tight uppercase">Confiança esculpida em <br /><span className="text-primary dark:text-accent">cada negociação.</span></h2>
                            <div className="space-y-8 text-slate-500 dark:text-slate-400 text-lg leading-relaxed font-medium">
                                <p>A <span className="font-black text-slate-900 dark:text-white border-b-4 border-accent/30">MGE Personal Car</span> nasceu com o propósito de transformar a experiência de compra e venda de veículos em algo prazeroso, transparente e totalmente seguro.</p>
                                <p>Não somos apenas uma revenda; somos consultores automotivos dedicados a encontrar o veículo ideal para o seu perfil e necessidade, oferecendo uma curadoria rigorosa em cada item do nosso estoque.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
                                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                                        <span className="material-symbols-outlined text-accent text-3xl font-black">verified</span>
                                        <span className="font-black text-sm uppercase tracking-widest text-slate-900 dark:text-slate-200">Procedência</span>
                                    </div>
                                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                                        <span className="material-symbols-outlined text-accent text-3xl font-black">security</span>
                                        <span className="font-black text-sm uppercase tracking-widest text-slate-900 dark:text-slate-200">Segurança</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-32 bg-slate-900 dark:bg-black relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
                    <div className="text-accent font-black text-sm tracking-[0.3em] uppercase mb-6">Depoimentos</div>
                    <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-20 uppercase tracking-tighter">O que dizem nossos clientes</h2>

                    <div className="relative">
                        {/* Navigation Buttons - Desktop */}
                        {reviews.length > 3 && (
                            <>
                                <button
                                    onClick={prevSlide}
                                    className="hidden md:flex absolute -left-16 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-accent text-white hover:text-slate-900 rounded-full items-center justify-center transition-all backdrop-blur-md border border-white/20"
                                >
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="hidden md:flex absolute -right-16 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-accent text-white hover:text-slate-900 rounded-full items-center justify-center transition-all backdrop-blur-md border border-white/20"
                                >
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </>
                        )}

                        {/* Navigation Buttons - Mobile */}
                        {reviews.length > 1 && (
                            <div className="flex md:hidden justify-center gap-4 mb-8">
                                <button
                                    onClick={prevSlide}
                                    className="w-12 h-12 bg-white/10 hover:bg-accent text-white hover:text-slate-900 rounded-full flex items-center justify-center transition-all backdrop-blur-md border border-white/20"
                                >
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="w-12 h-12 bg-white/10 hover:bg-accent text-white hover:text-slate-900 rounded-full flex items-center justify-center transition-all backdrop-blur-md border border-white/20"
                                >
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {getVisibleReviews().map((review, index) => (
                                <div key={`${review.id}-${index}`} className="relative group animate-fade-in">
                                    <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 rounded-[2.5rem] blur-2xl transition-opacity"></div>
                                    <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 hover:border-accent/30 transition-all duration-500 relative z-10 h-full flex flex-col">
                                        <div className="flex justify-center mb-8 text-accent gap-1">
                                            {[...Array(review.estrelas)].map((_, i) => (
                                                <span key={i} className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            ))}
                                        </div>
                                        <p className="text-slate-300 mb-10 text-lg leading-relaxed font-medium italic flex-grow">"{review.comentario}"</p>
                                        <div className="border-t border-white/10 pt-8">
                                            <div className="font-black text-white uppercase tracking-widest text-sm">
                                                — {review.rede_social ? (
                                                    <a href={`https://instagram.com/${review.rede_social.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                                                        {review.nome}
                                                    </a>
                                                ) : (
                                                    review.nome
                                                )}
                                            </div>
                                            <div className="text-[10px] text-accent font-black uppercase tracking-[0.2em] mt-2">
                                                {review.carro} • {review.ano_compra}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Botão removido para evitar avaliações falsas. Use o link único gerado pelo admin. */}
                    {/* <div className="mt-20">
                        <button
                            onClick={() => setIsReviewModalOpen(true)}
                            className="bg-accent hover:opacity-90 text-slate-900 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-accent/20 flex items-center gap-3 mx-auto transform hover:scale-105"
                        >
                            <span className="material-symbols-outlined font-black">rate_review</span>
                            Deixe seu Depoimento
                        </button>
                    </div> */}
                </div>

                {/* Review Modal */}
                {isReviewModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl animate-fade-in" onClick={() => setIsReviewModalOpen(false)}></div>
                        <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-zoom-in border border-slate-100 dark:border-white/10">
                            {submitted ? (
                                <div className="p-16 text-center space-y-6">
                                    <span className="material-symbols-outlined text-green-500 text-7xl animate-bounce">check_circle</span>
                                    <h3 className="text-3xl font-black uppercase tracking-tighter">Obrigado pela sua avaliação!</h3>
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Seu depoimento será analisado por nossa equipe e em breve estará no ar.</p>
                                </div>
                            ) : (
                                <div className="p-10">
                                    <div className="flex justify-between items-center mb-8">
                                        <h3 className="text-2xl font-black uppercase tracking-tighter">Deixe sua <span className="text-primary italic">Avaliação</span></h3>
                                        <button onClick={() => setIsReviewModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                                            <span className="material-symbols-outlined font-black text-3xl">close</span>
                                        </button>
                                    </div>

                                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                                                <input required name="nome" value={reviewForm.nome} onChange={handleReviewChange} className="w-full bg-slate-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary outline-none" placeholder="João Silva" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Carro Comprado</label>
                                                <input name="carro" value={reviewForm.carro} onChange={handleReviewChange} className="w-full bg-slate-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary outline-none" placeholder="Audi A4" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ano da Compra</label>
                                                <input type="number" name="ano_compra" value={reviewForm.ano_compra} onChange={handleReviewChange} className="w-full bg-slate-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary outline-none" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rede Social (@)</label>
                                                <input name="rede_social" value={reviewForm.rede_social} onChange={handleReviewChange} className="w-full bg-slate-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary outline-none" placeholder="@joaosilva" />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sua Nota (1-5 Estrelas)</label>
                                            <div className="flex gap-4 items-center bg-slate-50 dark:bg-white/5 p-2 rounded-2xl">
                                                {[1, 2, 3, 4, 5].map((num) => (
                                                    <button
                                                        key={num}
                                                        type="button"
                                                        onClick={() => setReviewForm(prev => ({ ...prev, estrelas: num }))}
                                                        className={`material-symbols-outlined text-3xl transition-all ${num <= reviewForm.estrelas ? 'text-accent scale-110' : 'text-slate-300 hover:text-accent/50'}`}
                                                    >
                                                        star
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Seu Depoimento</label>
                                            <textarea required name="comentario" value={reviewForm.comentario} onChange={handleReviewChange} rows={4} className="w-full bg-slate-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary outline-none resize-none" placeholder="Conte como foi sua experiência conosco..." />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full bg-primary hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl shadow-primary/30 transition-all mt-4 disabled:opacity-50"
                                        >
                                            {submitting ? 'Enviando...' : 'Enviar Avaliação'}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default About;
