-- Schema for Madkar Waqf Platform on Supabase

create extension if not exists pgcrypto;

create sequence if not exists public.waqf_request_seq start 1;

create table if not exists public.waqf_requests (
  id uuid primary key default gen_random_uuid(),
  request_number text not null unique,
  option_id text not null check (
    option_id in (
      'buy_over_million',
      'have_asset_convert',
      'transfer_nazir',
      'contribute_under_million'
    )
  ),
  option_title text not null,
  applicant_name text not null,
  phone text not null,
  city text not null,
  preferred_contact text not null,
  email text,
  answers jsonb not null default '{}'::jsonb,
  route_result text not null,
  recommendation text not null,
  status text not null,
  required_actions jsonb not null default '[]'::jsonb,
  timeline jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_waqf_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_waqf_updated_at on public.waqf_requests;
create trigger trg_waqf_updated_at
before update on public.waqf_requests
for each row execute function public.set_waqf_updated_at();

alter table public.waqf_requests enable row level security;

-- منع الوصول المباشر من anon/authenticated والاعتماد على RPC فقط.
revoke all on public.waqf_requests from anon, authenticated;

create or replace function public.create_waqf_request(
  p_option_id text,
  p_option_title text,
  p_applicant_name text,
  p_phone text,
  p_city text,
  p_preferred_contact text,
  p_email text,
  p_answers jsonb,
  p_route_result text,
  p_recommendation text,
  p_status text,
  p_required_actions jsonb,
  p_timeline jsonb
)
returns table (request_number text, created_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_amount numeric;
  v_request_number text;
  v_created_at timestamptz;
begin
  if p_option_id = 'buy_over_million' then
    v_amount := coalesce((p_answers ->> 'available_amount')::numeric, 0);
    if v_amount < 1000000 then
      raise exception 'This route requires amount >= 1,000,000';
    end if;
  end if;

  if p_option_id = 'contribute_under_million' then
    v_amount := coalesce((p_answers ->> 'contribution_amount')::numeric, 0);
    if v_amount >= 1000000 then
      raise exception 'This route requires amount < 1,000,000';
    end if;
  end if;

  v_request_number := format(
    'MDK-WQF-%s-%s',
    to_char(timezone('utc', now()), 'YYYYMMDD'),
    lpad(nextval('public.waqf_request_seq')::text, 6, '0')
  );

  insert into public.waqf_requests (
    request_number,
    option_id,
    option_title,
    applicant_name,
    phone,
    city,
    preferred_contact,
    email,
    answers,
    route_result,
    recommendation,
    status,
    required_actions,
    timeline
  )
  values (
    upper(v_request_number),
    p_option_id,
    p_option_title,
    p_applicant_name,
    p_phone,
    p_city,
    p_preferred_contact,
    p_email,
    coalesce(p_answers, '{}'::jsonb),
    p_route_result,
    p_recommendation,
    p_status,
    coalesce(p_required_actions, '[]'::jsonb),
    coalesce(p_timeline, '[]'::jsonb)
  )
  returning public.waqf_requests.request_number, public.waqf_requests.created_at
  into v_request_number, v_created_at;

  return query select v_request_number, v_created_at;
end;
$$;

create or replace function public.track_waqf_request(p_request_number text)
returns table (
  request_number text,
  option_id text,
  option_title text,
  status text,
  route_result text,
  recommendation text,
  required_actions jsonb,
  answers jsonb,
  timeline jsonb,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
security definer
stable
set search_path = public
as $$
  select
    w.request_number,
    w.option_id,
    w.option_title,
    w.status,
    w.route_result,
    w.recommendation,
    w.required_actions,
    w.answers,
    w.timeline,
    w.created_at,
    w.updated_at
  from public.waqf_requests w
  where upper(w.request_number) = upper(p_request_number)
  limit 1;
$$;

grant execute on function public.create_waqf_request(
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  jsonb,
  text,
  text,
  text,
  jsonb,
  jsonb
) to anon, authenticated;

grant execute on function public.track_waqf_request(text) to anon, authenticated;
