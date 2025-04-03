import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Flower2 } from 'lucide-react';
import { getSiteContent } from '../lib/supabase';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadContent() {
      try {
        const data = await getSiteContent();
        const contentMap = data.reduce((acc, item) => {
          acc[item.key] = item.value;
          return acc;
        }, {} as Record<string, string>);
        setContent(contentMap);
      } catch (err) {
        console.error('Error loading content:', err);
      }
    }

    loadContent();
  }, []);

  return (
    <nav className="bg-white shadow-sm">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            {content.site_logo !== 'none' && (
              <Flower2 className="h-8 w-8" style={{ color: content.primary_color }} />
            )}
            <span className="font-serif text-2xl">{content.site_name || 'A Whimsical Brush'}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/gallery" className="nav-link">Gallery</Link>
            <Link to="/events" className="nav-link">Events</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>Home</Link>
              <Link to="/about" className="nav-link" onClick={() => setIsOpen(false)}>About</Link>
              <Link to="/gallery" className="nav-link" onClick={() => setIsOpen(false)}>Gallery</Link>
              <Link to="/events" className="nav-link" onClick={() => setIsOpen(false)}>Events</Link>
              <Link to="/contact" className="nav-link" onClick={() => setIsOpen(false)}>Contact</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;