import React, { useState, useEffect } from 'react';
import { getSiteContent } from '../lib/supabase';

function About() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      try {
        const data = await getSiteContent();
        
        // Convert content array to key-value object for easier access
        const contentMap = data.reduce((acc, item) => {
          acc[item.key] = item.value;
          return acc;
        }, {} as Record<string, string>);
        
        setContent(contentMap);
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
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{content.about_title}</h1>
        
        <div className="prose prose-lg">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="aspect-w-16 aspect-h-9 mb-6">
              <img 
                src={content.about_main_image}
                alt="Artist in studio" 
                className="rounded-lg object-cover w-full h-[400px]"
              />
            </div>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Artist Statement</h2>
                <p className="text-gray-600 italic mb-6">
                  {content.about_intro}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">My Journey</h3>
                <p className="text-gray-600 mb-4">
                  {content.about_journey}
                </p>
                <p className="text-gray-600">
                  I find joy in painting botanicals and whimsical birds, particularly with watercolors. 
                  The way the colors blend and layer allows me to capture the essence of nature, like 
                  the fading hues of a summer sunset. To strengthen my creative practice, I explore a 
                  variety of materials such as acrylics and pastels. Additionally, I enjoy incorporating 
                  materials found in nature into my printmaking, using leaves, flowers, and other natural 
                  elements to create textures and patterns that reflect the organic beauty of the world. 
                  The challenge of blending different colors and mediums to reflect the complexities of 
                  nature is a source of constant inspiration and fulfillment for me.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Artist Statement</h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                {content.about_statement}
              </p>
              <p className="text-gray-600">
                I am drawn to the quiet dialogue between textures and colors in nature—the softness 
                of moss against the rough bark of trees, the gradient of a sunset sky with its vibrant 
                oranges, pinks and purples, cosmos bending in the breeze and reaching toward the sun. 
                My work seeks to capture these stories.
              </p>
              <p className="text-gray-600">
                I enjoy using a variety of materials and mediums to express these observations. Whether 
                it's the fluidity of watercolors, the boldness of acrylics, the softness of pastels, 
                or the precision of pen work, I embrace the unique qualities each medium offers. I am 
                fascinated by printmaking, an exploration that allows me to experiment with textures 
                and layering in a way that reflects the complexities of the natural world. By combining 
                these mediums, I aim to create work that speaks to the layered richness of the environment. 
                My hope is that my art will inspire others to appreciate the tiny details in the world 
                around them and let the whimsical elements of nature inspire.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;