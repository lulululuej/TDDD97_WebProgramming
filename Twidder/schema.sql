create table user(
    email varchar(120) NOT NULL, 
    password varchar(20) NOT NULL, 
    firstname varchar(20) NOT NULL, 
    family varchar(20) NOT NULL, 
    gender varchar(20) NOT NULL, 
    city varchar(20) NOT NULL, 
    country varchar(20) NOT NULL, 
    token varchar(30),
    primary key(email));

create table message(
    writer varchar(120) NOT NULL, 
    email varchar(20) NOT NULL, 
    content varchar(120) NOT NULL, 
    location varchar(20) NULL,
    id INTEGER PRIMARY KEY);