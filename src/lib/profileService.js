import { supabase } from './supabase';

export async function ensureUserProfile(user) {
  if (!user?.id) return null;

  const payload = {
    id: user.id,
    name: user.name || 'User',
    email: user.email || '',
    role: user.role || 'user',
  };

  const { data, error } = await supabase
    .from('profiles')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function getUserProfile(userId) {
  if (!userId) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function saveUserProfileData(userId, profileData) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      profile_data: profileData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function saveUserBookmarks(userId, bookmarks) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      bookmarks,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .maybeSingle();

  if (error) throw error;

  return data;
}