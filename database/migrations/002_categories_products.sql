begin;

create table if not exists public.categories (
    id uuid primary key default gen_random_uuid(),
    name varchar(100) not null check (length(btrim(name)) > 0),
    description varchar(500),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.products (
    id uuid primary key default gen_random_uuid(),
    category_id uuid not null,
    name varchar(150) not null check (length(btrim(name)) > 0),
    description varchar(500),
    price numeric(10,2) not null check (price >= 0),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint fk_products_category foreign key (category_id)
        references public.categories(id) on delete restrict
);

create index if not exists idx_products_category_id on public.products(category_id);

create or replace function public.set_confectionery_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
    new.updated_at = clock_timestamp();
    return new;
end;
$$;

drop trigger if exists categories_updated_at on public.categories;
create trigger categories_updated_at before update on public.categories
for each row execute function public.set_confectionery_updated_at();

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products
for each row execute function public.set_confectionery_updated_at();

alter table public.categories enable row level security;
alter table public.products enable row level security;

commit;
