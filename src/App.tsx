import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Flower2 } from 'lucide-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Events from './pages/Events';
import Admin from './pages/Admin';
import Messages from './pages/Messages';
import Login from './pages/Login';
import Register from './pages/Register';
import Footer from './components/Footer';
import { getSiteContent } from './lib/supabase';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const data = await getSiteContent();
        const primaryColor = data.find(item => item.key === 'primary_color')?.value || '#c026d3';
        document.documentElement.style.setProperty('--primary-color', primaryColor);
        document.documentElement.style.setProperty('--primary-color-dark', adjustColor(primaryColor, -20));
      } catch (err) {
        console.error('Error loading theme:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, []);

  const adjustColor = (color: string, amount: number) => {
    return '#' + color.replace(/^#/, '').replace(/../g, color => 
      ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).slice(-2)
    );
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/events" element={<Events />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/messages" element={<Messages />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registerjrb" element={<Register />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App