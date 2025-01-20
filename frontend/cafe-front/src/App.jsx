import React from 'react';
import { Route, Routes } from "react-router-dom";
import Home from '../routes/Home';
import Pricing from '../routes/Pricing';
import './App.css'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/pricing' element={<Pricing />} />
      </Routes>
    </div>
  )
}

export default App
