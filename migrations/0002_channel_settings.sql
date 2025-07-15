-- Migration number: 0002 	 2025-07-13T10:58:41.128Z
/*
 * Channel settings table
 */
create table channel_settings(
    channel_id text not null primary key,
    guild_id text not null,
    created_at timestamptz default current_timestamp not null,
    ping_role_id text not null default ""
);