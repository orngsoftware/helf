import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/NavbarHoriz';
import Home from './pages/Home';
import About from './pages/About';
import SignUpForm from './pages/Register';
import LoginForm from './pages/LogIn';

const LandingPage = () => {
  const location = useLocation();

  return (
    <>
      {!(location.pathname === "/sign-up" || location.pathname === "/log-in") && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/log-in" element={<LoginForm />} />
      </Routes>
    </>
  );
};

const App = () => (
  <React.StrictMode>
    <Router>
      <LandingPage />
    </Router>
  </React.StrictMode>
);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
