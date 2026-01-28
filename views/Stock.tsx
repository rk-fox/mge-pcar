import React, { useState, useMemo } from 'react';
import { Car } from '../types';

interface StockProps {
  onSelectCar: (carId: string) => void;
  cars: Car[];
  loading: boolean;
}

const Stock: React.FC<StockProps> = ({ onSelectCar, cars, loading }) => {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [minYear, setMinYear] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [showSold, setShowSold] = useState(false);

  // Get unique years from cars (sorted descending)
  const availableYears = useMemo(() => {
    const years = cars.map(car => car.year_fab || car.year).filter(Boolean) as number[];
    return [...new Set(years)].sort((a, b) => b - a);
  }, [cars]);

  // Get price thresholds based on available cars
  const priceThresholds = useMemo(() => {
    const prices = cars.map(car => car.price).filter(Boolean) as number[];
    if (prices.length === 0) return [];
    const maxCarPrice = Math.max(...prices);
    const thresholds: number[] = [];
    const steps = [20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 110000, 120000, 130000, 140000, 150000, 200000, 250000, 300000, 400000, 500000, 750000, 1000000];
    for (const step of steps) {
      if (step <= maxCarPrice + 10000) thresholds.push(step);
    }
    return thresholds;
  }, [cars]);

  // Filter cars
  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchBrand = car.brand?.toLowerCase().includes(term);
        const matchModel = car.model?.toLowerCase().includes(term);
        if (!matchBrand && !matchModel) return false;
      }
      // Year filter (minimum)
      if (minYear) {
        const carYear = car.year_fab || car.year || 0;
        if (carYear < minYear) return false;
      }
      // Price filter (maximum)
      if (maxPrice) {
        if ((car.price || 0) > maxPrice) return false;
      }
      // Sold filter
      if (!showSold && car.isSold) return false;

      return true;
    });
  }, [cars, searchTerm, minYear, maxPrice, showSold]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, minYear, maxPrice, showSold]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const paginatedCars = filteredCars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      {/* Header / Hero */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Background Luxury Car"
            className="w-full h-full object-cover scale-105"
            src="https://raw.githubusercontent.com/rk-fox/mge-pcar/refs/heads/main/public/capa-youtube.png"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent dark:from-black dark:via-black/80"></div>
        </div>
        <div className="relative container mx-auto px-4 md:px-8 z-10 pt-10 pb-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent font-black text-[10px] mb-4 tracking-[0.2em] uppercase">
              Seleção Premium
            </div>
            <h1 className="text-4xl md:text-7xl font-display font-black text-white mb-4 uppercase tracking-tighter leading-none">
              ESTOQUE <br />
              <span className="text-accent">MGE PERSONAL CAR</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-xl font-medium">Os veículos mais exclusivos do mercado com a procedência que você exige.</p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="container mx-auto px-4 md:px-8 -mt-10 relative z-20">
        {/* Desktop Filter */}
        <div className="hidden md:block bg-white dark:bg-card-dark p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-white/5 transition-all duration-500">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div>
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Marca / Modelo</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-xl">search</span>
                <input
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary dark:text-white font-bold transition-all"
                  placeholder="Ex: BMW 320i"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Ano Mínimo</label>
              <select
                className="w-full px-4 py-4 bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary dark:text-white font-bold appearance-none transition-all cursor-pointer"
                value={minYear || ''}
                onChange={(e) => setMinYear(e.target.value ? parseInt(e.target.value) : null)}
              >
                <option value="">Todos os anos</option>
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Preço Máximo</label>
              <select
                className="w-full px-4 py-4 bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary dark:text-white font-bold appearance-none transition-all cursor-pointer"
                value={maxPrice || ''}
                onChange={(e) => setMaxPrice(e.target.value ? parseInt(e.target.value) : null)}
              >
                <option value="">Sem limite</option>
                {priceThresholds.map(price => (
                  <option key={price} value={price}>Até R$ {price.toLocaleString('pt-BR')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Vendidos</label>
              <label className="flex items-center gap-3 cursor-pointer bg-slate-50 dark:bg-background-dark px-4 py-4 rounded-xl border border-slate-200 dark:border-white/10 h-[58px]">
                <div className="relative">
                  <input type="checkbox" checked={showSold} onChange={(e) => setShowSold(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </div>
                <span className="text-sm font-bold dark:text-white">Mostrar</span>
              </label>
            </div>
          </form>
        </div>

        {/* Mobile Filter Toggle Bar */}
        <div className="md:hidden bg-slate-900 border-b border-white/5 p-4 flex justify-between items-center rounded-2xl shadow-xl">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{filteredCars.length} VEÍCULOS</span>
          <button
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 transition-transform"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          >
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Filtrar
          </button>
        </div>

        {/* Mobile Filter Content */}
        {mobileFilterOpen && (
          <div className="md:hidden bg-slate-900 p-6 mt-4 rounded-2xl border border-white/10 shadow-2xl animate-fade-in">
            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Marca / Modelo</label>
                <input
                  className="w-full px-4 py-3 bg-background-dark border-white/10 rounded-xl text-sm text-white font-bold"
                  placeholder="Ex: BMW"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Ano Min</label>
                  <select
                    className="w-full px-4 py-3 bg-background-dark border-white/10 rounded-xl text-sm text-white font-bold appearance-none"
                    value={minYear || ''}
                    onChange={(e) => setMinYear(e.target.value ? parseInt(e.target.value) : null)}
                  >
                    <option value="">Todos</option>
                    {availableYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Preço Max</label>
                  <select
                    className="w-full px-4 py-3 bg-background-dark border-white/10 rounded-xl text-sm text-white font-bold appearance-none"
                    value={maxPrice || ''}
                    onChange={(e) => setMaxPrice(e.target.value ? parseInt(e.target.value) : null)}
                  >
                    <option value="">Sem limite</option>
                    {priceThresholds.map(price => (
                      <option key={price} value={price}>R$ {(price / 1000).toFixed(0)}k</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-4 justify-between">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mostrar Vendidos</label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" checked={showSold} onChange={(e) => setShowSold(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </div>
                </label>
              </div>
              <button
                className="w-full bg-accent text-slate-900 font-black py-4 rounded-xl uppercase text-xs tracking-[0.3em] shadow-2xl active:scale-95 transition-transform"
                type="submit"
              >
                APLICAR
              </button>
            </form>
          </div>
        )}
      </section>

      {/* Grid */}
      <section className="container mx-auto px-4 md:px-8 py-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Carregando estoque...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {paginatedCars.map(car => (
                <div
                  key={car.id}
                  onClick={() => onSelectCar(String(car.id))}
                  className="group bg-white dark:bg-card-dark rounded-2xl overflow-hidden shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 border border-slate-100 dark:border-white/5 cursor-pointer"
                >
                  <div className="relative overflow-hidden h-72">
                    <img
                      alt={car.model}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      src={car.image || (car.images && car.images.length > 0 ? car.images[0] : '/logo-MGE.png')}
                    />
                    <div className="absolute top-4 left-4 bg-accent text-slate-900 px-4 py-2 font-black text-lg rounded-xl shadow-2xl">
                      R$ {car.price.toLocaleString('pt-BR')}
                    </div>
                    {car.isFeatured && (
                      <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 font-black text-[10px] rounded-lg uppercase tracking-[0.2em] shadow-lg">
                        Destaque
                      </div>
                    )}
                    {car.isSold && (
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                        <span className="bg-red-600 text-white px-6 py-2 rounded-xl font-black uppercase tracking-[0.4em] text-xl shadow-2xl transform -rotate-12 border-4 border-white">Vendido</span>
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                      <h3 className="text-2xl font-display font-black text-slate-900 dark:text-white uppercase tracking-tighter">{car.brand} {car.model}</h3>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium line-clamp-2 mb-8 leading-relaxed">
                      {car.description}
                    </p>
                    <div className="grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-white/10 pt-6 text-center">
                      <div className="bg-slate-50/50 dark:bg-background-dark/50 py-3 rounded-xl border border-slate-100 dark:border-white/5">
                        <span className="block text-slate-900 dark:text-white text-base font-black mb-0.5 leading-none">{car.year_fab}/{car.year_mod}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ano</span>
                      </div>
                      <div className="bg-slate-50/50 dark:bg-background-dark/50 py-3 rounded-xl border border-slate-100 dark:border-white/5">
                        <span className="block text-slate-900 dark:text-white text-base font-black mb-0.5 leading-none">{car.transmission === 'Automático' ? 'Auto' : 'Man'}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Câmbio</span>
                      </div>
                      <div className="bg-slate-50/50 dark:bg-background-dark/50 py-3 rounded-xl border border-slate-100 dark:border-white/5">
                        <span className="block text-slate-900 dark:text-white text-base font-black mb-0.5 leading-none">{car.mileage.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">KM</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-8 pb-8">
                    <button
                      onClick={() => onSelectCar(String(car.id))}
                      className="w-full bg-primary hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-primary/20 uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                    >
                      VER DETALHES <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-20 gap-3">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-card-dark shadow-xl hover:bg-primary hover:text-white transition-all text-slate-400 border border-slate-100 dark:border-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined font-black">chevron_left</span>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-12 h-12 flex items-center justify-center rounded-xl shadow-2xl font-black text-lg transition-all ${currentPage === page
                      ? 'bg-primary text-white'
                      : 'bg-white dark:bg-card-dark text-slate-400 dark:text-white hover:bg-primary hover:text-white border border-slate-100 dark:border-white/5'
                      }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-card-dark shadow-xl hover:bg-primary hover:text-white transition-all text-slate-400 border border-slate-100 dark:border-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined font-black">chevron_right</span>
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Stock;
