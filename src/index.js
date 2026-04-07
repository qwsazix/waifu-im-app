import React from 'react';
import { useEffect } from 'react';
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
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavouritesProvider } from './context/FavouritesContext';
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './context/ThemeContext';
import { BASE_URL } from "./config";

const root = ReactDOM.createRoot(document.getElementById('root'));

function Root() {
  useEffect(() => {
    const pingingServer = async () => {
      try {
      const response = await fetch(`${BASE_URL}/ping`);
      if (response.ok) console.log('Server is awake and ready');
      } catch (err) {
        console.log('Server is pinged and waking up.');
      }
    }

    pingingServer();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <FavouritesProvider>
          <HashRouter>
            <NavbarWrapper />
            <Routes>
              <Route index element={<Home />} />
              <Route path="/cabinet" element={<Cabinet />} />
              <Route path="/signup" element={<SignupWrapper />} />
              <Route path="/signin" element={<LoginWrapper />} />
            </Routes>
          </HashRouter>
        </FavouritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function NavbarWrapper() {
  const { theme, toggleTheme } = useTheme();
  return <Navbar theme={theme} onToggleTheme={toggleTheme} />;
}

function SignupWrapper() {
  const { theme } = useTheme();
  return <Signup theme={theme} />;
}

function LoginWrapper() {
  const { theme } = useTheme();
  return <Login theme={theme} />
}

root.render(<Root />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
