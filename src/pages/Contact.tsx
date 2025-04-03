import React, { useState } from 'react';
import { Mail, Instagram, Send } from 'lucide-react';
import { createMessage } from '../lib/supabase';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await createMessage(formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to send message');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-serif text-center mb-12">Contact</h1>

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-serif mb-4">Get in Touch</h2>
              <p className="text-gray-600 mb-6">
                I'd love to hear from you. Whether you're interested in my artwork,
                have questions about commissions, or just want to say hello.
              </p>
            </div>

            <div className="space-y-4">
              <a 
                href="mailto:A.Whinsical.Brush@gmail.com"
                className="flex items-center space-x-3 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span>A.Whinsical.Brush@gmail.com</span>
              </a>

              <a 
                href="https://www.instagram.com/a_whimsical_brush"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span>@a_whimsical_brush</span>
              </a>
            </div>

            <div>
              <h3 className="text-xl font-serif mb-3">Studio Location</h3>
              <address className="text-gray-600 not-italic">
                By Appointment Only<br />
                Contact for Details
              </address>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-serif mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <span>{status === 'loading' ? 'Sending...' : 'Send Message'}</span>
                <Send className="h-4 w-4" />
              </button>

              {status === 'success' && (
                <p className="text-green-600 text-center">
                  Message sent successfully! We'll get back to you soon.
                </p>
              )}

              {status === 'error' && (
                <p className="text-red-600 text-center">
                  {errorMessage || 'Failed to send message. Please try again.'}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;