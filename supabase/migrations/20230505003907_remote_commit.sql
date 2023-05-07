alter table "public"."apps" drop constraint "apps_archived_at_unique";

alter table "public"."apps" drop constraint "apps_id_unique";

alter table "public"."apps" drop constraint "apps_logo_unique";

alter table "public"."apps" drop constraint "apps_name_unique";

alter table "public"."demo__users" drop constraint "demo__users_avatar_unique";

alter table "public"."demo__users" drop constraint "demo__users_email_unique";

alter table "public"."demo__users" drop constraint "demo__users_phone_unique";

alter table "public"."demo__users" drop constraint "demo__users_username_unique";

alter table "public"."fhp__users" drop constraint "fhp__users_avatar_unique";

alter table "public"."fhp__users" drop constraint "fhp__users_email_unique";

alter table "public"."fhp__users" drop constraint "fhp__users_phone_unique";

alter table "public"."fhp__users" drop constraint "fhp__users_username_unique";

alter table "public"."tec3__users" drop constraint "tec3__users_avatar_unique";

alter table "public"."tec3__users" drop constraint "tec3__users_email_unique";

alter table "public"."tec3__users" drop constraint "tec3__users_phone_unique";

alter table "public"."tec3__users" drop constraint "tec3__users_username_unique";

alter table "public"."apps" drop constraint "apps_pkey";

alter table "public"."demo__users" drop constraint "demo__users_pkey";

alter table "public"."fhp__users" drop constraint "fhp__users_pkey";

alter table "public"."knex_migrations" drop constraint "knex_migrations_pkey";

alter table "public"."knex_migrations_lock" drop constraint "knex_migrations_lock_pkey";

alter table "public"."tec3__users" drop constraint "tec3__users_pkey";

drop index if exists "public"."apps_archived_at_unique";

drop index if exists "public"."apps_id_unique";

drop index if exists "public"."apps_logo_unique";

drop index if exists "public"."apps_name_unique";

drop index if exists "public"."apps_pkey";

drop index if exists "public"."demo__users_avatar_unique";

drop index if exists "public"."demo__users_email_unique";

drop index if exists "public"."demo__users_phone_unique";

drop index if exists "public"."demo__users_pkey";

drop index if exists "public"."demo__users_username_unique";

drop index if exists "public"."fhp__users_avatar_unique";

drop index if exists "public"."fhp__users_email_unique";

drop index if exists "public"."fhp__users_phone_unique";

drop index if exists "public"."fhp__users_pkey";

drop index if exists "public"."fhp__users_username_unique";

drop index if exists "public"."knex_migrations_lock_pkey";

drop index if exists "public"."knex_migrations_pkey";

drop index if exists "public"."tec3__users_avatar_unique";

drop index if exists "public"."tec3__users_email_unique";

drop index if exists "public"."tec3__users_phone_unique";

drop index if exists "public"."tec3__users_pkey";

drop index if exists "public"."tec3__users_username_unique";

drop table "public"."apps";

drop table "public"."demo__users";

drop table "public"."fhp__users";

drop table "public"."knex_migrations";

drop table "public"."knex_migrations_lock";

drop table "public"."tec3__users";

drop sequence if exists "public"."knex_migrations_id_seq";

drop sequence if exists "public"."knex_migrations_lock_index_seq";


