import React from 'react';
import { Route, Routes } from "react-router-dom";
import Home from '../routes/Home';
import Pricing from '../routes/Pricing';
import FAQ from '../routes/FAQ';
import Games from '../routes/Games';
import Events from '../routes/Events';
import SignIn from '../routes/SignIn';
import AdminDashboard from '../routes/admin/AdminDashboard';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import Contact from '../routes/Contact';
import './App.css';
import Bookings from '../routes/Bookings';
import PrivacyPolicy from '../routes/PrivacyPolicy';
import EditBooking from '../routes/admin/EditBooking';
import EditEvents from '../routes/admin/EditEvents';
import EditTables from '../routes/admin/EditTables';
import EditPricing from '../routes/admin/EditPricing';
import EditHours from '../routes/admin/EditHours';
import Service from '../routes/Service';
import ServiceProduct from '../routes/ServiceProduct';
import { CheckoutForm, Return } from '../routes/Payment';
import Profile from '../routes/Profile';

function App() {

  const { isAuthenticated, isCheckingAuth } = useContext(AuthContext);
  const AdminRoute = ({ element }) => {
    if (isCheckingAuth) return <div>Loading...</div>;
    return isAuthenticated ? element : <Navigate to="/sign-in" />;
  };

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/pricing' element={<Pricing />} />
        <Route path='/faq' element={<FAQ />} />
        <Route path='/games' element={<Games />} />
        <Route path='/events' element={<Events />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/bookings' element={<Bookings />} />
		<Route path="/checkout" element={<CheckoutForm />} />
        <Route path="/return" element={<Return />} />
        <Route path='/admin' element={<AdminRoute element={<AdminDashboard />} />} />
		<Route path='/admin/edit-events' element={<AdminRoute element={<EditEvents />} />} />
		<Route path='/admin/edit-pricing' element={<AdminRoute element={<EditPricing />} />} />
		<Route path='/admin/edit-tables' element={<AdminRoute element={<EditTables />} />} />
        <Route path="/admin/edit-booking/:id" element={<AdminRoute element={<EditBooking />} />} />
		<Route path="/admin/edit-hours" element={<AdminRoute element={<EditHours />} />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/service' element={<Service />} />
        <Route path='/service-product/:serviceId' element={<ServiceProduct />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </div>
  )
}

export default App;
