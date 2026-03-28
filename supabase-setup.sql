-- ============================================================
-- IBAR by Ibar — Supabase Database Setup
-- Run this entire file in Supabase → SQL Editor → New Query
-- ============================================================

create table if not exists conversations (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references auth.users(id) on delete cascade not null,
  persona_id    text not null default 'assistant',
  persona_label text not null default 'Personal Assistant',
  persona_icon  text not null default '🤖',
  mode          text not null default 'chat',
  title         text not null default 'New Conversation',
  created_at    timestamp with time zone default now(),
  updated_at    timestamp with time zone default now()
);

create table if not exists messages (
  id                uuid default gen_random_uuid() primary key,
  conversation_id   uuid references conversations(id) on delete cascade not null,
  role              text not null,
  content           text not null,
  display_content   text,
  created_at        timestamp with time zone default now()
);

alter table conversations enable row level security;
alter table messages      enable row level security;

create policy "own_conversations" on conversations for all using (auth.uid() = user_id);
create policy "own_messages" on messages for all using (
  conversation_id in (select id from conversations where user_id = auth.uid())
);

create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger conversations_updated_at
  before update on conversations
  for each row execute function update_updated_at();
