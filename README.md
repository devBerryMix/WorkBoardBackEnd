# WorkBoard 백엔드 API 서버

## 📋 프로젝트 개요

WorkBoard는 회사 직원용 근태/연차 관리 MVP 애플리케이션입니다.
이 백엔드 서버는 현재 mock 데이터를 기반으로 동작하며, 추후 Node.js + Oracle을 이용한 실제 데이터베이스로 전환될 예정입니다.

- **언어**: Node.js (JavaScript)
- **프레임워크**: Express.js
- **포트**: 3000 (기본값)
- **CORS**: 활성화 (모든 origin 허용)

## 🗂️ 폴더 구조

```
workboard-backend/
├── src/
│   ├── index.js                 # 메인 서버 파일
│   ├── routes/                  # API 라우트
│   │   ├── auth.js             # 인증 관련 (로그인)
│   │   ├── users.js            # 사용자 정보 조회
│   │   └── leaves.js           # 연차 관리
│   └── data/                    # Mock 데이터
│       ├── users.js            # 사용자 데이터
│       └── leaves.js           # 연차 요청 데이터
├── package.json                 # 프로젝트 설정
├── .gitignore                   # Git 제외 파일
└── node_modules/               # 의존성 라이브러리
```

## 📦 의존성

### Production
- **express**: 5.2.1 - 웹 프레임워크
- **cors**: 2.8.6 - CORS 처리

### Development
- **nodemon**: 3.1.14 - 파일 변경 시 자동 재시작

## 🚀 설치 및 실행

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

## 📡 API 엔드포인트

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
    "department": "개발팀",
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

#### 개별 사용자 조회
```
GET /api/users/:userId
```

**경로 파라미터**:
- `userId`: 사용자 ID (예: "1")

**성공 응답 (200)**:
```json
{
  "id": "1",
  "email": "jeongho.l@workboard.com",
  "name": "이정호",
  "department": "개발팀",
  "position": "L2",
  "employeeNo": "2020001",
  "totalLeaves": 15,
  "usedLeaves": 3
}
```

**실패 응답 (404)**:
```json
{ "error": "User not found" }
```

---

#### 전체 사용자 목록 조회
```
GET /api/users
```

**성공 응답 (200)**:
```json
[
  {
    "id": "1",
    "email": "jeongho.l@workboard.com",
    "name": "이정호",
    "department": "개발팀",
    "position": "L2",
    "employeeNo": "2020001",
    "totalLeaves": 15,
    "usedLeaves": 3
  },
  ...
]
```

---

### 3. 연차 (Leaves)

#### 전체 연차 요청 목록
```
GET /api/leaves
```

**성공 응답 (200)**:
```json
[
  {
    "id": "1",
    "userId": "1",
    "startDate": "2026-04-21",
    "endDate": "2026-04-21",
    "reason": "병원 방문",
    "status": "approved",
    "createdAt": "2026-04-18"
  },
  ...
]
```

---

#### 사용자별 연차 요청 조회
```
GET /api/leaves/user/:userId
```

**경로 파라미터**:
- `userId`: 사용자 ID (예: "1")

**성공 응답 (200)**:
```json
[
  {
    "id": "1",
    "userId": "1",
    "startDate": "2026-04-21",
    "endDate": "2026-04-21",
    "reason": "병원 방문",
    "status": "approved",
    "createdAt": "2026-04-18"
  },
  {
    "id": "2",
    "userId": "1",
    "startDate": "2026-05-27",
    "endDate": "2026-05-27",
    "reason": "개인 사정",
    "status": "approved",
    "createdAt": "2026-05-20"
  }
]
```

---

#### 월별 팀 연차 조회 (캘린더뷰용)
```
GET /api/leaves/month/:year/:month
```

**경로 파라미터**:
- `year`: 연도 (예: "2026")
- `month`: 월 (예: "05")

**성공 응답 (200)**:
```json
{
  "2026-05-07": [
    {
      "userId": "2",
      "name": "김민준",
      "department": "개발팀"
    },
    {
      "userId": "4",
      "name": "박지훈",
      "department": "개발팀"
    }
  ],
  "2026-05-12": [
    {
      "userId": "3",
      "name": "이서준",
      "department": "개발팀"
    }
  ]
}
```

**참고**:
- 승인된 연차(status: "approved")만 포함됩니다.
- 연차 기간이 여러 날에 걸쳐 있으면 각 날짜마다 표시됩니다.

---

#### 새 연차 요청 생성
```
POST /api/leaves
```

**요청 Body**:
```json
{
  "userId": "1",
  "startDate": "2026-06-10",
  "endDate": "2026-06-12",
  "reason": "가족 여행"
}
```

**성공 응답 (201)**:
```json
{
  "id": "12",
  "userId": "1",
  "startDate": "2026-06-10",
  "endDate": "2026-06-12",
  "reason": "가족 여행",
  "status": "pending",
  "createdAt": "2026-05-07"
}
```

**실패 응답 (400)**:
```json
{ "error": "userId, startDate, endDate, and reason are required" }
```

**실패 응답 (404)**:
```json
{ "error": "User not found" }
```

**참고**:
- 새 연차 요청은 기본값으로 `status: "pending"`으로 생성됩니다.
- 현재는 메모리에만 저장되므로 서버 재시작 시 사라집니다.

---

## 📊 Mock 데이터

### 사용자 데이터 (src/data/users.js)
- 총 10명의 개발팀 직원
- 필드: id, employeeNo, name, department, position, email, totalLeaves, usedLeaves

**Mock 사용자 목록**:
| ID | 이름 | 부서 | 직급 | 이메일 | 총연차 | 사용연차 |
|----|------|------|------|--------|--------|---------|
| 1 | 이정호 | 개발팀 | L2 | jeongho.l@workboard.com | 15 | 3 |
| 2 | 김민준 | 개발팀 | L2 | minjun.kim@workboard.com | 15 | 5 |
| 3 | 이서준 | 개발팀 | L1 | seojun.lee@workboard.com | 15 | 2 |
| 4 | 박지훈 | 개발팀 | L2 | jihun.park@workboard.com | 15 | 7 |
| 5 | 최도윤 | 개발팀 | L1 | doyun.choi@workboard.com | 15 | 4 |
| 6 | 정하준 | 개발팀 | L4 | hajun.j@workboard.com | 16 | 6 |
| 7 | 강민서 | 개발팀 | L3 | minseo.kang@workboard.com | 15 | 1 |
| 8 | 윤서연 | 개발팀 | L2 | seoyeon.yoon@workboard.com | 15 | 8 |
| 9 | 장예준 | 개발팀 | L1 | yejun.jang@workboard.com | 17 | 5 |
| 10 | 한지우 | 개발팀 | L1 | jiwoo.han@workboard.com | 15 | 0 |

### 연차 데이터 (src/data/leaves.js)
- 초기 11개의 연차 요청 데이터
- 필드: id, userId, startDate, endDate, reason, status, createdAt
- 상태: "pending" 또는 "approved"

---

## 🔐 보안 주의사항

### 현재 (MVP - Mock 데이터)
⚠️ **프로덕션 환경에서는 사용 불가**:
- 비밀번호가 평문으로 저장됨
- 인증 토큰 없이 모든 API 접근 가능
- CORS에서 모든 origin 허용

### 향후 개선 사항
- [x] 비밀번호 암호화 (bcrypt)
- [x] JWT 토큰 기반 인증
- [x] 요청 검증 미들웨어
- [x] 로그 기능
- [x] 실제 데이터베이스 연결

---

## 🔄 향후 확장 계획

### Phase 1: 현재 (Mock 데이터)
- ✅ Express 서버 기본 구조
- ✅ Mock 데이터 기반 API
- ✅ 메모리 기반 데이터 저장

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

## 🛠️ 개발 가이드

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

## 📝 참고사항

- 프론트엔드: `C:\ClaudeTest\WorkBoard` (Expo React Native)
- 서버 포트: 3000 (환경 변수 `PORT`로 변경 가능)
- Mock 데이터는 서버 재시작 시 초기 상태로 돌아옵니다.

---

## 💡 문제 해결

### 포트 3000이 이미 사용 중인 경우
```bash
PORT=3001 npm start
```

### 모듈을 찾을 수 없음 (Cannot find module)
```bash
npm install
```

---

**마지막 업데이트**: 2026-05-07
