import React from 'react';
import { ViewState, Car } from '../types';

interface HomeProps {
  onChangeView: (view: ViewState) => void;
  onSelectCar: (carId: string) => void;
  cars: Car[];
  loading: boolean;
}

const Home: React.FC<HomeProps> = ({ onChangeView, onSelectCar, cars, loading }) => {
  const featuredCars = cars.filter(car => car.isFeatured || car.price > 200000).slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[55vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Entrega de chaves"
            className="w-full h-full object-cover scale-105"
            src="https://raw.githubusercontent.com/rk-fox/mge-pcar/refs/heads/main/public/capa-youtube.png"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent dark:from-black dark:via-black/90"></div>
        </div>

        <div className="relative container mx-auto px-4 md:px-8 z-10 py-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent font-bold text-xs mb-6 tracking-widest uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              Seu Próximo Carro Está Aqui
            </div>
            <h1 className="font-display text-5xl md:text-8xl font-black text-white mb-6 uppercase leading-[0.85] tracking-tighter drop-shadow-2xl">
              NEGÓCIO <br />
              <span className="text-accent drop-shadow-[0_2px_10px_rgba(250,204,21,0.3)]">FÁCIL E SEGURO.</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-slate-200 max-w-xl font-medium leading-relaxed">
              Encontre o veículo dos seus sonhos com a consultoria personalizada e a garantia que só a MGE oferece.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onChangeView('STOCK')}
                className="bg-primary hover:bg-blue-700 text-white px-10 py-5 rounded-xl font-black text-lg transition-all transform hover:scale-105 shadow-2xl flex items-center gap-3 tracking-widest uppercase"
              >
                <span className="material-symbols-outlined">directions_car</span> VER ESTOQUE
              </button>
              <button
                onClick={() => onChangeView('ADVERTISE')}
                className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white px-10 py-5 rounded-xl font-black text-lg transition-all shadow-2xl flex items-center gap-3 tracking-widest uppercase"
              >
                <span className="material-symbols-outlined">sell</span> VENDER MEU CARRO
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-slate-900 dark:bg-black border-y border-white/5 py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          <div className="flex items-center gap-6 text-white justify-center md:justify-start group">
            <div className="bg-primary/20 p-4 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
              <span className="material-symbols-outlined text-primary group-hover:text-white text-3xl">credit_card</span>
            </div>
            <div>
              <p className="font-black text-lg leading-tight uppercase tracking-tighter">Financiamento</p>
              <p className="text-sm text-slate-400">Taxas competitivas e aprovação rápida</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-white justify-center md:justify-start group">
            <div className="bg-secondary/20 p-4 rounded-2xl flex items-center justify-center group-hover:bg-secondary transition-colors duration-300">
              <span className="material-symbols-outlined text-secondary group-hover:text-white text-3xl">verified</span>
            </div>
            <div>
              <p className="font-black text-lg leading-tight uppercase tracking-tighter">Garantia MGE</p>
              <p className="text-sm text-slate-400">Veículos 100% revisados e com procedência</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-white justify-center md:justify-start group">
            <div className="bg-accent/20 p-4 rounded-2xl flex items-center justify-center group-hover:bg-accent transition-colors duration-300">
              <span className="material-symbols-outlined text-accent group-hover:text-slate-900 text-3xl">support_agent</span>
            </div>
            <div>
              <p className="font-black text-lg leading-tight uppercase tracking-tighter">Personal Car</p>
              <p className="text-sm text-slate-400">Consultoria dedicada em cada etapa</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stock */}
      <section className="py-24 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="text-primary font-black text-sm tracking-[0.3em] uppercase mb-4">Seleção Exclusiva</div>
            <h2 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white inline-block relative">
              Ofertas em Destaque
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-1.5 w-24 bg-accent rounded-full"></span>
            </h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
              <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Aguarde...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {featuredCars.map(car => (
                <div
                  key={car.id}
                  onClick={() => onSelectCar(car.id)}
                  className="bg-white dark:bg-card-dark rounded-2xl overflow-hidden shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 group border border-slate-100 dark:border-white/5 cursor-pointer"
                >
                  <div className="relative overflow-hidden h-72">
                    <img alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={car.image || (car.images && car.images.length > 0 ? car.images[0] : '/logo-MGE.png')} />
                    <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg">Destaque</div>
                    <div className="absolute bottom-0 right-0 bg-accent text-slate-900 px-6 py-3 font-black text-2xl rounded-tl-2xl shadow-2xl">
                      R$ {car.price.toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="font-display text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-1">{car.brand} {car.model}</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-sm tracking-wide">{car.version}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 border-t border-b border-slate-100 dark:border-white/5 py-6 my-6">
                      <div className="text-center">
                        <span className="material-symbols-outlined text-primary mb-1">calendar_today</span>
                        <p className="text-[10px] text-slate-400 font-black uppercase">Ano</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-200">{car.year_fab}/{car.year_mod}</p>
                      </div>
                      <div className="text-center">
                        <span className="material-symbols-outlined text-primary mb-1">speed</span>
                        <p className="text-[10px] text-slate-400 font-black uppercase">KM</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-200">{car.mileage.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <span className="material-symbols-outlined text-primary mb-1">settings</span>
                        <p className="text-[10px] text-slate-400 font-black uppercase">Câmbio</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-200">Auto</p>
                      </div>
                    </div>
                    <button onClick={() => onSelectCar(car.id)} className="w-full bg-slate-50 dark:bg-white/5 hover:bg-primary hover:text-white dark:text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 text-sm">
                      Ver detalhes <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-20 text-center">
            <button onClick={() => onChangeView('STOCK')} className="inline-flex items-center gap-3 font-black text-primary hover:text-secondary border-b-4 border-primary/20 hover:border-secondary transition-all pb-2 text-xl tracking-tighter uppercase">
              EXPLORAR TODO O ESTOQUE <span className="material-symbols-outlined">apps</span>
            </button>
          </div>
        </div>
      </section>

      {/* CTA Sell Car */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img alt="Abstract car details" className="w-full h-full object-cover grayscale" src="https://raw.githubusercontent.com/rk-fox/mge-pcar/refs/heads/main/public/capa-youtube.png" />
        </div>
        <div className="absolute inset-0 bg-primary/80"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-white/10 backdrop-blur-2xl rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 lg:p-20 border border-white/20 flex flex-col lg:flex-row items-center gap-8 md:gap-16 shadow-2xl">
            <div className="lg:w-2/3 text-white">
              <div className="text-accent font-black text-sm tracking-[0.3em] uppercase mb-6">Venda Facilitada</div>
              <h2 className="font-display text-4xl md:text-6xl font-black mb-8 uppercase leading-[0.9] tracking-tighter">Venda seu veículo com <br /><span className="text-accent">valorização real.</span></h2>
              <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl font-medium">Na MGE Personal Car, sua venda é tratada com exclusividade. Avaliamos seu veículo com as melhores condições e garantimos rapidez.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
                  <span className="material-symbols-outlined text-accent text-3xl">verified</span>
                  <span className="font-bold tracking-tight">Melhor avaliação do mercado</span>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
                  <span className="material-symbols-outlined text-accent text-3xl">security</span>
                  <span className="font-bold tracking-tight">Segurança jurídica total</span>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => onChangeView('ADVERTISE')}
                  className="bg-blue-700 text-white hover:bg-accent hover:text-slate-900 px-12 py-6 rounded-2xl font-black text-xl transition-all shadow-2xl transform hover:scale-105 active:scale-95 uppercase tracking-widest"
                >
                  QUERO VENDER AGORA
                </button>
              </div>
            </div>
            <div className="lg:w-1/3 hidden lg:block relative group">
              <div className="absolute inset-0 bg-accent rounded-[2rem] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <img alt="Negociação MGE" className="rounded-[2rem] shadow-2xl border-8 border-white/20 transform rotate-3 relative z-10 group-hover:rotate-0 transition-transform duration-500" src="/logo-MGE.png" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
