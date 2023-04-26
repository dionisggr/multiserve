create type "auth"."code_challenge_method" as enum ('s256', 'plain');

drop index if exists "auth"."refresh_tokens_token_idx";

create table "auth"."flow_state" (
    "id" uuid not null,
    "user_id" uuid,
    "auth_code" text not null,
    "code_challenge_method" auth.code_challenge_method not null,
    "code_challenge" text not null,
    "provider_type" text not null,
    "provider_access_token" text,
    "provider_refresh_token" text,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "authentication_method" text not null
);


CREATE UNIQUE INDEX flow_state_pkey ON auth.flow_state USING btree (id);

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);

alter table "auth"."flow_state" add constraint "flow_state_pkey" PRIMARY KEY using index "flow_state_pkey";


create sequence "public"."knex_migrations_id_seq";

create sequence "public"."knex_migrations_lock_index_seq";

create table "public"."apps" (
    "id" character varying(255) not null,
    "name" character varying(255),
    "created_at" character varying(255) not null default CURRENT_TIMESTAMP,
    "archived_at" character varying(255),
    "logo" character varying(255)
);


create table "public"."demo__users" (
    "id" character varying(255) not null default uuid_generate_v4(),
    "username" character varying(255),
    "password" character varying(255) not null,
    "first_name" character varying(255),
    "last_name" character varying(255),
    "DOB" date,
    "email" character varying(255) not null,
    "phone" character varying(255),
    "avatar" character varying(255),
    "is_admin" boolean not null default false,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "last_login" timestamp with time zone default CURRENT_TIMESTAMP
);


create table "public"."fhp__users" (
    "id" character varying(255) not null default uuid_generate_v4(),
    "username" character varying(255),
    "password" character varying(255) not null,
    "first_name" character varying(255),
    "last_name" character varying(255),
    "DOB" date,
    "email" character varying(255) not null,
    "phone" character varying(255),
    "avatar" character varying(255),
    "is_admin" boolean not null default false,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "last_login" timestamp with time zone default CURRENT_TIMESTAMP
);


create table "public"."knex_migrations" (
    "id" integer not null default nextval('knex_migrations_id_seq'::regclass),
    "name" character varying(255),
    "batch" integer,
    "migration_time" timestamp with time zone
);


create table "public"."knex_migrations_lock" (
    "index" integer not null default nextval('knex_migrations_lock_index_seq'::regclass),
    "is_locked" integer
);


create table "public"."tec3__users" (
    "id" character varying(255) not null default uuid_generate_v4(),
    "username" character varying(255),
    "password" character varying(255) not null,
    "first_name" character varying(255),
    "last_name" character varying(255),
    "DOB" date,
    "email" character varying(255) not null,
    "phone" character varying(255),
    "avatar" character varying(255),
    "is_admin" boolean not null default false,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "last_login" timestamp with time zone default CURRENT_TIMESTAMP
);


alter sequence "public"."knex_migrations_id_seq" owned by "public"."knex_migrations"."id";

alter sequence "public"."knex_migrations_lock_index_seq" owned by "public"."knex_migrations_lock"."index";

CREATE UNIQUE INDEX apps_archived_at_unique ON public.apps USING btree (archived_at);

CREATE UNIQUE INDEX apps_id_unique ON public.apps USING btree (id);

CREATE UNIQUE INDEX apps_logo_unique ON public.apps USING btree (logo);

CREATE UNIQUE INDEX apps_name_unique ON public.apps USING btree (name);

CREATE UNIQUE INDEX apps_pkey ON public.apps USING btree (id);

CREATE UNIQUE INDEX demo__users_avatar_unique ON public.demo__users USING btree (avatar);

CREATE UNIQUE INDEX demo__users_email_unique ON public.demo__users USING btree (email);

CREATE UNIQUE INDEX demo__users_phone_unique ON public.demo__users USING btree (phone);

CREATE UNIQUE INDEX demo__users_pkey ON public.demo__users USING btree (id);

CREATE UNIQUE INDEX demo__users_username_unique ON public.demo__users USING btree (username);

CREATE UNIQUE INDEX fhp__users_avatar_unique ON public.fhp__users USING btree (avatar);

CREATE UNIQUE INDEX fhp__users_email_unique ON public.fhp__users USING btree (email);

CREATE UNIQUE INDEX fhp__users_phone_unique ON public.fhp__users USING btree (phone);

CREATE UNIQUE INDEX fhp__users_pkey ON public.fhp__users USING btree (id);

CREATE UNIQUE INDEX fhp__users_username_unique ON public.fhp__users USING btree (username);

CREATE UNIQUE INDEX knex_migrations_lock_pkey ON public.knex_migrations_lock USING btree (index);

CREATE UNIQUE INDEX knex_migrations_pkey ON public.knex_migrations USING btree (id);

CREATE UNIQUE INDEX tec3__users_avatar_unique ON public.tec3__users USING btree (avatar);

CREATE UNIQUE INDEX tec3__users_email_unique ON public.tec3__users USING btree (email);

CREATE UNIQUE INDEX tec3__users_phone_unique ON public.tec3__users USING btree (phone);

CREATE UNIQUE INDEX tec3__users_pkey ON public.tec3__users USING btree (id);

CREATE UNIQUE INDEX tec3__users_username_unique ON public.tec3__users USING btree (username);

alter table "public"."apps" add constraint "apps_pkey" PRIMARY KEY using index "apps_pkey";

alter table "public"."demo__users" add constraint "demo__users_pkey" PRIMARY KEY using index "demo__users_pkey";

alter table "public"."fhp__users" add constraint "fhp__users_pkey" PRIMARY KEY using index "fhp__users_pkey";

alter table "public"."knex_migrations" add constraint "knex_migrations_pkey" PRIMARY KEY using index "knex_migrations_pkey";

alter table "public"."knex_migrations_lock" add constraint "knex_migrations_lock_pkey" PRIMARY KEY using index "knex_migrations_lock_pkey";

alter table "public"."tec3__users" add constraint "tec3__users_pkey" PRIMARY KEY using index "tec3__users_pkey";

alter table "public"."apps" add constraint "apps_archived_at_unique" UNIQUE using index "apps_archived_at_unique";

alter table "public"."apps" add constraint "apps_id_unique" UNIQUE using index "apps_id_unique";

alter table "public"."apps" add constraint "apps_logo_unique" UNIQUE using index "apps_logo_unique";

alter table "public"."apps" add constraint "apps_name_unique" UNIQUE using index "apps_name_unique";

alter table "public"."demo__users" add constraint "demo__users_avatar_unique" UNIQUE using index "demo__users_avatar_unique";

alter table "public"."demo__users" add constraint "demo__users_email_unique" UNIQUE using index "demo__users_email_unique";

alter table "public"."demo__users" add constraint "demo__users_phone_unique" UNIQUE using index "demo__users_phone_unique";

alter table "public"."demo__users" add constraint "demo__users_username_unique" UNIQUE using index "demo__users_username_unique";

alter table "public"."fhp__users" add constraint "fhp__users_avatar_unique" UNIQUE using index "fhp__users_avatar_unique";

alter table "public"."fhp__users" add constraint "fhp__users_email_unique" UNIQUE using index "fhp__users_email_unique";

alter table "public"."fhp__users" add constraint "fhp__users_phone_unique" UNIQUE using index "fhp__users_phone_unique";

alter table "public"."fhp__users" add constraint "fhp__users_username_unique" UNIQUE using index "fhp__users_username_unique";

alter table "public"."tec3__users" add constraint "tec3__users_avatar_unique" UNIQUE using index "tec3__users_avatar_unique";

alter table "public"."tec3__users" add constraint "tec3__users_email_unique" UNIQUE using index "tec3__users_email_unique";

alter table "public"."tec3__users" add constraint "tec3__users_phone_unique" UNIQUE using index "tec3__users_phone_unique";

alter table "public"."tec3__users" add constraint "tec3__users_username_unique" UNIQUE using index "tec3__users_username_unique";


