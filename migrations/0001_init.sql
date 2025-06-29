-- Migration number: 0001 	 2025-06-27T10:03:26.418Z
/*
 * Protected strings table
 */
create table protected_strings(
    id integer primary key autoincrement,
    string text not null,
    viewers text not null default "{}" check(json_valid(viewers)),
    created_at timestamptz default current_timestamp not null,
    created_by text not null,
    guild_id text not null,
    channel_id text not null
);