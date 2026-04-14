alter table public.orders
  add column if not exists fulfillment_status text not null default 'new',
  add column if not exists customer_arriving_at timestamptz;

do $$
begin
  alter table public.orders
    add constraint orders_fulfillment_status_check
    check (fulfillment_status in ('new', 'preparing', 'ready_for_pickup', 'completed'));
exception
  when duplicate_object then null;
end
$$;

create index if not exists orders_fulfillment_status_idx on public.orders (fulfillment_status);
