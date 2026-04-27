create table if not exists complaints (
    id uuid primary key default gen_random_uuid(),
    user_id text not null,
    user_role text not null check (user_role in ('agent', 'partner', 'customer')),
    message text not null check (char_length(trim(message)) > 0),
    is_admin boolean not null default false,
    is_bot boolean not null default false,
    status text not null default 'open' check (status in ('open', 'closed')),
    is_read boolean not null default false,
    created_at timestamptz not null default now()
);

create index if not exists idx_complaints_user_created_at
on complaints (user_id, created_at desc);

create index if not exists idx_complaints_unread_admin
on complaints (is_admin, is_read, created_at desc);

create table if not exists admin_presence (
    admin_id text primary key,
    is_active boolean not null default false,
    last_seen_at timestamptz not null default now()
);

