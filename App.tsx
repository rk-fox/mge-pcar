import React, { useState } from 'react';
import Layout from './components/Layout';
import Home from './views/Home';
import Stock from './views/Stock';
import CarDetails from './views/CarDetails';
import Advertise from './views/Advertise';
import About from './views/About';
import Contact from './views/Contact';
import CreateVehicle from './views/Admin/CreateVehicle';
import { ViewState, Car } from './types';
import { CARS } from './constants';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewToken, setReviewToken] = useState<string | null>(null);

  React.useEffect(() => {
    fetchCars();

    // Check for review token in URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('review_token');
    if (token) {
      setReviewToken(token);
      setCurrentView('ABOUT');
    }
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('stocks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cars:', error);
      setCars(CARS);
    } else if (data && data.length > 0) {
      const camelCaseCars = data.map((item: any) => ({
        ...item,
        isFeatured: item.is_featured,
        isSold: item.is_sold
      }));
      setCars(camelCaseCars);
    } else {
      setCars(CARS);
    }
    setLoading(false);
  };

  const handleSelectCar = (carId: string) => {
    setSelectedCarId(carId);
    setCurrentView('DETAILS');
    window.scrollTo(0, 0);
  };

  const handleChangeView = (view: ViewState) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  if (currentView === 'ADMIN_CREATE') {
    return <CreateVehicle onBack={() => handleChangeView('HOME')} onCarUpdate={fetchCars} />;
  }

  return (
    <Layout currentView={currentView} onChangeView={handleChangeView}>
      {currentView === 'HOME' && <Home onChangeView={handleChangeView} onSelectCar={handleSelectCar} cars={cars} loading={loading} />}
      {currentView === 'STOCK' && <Stock onSelectCar={handleSelectCar} cars={cars} loading={loading} />}
      {currentView === 'DETAILS' && selectedCarId && (
        <CarDetails car={cars.find(c => String(c.id) === String(selectedCarId)) || cars[0]} />
      )}
      {currentView === 'ADVERTISE' && <Advertise />}
      {currentView === 'ABOUT' && <About reviewToken={reviewToken} />}
      {currentView === 'CONTACT' && <Contact />}
    </Layout>
  );
};

export default App;
