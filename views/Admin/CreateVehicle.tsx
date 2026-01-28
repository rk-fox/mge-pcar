import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Car } from '../../types';

interface AdminProps {
    onBack: () => void;
    onCarUpdate?: () => void;
}

type AdminSection = 'ESTOQUE' | 'CONTATO' | 'ANUNCIOS' | 'INTERESSES' | 'AVALIACOES';

const CreateVehicle: React.FC<AdminProps> = ({ onBack, onCarUpdate }) => {
    const [activeSection, setActiveSection] = useState<AdminSection>('ESTOQUE');
    const [cars, setCars] = useState<Car[]>([]);
    const [contactMessages, setContactMessages] = useState<any[]>([]);
    const [advertiseMessages, setAdvertiseMessages] = useState<any[]>([]);
    const [carInterests, setCarInterests] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCar, setEditingCar] = useState<Car | null>(null);
    const [uploading, setUploading] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [generatedLink, setGeneratedLink] = useState<string | null>(null);

    const generateReviewLink = async () => {
        const token = crypto.randomUUID();
        const { error } = await supabase
            .from('review_tokens')
            .insert([{ token }]);

        if (error) {
            alert('Erro ao gerar link: ' + error.message);
        } else {
            const link = `${window.location.origin}/?review_token=${token}`;
            setGeneratedLink(link);
            // Copy to clipboard
            navigator.clipboard.writeText(link);
            alert('Link gerado e copiado para a área de transferência:\n' + link);
        }
    };

    // Form State
    const [formData, setFormData] = useState<Partial<Car>>({
        brand: '',
        model: '',
        version: '',
        year_fab: new Date().getFullYear(),
        year_mod: new Date().getFullYear(),
        price: 0,
        mileage: 0,
        transmission: 'Automático',
        fuel: '',
        color: '',
        image: '',
        images: [],
        description: '',
        features: [],
        isFeatured: false,
        isSold: false
    });

    useEffect(() => {
        fetchData();
    }, [activeSection]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeSection === 'ESTOQUE') {
                await fetchCars();
            } else if (activeSection === 'CONTATO') {
                await fetchContactMessages();
            } else if (activeSection === 'ANUNCIOS') {
                await fetchAdvertiseMessages();
            } else if (activeSection === 'INTERESSES') {
                await fetchCarInterests();
            } else if (activeSection === 'AVALIACOES') {
                await fetchReviews();
            }
        } catch (err) {
            console.error('Error in fetchData:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCars = async () => {
        const { data, error } = await supabase
            .from('stocks')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching cars:', error);
            alert('Erro ao carregar estoque: ' + error.message);
        } else {
            const camelCaseCars = data.map((item: any) => ({
                ...item,
                isFeatured: item.is_featured,
                isSold: item.is_sold
            }));
            setCars(camelCaseCars);
        }
    };

    const fetchContactMessages = async () => {
        const { data, error } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching contact messages:', error);
            alert('Erro ao carregar mensagens: ' + error.message);
        } else {
            setContactMessages(data || []);
        }
    };

    const fetchAdvertiseMessages = async () => {
        const { data, error } = await supabase
            .from('advertise_messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching advertise messages:', error);
            alert('Erro ao carregar anúncios: ' + error.message);
        } else {
            setAdvertiseMessages(data || []);
        }
    };

    const fetchCarInterests = async () => {
        const { data, error } = await supabase
            .from('car_interests')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching car interests:', error);
            alert('Erro ao carregar interesses: ' + error.message);
        } else {
            setCarInterests(data || []);
        }
    };

    const fetchReviews = async () => {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching reviews:', error);
            alert('Erro ao carregar avaliações: ' + error.message);
        } else {
            setReviews(data || []);
        }
    };

    const toggleReviewApproval = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from('reviews')
            .update({ is_approved: !currentStatus })
            .eq('id', id);

        if (error) alert('Erro ao atualizar status: ' + error.message);
        else fetchReviews();
    };

    const deleteMessage = async (table: string, id: string) => {
        if (!confirm('Excluir esta mensagem permanentemente?')) return;
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) alert('Erro ao excluir: ' + error.message);
        else fetchData();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'number' ? parseFloat(value) : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleFeaturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const features = e.target.value.split(',').map(f => f.trim());
        setFormData(prev => ({ ...prev, features }));
    };

    const addImageUrl = () => {
        if (!newImageUrl) return;
        setFormData(prev => ({
            ...prev,
            images: [...(prev.images || []), newImageUrl]
        }));
        setNewImageUrl('');
    };

    const removeImageUrl = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: (prev.images || []).filter((_, i) => i !== index)
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `cars/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('car-images')
            .upload(filePath, file);

        if (uploadError) {
            alert('Erro no upload: ' + uploadError.message + '\nVerifique se o bucket "car-images" existe e é público.');
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('car-images')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image: publicUrl }));
        }
        setUploading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const dbData = {
            brand: formData.brand,
            model: formData.model,
            version: formData.version,
            year_fab: formData.year_fab,
            year_mod: formData.year_mod,
            price: formData.price,
            mileage: formData.mileage,
            transmission: formData.transmission,
            fuel: formData.fuel,
            color: formData.color,
            image: formData.image,
            images: formData.images,
            description: formData.description,
            features: formData.features,
            is_featured: formData.isFeatured,
            is_sold: formData.isSold
        };

        let error;
        if (editingCar) {
            const { error: updateError } = await supabase
                .from('stocks')
                .update(dbData)
                .eq('id', editingCar.id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from('stocks')
                .insert([dbData]);
            error = insertError;
        }

        if (error) {
            alert('Erro ao salvar: ' + error.message);
        } else {
            setIsFormOpen(false);
            setEditingCar(null);
            resetFormData();
            fetchCars();
            if (onCarUpdate) onCarUpdate();
        }
        setLoading(false);
    };

    const resetFormData = () => {
        setFormData({
            brand: '', model: '', version: '', year_fab: new Date().getFullYear(), year_mod: new Date().getFullYear(),
            price: 0, mileage: 0, transmission: 'Automático', fuel: '',
            color: '', image: '', images: [], description: '', features: [],
            isFeatured: false, isSold: false
        });
    };

    const handleDeleteCar = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este veículo?')) return;

        const { error } = await supabase
            .from('stocks')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Erro ao excluir: ' + error.message);
        } else {
            fetchCars();
            if (onCarUpdate) onCarUpdate();
        }
    };

    const handleEdit = (car: Car) => {
        setEditingCar(car);
        setFormData(car);
        setIsFormOpen(true);
        setActiveSection('ESTOQUE');
        window.scrollTo(0, 0);
    };

    return (
        <div className="flex min-h-screen bg-[#f6f6f8] dark:bg-[#0f172a] font-sans text-[#0d121b] dark:text-slate-200">
            {/* Sidebar */}
            <aside className="w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden lg:flex flex-col sticky top-0 h-screen shadow-xl z-30">
                <div className="p-8 flex flex-col h-full justify-between">
                    <div className="flex flex-col gap-10">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary rounded-2xl p-3 text-white shadow-xl shadow-primary/20">
                                <span className="material-symbols-outlined text-2xl">shield_person</span>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-sm font-black leading-tight uppercase tracking-widest">MGE Dashboard</h1>
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Controle Administrativo</p>
                            </div>
                        </div>
                        <nav className="flex flex-col gap-2">
                            <button
                                onClick={onBack}
                                className="flex items-center gap-3 px-5 py-4 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all font-bold text-sm text-left"
                            >
                                <span className="material-symbols-outlined text-xl">keyboard_backspace</span>
                                Sair do Painel
                            </button>

                            <div className="h-px bg-slate-100 dark:bg-white/5 my-4"></div>

                            <button
                                onClick={() => { setActiveSection('ESTOQUE'); setIsFormOpen(false); }}
                                className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-bold text-sm text-left ${activeSection === 'ESTOQUE' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            >
                                <span className="material-symbols-outlined text-xl">inventory_2</span>
                                Estoque Premium
                            </button>

                            <button
                                onClick={() => { setActiveSection('CONTATO'); setIsFormOpen(false); }}
                                className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-bold text-sm text-left ${activeSection === 'CONTATO' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            >
                                <span className="material-symbols-outlined text-xl">quick_phrases</span>
                                Mensagens Contato
                            </button>

                            <button
                                onClick={() => { setActiveSection('ANUNCIOS'); setIsFormOpen(false); }}
                                className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-bold text-sm text-left ${activeSection === 'ANUNCIOS' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            >
                                <span className="material-symbols-outlined text-xl">campaign</span>
                                Solicitações Anúncio
                            </button>

                            <button
                                onClick={() => { setActiveSection('INTERESSES'); setIsFormOpen(false); }}
                                className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-bold text-sm text-left ${activeSection === 'INTERESSES' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            >
                                <span className="material-symbols-outlined text-xl">loyalty</span>
                                Leads de Interesse
                            </button>

                            <button
                                onClick={() => { setActiveSection('AVALIACOES'); setIsFormOpen(false); }}
                                className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-bold text-sm text-left ${activeSection === 'AVALIACOES' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            >
                                <span className="material-symbols-outlined text-xl">grade</span>
                                Avaliações Clientes
                            </button>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5">
                        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-black shadow-inner">
                            A
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <p className="text-xs font-black truncate">Administrador</p>
                            <button onClick={() => supabase.auth.signOut()} className="text-[10px] text-red-500 font-black uppercase tracking-widest text-left hover:underline">Encerrar Sessão</button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-6xl mx-auto px-8 py-12">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Painel Admin</span>
                                <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
                                <span className="text-primary text-[10px] font-black uppercase tracking-widest">
                                    {activeSection === 'ESTOQUE' ? 'Gestão de Estoque' :
                                        activeSection === 'CONTATO' ? 'Mensagens Recebidas' :
                                            activeSection === 'ANUNCIOS' ? 'Solicitações de Anúncio' :
                                                activeSection === 'INTERESSES' ? 'Interesses em Veículos' :
                                                    'Avaliações de Clientes'}
                                </span>
                            </div>
                            <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">
                                {activeSection === 'ESTOQUE' ? <><span className="text-primary italic">Stock</span> Management</> :
                                    activeSection === 'CONTATO' ? <><span className="text-primary italic">Contact</span> Center</> :
                                        activeSection === 'ANUNCIOS' ? <><span className="text-primary italic">Ad</span> Requests</> :
                                            activeSection === 'INTERESSES' ? <><span className="text-primary italic">Interest</span> Hub</> :
                                                <><span className="text-primary italic">Customer</span> Reviews</>}
                            </h2>
                        </div>

                        {activeSection === 'ESTOQUE' && (
                            <button
                                onClick={() => {
                                    setIsFormOpen(!isFormOpen);
                                    if (!isFormOpen) {
                                        setEditingCar(null);
                                        resetFormData();
                                    }
                                }}
                                className="bg-primary hover:bg-blue-700 text-white px-10 py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 transition-all active:scale-95 flex items-center gap-3 hover:-translate-y-1"
                            >
                                <span className="material-symbols-outlined font-black">{isFormOpen ? 'close' : 'add_circle'}</span>
                                {isFormOpen ? 'Fechar Formulário' : 'Novo Carro no Estoque'}
                            </button>
                        )}
                    </div>

                    {/* Form Section (Only for Stock) */}
                    {activeSection === 'ESTOQUE' && isFormOpen && (
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-white/5 overflow-hidden mb-16 animate-in slide-in-from-top-10 duration-700">
                            <div className="p-12">
                                <form onSubmit={handleSubmit} className="space-y-12">
                                    <section>
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black shadow-inner">1</div>
                                            <h3 className="text-2xl font-black uppercase tracking-tight">Capa e Visual</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="flex flex-col gap-6">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Thumbnail do Veículo</label>
                                                <div className="relative group">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    />
                                                    <div className="border-4 border-dashed border-slate-100 dark:border-white/5 rounded-[2rem] p-16 text-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all bg-slate-50 dark:bg-slate-800/50 shadow-inner">
                                                        {uploading ? (
                                                            <div className="flex flex-col items-center gap-4">
                                                                <div className="animate-spin w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full mx-auto"></div>
                                                                <span className="text-[10px] font-black text-primary uppercase tracking-widest animate-pulse">Fazendo Upload...</span>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <span className="material-symbols-outlined text-6xl text-slate-200 group-hover:text-primary transition-colors mb-4">image_search</span>
                                                                <p className="text-xs font-black text-slate-400 group-hover:text-slate-600 transition-colors uppercase tracking-widest">Clique para selecionar</p>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                {formData.image && (
                                                    <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden border-8 border-white dark:border-white/5 shadow-2xl group">
                                                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                        <button type="button" onClick={() => setFormData(p => ({ ...p, image: '' }))} className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all"><span className="material-symbols-outlined text-lg font-black">delete</span></button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-8 justify-center">
                                                <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem] border border-slate-100 dark:border-white/5 space-y-8">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Destaques e Status</label>
                                                    <div className="space-y-6">
                                                        <label className="flex items-center gap-4 cursor-pointer group">
                                                            <div className="relative">
                                                                <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleCheckboxChange} className="sr-only peer" />
                                                                <div className="w-14 h-7 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                                                            </div>
                                                            <span className="text-sm font-black uppercase tracking-tight group-hover:text-primary transition-colors">Veículo em Destaque</span>
                                                        </label>
                                                        <label className="flex items-center gap-4 cursor-pointer group">
                                                            <div className="relative">
                                                                <input type="checkbox" name="isSold" checked={formData.isSold} onChange={handleCheckboxChange} className="sr-only peer" />
                                                                <div className="w-14 h-7 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500 shadow-inner"></div>
                                                            </div>
                                                            <span className="text-sm font-black uppercase tracking-tight group-hover:text-red-500 transition-colors">Marcar como Vendido</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Multi-Image URL Section */}
                                    <section>
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black shadow-inner">2</div>
                                            <h3 className="text-2xl font-black uppercase tracking-tight">Galeria de Fotos (Links Externos)</h3>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem] border border-slate-100 dark:border-white/5 space-y-6">
                                            <div className="flex gap-4">
                                                <input
                                                    type="text"
                                                    value={newImageUrl}
                                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                                    placeholder="Cole aqui o link da imagem (ex: https://site.com/foto.jpg)"
                                                    className="flex-1 rounded-2xl border-transparent dark:bg-slate-900 px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/20 transition-all shadow-inner bg-white"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={addImageUrl}
                                                    className="bg-primary hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg transition-all active:scale-95"
                                                >
                                                    Adicionar
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                                {formData.images?.map((url, index) => (
                                                    <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group border-4 border-white dark:border-white/5 shadow-lg">
                                                        <img src={url} alt={`Extra ${index}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImageUrl(index)}
                                                            className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <span className="material-symbols-outlined text-xs">close</span>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black shadow-inner">3</div>
                                            <h3 className="text-2xl font-black uppercase tracking-tight">Dados Técnicos</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            <div className="flex flex-col gap-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Marca</label>
                                                <input name="brand" value={formData.brand} onChange={handleInputChange} required className="rounded-2xl border-transparent dark:bg-slate-800 px-6 py-4.5 text-sm font-bold focus:ring-4 focus:ring-primary/20 transition-all shadow-inner bg-slate-50" placeholder="Ex: BMW" />
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Modelo</label>
                                                <input name="model" value={formData.model} onChange={handleInputChange} required className="rounded-2xl border-transparent dark:bg-slate-800 px-6 py-4.5 text-sm font-bold focus:ring-4 focus:ring-primary/20 transition-all shadow-inner bg-slate-50" placeholder="Ex: 320i" />
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Versão</label>
                                                <input name="version" value={formData.version} onChange={handleInputChange} className="rounded-2xl border-transparent dark:bg-slate-800 px-6 py-4.5 text-sm font-bold focus:ring-4 focus:ring-primary/20 transition-all shadow-inner bg-slate-50" placeholder="Ex: M Sport" />
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ano Fabricação</label>
                                                <input name="year_fab" type="number" value={formData.year_fab} onChange={handleInputChange} required className="rounded-2xl border-transparent dark:bg-slate-800 px-6 py-4.5 text-sm font-bold focus:ring-4 focus:ring-primary/20 transition-all shadow-inner bg-slate-50" />
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ano Modelo</label>
                                                <input name="year_mod" type="number" value={formData.year_mod} onChange={handleInputChange} required className="rounded-2xl border-transparent dark:bg-slate-800 px-6 py-4.5 text-sm font-bold focus:ring-4 focus:ring-primary/20 transition-all shadow-inner bg-slate-50" />
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preço (R$)</label>
                                                <input name="price" type="number" value={formData.price} onChange={handleInputChange} required className="rounded-2xl border-transparent dark:bg-slate-800 px-6 py-4.5 text-sm font-bold focus:ring-4 focus:ring-primary/20 transition-all shadow-inner bg-slate-50" placeholder="0" />
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quilometragem</label>
                                                <input name="mileage" type="number" value={formData.mileage} onChange={handleInputChange} required className="rounded-2xl border-transparent dark:bg-slate-800 px-6 py-4.5 text-sm font-bold focus:ring-4 focus:ring-primary/20 transition-all shadow-inner bg-slate-50" placeholder="0" />
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black shadow-inner">4</div>
                                            <h3 className="text-2xl font-black uppercase tracking-tight">Ficha Detalhada</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            <div className="flex flex-col gap-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Câmbio</label>
                                                <select name="transmission" value={formData.transmission} onChange={handleInputChange} className="rounded-2xl border-transparent dark:bg-slate-800 px-6 py-4.5 text-sm font-bold focus:ring-4 focus:ring-primary/20 transition-all shadow-inner bg-slate-50">
                                                    <option value="Automático">Automático</option>
                                                    <option value="Manual">Manual</option>
                                                </select>
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Combustível</label>
                                                <input name="fuel" value={formData.fuel} onChange={handleInputChange} className="rounded-2xl border-transparent dark:bg-slate-800 px-6 py-4.5 text-sm font-bold focus:ring-4 focus:ring-primary/20 transition-all shadow-inner bg-slate-50" placeholder="Gasolina / Flex" />
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cor</label>
                                                <input name="color" value={formData.color} onChange={handleInputChange} className="rounded-2xl border-transparent dark:bg-slate-800 px-6 py-4.5 text-sm font-bold focus:ring-4 focus:ring-primary/20 transition-all shadow-inner bg-slate-50" placeholder="Ex: Cinza Metal" />
                                            </div>
                                            <div className="flex flex-col gap-3 md:col-span-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Itens de Série (separados por vírgula)</label>
                                                <input value={formData.features?.join(', ')} onChange={handleFeaturesChange} className="rounded-2xl border-transparent dark:bg-slate-800 px-6 py-4.5 text-sm font-bold focus:ring-4 focus:ring-primary/20 transition-all shadow-inner bg-slate-50" placeholder="X-Drive, Faróis Laser, Interior em Couro..." />
                                            </div>
                                            <div className="flex flex-col gap-3 md:col-span-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição Comercial</label>
                                                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={6} className="rounded-2xl border-transparent dark:bg-slate-800 px-6 py-4.5 text-sm font-bold focus:ring-4 focus:ring-primary/20 transition-all shadow-inner bg-slate-50 resize-none" placeholder="Este veículo é uma oportunidade exclusiva..." />
                                            </div>
                                        </div>
                                    </section>

                                    <div className="pt-10 border-t border-slate-100 dark:border-white/10 flex justify-end gap-6">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="bg-primary hover:bg-blue-700 text-white px-16 py-6 rounded-2xl font-black uppercase text-sm tracking-[0.2em] shadow-2xl shadow-primary/40 disabled:opacity-50 transition-all active:scale-95 hover:-translate-y-1"
                                        >
                                            {loading ? 'Processando...' : editingCar ? 'Salvar Alterações' : 'Publicar no Estoque'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* List Sections */}
                    <div className="space-y-8 pb-20">
                        {loading && !isFormOpen ? (
                            <div className="flex flex-col items-center justify-center py-32 gap-6">
                                <div className="animate-spin w-16 h-16 border-8 border-primary/20 border-t-primary rounded-full"></div>
                                <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse">Sincronizando com Banco de Dados...</p>
                            </div>
                        ) : activeSection === 'ESTOQUE' ? (
                            <>
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="w-2 h-10 bg-primary rounded-full shadow-lg shadow-primary/50"></span>
                                    <h3 className="text-xl font-black uppercase tracking-tight">Frota Ativa ({cars.length})</h3>
                                </div>
                                {cars.length === 0 ? (
                                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-32 text-center border border-slate-100 dark:border-white/5 shadow-2xl">
                                        <span className="material-symbols-outlined text-8xl text-slate-100 mb-6 drop-shadow-sm">no_crash</span>
                                        <p className="text-slate-400 font-black uppercase tracking-widest text-sm">O Pátio está vazio!</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-6">
                                        {cars.map(car => (
                                            <div key={car.id} className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 flex flex-col md:flex-row items-center gap-8 border border-slate-100 dark:border-white/5 hover:shadow-2xl transition-all group relative overflow-hidden">
                                                {car.isFeatured && <div className="absolute top-0 right-0 w-24 h-24 bg-primary opacity-5 rounded-full -mr-12 -mt-12 blur-2xl"></div>}
                                                <div className="w-full md:w-48 h-36 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 shadow-lg group-hover:shadow-primary/10 transition-shadow">
                                                    <img src={car.image || (car.images && car.images.length > 0 ? car.images[0] : './logo-MGE.png')} alt={car.model} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                </div>
                                                <div className="flex-1 min-w-0 text-center md:text-left">
                                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                                        <h4 className="font-black text-2xl truncate uppercase tracking-tighter">{car.brand} {car.model}</h4>
                                                        <div className="flex gap-2">
                                                            {car.isFeatured && <span className="bg-primary text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-primary/30">Destaque</span>}
                                                            {car.isSold && <span className="bg-red-500 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-red-500/30">Vendido</span>}
                                                        </div>
                                                    </div>
                                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3">{car.year_fab}/{car.year_mod} • {car.fuel} • {car.transmission} • {car.mileage.toLocaleString()} KM</p>
                                                    <p className="text-primary font-black text-3xl tracking-tighter">R$ {car.price.toLocaleString('pt-BR')}</p>
                                                </div>
                                                <div className="flex items-center gap-3 pr-2">
                                                    <button
                                                        onClick={() => handleEdit(car)}
                                                        className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-primary hover:text-white transition-all flex items-center justify-center border border-slate-100 dark:border-white/10 shadow-lg group-hover:scale-110"
                                                    >
                                                        <span className="material-symbols-outlined text-2xl font-black">edit_square</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCar(car.id)}
                                                        className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-slate-100 dark:border-white/10 shadow-lg group-hover:scale-110"
                                                    >
                                                        <span className="material-symbols-outlined text-2xl font-black">delete_forever</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : activeSection === 'CONTATO' ? (
                            <>
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="w-2 h-10 bg-primary rounded-full shadow-lg shadow-primary/50"></span>
                                    <h3 className="text-xl font-black uppercase tracking-tight">Inbox de Contato ({contactMessages.length})</h3>
                                </div>
                                {contactMessages.length === 0 ? (
                                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-32 text-center border border-slate-100 dark:border-white/5 shadow-2xl">
                                        <span className="material-symbols-outlined text-8xl text-slate-100 mb-6 drop-shadow-sm">mail_outline</span>
                                        <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Nenhuma mensagem por aqui.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-6">
                                        {contactMessages.map(msg => (
                                            <div key={msg.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-white/5 hover:shadow-2xl transition-all">
                                                <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
                                                    <div>
                                                        <h4 className="text-2xl font-black uppercase tracking-tighter mb-1">{msg.nome_completo}</h4>
                                                        <p className="text-primary font-bold text-xs">{msg.email}</p>
                                                        <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mt-2">{new Date(msg.created_at).toLocaleString()}</p>
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <a href={`mailto:${msg.email}`} className="bg-primary/10 text-primary px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-primary hover:text-white transition-all">
                                                            <span className="material-symbols-outlined text-sm">mail</span> Responder
                                                        </a>
                                                        <button onClick={() => deleteMessage('contact_messages', msg.id)} className="bg-red-500/10 text-red-600 w-12 h-12 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                                                            <span className="material-symbols-outlined">delete</span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-100 dark:border-white/5">
                                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">"{msg.mensagem}"</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : activeSection === 'ANUNCIOS' ? (
                            <>
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="w-2 h-10 bg-primary rounded-full shadow-lg shadow-primary/50"></span>
                                    <h3 className="text-xl font-black uppercase tracking-tight">Leads de Anúncio ({advertiseMessages.length})</h3>
                                </div>
                                {advertiseMessages.length === 0 ? (
                                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-32 text-center border border-slate-100 dark:border-white/5 shadow-2xl">
                                        <span className="material-symbols-outlined text-8xl text-slate-100 mb-6 drop-shadow-sm">car_repair</span>
                                        <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Nenhuma ficha de anúncio recebida.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-8">
                                        {/* ... advertiseMessages map ... */}
                                        {advertiseMessages.map(msg => (
                                            <div key={msg.id} className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-white/5 hover:shadow-2xl transition-all relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-2 h-full bg-primary/20"></div>
                                                <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-4 mb-4">
                                                            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black">
                                                                <span className="material-symbols-outlined">person</span>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-2xl font-black uppercase tracking-tighter leading-none">{msg.nome_completo}</h4>
                                                                <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mt-1">{msg.telefone}</p>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
                                                            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-white/5">
                                                                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Veículo</span>
                                                                <span className="text-sm font-black uppercase tracking-tight">{msg.marca} {msg.modelo}</span>
                                                            </div>
                                                            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-white/5">
                                                                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Ano Fab/Mod</span>
                                                                <span className="text-sm font-black uppercase tracking-tight">{msg.ano_fabricacao}/{msg.ano_modelo}</span>
                                                            </div>
                                                            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-white/5">
                                                                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Km</span>
                                                                <span className="text-sm font-black uppercase tracking-tight">{msg.quilometragem?.toLocaleString()} KM</span>
                                                            </div>
                                                            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-white/5">
                                                                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Cor</span>
                                                                <span className="text-sm font-black uppercase tracking-tight">{msg.cor}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="lg:w-48 space-y-3">
                                                        <a href={`https://wa.me/${msg.telefone?.replace(/\D/g, '')}?text=Olá ${msg.nome_completo}, recebi sua ficha de anúncio para o ${msg.marca} ${msg.modelo}. Vamos conversar?`} target="_blank" rel="noreferrer" className="w-full bg-green-500 hover:bg-green-600 text-white p-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-green-500/20 transition-all">
                                                            <span className="material-symbols-outlined text-sm">chat</span> WhatsApp
                                                        </a>
                                                        <button onClick={() => deleteMessage('advertise_messages', msg.id)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5 text-slate-400 hover:bg-red-500 hover:text-white p-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                                                            <span className="material-symbols-outlined text-sm">delete</span> Excluir Ficha
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : activeSection === 'INTERESSES' ? (
                            <>
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="w-2 h-10 bg-primary rounded-full shadow-lg shadow-primary/50"></span>
                                    <h3 className="text-xl font-black uppercase tracking-tight">Leads de Interesse ({carInterests.length})</h3>
                                </div>
                                {carInterests.length === 0 ? (
                                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-32 text-center border border-slate-100 dark:border-white/5 shadow-2xl">
                                        <span className="material-symbols-outlined text-8xl text-slate-100 mb-6 drop-shadow-sm">heart_plus</span>
                                        <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Nenhum interesse registrado.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-6">
                                        {carInterests.map(lead => (
                                            <div key={lead.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 hover:shadow-2xl transition-all">
                                                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                                    <div className="flex items-center gap-6">
                                                        <div className="bg-primary/10 text-primary w-16 h-16 rounded-2xl flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-3xl">inbox</span>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xl font-black uppercase tracking-tight">{lead.nome}</h4>
                                                            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Interesse no: <span className="text-primary">{lead.car_name}</span></p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <a href={`https://wa.me/${lead.whatsapp?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all">
                                                            <span className="material-symbols-outlined text-sm">chat</span> WhatsApp
                                                        </a>
                                                        <button onClick={() => deleteMessage('car_interests', lead.id)} className="bg-slate-100 dark:bg-white/5 text-slate-400 hover:bg-red-500 hover:text-white w-12 h-12 rounded-xl flex items-center justify-center transition-all">
                                                            <span className="material-symbols-outlined">delete</span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">E-mail</p>
                                                        <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{lead.email}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WhatsApp</p>
                                                        <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{lead.whatsapp}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</p>
                                                        <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{new Date(lead.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="w-2 h-10 bg-primary rounded-full shadow-lg shadow-primary/50"></span>
                                    <h3 className="text-xl font-black uppercase tracking-tight">Avaliações e Depoimentos ({reviews.length})</h3>
                                    <button
                                        onClick={generateReviewLink}
                                        className="ml-auto bg-accent hover:opacity-90 text-slate-900 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-accent/20 flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-sm font-black">link</span>
                                        Gerar Link de Avaliação
                                    </button>
                                </div>
                                {reviews.length === 0 ? (
                                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-32 text-center border border-slate-100 dark:border-white/5 shadow-2xl">
                                        <span className="material-symbols-outlined text-8xl text-slate-100 mb-6 drop-shadow-sm">reviews</span>
                                        <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Nenhuma avaliação recebida.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-6">
                                        {reviews.map(review => (
                                            <div key={review.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 hover:shadow-2xl transition-all">
                                                <div className="flex items-start justify-between mb-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border-2 border-primary/20">
                                                            {review.foto_url ? (
                                                                <img src={review.foto_url} alt={review.nome} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-primary font-black text-xl">{review.nome?.[0]}</div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xl font-black uppercase tracking-tighter">{review.nome}</h4>
                                                            <p className="text-primary font-bold text-[10px] uppercase tracking-widest">{review.rede_social} • {review.carro} ({review.ano_compra})</p>
                                                            <div className="flex gap-1 mt-1">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <span key={i} className={`material-symbols-outlined text-sm ${i < review.estrelas ? 'text-accent' : 'text-slate-300'}`}>star</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => toggleReviewApproval(review.id, review.is_approved)}
                                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${review.is_approved ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 hover:bg-primary hover:text-white'}`}
                                                        >
                                                            {review.is_approved ? 'Aprovado' : 'Aprovar'}
                                                        </button>
                                                        <button onClick={() => deleteMessage('reviews', review.id)} className="bg-red-500/10 text-red-600 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                                                            <span className="material-symbols-outlined">delete</span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl italic text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-white/5 quote">
                                                    "{review.comentario}"
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CreateVehicle;
