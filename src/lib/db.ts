import { supabase, setUserContext, isSupabaseConfigured } from './supabase';

export interface MoodEntry {
    id?: string;
    mood_rating: number;
    label: string;
    notes: string;
    logged_at: string;
}

const MOCK_MOODS: MoodEntry[] = [
    { mood_rating: 5, label: 'Great', notes: 'Had a productive morning.', logged_at: new Date().toISOString() },
    { mood_rating: 4, label: 'Good', notes: 'Feeling calm.', logged_at: new Date(Date.now() - 86400000).toISOString() }
];

export async function upsertUser(userId: number): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
        await setUserContext(userId);
        await supabase.from('users').upsert({ id: userId }, { onConflict: 'id' });
    } catch (e) {
        console.warn('DB: upsertUser failed:', e);
    }
}

export async function saveMoodEntry(userId: number, entry: MoodEntry) {
    if (!isSupabaseConfigured) {
        console.log('DB: Using mock saveMoodEntry');
        return;
    }
    try {
        await setUserContext(userId);
        const { error } = await supabase.from('mood_entries').insert({
            user_id: userId,
            ...entry
        });
        if (error) throw error;
    } catch (e) {
        console.error('DB: saveMoodEntry failed:', e);
    }
}

export async function getMoodEntries(userId: number): Promise<MoodEntry[]> {
    if (!isSupabaseConfigured) return MOCK_MOODS;
    try {
        await setUserContext(userId);
        const { data, error } = await supabase
            .from('mood_entries')
            .select('*')
            .eq('user_id', userId)
            .order('logged_at', { ascending: false });

        if (error) throw error;
        return data || MOCK_MOODS;
    } catch (e) {
        console.error('DB: getMoodEntries failed:', e);
        return MOCK_MOODS;
    }
}