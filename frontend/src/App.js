import React from "react";
import './css/pico.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AdminPage, LoginPage } from './pages'

const App = () => {
  return (
    <Router data-theme="dark">
      <Routes>
        <Route path='/' element={<LoginPage/>} />
        <Route path='/admin' element={<AdminPage/>} />
      </Routes>
    </Router>
  );
};

export default App;
