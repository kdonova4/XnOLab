drop schema if exists xno cascade;
create schema xno;
set search_path to xno;

create table app_user (
	app_user_id bigserial primary key,
	username varchar(30) unique not null,
	email varchar(254) unique not null,
	password_hash varchar(2048) not null,
	disabled boolean not null default false
);

create table app_role (
	app_role_id bigserial primary key,
	role_name varchar(50) unique not null
);

create table app_user_role (
	app_user_id bigint not null,
	app_role_id bigint not null,
	primary key (app_user_id, app_role_id),
	foreign key (app_user_id) references app_user(app_user_id),
	foreign key (app_role_id) references app_role(app_role_id)
);

create table playbook (
	playbook_id bigserial primary key,
	playbook_name varchar(50) not null,
	app_user_id bigint not null,
	foreign key (app_user_id) references app_user(app_user_id),
	constraint uk_user_playbook_name unique (app_user_id, playbook_name)
);

create table formation (
	formation_id bigserial primary key,
	formation_name varchar(50) not null,
	formation_image_url varchar(300) not null,
	formation_public_id varchar(300) not null,
	app_user_id bigint not null,
	foreign key (app_user_id) references app_user(app_user_id)
);

create table play (
	play_id bigserial primary key,
	play_name varchar(50) not null,
	play_image_url varchar(300) not null,
	play_public_id varchar(300) not null,
	notes varchar(5000),
	formation_id bigint not null,
	playbook_id bigint not null,
	app_user_id bigint not null,
	foreign key (formation_id) references formation(formation_id),
	foreign key (playbook_id) references playbook(playbook_id),
	foreign key (app_user_id) references app_user(app_user_id)
);

create table playsheet (
	playsheet_id bigserial primary key,
	playsheet_name varchar(50) not null,
	created_at timestamp not null,
	updated_at timestamp,
	app_user_id bigint not null,
	playbook_id bigint not null,
	foreign key (app_user_id) references app_user(app_user_id),
	foreign key (playbook_id) references playbook(playbook_id)
);

create table playsheet_situation (
	playsheet_situation_id bigserial primary key,
	situation_name varchar(50) not null,
	situation_color varchar(50) not null,
	playsheet_id bigint not null,
	foreign key (playsheet_id) references playsheet(playsheet_id)
);

create table playsheet_situation_play (
	playsheet_situation_play_id bigserial primary key,
	playsheet_situation_id bigint not null,
	play_id bigint not null,
	foreign key (playsheet_situation_id) references playsheet_situation(playsheet_situation_id),
	foreign key (play_id) references play(play_id)
);

insert into app_role (role_name) values 
('ROLE_USER'),
('ROLE_ADMIN');

insert into app_user (app_user_id, username, email, password_hash, disabled)
values (1, 'kdonova4', 'kdonova4@gmail.com', '$2y$10$.poyrrnAlMXmbWP9fLGVket589FifPuPKPd3qggvYF.1A1TaFN7ee', false);

insert into app_user_role (app_user_id, app_role_id)
values (1, 1);

insert into playbook (playbook_id, playbook_name, app_user_id)
values (1, 'West Coast Offense', 1);

insert into formation (formation_id, formation_name, formation_image_url, formation_public_id, app_user_id) values
(1, 'Shotgun', 'url', 'id', 1),
(2, 'I-Formation', 'url', 'id', 1),
(3, 'Singleback', 'url', 'id', 1),
(4, 'Pistol', 'url', 'id', 1),
(5, 'Trips Right', 'url', 'id', 1);

insert into play (play_id, play_name, play_image_url, play_public_id, notes, formation_id, playbook_id, app_user_id) values
(1,'Inside Zone','url1','id','Zone run middle',1,1,1),
(2,'Outside Zone','url2','id','Stretch run outside',1,1,1),
(3,'Read Option Right','url3','id','QB reads DE',1,1,1),
(4,'Read Option Left','url4','id','QB reads DE backside',1,1,1),
(5,'QB Draw','url5','id','Delayed QB run',1,1,1),
(6,'Four Verticals','url6','id','Vertical passing concept',1,1,1),
(7,'Mesh Concept','url7','id','Crossing routes',1,1,1),
(8,'Stick Concept','url8','id','Quick game stick',1,1,1),
(9,'Slants','url9','id','Quick slant concept',1,1,1),
(10,'HB Screen','url10','id','Running back screen',1,1,1),

(11,'Power Right','url11','id','Power run strong side',2,1,1),
(12,'Power Left','url12','id','Power run weak side',2,1,1),
(13,'Iso Lead','url13','id','Fullback lead',2,1,1),
(14,'Counter Trey','url14','id','Counter run',2,1,1),
(15,'Play Action Post','url15','id','Deep PA shot',2,1,1),
(16,'Bootleg Right','url16','id','QB rollout',2,1,1),
(17,'Bootleg Left','url17','id','QB naked boot',2,1,1),
(18,'FB Dive','url18','id','Quick dive',2,1,1),
(19,'Stretch Toss','url19','id','Outside toss',2,1,1),
(20,'PA Flood','url20','id','Flood concept',2,1,1),

(21,'Singleback Dive','url21','id','Inside run',3,1,1),
(22,'Singleback Counter','url22','id','Counter action',3,1,1),
(23,'PA Crossers','url23','id','Play action cross',3,1,1),
(24,'Levels Concept','url24','id','Short + intermediate routes',3,1,1),
(25,'Curl Flats','url25','id','Curl/flat combo',3,1,1),
(26,'Smash Concept','url26','id','Corner + hitch',3,1,1),
(27,'HB Toss','url27','id','Outside run',3,1,1),
(28,'Delay Draw','url28','id','Delayed handoff',3,1,1),
(29,'TE Seam','url29','id','Tight end vertical seam',3,1,1),
(30,'Wheel Route','url30','id','RB wheel',3,1,1),

(31,'Pistol Inside Zone','url31','id','Zone run pistol',4,1,1),
(32,'Pistol Power','url32','id','Power pistol',4,1,1),
(33,'Pistol Read Option','url33','id','Read option pistol',4,1,1),
(34,'Pistol Play Action','url34','id','PA pistol',4,1,1),
(35,'QB Sweep','url35','id','Designed QB run',4,1,1),
(36,'Slot Fade','url36','id','Fade from slot',4,1,1),
(37,'Bubble Screen','url37','id','Quick WR screen',4,1,1),
(38,'Middle Screen','url38','id','TE screen',4,1,1),
(39,'Dagger Concept','url39','id','Clear out + dig',4,1,1),
(40,'Drive Concept','url40','id','Shallow cross',4,1,1),

(41,'Trips Verticals','url41','id','4 verts trips',5,1,1),
(42,'Trips Flood','url42','id','Flood trips side',5,1,1),
(43,'Trips Screen','url43','id','Trips WR screen',5,1,1),
(44,'Trips RPO Slant','url44','id','RPO slant',5,1,1),
(45,'Trips RPO Bubble','url45','id','RPO bubble',5,1,1),
(46,'Trips Levels','url46','id','Levels trips',5,1,1),
(47,'Trips Y Cross','url47','id','Y cross concept',5,1,1),
(48,'Trips Smash','url48','id','Smash trips',5,1,1),
(49,'Trips Mesh','url49','id','Mesh trips',5,1,1),
(50,'Trips HB Draw','url50','id','Draw from trips',5,1,1);

insert into playsheet (playsheet_id, playsheet_name, created_at, updated_at, app_user_id, playbook_id)
values (1, 'Week 1', now(), null, 1, 1);

insert into playsheet_situation (playsheet_situation_id, situation_name, situation_color, playsheet_id) values
(1,'Opening Script (First 15)','blue',1),
(2,'1st & 10 - Normal Field Zone','green',1),
(3,'2nd & Medium (4-6)','yellow',1),
(4,'3rd & Short (1-3)','orange',1),
(5,'3rd & Long (7+)','red',1),
(6,'Low Red Zone (Inside 10)','indigo',1),
(7,'High Red Zone (10-20)','pink',1),
(8,'Backed Up (Inside Own 10)','blue_grey',1),
(9,'Two-Minute Drill','black',1),
(10,'Goal Line (Inside 5)','gold',1),
(11,'3rd & Long (7+)','red',1),
(12,'Low Red Zone (Inside 10)','indigo',1),
(13,'High Red Zone (10-20)','pink',1),
(14,'Backed Up (Inside Own 10)','blue_grey',1),
(15,'Two-Minute Drill','black',1),
(16,'Goal Line (Inside 5)','gold',1);

insert into playsheet_situation_play (playsheet_situation_id, play_id)
select 1, play_id from play
where play_id in (1,2,3,4,5,6,7,8,9,10,
                  11,12,13,14,15,16,17,18,19,20,
                  21,22,23,24,25,26,27,28,29,30,
                  31,32,33,34,35,36,37,38,39,40,
                  41,42,43,44,45,46,47,48,49,50);

insert into playsheet_situation_play (playsheet_situation_id, play_id)
select 2, play_id from play
where play_id in (1,2,3,4,5,6,7,8,9,10,
                  11,12,13,14,15,16,17,18,19,20,
                  21,22,23,24,25,26,27,28,29,30,
                  31,32,33,34,35,36,37,38,39,40,
                  41,42,43,44,45,46,47,48,49,50);

insert into playsheet_situation_play (playsheet_situation_id, play_id)
select 3, play_id from play
where play_id in (1,2,3,4,5,6,7,8,9,10,
                  11,12,13,14,15,16,17,18,19,20,
                  21,22,23,24,25,26,27,28,29,30,
                  31,32,33,34,35,36,37,38,39,40,
                  41,42,43,44,45,46,47,48,49,50);

insert into playsheet_situation_play (playsheet_situation_id, play_id)
select 4, play_id from play
where play_id in (1,2,3,4,5,6,7,8,9,10,
                  11,12,13,14,15,16,17,18,19,20,
                  21,22,23,24,25,26,27,28,29,30,
                  31,32,33,34,35,36,37,38,39,40,
                  41,42,43,44,45,46,47,48,49,50);

insert into playsheet_situation_play (playsheet_situation_id, play_id)
select 5, play_id from play
where play_id in (1,2,3,4,5,6,7,8,9,10,
                  11,12,13,14,15,16,17,18,19,20,
                  21,22,23,24,25,26,27,28,29,30,
                  31,32,33,34,35,36,37,38,39,40,
                  41,42,43,44,45,46,47,48,49,50);

insert into playsheet_situation_play (playsheet_situation_id, play_id)
select 6, play_id from play
where play_id in (1,2,3,4,5,6,7,8,9,10,
                  11,12,13,14,15,16,17,18,19,20,
                  21,22,23,24,25,26,27,28,29,30,
                  31,32,33,34,35,36,37,38,39,40,
                  41,42,43,44,45,46,47,48,49,50);

insert into playsheet_situation_play (playsheet_situation_id, play_id)
select 7, play_id from play
where play_id in (1,2,3,4,5,6,7,8,9,10,
                  11,12,13,14,15,16,17,18,19,20,
                  21,22,23,24,25,26,27,28,29,30,
                  31,32,33,34,35,36,37,38,39,40,
                  41,42,43,44,45,46,47,48,49,50);

insert into playsheet_situation_play (playsheet_situation_id, play_id)
select 8, play_id from play
where play_id in (1,2,3,4,5,6,7,8,9,10,
                  11,12,13,14,15,16,17,18,19,20,
                  21,22,23,24,25,26,27,28,29,30,
                  31,32,33,34,35,36,37,38,39,40,
                  41,42,43,44,45,46,47,48,49,50);

insert into playsheet_situation_play (playsheet_situation_id, play_id)
select 9, play_id from play
where play_id in (1,2,3,4,5,6,7,8,9,10,
                  11,12,13,14,15,16,17,18,19,20,
                  21,22,23,24,25,26,27,28,29,30,
                  31,32,33,34,35,36,37,38,39,40,
                  41,42,43,44,45,46,47,48,49,50);

insert into playsheet_situation_play (playsheet_situation_id, play_id)
select 10, play_id from play
where play_id in (1,2,3,4,5,6,7,8,9,10,
                  11,12,13,14,15,16,17,18,19,20,
                  21,22,23,24,25,26,27,28,29,30,
                  31,32,33,34,35,36,37,38,39,40,
                  41,42,43,44,45,46,47,48,49,50);

insert into playsheet_situation_play (playsheet_situation_id, play_id)
select 11, play_id from play
where play_id in (1,2,3,4,5,6,7,8,9,10,
                  11,12,13,14,15,16,17,18,19,20,
                  21,22,23,24,25,26,27,28,29,30,
                  31,32,33,34,35,36,37,38,39,40,
                  41,42,43,44,45,46,47,48,49,50);

insert into playsheet_situation_play (playsheet_situation_id, play_id)
select 12, play_id from play
where play_id in (1,2,3,4,5,6,7,8,9,10,
                  11,12,13,14,15,16,17,18,19,20,
                  21,22,23,24,25,26,27,28,29,30,
                  31,32,33,34,35,36,37,38,39,40,
                  41,42,43,44,45,46,47,48,49,50);

insert into playsheet_situation_play (playsheet_situation_id, play_id)
select 13, play_id from play
where play_id in (1,2,3,4,5,6,7,8,9,10,
                  11,12,13,14,15,16,17,18,19,20,
                  21,22,23,24,25,26,27,28,29,30,
                  31,32,33,34,35,36,37,38,39,40,
                  41,42,43,44,45,46,47,48,49,50);

insert into playsheet_situation_play (playsheet_situation_id, play_id)
select 14, play_id from play
where play_id in (1,2,3,4,5,6,7,8,9,10,
                  11,12,13,14,15,16,17,18,19,20,
                  21,22,23,24,25,26,27,28,29,30,
                  31,32,33,34,35,36,37,38,39,40,
                  41,42,43,44,45,46,47,48,49,50);

insert into playsheet_situation_play (playsheet_situation_id, play_id)
select 15, play_id from play
where play_id in (1,2,3,4,5,6,7,8,9,10,
                  11,12,13,14,15,16,17,18,19,20,
                  21,22,23,24,25,26,27,28,29,30,
                  31,32,33,34,35,36,37,38,39,40,
                  41,42,43,44,45,46,47,48,49,50);

insert into playsheet_situation_play (playsheet_situation_id, play_id)
select 16, play_id from play
where play_id in (30,31,32,33,34,35,36,37,38,39,
                  40,41,42,43,44,45,46,47,48,49,50);

select * from app_role;
select * from app_user;
select * from app_user_role;
select * from playsheet_situation_play;
select * from playsheet;

