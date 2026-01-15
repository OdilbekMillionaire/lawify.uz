import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lsmmrbflyrmavounigdn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzbW1yYmZseXJtYXZvdW5pZ2RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NzM1NDYsImV4cCI6MjA4NDA0OTU0Nn0.cSaCrIRmVrBBkm-02Wk637RLeqgF1I7tMXoz1BTIJmo';

export const supabase = createClient(supabaseUrl, supabaseKey);

// --- Auth Helpers ---

export const signUpNewUser = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: window.location.origin // Tries to redirect back to current correct port
        }
    });
    if (error) throw error;
    return data;
};

export const signInWithPassword = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    if (error) throw error;
    return data;
};

// --- Profile Helpers ---

export const updateUserProfile = async (userId: string, updates: { full_name?: string; avatar_url?: string; }) => {
    const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
    
    if (error) throw error;
};

// --- Subscription Helpers ---

// Helper to simulate a payment and update the user's subscription
// In a real app, this would happen on the server after a Payme callback
export const activateProSubscription = async (userId: string, plan: 'day' | 'week' | 'month' | 'lawyer') => {
    let daysToAdd = 30;
    if (plan === 'day') daysToAdd = 1;
    if (plan === 'week') daysToAdd = 7;
    if (plan === 'month' || plan === 'lawyer') daysToAdd = 30;

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + daysToAdd);

    const { error } = await supabase
        .from('profiles')
        .update({
            is_pro: true,
            plan_type: plan,
            subscription_end_date: endDate.toISOString()
        })
        .eq('id', userId);

    if (error) throw error;
    return endDate;
};

export const cancelSubscription = async (userId: string) => {
    const { error } = await supabase
        .from('profiles')
        .update({
            is_pro: false,
            plan_type: 'free',
            subscription_end_date: null
        })
        .eq('id', userId);
        
    if (error) throw error;
};