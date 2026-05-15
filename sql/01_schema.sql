-- ============================================================
-- 01_schema.sql  WorkBoard DB 스키마 생성
-- Oracle XE 21c / AL32UTF8
-- ============================================================

-- 기존 테이블/시퀀스 제거 (재실행 가능)
BEGIN EXECUTE IMMEDIATE 'DROP TABLE LEAVE_REQUESTS CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE USERS CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE DEPARTMENTS CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP SEQUENCE SEQ_LEAVE_ID'; EXCEPTION WHEN OTHERS THEN NULL; END;
/

-- ──────────────────────────────────────────────────────────
-- DEPARTMENTS
-- ──────────────────────────────────────────────────────────
CREATE TABLE DEPARTMENTS (
    DEPT_ID     VARCHAR2(10)    NOT NULL,
    DEPT_NAME   VARCHAR2(100)   NOT NULL,
    GROUP_NAME  VARCHAR2(100)   NOT NULL,
    CONSTRAINT PK_DEPARTMENTS PRIMARY KEY (DEPT_ID)
);

-- ──────────────────────────────────────────────────────────
-- USERS
-- ──────────────────────────────────────────────────────────
CREATE TABLE USERS (
    USER_ID         NUMBER          NOT NULL,
    EMPLOYEE_NO     VARCHAR2(20)    NOT NULL,
    USER_NAME       VARCHAR2(100)   NOT NULL,
    GROUP_NAME      VARCHAR2(100)   NOT NULL,
    DEPT_ID         VARCHAR2(10)    NOT NULL,
    DEPARTMENT      VARCHAR2(100)   NOT NULL,
    POSITION        VARCHAR2(10)    NOT NULL,
    EMAIL           VARCHAR2(200)   NOT NULL,
    PASSWORD        VARCHAR2(200)   DEFAULT '1234'   NOT NULL,
    TOTAL_LEAVES    NUMBER          DEFAULT 15       NOT NULL,
    USED_LEAVES     NUMBER          DEFAULT 0        NOT NULL,
    CONSTRAINT PK_USERS             PRIMARY KEY (USER_ID),
    CONSTRAINT UQ_USERS_EMAIL       UNIQUE (EMAIL),
    CONSTRAINT UQ_USERS_EMPLOYEE_NO UNIQUE (EMPLOYEE_NO),
    CONSTRAINT FK_USERS_DEPT        FOREIGN KEY (DEPT_ID) REFERENCES DEPARTMENTS(DEPT_ID)
);

-- ──────────────────────────────────────────────────────────
-- LEAVE_REQUESTS
-- ──────────────────────────────────────────────────────────
CREATE TABLE LEAVE_REQUESTS (
    LEAVE_ID    NUMBER          NOT NULL,
    USER_ID     NUMBER          NOT NULL,
    START_DATE  DATE            NOT NULL,
    END_DATE    DATE            NOT NULL,
    REASON      VARCHAR2(500),
    STATUS      VARCHAR2(20)    DEFAULT 'pending'   NOT NULL,
    CREATED_AT  DATE            DEFAULT SYSDATE     NOT NULL,
    CONSTRAINT PK_LEAVE_REQUESTS    PRIMARY KEY (LEAVE_ID),
    CONSTRAINT FK_LEAVES_USER       FOREIGN KEY (USER_ID) REFERENCES USERS(USER_ID),
    CONSTRAINT CK_LEAVE_STATUS      CHECK (STATUS IN ('pending', 'approved', 'rejected'))
);

-- seed 데이터가 id 1~79를 사용하므로 80부터 시작
CREATE SEQUENCE SEQ_LEAVE_ID START WITH 80 INCREMENT BY 1 NOCACHE;

COMMIT;
