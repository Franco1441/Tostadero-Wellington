create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  order_type text not null check (order_type in ('para_llevar', 'consumir_local')),
  items jsonb not null,
  item_count integer not null default 0,
  subtotal integer not null default 0,
  app_discount integer not null default 0,
  coupon_discount integer not null default 0,
  total integer not null default 0,
  coupon_code text,
  payment_status text not null default 'pending_payment' check (
    payment_status in ('pending_payment', 'pending', 'paid', 'rejected', 'cancelled', 'refunded')
  ),
  mp_preference_id text,
  mp_payment_id text,
  mp_merchant_order_id text,
  mp_status text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists orders_mp_preference_id_idx on public.orders (mp_preference_id) where mp_preference_id is not null;
create unique index if not exists orders_mp_payment_id_idx on public.orders (mp_payment_id) where mp_payment_id is not null;

create or replace function public.set_orders_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists orders_set_updated_at on public.orders;

create trigger orders_set_updated_at
before update on public.orders
for each row
execute function public.set_orders_updated_at();

alter table public.orders enable row level security;
