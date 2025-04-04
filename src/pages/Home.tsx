import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Instagram, X } from 'lucide-react';
import NewsletterSignup from '../components/NewsletterSignup';
import { getFeaturedArtworks, getSiteContent } from '../lib/supabase';

interface Artwork {
  id: string;
  title: string;
  image_url: string;
  medium: string;
  year: string;
  dimensions?: string;
  status?: string;
  description?: string;
}

interface SiteContent {
  key: string;
  value: string;
  type: string;
}

const Home = () => {
  const [featuredWorks, setFeaturedWorks] = useState<Artwork[]>([]);
  const [siteContent, setSiteContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  useEffect(() => {
    async function loadContent() {
      try {
        const [artworksData, contentData] = await Promise.all([
          getFeaturedArtworks(),
          getSiteContent()
        ]);

        setFeaturedWorks(artworksData);

        // Convert content array to key-value object for easier access
        const contentMap = contentData.reduce((acc, item) => {
          acc[item.key] = item.value;
          return acc;
        }, {} as Record<string, string>);
        
        setSiteContent(contentMap);
      } catch (err) {
        console.error('Error loading content:', err);
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url("${siteContent.home_hero_image || ''}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="container-custom relative text-center text-white">
          <h1 className="text-4xl md:text-6xl font-serif mb-6">
            {siteContent.home_hero_title || ''}
          </h1>
          <p className="text-xl italic mb-8">{siteContent.home_hero_subtitle || ''}</p>
          <Link to="/gallery" className="btn-primary">
            Explore Gallery
          </Link>
        </div>
      </section>

      {/* Artist Intro */}
      <section className="py-20 bg-gradient-to-b from-white to-primary-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif mb-6">
              Welcome
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              I'm an artist, teacher, and mom who rediscovered my creative passion in 2020 while designing art projects for my young child. I work with mostly watercolors and find great joy in painting botanicals and whimsy creatures like birds and butterflies. Acrylics and pastels on large canvases allow me to express big ideas, to recreate a moment in nature that stays in my mind.
            </p>
            <Link to="/about" className="inline-flex items-center text-primary-600 hover:text-primary-700">
              Read More About My Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Works */}
      <section className="py-20">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-12">
            {siteContent.home_featured_title || 'Featured Works'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredWorks.map((artwork) => (
              <div 
                key={artwork.id} 
                className="artwork-card cursor-pointer"
                onClick={() => setSelectedArtwork(artwork)}
              >
                <img 
                  src={`${artwork.image_url}?auto=format&fit=crop&w=800&q=80`}
                  alt={artwork.title}
                  className="w-full h-80 object-cover"
                />
                <div className="artwork-overlay">
                  <div className="text-white text-center">
                    <h3 className="text-xl font-serif mb-2">{artwork.title}</h3>
                    <p className="text-sm">{artwork.medium}{artwork.medium && artwork.year ? ', ' : ''}{artwork.year}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">
              {siteContent.home_instagram_title || 'Follow My Journey'}
            </h2>
            <a 
              href="https://www.instagram.com/a_whimsical_brush/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary-600 hover:text-primary-700"
            >
              <Instagram className="h-5 w-5 mr-2" />
              {siteContent.home_instagram_text || '@a_whimsical_brush'}
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              siteContent.instagram_feed_1 || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38',
              siteContent.instagram_feed_2 || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5',
              siteContent.instagram_feed_3 || 'https://images.unsplash.com/photo-1574182245530-967d9b3831af'
            ].map((image, index) => (
              <a
                key={index}
                href="https://www.instagram.com/a_whimsical_brush/"
                target="_blank"
                rel="noopener noreferrer"
                className="block aspect-square overflow-hidden"
              >
                <img
                  src={`${image}?auto=format&fit=crop&w=600&q=80`}
                  alt="Art process"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section - Commented out until ready to use
      <section className="py-20 bg-nature-sage bg-opacity-10">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-serif mb-6">
              {siteContent.home_newsletter_title || 'Stay Inspired'}
            </h2>
            <p className="text-gray-600 mb-8">
              {siteContent.home_newsletter_text || 'Join my newsletter to receive updates about new works, exhibitions, and artistic insights.'}
            </p>
            <NewsletterSignup />
          </div>
        </div>
      </section>
      */}

      {/* Artwork Modal */}
      {selectedArtwork && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="max-w-4xl w-full bg-white rounded-lg overflow-hidden relative">
            <button 
              onClick={() => setSelectedArtwork(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-10"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="grid md:grid-cols-2">
              <div className="h-[500px]">
                <img 
                  src={`${selectedArtwork.image_url}?auto=format&fit=crop&w=800&q=80`}
                  alt={selectedArtwork.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-8">
                <h2 className="text-3xl font-serif mb-4">{selectedArtwork.title}</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">Medium</h3>
                    <p>{selectedArtwork.medium}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">Year</h3>
                    <p>{selectedArtwork.year}</p>
                  </div>
                  {selectedArtwork.dimensions && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500">Dimensions</h3>
                      <p>{selectedArtwork.dimensions}</p>
                    </div>
                  )}
                  {selectedArtwork.status && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500">Status</h3>
                      <p>{selectedArtwork.status}</p>
                    </div>
                  )}
                  {selectedArtwork.description && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500">Description</h3>
                      <p className="text-gray-600">{selectedArtwork.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;