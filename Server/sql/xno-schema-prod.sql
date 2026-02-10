drop schema if exists xno cascade;
create schema xno;
set search_path to xno;

create table app_user (
	app_user_id serial primary key,
	username varchar(50) unique not null,
	email varchar(254) unique not null,
	password_hash varchar(2048) not null,
	disabled boolean not null default false
);

create table app_role (
	app_role_id serial primary key,
	role_name varchar(50) unique not null
);

create table app_user_role (
	app_user_id int not null,
	app_role_id int not null,
	primary key (app_user_id, app_role_id),
	foreign key (app_user_id) references app_user(app_user_id),
	foreign key (app_role_id) references app_role(app_role_id)
);

create table playbook (
	playbook_id serial primary key,
	playbook_name varchar(50) not null,
	app_user_id int not null,
	foreign key (app_user_id) references app_user(app_user_id)
);

create table formation (
	formation_id serial primary key,
	formation_name varchar(50) not null,
	formation_image_url varchar(300) not null,
	app_user_id int not null,
	foreign key (app_user_id) references app_user(app_user_id)
);

create table play (
	play_id serial primary key,
	play_name varchar(50) not null,
	play_image_url varchar(300) not null,
	notes varchar(5000),
	formation_id int not null,
	foreign key (formation_id) references formation(formation_id)
);

create table playsheet (
	playsheet_id serial primary key,
	playsheet_name varchar(50) not null,
	created_at timestamp not null,
	updated_at timestamp not null,
	app_user_id int not null,
	playbook_id int not null,
	foreign key (app_user_id) references app_user(app_user_id),
	foreign key (playbook_id) references playbook(playbook_id)
);

create table playsheet_situation (
	playsheet_situation_id serial primary key,
	situation_name varchar(50) not null,
	situation_color varchar(50) not null,
	playsheet_id int not null,
	foreign key (playsheet_id) references playsheet(playsheet_id)
);

create table playsheet_situation_play (
	playsheet_situation_play_id serial primary key,
	playsheet_situation_id int not null,
	play_id int not null,
	foreign key (playsheet_situation_id) references playsheet_situation(playsheet_situation_id),
	foreign key (play_id) references play(play_id)
);
