import { supabase } from './supabase';

export async function getAllActiveSchemes() {
  const { data, error } = await supabase
    .from('schemes')
    .select('*')
    .eq('active', true)
    .order('pop', { ascending: false });

  if (error) throw error;

  return data || [];
}