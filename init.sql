-- Active: 1707101283066@@127.0.0.1@3306@bbgg_db


show DATABASES;
use prac;
show TABLES;


-- dw
drop database bbgg_db;
create DATABASE bbgg_db DEFAULT CHARACTER set utf8 COLLATE utf8_general_ci;
use bbgg_db;
-- dw

DROP TABLE visitor;

DROP TABLE IF EXISTS user;
CREATE TABLE user (
	u_seq	BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	id	VARCHAR(30)	NOT NULL, 
	pw	VARCHAR(30)	NOT NULL,
	email	VARCHAR(50)	NOT NULL,
	name	VARCHAR(36)	NOT NULL,
	nickname	VARCHAR(36)	NOT NULL
);

CREATE TABLE post (
	p_seq	BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	u_seq	BIGINT NOT NULL,
	title VARCHAR(50) NOT NULL,
	content	VARCHAR(255) NOT NULL,
	date DATE	NOT NULL,
	file VARCHAR(255) NULL,
	category VARCHAR(20) NOT NULL,
	FOREIGN KEY (u_seq) REFERENCES user(u_seq) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE likes (
	l_seq	BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	p_seq	BIGINT NOT NULL,
	u_seq	BIGINT NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (p_seq) REFERENCES post(p_seq) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY (u_seq) REFERENCES user(u_seq) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE chat (
	c_seq	BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	p_seq	BIGINT NOT NULL,
	u_seq	BIGINT NOT NULL,
	u_seq_current BIGINT NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (p_seq) REFERENCES post(p_seq) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY (u_seq) REFERENCES user(u_seq) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY (u_seq_current) REFERENCES user(u_seq) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE message (
	m_seq	BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	c_seq	BIGINT NOT NULL,
	u_seq	BIGINT NOT NULL,
	content	VARCHAR(200) NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (c_seq) REFERENCES chat(c_seq) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY (u_seq) REFERENCES user(u_seq) ON UPDATE CASCADE ON DELETE CASCADE
);
INSERT INTO user (id, pw, email, name, nickname) 
VALUES ('aaa', '1234', 'aaa@naver.com', '가가가', '가닉넴');

INSERT INTO user (id, pw, email, name, nickname) 
VALUES ('bbb', '1234', 'bbb@naver.com', '나나나', '나닉넴');

INSERT INTO user (id, pw, email, name, nickname) 
VALUES ('ccc', '1234', 'ccc@naver.com', '다다다', '다닉넴');

INSERT INTO user (id, pw, email, name, nickname) 
VALUES ('ddd', '1234', 'ddd@naver.com', '라라라', '라닉넴');

INSERT INTO user (id, pw, email, name, nickname) 
VALUES ('eee', '1234', 'eee@naver.com', '마마마', '마닉넴');

SELECT * FROM user;

SELECT * FROM chat;
SELECT * FROM post;

DROP TABLE chat;

DESC likes;

DROP TABLE message;

INSERT INTO chat (p_seq, u_seq, b_seq, c_title1, c_title2, createdAt, updatedAt, last_user) 
VALUES (1,4,3,'test123','sfdssffd', now(), now(), 4);
INSERT INTO chat (p_seq, u_seq, b_seq, c_title1, c_title2, createdAt, updatedAt, last_user) 
VALUES (1,4,3,'test123','sfdssffd', now(), now(), 4);
INSERT INTO chat (p_seq, u_seq, b_seq, c_title1, c_title2, createdAt, updatedAt, last_user) 
VALUES (2,1,1,'testid1','fgdfgdfgd', now(), now(), 1);

-- sfdssffd
SELECT * FROM chat;

DESC post;

INSERT INTO user (id, pw, email, name, nickname) 
VALUES ('aaa', '1234', 'aaa@naver.com', '가가가', '가닉넴');

INSERT INTO user (id, pw, email, name, nickname) 
VALUES ('bbb', '1234', 'bbb@naver.com', '나나나', '나닉넴');

INSERT INTO user (id, pw, email, name, nickname) 
VALUES ('ccc', '1234', 'ccc@naver.com', '다다다', '다닉넴');

INSERT INTO user (id, pw, email, name, nickname) 
VALUES ('ddd', '1234', 'ddd@naver.com', '라라라', '라닉넴');

INSERT INTO user (id, pw, email, name, nickname) 
VALUES ('eee', '1234', 'eee@naver.com', '마마마', '마닉넴');



INSERT INTO post (u_seq, title, content, date, file, category) 
VALUES (1, '제목1', '내용내용내용111', '2024-03-03', 'a.png', '서울특별시');

INSERT INTO post (u_seq, title, content, date, file, category) 
VALUES (1, '제목2', '내용내용내용222', '2024-03-03', 'aa.png', '제주특별자치도');

INSERT INTO post (u_seq, title, content, date, file, category) 
VALUES (2, '제목3', '내용내용내용333', '2024-03-03', 'b.png', '강원도');


INSERT INTO chat (p_seq, u_seq, b_seq, c_title1, c_title2, createdAt, last_user) 
VALUES (1,4,3,'test123','sfdssffd', now(), now(), 4);
INSERT INTO chat (p_seq, u_seq, b_seq, c_title1, c_title2, createdAt, last_user) 
VALUES (1,4,3,'test123','sfdssffd', now(), now(), 4);
INSERT INTO chat (p_seq, u_seq, b_seq, c_title1, c_title2, createdAt, last_user) 
VALUES (2,1,2,'testid1','fgdfgdfgd', now(), now(), 1);

SELECT * FROM likes;


INSERT INTO likes (p_seq, u_seq, created_at) 
VALUES (1, 4,now());

INSERT INTO likes (p_seq, u_seq, created_at) 
VALUES (2, 4,now());

INSERT INTO likes (p_seq, u_seq, created_at) 
VALUES (5, 4,now());

INSERT INTO likes (p_seq, u_seq, created_at) 
VALUES (3, 4,now());

INSERT INTO likes (p_seq, u_seq, created_at) 
VALUES (3, 2,now());

SELECT * FROM likes where u_seq=4 ORDER BY created_at DESC;