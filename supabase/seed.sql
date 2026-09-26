-- AI-KCP development seed data
-- Safe to execute repeatedly.

insert into public.categories
    (name, slug, description, icon, sort_order, is_active)
values
    (
        'Knowledge',
        'knowledge',
        'Questions, learning, and knowledge sharing.',
        'BookOpen',
        1,
        true
    ),
    (
        'Community',
        'community',
        'Community discussions and meaningful conversations.',
        'Users',
        2,
        true
    ),
    (
        'Current Affairs',
        'current-affairs',
        'Current affairs, news, and important developments.',
        'Newspaper',
        3,
        true
    ),
    (
        'Culture & Heritage',
        'culture-heritage',
        'Culture, heritage, traditions, and historical knowledge.',
        'Landmark',
        4,
        true
    )
on conflict (slug) do update
set
    name = excluded.name,
    description = excluded.description,
    icon = excluded.icon,
    sort_order = excluded.sort_order,
    is_active = excluded.is_active,
    updated_at = now();
