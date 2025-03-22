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
import './App.css'
import Bookings from '../routes/Bookings';
import EditBooking from '../routes/admin/EditBooking';
import Service from '../routes/Service';
import ServiceProduct from '../routes/ServiceProduct';
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
        <Route path='/admin' element={<AdminRoute element={<AdminDashboard />} />} />
        <Route path="/admin/edit-booking/:id" element={<AdminRoute element={<EditBooking />} />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/service' element={<Service />} />
        <Route path='/service-product/:serviceId' element={<ServiceProduct />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </div>
  )
}

export default App;
