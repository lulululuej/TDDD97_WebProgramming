create table user(
    email varchar(120), 
    password varchar(20), 
    firstname varchar(20), 
    family varchar(20), 
    gender varchar(20), 
    city varchar(20), 
    country varchar(20), 
    token varchar(30),
    primary key(email));

create table message(
    writer varchar(120), 
    email varchar(20), 
    content varchar(120), 
    primary key(writer), 
    foreign key(email) references user(email));