import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// --- Public Routes ---
import Home from '../routes/Home';
import Pricing from '../routes/Pricing';
import FAQ from '../routes/FAQ';
import Games from '../routes/Games';
import Events from '../routes/Events';
import SignIn from '../routes/SignIn';
import Bookings from '../routes/Bookings';
import Contact from '../routes/Contact';
import PrivacyPolicy from '../routes/PrivacyPolicy';
import Service from '../routes/Service';
import ServiceProduct from '../routes/ServiceProduct';
import Profile from '../routes/Profile';
import { CheckoutForm, Return } from '../routes/Payment';

// --- Admin Routes ---
import AdminDashboard from '../routes/admin/AdminDashboard';
import EditEvents from '../routes/admin/EditEvents';
import EditPricing from '../routes/admin/EditPricing';
import EditTables from '../routes/admin/EditTables';
import EditHours from '../routes/admin/EditHours';
import EditBooking from '../routes/admin/EditBooking';

import './App.css';

const AdminRoute = ({ element }) => {
  const { isAuthenticated, isCheckingAuth } = useContext(AuthContext);
  if (isCheckingAuth) return <div>Loading...</div>;
  return isAuthenticated ? element : <Navigate to="/sign-in" />;
};

function App() {
	return (
	  <div className="App">
		<Routes>
		  {/* Public routes */}
		  <Route path='/' element={<Home />} />
		  <Route path='/pricing' element={<Pricing />} />
		  <Route path='/faq' element={<FAQ />} />
		  <Route path='/games' element={<Games />} />
		  <Route path='/events' element={<Events />} />
		  <Route path='/sign-in' element={<SignIn />} />
		  <Route path='/bookings' element={<Bookings />} />
		  <Route path='/checkout' element={<CheckoutForm />} />
		  <Route path='/return' element={<Return />} />
		  <Route path='/contact' element={<Contact />} />
		  <Route path='/privacy-policy' element={<PrivacyPolicy />} />
		  <Route path='/service' element={<Service />} />
		  <Route path='/service-product/:serviceId' element={<ServiceProduct />} />
		  <Route path='/profile' element={<Profile />} />
		  <Route path='/account' element={<MyBookings />} />
  
		  {/* Admin routes */}
		  <Route path='/admin' element={<AdminRoute element={<AdminDashboard />} />} />
		  <Route path='/admin/edit-events' element={<AdminRoute element={<EditEvents />} />} />
		  <Route path='/admin/edit-pricing' element={<AdminRoute element={<EditPricing />} />} />
		  <Route path='/admin/edit-tables' element={<AdminRoute element={<EditTables />} />} />
		  <Route path='/admin/edit-hours' element={<AdminRoute element={<EditHours />} />} />
		  <Route path='/admin/edit-booking/:id' element={<AdminRoute element={<EditBooking />} />} />
		</Routes>
	  </div>
	);
}

export default App;
