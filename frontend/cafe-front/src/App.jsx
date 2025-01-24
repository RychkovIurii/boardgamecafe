import React from 'react';
import {Route, Routes} from "react-router-dom";
import Home from '../routes/Home';
import './App.css'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home/>}/>
      </Routes>
    </div>
  )
}

export default App
