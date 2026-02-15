
-- 1. Create Transactions Table
create table if not exists transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  provider text not null check (provider in ('payme', 'click', 'manual')),
  amount numeric not null,
  status text default 'pending' check (status in ('pending', 'paid', 'cancelled', 'failed')),
  external_id text, -- The ID sent by Payme/Click
  perform_time bigint, -- Timestamp from Payme/Click
  created_at timestamptz default now()
);

-- 2. Security Policies (RLS)
alter table transactions enable row level security;

-- Users can view their own transactions
create policy "Users can view own transactions" 
on transactions for select 
using (auth.uid() = user_id);

-- Service Role (The API) has full access (Implicit in Supabase, but good to know)
