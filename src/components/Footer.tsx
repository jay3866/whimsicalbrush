import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, Flower2 } from 'lucide-react';
import { getSiteContent } from '../lib/supabase';

const Footer = () => {
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
    <footer className="bg-gray-50 border-t">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              {content.site_logo !== 'none' && (
                <Flower2 className="h-8 w-8" style={{ color: content.primary_color }} />
              )}
              <span className="font-serif text-2xl">{content.site_name || 'A Whimsical Brush'}</span>
            </Link>
            <p className="text-gray-600 mb-4">
              Creating art inspired by nature's endless beauty and the delicate balance of life.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/a_whimsical_brush"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600 transition-colors"
                style={{ '--tw-text-opacity': 1, '--tw-hover-color': content.primary_color } as any}
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a 
                href="mailto:A.Whinsical.Brush@gmail.com"
                className="text-gray-600 hover:text-primary-600 transition-colors"
                style={{ '--tw-text-opacity': 1, '--tw-hover-color': content.primary_color } as any}
              >
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="nav-link">About</Link></li>
              <li><Link to="/gallery" className="nav-link">Gallery</Link></li>
              <li><Link to="/events" className="nav-link">Events</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-4">More</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="nav-link">Contact</Link></li>
              <li><Link to="/terms" className="nav-link">Terms of Use</Link></li>
              <li><Link to="/privacy" className="nav-link">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="container-custom py-6">
          <p className="text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} {content.site_name || 'A Whimsical Brush'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;