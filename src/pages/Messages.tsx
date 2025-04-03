import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Mail, Check, X } from 'lucide-react';
import { supabase, getMessages, updateMessageStatus, deleteMessage } from '../lib/supabase';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

function Messages() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    loadMessages();
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
    }
  }

  async function loadMessages() {
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (err) {
      setError('Failed to load messages');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleToggleRead = async (id: string, currentStatus: boolean) => {
    try {
      await updateMessageStatus(id, !currentStatus);
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, read: !currentStatus } : msg
      ));
    } catch (err) {
      console.error('Error updating message status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await deleteMessage(id);
      setMessages(messages.filter(msg => msg.id !== id));
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="container-custom py-12">Loading...</div>;
  if (error) return <div className="container-custom py-12 text-red-600">{error}</div>;

  return (
    <div className="container-custom py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif">Messages</h1>
        <button onClick={() => navigate('/admin')} className="text-gray-600 hover:text-gray-900">
          Back to Dashboard
        </button>
      </div>

      {messages.length === 0 ? (
        <div className="text-center text-gray-600 py-8">
          <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No messages yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`bg-white rounded-lg shadow-lg p-6 ${!message.read ? 'border-l-4 border-primary-500' : ''}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{message.name}</h3>
                  <a 
                    href={`mailto:${message.email}`} 
                    className="text-gray-600 hover:text-primary-600"
                  >
                    {message.email}
                  </a>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleToggleRead(message.id, message.read)}
                    className={`p-2 rounded-full transition-colors ${
                      message.read 
                        ? 'bg-gray-100 hover:bg-gray-200' 
                        : 'bg-primary-100 hover:bg-primary-200'
                    }`}
                    title={message.read ? 'Mark as unread' : 'Mark as read'}
                  >
                    {message.read ? (
                      <X className="h-5 w-5 text-gray-600" />
                    ) : (
                      <Check className="h-5 w-5 text-primary-600" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(message.id)}
                    className="p-2 text-red-600 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors"
                    title="Delete message"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Received on {formatDate(message.created_at)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Messages;