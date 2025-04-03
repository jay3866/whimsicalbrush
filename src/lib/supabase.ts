import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export async function getFeaturedArtworks() {
  const { data, error } = await supabase
    .from('artworks')
    .select('*')
    .eq('is_featured', true)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getAllArtworks() {
  const { data, error } = await supabase
    .from('artworks')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getSiteContent() {
  const { data, error } = await supabase
    .from('site_content')
    .select('*');

  if (error) throw error;
  return data;
}

export async function updateSiteContent(key: string, value: string) {
  const { error } = await supabase
    .from('site_content')
    .update({ value, updated_at: new Date().toISOString() })
    .eq('key', key);

  if (error) throw error;
}

export async function getEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createEvent(event: Omit<Event, 'id' | 'created_at' | 'updated_at'>) {
  const { error } = await supabase
    .from('events')
    .insert([event]);

  if (error) throw error;
}

export async function updateEvent(id: string, event: Partial<Event>) {
  const { error } = await supabase
    .from('events')
    .update({ ...event, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteEvent(id: string) {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getMessages() {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createMessage(message: { name: string; email: string; message: string; }) {
  const { error } = await supabase
    .from('messages')
    .insert([message]);

  if (error) throw error;
}

export async function updateMessageStatus(id: string, read: boolean) {
  const { error } = await supabase
    .from('messages')
    .update({ read, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteMessage(id: string) {
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', id);

  if (error) throw error;
}