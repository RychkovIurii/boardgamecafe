import React from 'react';
import { Route, Routes } from "react-router-dom";
import Home from '../routes/Home';
import Pricing from '../routes/Pricing';
import FAQ from '../routes/FAQ';
import Games from '../routes/Games';
import Events from '../routes/Events';
import SignIn from '../routes/SignIn';
import './App.css'
import Bookings from '../routes/Bookings';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/pricing' element={<Pricing />} />
        <Route path='/faq' element={<FAQ />} />
        <Route path='/games' element={<Games/>}/>
        <Route path='/events' element={<Events/>}/>
        <Route path='/sign-in' element={<SignIn/>}/>
        <Route path='/bookings' element={<Bookings />} />
      </Routes>
    </div>
  )
}

export default App
