import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getAllArtworks } from '../lib/supabase';

interface Artwork {
  id: string;
  title: string;
  image_url: string;
  medium: string;
  year: string;
  dimensions: string;
  status: string;
  description?: string;
}

function Gallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadArtworks() {
      try {
        const data = await getAllArtworks();
        setArtworks(data);
      } catch (err) {
        setError('Failed to load artworks');
        console.error('Error loading artworks:', err);
      } finally {
        setLoading(false);
      }
    }

    loadArtworks();
  }, []);

  if (loading) {
    return (
      <div className="container-custom py-12 text-center">
        <p>Loading artworks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-12 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-serif text-center mb-12">Gallery</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {artworks.map((artwork) => (
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
              <div className="text-white text-center p-4">
                <h3 className="text-xl font-serif mb-2">{artwork.title}</h3>
                <p className="text-sm">{artwork.medium}, {artwork.year}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedArtwork && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4">
          {/* Close button bar at top for mobile */}
          <div className="w-full flex justify-between items-center bg-white py-2 px-4 mb-2 rounded-t-lg md:hidden">
            <h3 className="text-lg font-medium text-gray-900">{selectedArtwork.title}</h3>
            <button 
              onClick={() => setSelectedArtwork(null)}
              className="text-gray-800 p-1"
              aria-label="Close lightbox"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="max-w-4xl w-full bg-white rounded-lg md:rounded-t-lg overflow-hidden relative">
            {/* Close button at top right (desktop only) */}
            <button 
              onClick={() => setSelectedArtwork(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 hidden md:block"
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
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">Dimensions</h3>
                    <p>{selectedArtwork.dimensions}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">Status</h3>
                    <p>{selectedArtwork.status}</p>
                  </div>
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
}

export default Gallery;