import React from 'react';
import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


//pages
import Home from './pages/Home/Home';
import Cabinet from './pages/Cabinet/Cabinet';
import Navbar from './pages/Navbar/Navbar';
import Login from './pages/Auth/login/Login';
import Signup from './pages/Auth/register/Signup';

import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavouritesProvider } from './context/FavouritesContext';


const basename = process.env.PUBLIC_URL || "/";
const root = ReactDOM.createRoot(document.getElementById('root'));

function Root() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");

    if (saved) return saved;

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
  };

  return (
    <AuthProvider>
      <FavouritesProvider>
        <BrowserRouter basename={basename}>
          <Navbar onToggleTheme={toggleTheme} theme={theme} />
          <Routes>
            <Route index element={<Home />} />
            <Route path="/cabinet" element={<Cabinet />} />
            <Route path="/signup" element={<Signup theme={theme} />} />
            <Route path="/signin" element={<Login theme={theme} />} />
          </Routes>
        </BrowserRouter>
      </FavouritesProvider>
    </AuthProvider>
  );
}

root.render(<Root />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
