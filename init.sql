-- Active: 1707101296801@@127.0.0.1@3306@sesac

show DATABASES;
use prac;
show TABLES;

drop DATABASE sesac;
create DATABASE sesac DEFAULT CHARACTER set utf8 COLLATE utf8_general_ci;
use sesac;

DROP TABLE review;
DROP TABLE likes;
DROP TABLE post;
DROP TABLE user;
DROP TABLE chat;
DROP TABLE message;
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
SELECT * FROM user;

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



INSERT INTO post (u_seq, title, content, date, file, category, deal_type) 
VALUES (1, '제목1', '내용내용내용111', '2024-03-03', 'a.png', '서울특별시', 0);

INSERT INTO post (u_seq, title, content, date, file, category, deal_type) 
VALUES (1, '제목2', '내용내용내용222', '2024-03-03', 'aa.png', '제주특별자치도', 1);

INSERT INTO post (u_seq, title, content, date, file, category, deal_type) 
VALUES (2, '제목3', '내용내용내용333', '2024-03-03', 'b.png', '강원도', 0);

desc chat;
INSERT INTO chat (p_seq, u_seq, b_seq, c_title1, c_title2, createdAt, updatedAt, last_user) 
VALUES (1,4,3,'test123','sfdssffd', now(), now(), 4);
INSERT INTO chat (p_seq, u_seq, b_seq, c_title1, c_title2, createdAt, updatedAt, last_user) 
VALUES (1,4,3,'test123','sfdssffd', now(), now(), 4);
INSERT INTO chat (p_seq, u_seq, b_seq, c_title1, c_title2, createdAt, updatedAt, last_user) 
VALUES (2,1,1,'testid1','fgdfgdfgd', now(), now(), 1);

INSERT INTO chat (p_seq, u_seq, b_seq, c_title1, c_title2, createdAt, updatedAt, last_user) 
VALUES (3,1,1,'testid1','fgdfgdfgd', now(), now(), 1);

INSERT INTO chat (p_seq, u_seq, b_seq, c_title1, c_title2, createdAt, updatedAt, last_user) 
VALUES (4,1,1,'testid1','fgdfgdfgd', now(), now(), 1);



INSERT INTO likes (p_seq, u_seq, created_at) 
VALUES (2, 4,now());

INSERT INTO likes (p_seq, u_seq, created_at) 
VALUES (5, 4,now());

INSERT INTO likes (p_seq, u_seq, created_at) 
VALUES (3, 4,now());

INSERT INTO likes (p_seq, u_seq, created_at) 
VALUES (3, 2,now());
INSERT INTO likes (p_seq, u_seq, created_at) 
VALUES (1, 1,now());
INSERT INTO likes (p_seq, u_seq, created_at) 
VALUES (2, 1,now());
INSERT INTO likes (p_seq, u_seq, created_at) 
VALUES (4, 1,now());
INSERT INTO likes (p_seq, u_seq, created_at) 
VALUES (9, 1,now());
INSERT INTO likes (p_seq, u_seq, created_at) 
VALUES (5, 1,now());
SELECT * FROM likes where u_seq=4 ORDER BY created_at DESC;

SELECT * FROM review;

SELECT * FROM post;

SELECT * FROM review;

SELECT * FROM likes;

SELECT * FROM user;

INSERT INTO post (u_seq, title, content, date, file, category, is_success, deal_type) 
VALUES (1, '이케아', '이케아 갈건데 대리구매 원하시는 분 계신가요', '2024-03-11', 'hy01.jpg', '경기도', 0, 0);

INSERT INTO post (u_seq, title, content, date, file, category, is_success, deal_type) 
VALUES (1, '세븐일레븐X펩시 팝업스토어 대리구매해주실 분', "서울 송파구에서 열리는 세븐일레븐X팝업 스토어에서 원하는 굿즈 택배로 보내주실 분 구합니다.", '2024-03-05', 'hy02.jpg', '서울' 0, 0);

INSERT INTO post (u_seq, title, content, date, file, category, is_success, deal_type) 
VALUES (1, 'GRBK 하우스 오브 비일상 팝업스토어 대리구매', '강남구에서 열리는 GRBK 하우스 팝업에서 그래놀라 사서 보내주실 분 찾아요', '2024-03-05', 'hy03.jpg', '서울' 0, 0);


INSERT INTO post (u_seq, title, content, date, file, category, is_success, deal_type) 
VALUES (1, '멜린앤게츠 팝업스토어', '성동구에서 열리는 멜린앤게츠 팝업스토어 대리구매 해주실 분 채팅 부탁드립니다', '2024-03-06', 'hy04.jpg', '서울', 0, 0);

INSERT INTO post (u_seq, title, content, date, file, category, is_success, deal_type) 
VALUES (1, '부산바다샌드 ', '부산바다샌드 택배로 보내주실 분 채팅주세요', '2024-03-05', 'hy05.jpg', '경상남도', 0, 1);

INSERT INTO post (u_seq, title, content, date, file, category, is_success, deal_type) 
VALUES (1, '대구 납작프렌드 팝업스토어', '납작만두 먹고싶어요..', '2024-03-06', 'hy06.jpg', '경상북도', 0, 1);

INSERT INTO post (u_seq, title, content, date, file, category, is_success, deal_type) 
VALUES (6, '판교 호감샌드 보내드려요', '판교 호감샌드 드시고 싶으신 분 채팅주세요!', '2024-03-08', 'hy07.jpg', '서울', 0, 0);

INSERT INTO post (u_seq, title, content, date, file, category, is_success, deal_type) 
VALUES (7, '수원 잔망루피 팝업스토어 대리구매', '잔망루피 굿즈3개 구매합니다. 택배로 보내주실 분 채팅 주세요!', '2024-03-08', 'hy08.jpg', '경기도', 0, 1);

INSERT INTO post (u_seq, title, content, date, file, category, is_success, deal_type) 
VALUES (8, '코난 팝업스토어 대리구매 해드립니다.', '2024-03-08', 'hy09.jpg', '서울', 0, 0);

INSERT INTO post (u_seq, title, content, date, file, category, is_success, deal_type) 
VALUES (9, '골든피스 약과 사다드립니다.', '더 현대 서울에서 진행하는 골든피스 팝업스토어에 방문할 예정이니 대리구매 원하시는 분들은 채팅주세요:)', '2024-03-10', 'hy10.jpg', '서울', 0, 0);

INSERT INTO post (u_seq, title, content, date, file, category, is_success, deal_type) 
VALUES (10, '동팔이와 두칠', '더 현대 대구에서 진행하는 동팔이와 두칠이 팝업스토어에서 인형사서 보내주실 분ㅠㅠ', '2024-03-10', 'hy11.jpg', '서울', 0, 1);

INSERT INTO post (u_seq, title, content, date, file, category, is_success, deal_type) 
VALUES (11, '코스트코', '오랜만에 코스트코에 가려고 하는데 대리구매 필요하신 분 계실까요? 채팅 주세요 선착순 2명~', '2024-03-10', 'hy12.jpg', '경기도', 0, 0);

INSERT INTO post (u_seq, title, content, date, file, category, is_success, deal_type) 
VALUES (11, '제너럴도넛샵', '제너럴도넛샵 방문 예정입니다. 전주에 사시는 분들 중에 필요하신 분 계신가요? 직거래만 가능해요', '2024-03-11', 'hy13.jpg', '전라북도', 0, 0);

INSERT INTO post (u_seq, title, content, date, file, category, is_success, deal_type) 
VALUES (12, '미야 스폰지밥', '미야 푸어링 물감 DIY 키트 사다주세요', '2024-03-11', 'hy14.jpg', '경기도', 0, 1);

INSERT INTO post (u_seq, title, content, date, file, category, is_success, deal_type) 
VALUES (13, '커비 팝업스토어', '커비 인형 택배 부탁드려요', '2024-03-11', 'hy15.jpg', '서울', 0, 1);

INSERT INTO post (u_seq, title, content, date, file, category, is_success, deal_type) 
VALUES (14, '수키도키', '스티커 사다주실 분 채팅 주세요', '2024-03-11', 'hy16.jpg', '서울', 0, 1);

INSERT INTO post (u_seq, title, content, date, file, category, is_success, deal_type) 
VALUES (14, '왈맹이 팝업', '인형 대리구매 해주실 분 ㅠㅠ', '2024-03-11', 'hy17.jpg', '경상북도', 0, 1);

INSERT INTO post (u_seq, title, content, date, file, category, is_success, deal_type) 
VALUES (15, '위글위글', '우산 대리구매 원해요 채팅 주세요', '2024-03-11', 'hy18.jpg', '서울', 0, 1);

INSERT INTO post (u_seq, title, content, date, file, category, is_success, deal_type) 
VALUES (15, '하리보 팝업', '하리보 반팔티 사서 보내주실 분', '2024-03-11', 'hy19.jpg', '서울', 0, 1);

INSERT INTO post (u_seq, title, content, date, file, category, is_success, deal_type)
VALUES (16, '공먹', '공먹젤 사서 보내주실 분 채팅주세요', '2024-03-11', 'hy20.jpg', '경상북도', 0, 1);
