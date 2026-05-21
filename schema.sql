-- Frame schema
create schema if not exists frame;

create table if not exists frame.widgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  site_name text,
  site_url text,
  brand_voice_md text,
  escalation_rules_md text,
  owner_email text,
  embed_id text unique default substr(gen_random_uuid()::text, 1, 12),
  created_at timestamptz default now()
);

create table if not exists frame.conversations (
  id uuid primary key default gen_random_uuid(),
  widget_id uuid references frame.widgets(id) on delete cascade,
  channel text default 'web',
  visitor_email text,
  intent text,
  routed_to text,
  resolution text,
  started_at timestamptz default now(),
  ended_at timestamptz
);

create table if not exists frame.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references frame.conversations(id) on delete cascade,
  sender text check (sender in ('visitor','frame','owner')),
  body text,
  sent_at timestamptz default now()
);

-- Indexes
create index if not exists idx_widgets_user on frame.widgets(user_id);
create index if not exists idx_convos_widget on frame.conversations(widget_id);
create index if not exists idx_messages_convo on frame.messages(conversation_id);

-- RLS
alter table frame.widgets enable row level security;
drop policy if exists "own widgets" on frame.widgets;
create policy "own widgets" on frame.widgets for all using (auth.uid() = user_id);

alter table frame.conversations enable row level security;
drop policy if exists "own convos" on frame.conversations;
create policy "own convos" on frame.conversations for all using (exists (select 1 from frame.widgets where id = frame.conversations.widget_id and user_id = auth.uid()));

alter table frame.messages enable row level security;
drop policy if exists "own messages" on frame.messages;
create policy "own messages" on frame.messages for all using (exists (select 1 from frame.conversations c join frame.widgets w on w.id=c.widget_id where c.id = frame.messages.conversation_id and w.user_id = auth.uid()));

-- Grant API access
grant usage on schema frame to anon, authenticated, service_role;
grant all on all tables in schema frame to anon, authenticated, service_role;
grant all on all sequences in schema frame to anon, authenticated, service_role;
