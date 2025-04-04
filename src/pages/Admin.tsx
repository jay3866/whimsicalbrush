import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Save, X, Settings, Flower2, Calendar, Clock, MapPin } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { supabase, getSiteContent, updateSiteContent, getEvents, createEvent, updateEvent, deleteEvent } from '../lib/supabase';

interface Artwork {
  id: string;
  title: string;
  image_url: string;
  medium: string;
  year: string;
  dimensions: string;
  status: string;
  description?: string;
  is_featured: boolean;
  display_order: number;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image_url: string;
  created_at?: string;
  updated_at?: string;
}

interface SiteContent {
  key: string;
  value: string;
  type: string;
}

const contentSections = {
  home: [
    'home_hero_image',
    'home_hero_title',
    'home_hero_subtitle',
    'home_welcome_title',
    'home_welcome_text',
    'home_featured_title',
    'home_instagram_title',
    'home_instagram_text',
    'home_newsletter_title',
    'home_newsletter_text',
    'instagram_feed_1',
    'instagram_feed_2',
    'instagram_feed_3'
  ],
  about: [
    'about_main_image',
    'about_title',
    'about_intro',
    'about_journey',
    'about_statement'
  ],
  contact: [
    'contact_title',
    'contact_intro',
    'contact_email',
    'contact_instagram',
    'contact_location'
  ],
  events: [
    'events_title',
    'events_intro',
    'events_cta_title',
    'events_cta_text'
  ],
  settings: [
    'site_logo',
    'site_name',
    'primary_color'
  ]
};

function Admin() {
  const navigate = useNavigate();
  const [mainTab, setMainTab] = useState<'artworks' | 'pages' | 'events'>('artworks');
  const [pageTab, setPageTab] = useState<'home' | 'about' | 'contact' | 'events' | 'settings'>('home');
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [newArtwork, setNewArtwork] = useState(false);
  const [newEvent, setNewEvent] = useState(false);
  const [formData, setFormData] = useState<Partial<Artwork>>({});
  const [eventFormData, setEventFormData] = useState<Partial<Event>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [eventImageFile, setEventImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingContent, setEditingContent] = useState<string | null>(null);
  const [contentValue, setContentValue] = useState('');
  const [contentImageFile, setContentImageFile] = useState<File | null>(null);

  useEffect(() => {
    checkAuth();
    loadData();
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
    }
  }

  async function loadData() {
    try {
      const [artworksData, contentData, eventsData] = await Promise.all([
        supabase
          .from('artworks')
          .select('*')
          .order('display_order', { ascending: true }),
        getSiteContent(),
        getEvents()
      ]);

      if (artworksData.error) throw artworksData.error;
      setArtworks(artworksData.data || []);
      setSiteContent(contentData || []);
      setEvents(eventsData || []);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleEventInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleEventImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEventImageFile(e.target.files[0]);
    }
  };

  const handleContentImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setContentImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async (file: File, bucket: string = 'artwork-images'): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          upsert: true,
          onUploadProgress: (progress) => {
            setUploadProgress((progress.loaded / progress.total) * 100);
          },
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  };

  const handleEdit = (artwork: Artwork) => {
    setEditingId(artwork.id);
    setFormData(artwork);
    setNewArtwork(false);
    setImageFile(null);
    setUploadProgress(0);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEventId(event.id);
    setEventFormData(event);
    setNewEvent(false);
    setEventImageFile(null);
    setUploadProgress(0);
  };

  const handleNew = () => {
    setNewArtwork(true);
    setEditingId(null);
    setFormData({
      title: '',
      image_url: '',
      medium: '',
      year: '',
      dimensions: '',
      status: '',
      description: '',
      is_featured: false,
      display_order: artworks.length
    });
    setImageFile(null);
    setUploadProgress(0);
  };

  const handleNewEvent = () => {
    setNewEvent(true);
    setEditingEventId(null);
    setEventFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      image_url: ''
    });
    setEventImageFile(null);
    setUploadProgress(0);
  };

  const handleSave = async () => {
    try {
      let imageUrl = formData.image_url;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const dataToSave = {
        ...formData,
        image_url: imageUrl
      };

      if (newArtwork) {
        const { error } = await supabase
          .from('artworks')
          .insert([dataToSave]);
        if (error) throw error;
      } else if (editingId) {
        const { error } = await supabase
          .from('artworks')
          .update(dataToSave)
          .eq('id', editingId);
        if (error) throw error;
      }

      setEditingId(null);
      setNewArtwork(false);
      setImageFile(null);
      setUploadProgress(0);
      loadData();
    } catch (err) {
      setError('Failed to save artwork');
      console.error('Error:', err);
    }
  };

  const handleSaveEvent = async () => {
    try {
      let imageUrl = eventFormData.image_url;

      if (eventImageFile) {
        imageUrl = await uploadImage(eventImageFile, 'event-images');
      }

      const dataToSave = {
        ...eventFormData,
        image_url: imageUrl
      };

      if (newEvent) {
        await createEvent(dataToSave as Omit<Event, 'id' | 'created_at' | 'updated_at'>);
      } else if (editingEventId) {
        await updateEvent(editingEventId, dataToSave);
      }

      setEditingEventId(null);
      setNewEvent(false);
      setEventImageFile(null);
      setUploadProgress(0);
      loadData();
    } catch (err) {
      setError('Failed to save event');
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this artwork?')) return;

    try {
      const artwork = artworks.find(a => a.id === id);
      if (artwork) {
        // Extract filename from URL
        const fileName = artwork.image_url.split('/').pop();
        if (fileName) {
          // Delete image from storage
          await supabase.storage
            .from('artwork-images')
            .remove([fileName]);
        }
      }

      const { error } = await supabase
        .from('artworks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      loadData();
    } catch (err) {
      setError('Failed to delete artwork');
      console.error('Error:', err);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const event = events.find(e => e.id === id);
      if (event) {
        // Extract filename from URL
        const fileName = event.image_url.split('/').pop();
        if (fileName) {
          // Delete image from storage
          await supabase.storage
            .from('event-images')
            .remove([fileName]);
        }
      }

      await deleteEvent(id);
      loadData();
    } catch (err) {
      setError('Failed to delete event');
      console.error('Error:', err);
    }
  };

  const handleEditContent = (content: SiteContent) => {
    setEditingContent(content.key);
    setContentValue(content.value);
    setContentImageFile(null);
  };

  const handleSaveContent = async () => {
    if (!editingContent) return;

    try {
      let finalValue = contentValue;

      if (contentImageFile) {
        const content = siteContent.find(c => c.key === editingContent);
        if (content?.type === 'image_url') {
          finalValue = await uploadImage(contentImageFile, 'site-content');
        }
      }

      await updateSiteContent(editingContent, finalValue);
      
      setSiteContent(prevContent => 
        prevContent.map(content => 
          content.key === editingContent
            ? { ...content, value: finalValue }
            : content
        )
      );

      setEditingContent(null);
      setContentValue('');
      setContentImageFile(null);
    } catch (err) {
      setError('Failed to update content');
      console.error('Error:', err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const getPageContent = (page: string) => {
    const orderedKeys = contentSections[page as keyof typeof contentSections];
    
    return orderedKeys
      .map(key => siteContent.find(content => content.key === key))
      .filter((content): content is SiteContent => content !== undefined);
  };

  if (loading) return <div className="container-custom py-12">Loading...</div>;
  if (error) return <div className="container-custom py-12 text-red-600">{error}</div>;

  return (
    <div className="container-custom py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif">Admin Dashboard</h1>
        <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
          Logout
        </button>
      </div>

      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setMainTab('artworks')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                mainTab === 'artworks'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Artwork Management
            </button>
            <button
              onClick={() => setMainTab('events')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                mainTab === 'events'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Event Management
            </button>
            <button
              onClick={() => navigate('/admin/messages')}
              className={`py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`}
            >
              Messages
            </button>
            <button
              onClick={() => setMainTab('pages')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                mainTab === 'pages'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Page Content
            </button>
          </nav>
        </div>
      </div>

      {mainTab === 'events' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button onClick={handleNewEvent} className="btn-primary">
              <Plus className="h-4 w-4 mr-2 inline" />
              Add New Event
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="h-16 w-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{event.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{event.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{event.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{event.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {mainTab === 'pages' && (
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow">
            <nav className="flex divide-x divide-gray-200">
              <button
                onClick={() => setPageTab('home')}
                className={`flex-1 py-4 px-6 text-sm font-medium ${
                  pageTab === 'home'
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                Home Page
              </button>
              <button
                onClick={() => setPageTab('about')}
                className={`flex-1 py-4 px-6 text-sm font-medium ${
                  pageTab === 'about'
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                About Page
              </button>
              <button
                onClick={() => setPageTab('contact')}
                className={`flex-1 py-4 px-6 text-sm font-medium ${
                  pageTab === 'contact'
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                Contact Page
              </button>
              <button
                onClick={() => setPageTab('events')}
                className={`flex-1 py-4 px-6 text-sm font-medium ${
                  pageTab === 'events'
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                Events Page
              </button>
              <button
                onClick={() => setPageTab('settings')}
                className={`flex-1 py-4 px-6 text-sm font-medium ${
                  pageTab === 'settings'
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                Site Settings
              </button>
            </nav>
          </div>
        </div>
      )}

      {mainTab === 'artworks' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button onClick={handleNew} className="btn-primary">
              <Plus className="h-4 w-4 mr-2 inline" />
              Add New Artwork
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medium
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {artworks.map((artwork) => (
                  <tr key={artwork.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={artwork.image_url}
                        alt={artwork.title}
                        className="h-16 w-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{artwork.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{artwork.medium}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {artwork.is_featured ? '✓' : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{artwork.display_order}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleEdit(artwork)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(artwork.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {mainTab === 'pages' && pageTab === 'settings' && (
        <div className="space-y-8">
          {/* Logo Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Logo Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {siteContent.find(c => c.key === 'site_logo')?.value === 'none' ? (
                    <span className="text-lg font-serif">Text Only</span>
                  ) : (
                    <Flower2 className="h-8 w-8 text-primary-600" />
                  )}
                </div>
                <div className="flex-grow">
                  <select
                    value={siteContent.find(c => c.key === 'site_logo')?.value || 'flower2'}
                    onChange={async (e) => {
                      await updateSiteContent('site_logo', e.target.value);
                      setSiteContent(prev => 
                        prev.map(content => 
                          content.key === 'site_logo'
                            ? { ...content, value: e.target.value }
                            : content
                        )
                      );
                    }}
                    className="w-full px-4 py-2 border rounded-md"
                  >
                    <option value="flower2">Flower Logo</option>
                    <option value="none">Text Only</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  value={siteContent.find(c => c.key === 'site_name')?.value || ''}
                  onChange={async (e) => {
                    await updateSiteContent('site_name', e.target.value);
                    setSiteContent(prev => 
                      prev.map(content => 
                        content.key === 'site_name'
                          ? { ...content, value: e.target.value }
                          : content
                      )
                    );
                  }}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Color Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Color Theme</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex items-start space-x-4">
                  <div>
                    <HexColorPicker
                      color={siteContent.find(c => c.key === 'primary_color')?.value || '#c026d3'}
                      onChange={async (color) => {
                        await updateSiteContent('primary_color', color);
                        setSiteContent(prev => 
                          prev.map(content => 
                            content.key === 'primary_color'
                              ? { ...content, value: color }
                              : content
                          )
                        );
                      }}
                    />
                  </div>
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={siteContent.find(c => c.key === 'primary_color')?.value || '#c026d3'}
                      onChange={async (e) => {
                        await updateSiteContent('primary_color', e.target.value);
                        setSiteContent(prev => 
                          prev.map(content => 
                            content.key === 'primary_color'
                              ? { ...content, value: e.target.value }
                              : content
                          )
                        );
                      }}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                    <div className="mt-2">
                      <div
                        className="h-12 w-full rounded-md border"
                        style={{
                          backgroundColor: siteContent.find(c => c.key === 'primary_color')?.value || '#c026d3'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {mainTab === 'pages' && (
        <div className="space-y-8">
          {getPageContent(pageTab).map((content) => (
            <div key={content.key} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {content.key.split('_').slice(1).map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </h3>
                  <p className="text-sm text-gray-500">{content.type}</p>
                </div>
                <button
                  onClick={() => handleEditContent(content)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <Settings className="h-5 w-5" />
                </button>
              </div>

              {editingContent === content.key ? (
                <div className="space-y-4">
                  {content.type === 'image_url' || content.key.includes('image') ? (
                    <div>
                      <div className="flex items-center space-x-4 mb-4">
                        <input
                          type="text"
                          value={contentValue}
                          onChange={(e) => setContentValue(e.target.value)}
                          className="flex-grow px-4 py-2 border rounded-md"
                          placeholder="Enter image URL"
                        />
                        <span className="text-gray-500">or</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleContentImageChange}
                          className="flex-shrink-0"
                        />
                      </div>
                      <img
                        src={contentImageFile ? URL.createObjectURL(contentImageFile) : contentValue}
                        alt="Preview"
                        className="mt-2 max-w-md rounded-lg"
                      />
                    </div>
                  ) : (
                    <textarea
                      value={contentValue}
                      onChange={(e) => setContentValue(e.target.value)}
                      
                      rows={4}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  )}
                  <div className="flex space-x-4">
                    <button
                      onClick={handleSaveContent}
                      className="btn-primary"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setEditingContent(null);
                        setContentValue('');
                        setContentImageFile(null);
                      }}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-2">
                  {(content.type === 'image_url' || content.key.includes('image')) ? (
                    <img
                      src={content.value}
                      alt="Content preview"
                      className="max-w-md rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-600 whitespace-pre-wrap">{content.value}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {(editingId || newArtwork) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif">
                {newArtwork ? 'Add New Artwork' : 'Edit Artwork'}
              </h2>
              <button onClick={() => {
                setEditingId(null);
                setNewArtwork(false);
              }}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full"
                  />
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="ml-2">
                      {Math.round(uploadProgress)}%
                    </div>
                  )}
                </div>
                {(formData.image_url || imageFile) && (
                  <div className="mt-2">
                    <img
                      src={imageFile ? URL.createObjectURL(imageFile) : formData.image_url}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medium
                </label>
                <input
                  type="text"
                  name="medium"
                  value={formData.medium || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <input
                  type="text"
                  name="year"
                  value={formData.year || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dimensions
                </label>
                <input
                  type="text"
                  name="dimensions"
                  value={formData.dimensions || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <input
                  type="text"
                  name="status"
                  value={formData.status || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  name="display_order"
                  value={formData.display_order || 0}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured || false}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">
                  Featured on Homepage
                </label>
              </div>

              <button onClick={handleSave} className="btn-primary w-full">
                <Save className="h-4 w-4 mr-2 inline" />
                Save Artwork
              </button>
            </div>
          </div>
        </div>
      )}

      {(editingEventId || newEvent) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif">
                {newEvent ? 'Add New Event' : 'Edit Event'}
              </h2>
              <button onClick={() => {
                setEditingEventId(null);
                setNewEvent(false);
              }}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={eventFormData.title || ''}
                  onChange={handleEventInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEventImageChange}
                    className="w-full"
                  />
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="ml-2">
                      {Math.round(uploadProgress)}%
                    </div>
                  )}
                </div>
                {(eventFormData.image_url || eventImageFile) && (
                  <div className="mt-2">
                    <img
                      src={eventImageFile ? URL.createObjectURL(eventImageFile) : eventFormData.image_url}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="text"
                  name="date"
                  value={eventFormData.date || ''}
                  onChange={handleEventInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="e.g., April 15-30, 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="text"
                  name="time"
                  value={eventFormData.time || ''}
                  onChange={handleEventInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="e.g., 10:00 AM - 6:00 PM"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={eventFormData.location || ''}
                  onChange={handleEventInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={eventFormData.description || ''}
                  onChange={handleEventInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>

              <button onClick={handleSaveEvent} className="btn-primary w-full">
                <Save className="h-4 w-4 mr-2 inline" />
                Save Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;