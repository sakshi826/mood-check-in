import { supabase, setUserContext } from './supabase';

export interface MoodEntry {
  id?: string;
  mood_rating: number;
  label: string;
  notes: string;
  logged_at: string;
}

export interface MoodPreferences {
  reminder_enabled: boolean;
  reminder_time?: string;
  daily_prompts: boolean;
  privacy_mode: boolean;
}

export async function upsertUser(userId: number): Promise<void> {
  await setUserContext(userId);
  const { error } = await supabase.from('users').upsert({ id: userId }, { onConflict: 'id' });
  if (error) throw error;
}

export async function saveMoodEntry(userId: number, entry: MoodEntry) {
  await setUserContext(userId);
  const { error } = await supabase.from('mood_entries').insert({
    user_id: userId,
    mood_rating: entry.mood_rating,
    notes: entry.notes,
    logged_at: entry.logged_at,
    // emotions and activities defaults to [] if not provided, 
    // but the types in the component might need scaling.
  });
  if (error) throw error;
}

export async function getMoodEntries(userId: number): Promise<MoodEntry[]> {
  await setUserContext(userId);
  const { data, error } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('user_id', userId)
    .order('logged_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function deleteMoodEntry(userId: number, id: string) {
  await setUserContext(userId);
  const { error } = await supabase
    .from('mood_entries')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  
  if (error) throw error;
}

export async function saveMoodPreferences(userId: number, prefs: MoodPreferences) {
  await setUserContext(userId);
  const { error } = await supabase
    .from('mood_preferences')
    .upsert({ user_id: userId, ...prefs }, { onConflict: 'user_id' });
  
  if (error) throw error;
}

export async function getMoodPreferences(userId: number): Promise<MoodPreferences | null> {
  await setUserContext(userId);
  const { data, error } = await supabase
    .from('mood_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}
