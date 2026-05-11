# WorkBoard 백엔드 API 서버

## 프로젝트 개요

WorkBoard는 회사 직원용 근태/연차 관리 MVP 애플리케이션입니다.
이 백엔드 서버는 현재 mock 데이터를 기반으로 동작하며, 추후 Node.js + Oracle을 이용한 실제 데이터베이스로 전환될 예정입니다.

- **언어**: Node.js (JavaScript)
- **프레임워크**: Express.js
- **포트**: 3000 (기본값)
- **CORS**: 활성화 (모든 origin 허용)

## 조직 구조

```
회사
├── 경영지원그룹
│   └── IT팀 (10명)
└── 카지노오퍼레이션그룹
    ├── 테이블게임팀 (10명)
    ├── 전자게임팀 (10명)
    ├── 오퍼레이션지원팀 (10명)
    └── 카지노CS팀 (10명)
```

총 50명의 Mock 직원 데이터가 등록되어 있습니다.

## 폴더 구조

```
workboard-backend/
├── src/
│   ├── index.js                 # 메인 서버 파일
│   ├── middleware/              # 공통 미들웨어
│   │   └── requester.js        # requesterId 검증 및 req.requester 주입
│   ├── routes/                  # API 라우트
│   │   ├── auth.js             # 인증 관련 (로그인)
│   │   ├── users.js            # 사용자 정보 조회
│   │   └── leaves.js           # 연차 관리
│   └── data/                    # Mock 데이터
│       ├── departments.js      # 부서 마스터 데이터 (D001~D005)
│       ├── users.js            # 사용자 데이터 (50명)
│       └── leaves.js           # 연차 요청 데이터
├── package.json                 # 프로젝트 설정
├── .gitignore                   # Git 제외 파일
└── node_modules/               # 의존성 라이브러리
```

## 의존성

### Production
- **express**: 5.2.1 - 웹 프레임워크
- **cors**: 2.8.6 - CORS 처리

### Development
- **nodemon**: 3.1.14 - 파일 변경 시 자동 재시작

## 설치 및 실행

### 설치
```bash
cd C:\ClaudeTestBackEnd\workboard-backend
npm install
```

### 개발 모드 실행 (파일 변경 시 자동 재시작)
```bash
npm run dev
```

### 프로덕션 모드 실행
```bash
npm start
```

서버 실행 후 `http://localhost:3000/health` 에서 상태 확인 가능합니다.

## API 엔드포인트

### 헬스 체크
```
GET /health
```
**응답**:
```json
{ "status": "OK" }
```

---

### 1. 인증 (Authentication)

#### 로그인
```
POST /api/auth/login
```

**요청 Body**:
```json
{
  "email": "jeongho.l@workboard.com",
  "password": "1234"
}
```

**성공 응답 (200)**:
```json
{
  "success": true,
  "user": {
    "id": "1",
    "email": "jeongho.l@workboard.com",
    "name": "이정호",
    "group": "경영지원그룹",
    "departmentId": "D001",
    "department": "IT팀",
    "position": "L2",
    "employeeNo": "2020001",
    "totalLeaves": 15,
    "usedLeaves": 3
  }
}
```

**실패 응답 (401)**:
```json
{ "error": "Invalid email or password" }
```

**참고**:
- Mock 계정의 비밀번호는 모두 `1234` 입니다.
- 실제 프로덕션에서는 암호화된 비밀번호와 JWT 토큰을 사용해야 합니다.

---

### 2. 사용자 (Users)

> 모든 Users API는 `requesterId` 쿼리 파라미터가 필수입니다.
> 요청자와 **같은 부서** 소속 직원 정보만 조회할 수 있습니다.

#### 전체 사용자 목록 조회 (같은 부서만)
```
GET /api/users?requesterId=1
```

**쿼리 파라미터**:
- `requesterId` (필수): 로그인한 사용자의 ID

**성공 응답 (200)** — requesterId=1(IT팀, D001) 기준:
```json
[
  {
    "id": "1",
    "email": "jeongho.l@workboard.com",
    "name": "이정호",
    "group": "경영지원그룹",
    "departmentId": "D001",
    "department": "IT팀",
    "position": "L2",
    "employeeNo": "2020001",
    "totalLeaves": 15,
    "usedLeaves": 3
  },
  ...
]
```

**실패 응답 (400)**:
```json
{ "error": "requesterId query parameter is required" }
```

**실패 응답 (404)**:
```json
{ "error": "Requester not found" }
```

---

#### 개별 사용자 조회 (같은 부서만)
```
GET /api/users/:userId?requesterId=1
```

**쿼리 파라미터**:
- `requesterId` (필수): 로그인한 사용자의 ID

**성공 응답 (200)**:
```json
{
  "id": "1",
  "email": "jeongho.l@workboard.com",
  "name": "이정호",
  "group": "경영지원그룹",
  "departmentId": "D001",
  "department": "IT팀",
  "position": "L2",
  "employeeNo": "2020001",
  "totalLeaves": 15,
  "usedLeaves": 3
}
```

**실패 응답 (403)** — 다른 부서 조회 시도:
```json
{ "error": "Access denied: different department" }
```

**실패 응답 (404)**:
```json
{ "error": "User not found" }
```

---

### 3. 연차 (Leaves)

> 모든 Leaves API는 `requesterId`가 필수입니다.
> 엔드포인트별 접근 범위가 다릅니다 — 아래 표 참고.

| 엔드포인트 | 접근 범위 | 용도 |
|---|---|---|
| `GET /api/leaves/user/:userId` | **본인만** (`userId === requesterId`) | 내 연차 내역 |
| `POST /api/leaves` | **본인만** (`userId === requesterId`) | 연차 신청 |
| `GET /api/leaves/month/:year/:month` | **같은 부서 전체** | 팀 달력 |

#### 사용자별 연차 요청 조회 (본인만)
```
GET /api/leaves/user/:userId?requesterId=1
```

`userId !== requesterId`일 경우 **403** 반환.

#### 월별 팀 연차 조회 (캘린더뷰용, 같은 부서)
```
GET /api/leaves/month/:year/:month?requesterId=1
```

**참고**:
- 승인된 연차(status: "approved")만 포함됩니다.
- 연차 기간이 여러 날에 걸쳐 있으면 각 날짜마다 표시됩니다.

#### 새 연차 요청 생성 (본인만)
```
POST /api/leaves
```

**요청 Body**:
```json
{
  "requesterId": "1",
  "userId": "1",
  "startDate": "2026-06-10",
  "endDate": "2026-06-12",
  "reason": "가족 여행"
}
```

`userId !== requesterId`일 경우 **403** 반환.

---

## Mock 데이터

### 부서 마스터 데이터 (src/data/departments.js)

| departmentId | 부서명 | 그룹 |
|---|---|---|
| D001 | IT팀 | 경영지원그룹 |
| D002 | 테이블게임팀 | 카지노오퍼레이션그룹 |
| D003 | 전자게임팀 | 카지노오퍼레이션그룹 |
| D004 | 오퍼레이션지원팀 | 카지노오퍼레이션그룹 |
| D005 | 카지노CS팀 | 카지노오퍼레이션그룹 |

### 사용자 데이터 (src/data/users.js)

- 총 50명 (그룹/팀별 10명씩)
- 필드: id, employeeNo, name, group, **departmentId**, department, position, email, totalLeaves, usedLeaves
- 비밀번호: 모든 계정 `1234`
- 접근 제어는 `department` 텍스트가 아닌 **`departmentId`** 값으로 비교

#### 경영지원그룹 - IT팀 (ID 1~10, departmentId: D001)

| ID | 이름 | departmentId | 직급 | 이메일 |
|----|------|-------------|------|--------|
| 1 | 이정호 | D001 | L2 | jeongho.l@workboard.com |
| 2 | 김민준 | D001 | L2 | minjun.kim@workboard.com |
| 3 | 이서준 | D001 | L1 | seojun.lee@workboard.com |
| 4 | 박지훈 | D001 | L2 | jihun.park@workboard.com |
| 5 | 최도윤 | D001 | L1 | doyun.choi@workboard.com |
| 6 | 정하준 | D001 | L4 | hajun.j@workboard.com |
| 7 | 강민서 | D001 | L3 | minseo.kang@workboard.com |
| 8 | 윤서연 | D001 | L2 | seoyeon.yoon@workboard.com |
| 9 | 장예준 | D001 | L1 | yejun.jang@workboard.com |
| 10 | 한지우 | D001 | L1 | jiwoo.han@workboard.com |

#### 카지노오퍼레이션그룹 - 테이블게임팀 (ID 11~20, departmentId: D002)

| ID | 이름 | departmentId | 직급 | 이메일 |
|----|------|-------------|------|--------|
| 11 | 김태양 | D002 | L3 | tayang.kim@workboard.com |
| 12 | 박소미 | D002 | L2 | somi.park@workboard.com |
| 13 | 이현우 | D002 | L2 | hyunwoo.lee@workboard.com |
| 14 | 최지원 | D002 | L1 | jiwon.choi@workboard.com |
| 15 | 정민하 | D002 | L4 | minha.j@workboard.com |
| 16 | 한수진 | D002 | L2 | sujin.han@workboard.com |
| 17 | 오준혁 | D002 | L1 | junhyuk.oh@workboard.com |
| 18 | 신예린 | D002 | L2 | yerrin.shin@workboard.com |
| 19 | 류성민 | D002 | L3 | sungmin.ryu@workboard.com |
| 20 | 윤재원 | D002 | L1 | jaewon.yoon@workboard.com |

#### 카지노오퍼레이션그룹 - 전자게임팀 (ID 21~30, departmentId: D003)

| ID | 이름 | departmentId | 직급 | 이메일 |
|----|------|-------------|------|--------|
| 21 | 임채원 | D003 | L4 | chaewon.lim@workboard.com |
| 22 | 홍지민 | D003 | L2 | jimin.hong@workboard.com |
| 23 | 남궁민 | D003 | L3 | min.namgung@workboard.com |
| 24 | 배수현 | D003 | L1 | suhyun.bae@workboard.com |
| 25 | 서동현 | D003 | L2 | donghyun.seo@workboard.com |
| 26 | 권나은 | D003 | L2 | naeun.kwon@workboard.com |
| 27 | 문준서 | D003 | L1 | junseo.moon@workboard.com |
| 28 | 노은지 | D003 | L3 | eunji.noh@workboard.com |
| 29 | 심재훈 | D003 | L2 | jaehun.shim@workboard.com |
| 30 | 지수아 | D003 | L1 | sua.ji@workboard.com |

#### 카지노오퍼레이션그룹 - 오퍼레이션지원팀 (ID 31~40, departmentId: D004)

| ID | 이름 | departmentId | 직급 | 이메일 |
|----|------|-------------|------|--------|
| 31 | 고미래 | D004 | L4 | mirae.ko@workboard.com |
| 32 | 안서현 | D004 | L3 | seohyun.an@workboard.com |
| 33 | 황진우 | D004 | L2 | jinwoo.hwang@workboard.com |
| 34 | 유하린 | D004 | L1 | harin.yoo@workboard.com |
| 35 | 전도현 | D004 | L2 | dohyun.jeon@workboard.com |
| 36 | 조은혜 | D004 | L2 | eunhye.cho@workboard.com |
| 37 | 도지호 | D004 | L1 | jiho.do@workboard.com |
| 38 | 위성진 | D004 | L3 | sungjin.wi@workboard.com |
| 39 | 변수아 | D004 | L2 | sua.byun@workboard.com |
| 40 | 석민재 | D004 | L1 | minjae.seok@workboard.com |

#### 카지노오퍼레이션그룹 - 카지노CS팀 (ID 41~50, departmentId: D005)

| ID | 이름 | departmentId | 직급 | 이메일 |
|----|------|-------------|------|--------|
| 41 | 탁현준 | D005 | L4 | hyunjun.tak@workboard.com |
| 42 | 표지혜 | D005 | L2 | jihye.pyo@workboard.com |
| 43 | 연지유 | D005 | L3 | jiyu.yeon@workboard.com |
| 44 | 봉수현 | D005 | L1 | suhyun.bong@workboard.com |
| 45 | 맹도희 | D005 | L2 | dohee.maeng@workboard.com |
| 46 | 편준영 | D005 | L2 | junyoung.pyeon@workboard.com |
| 47 | 하민규 | D005 | L1 | mingyu.ha@workboard.com |
| 48 | 국수진 | D005 | L3 | sujin.kook@workboard.com |
| 49 | 어재민 | D005 | L2 | jaemin.eo@workboard.com |
| 50 | 소윤지 | D005 | L1 | yunji.so@workboard.com |

### 연차 데이터 (src/data/leaves.js)
- 초기 11개의 연차 요청 데이터 (IT팀 소속)
- 필드: id, userId, startDate, endDate, reason, status, createdAt
- 상태: "pending" 또는 "approved"

---

## 보안 주의사항

### 현재 (MVP - Mock 데이터)
⚠️ **프로덕션 환경에서는 사용 불가**:
- 비밀번호가 평문으로 저장됨
- 인증 토큰 없이 모든 API 접근 가능
- CORS에서 모든 origin 허용

### 향후 개선 사항
- [ ] 비밀번호 암호화 (bcrypt)
- [ ] JWT 토큰 기반 인증
- [ ] 요청 검증 미들웨어
- [ ] 로그 기능
- [ ] 실제 데이터베이스 연결

---

## 향후 확장 계획

### Phase 1: 현재 (Mock 데이터)
- ✅ Express 서버 기본 구조
- ✅ Mock 데이터 기반 API (50명, 2그룹 5팀)
- ✅ 메모리 기반 데이터 저장
- ✅ 조직 구조 계층(그룹→팀) 반영

### Phase 2: 데이터베이스 연결 (Oracle)
- [ ] Oracle 드라이버 설치 (node-oracledb)
- [ ] 데이터베이스 스키마 설계
- [ ] 마이그레이션 스크립트 작성
- [ ] Mock 데이터 → Oracle 마이그레이션
- [ ] 서비스 레이어 구현

### Phase 3: 보안 강화
- [ ] JWT 인증 구현
- [ ] 비밀번호 암호화
- [ ] CORS 정책 개선
- [ ] 입력값 검증

### Phase 4: 추가 기능
- [ ] 권한 관리 (Role-based Access Control)
- [ ] 로그 시스템
- [ ] 에러 처리 개선
- [ ] API 문서화 (Swagger)

---

## 개발 가이드

### 새로운 API 엔드포인트 추가

1. **라우터 생성** (`src/routes/newroute.js`):
```javascript
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Hello' });
});

module.exports = router;
```

2. **메인 서버에 마운트** (`src/index.js`):
```javascript
const newRoutes = require('./routes/newroute');
app.use('/api/newroute', newRoutes);
```

### 데이터 추가
Mock 데이터는 `src/data/` 디렉토리의 파일들에서 관리합니다.
실제 데이터베이스로 전환할 때는 데이터 접근 계층을 별도로 추상화하면 좋습니다.

---

## 참고사항

- 프론트엔드: `C:\ClaudeTest\WorkBoard` (Expo React Native)
- 서버 포트: 3000 (환경 변수 `PORT`로 변경 가능)
- Mock 데이터는 서버 재시작 시 초기 상태로 돌아옵니다.

---

## 문제 해결

### 포트 3000이 이미 사용 중인 경우
```bash
PORT=3001 npm start
```

### 모듈을 찾을 수 없음 (Cannot find module)
```bash
npm install
```

---

**마지막 업데이트**: 2026-05-12 (departmentId 기반 접근 제어 적용)
