# WorkBoard 백엔드 API 서버

Last Updated: 2026-05-15

## 프로젝트 개요

WorkBoard는 회사 직원용 근태/연차 관리 MVP 애플리케이션입니다.
현재 mock 데이터(메모리) 기반으로 동작하며, 추후 Oracle DB로 전환될 예정입니다.

- **언어**: Node.js (JavaScript)
- **프레임워크**: Express.js 5.2.1
- **포트**: 3000 (기본값, `PORT` 환경변수로 변경 가능)
- **CORS**: 활성화 (모든 origin 허용 — MVP 단계)

## 조직 구조

```
경영지원그룹
└── IT팀 (D001, ID 1~10)

카지노오퍼레이션그룹
├── 테이블게임팀 (D002, ID 11~20)
├── 전자게임팀 (D003, ID 21~30)
├── 오퍼레이션지원팀 (D004, ID 31~40)
└── 카지노CS팀 (D005, ID 41~50)
```

총 50명의 Mock 직원 데이터. 모든 계정 비밀번호: `1234`

## 폴더 구조

```
workboard-backend/
├── src/
│   ├── index.js                 # 메인 서버 파일
│   ├── middleware/
│   │   └── requester.js         # requesterId 검증 → req.requester 주입
│   ├── routes/
│   │   ├── auth.js              # POST /api/auth/login
│   │   ├── users.js             # GET /api/users/*
│   │   └── leaves.js            # GET/POST/PATCH /api/leaves/*
│   └── data/
│       ├── departments.js       # 부서 마스터 (D001~D005)
│       ├── users.js             # 사용자 50명
│       └── leaves.js            # 연차 요청 초기 데이터 (79건)
├── package.json
└── .gitignore
```

## 의존성

| 패키지 | 버전 | 용도 |
|--------|------|------|
| express | 5.2.1 | 웹 프레임워크 |
| cors | 2.8.6 | CORS 처리 |
| nodemon | 3.1.14 | 개발 시 자동 재시작 (devDependency) |

## 설치 및 실행

```bash
npm install
npm run dev    # 개발 모드 (nodemon)
npm start      # 프로덕션 모드
```

헬스 체크: `GET http://localhost:3000/health` → `{ "status": "OK" }`

---

## API 엔드포인트

### 공통 사항

- `GET` 요청: `?requesterId={id}` 쿼리 파라미터 필수
- `POST/PATCH` 요청: body에 `requesterId` 포함 필수
- 접근 제어 기준: **`departmentId`** (D001~D005) 값 비교 — 부서명 문자열 비교 아님

---

### 인증

#### `POST /api/auth/login`

```json
// Request
{ "email": "goodman@workboard.com", "password": "1234" }

// Response 200
{
  "success": true,
  "user": {
    "id": "6",
    "email": "goodman@workboard.com",
    "name": "김봉균",
    "group": "경영지원그룹",
    "departmentId": "D001",
    "department": "IT팀",
    "position": "L4",
    "employeeNo": "2018006",
    "totalLeaves": 16,
    "usedLeaves": 6
  }
}

// Response 401
{ "error": "Invalid email or password" }
```

---

### 사용자

> 모든 엔드포인트는 `requesterId` 필수. **같은 부서** 직원 정보만 조회 가능.

#### `GET /api/users?requesterId={id}`
같은 부서 직원 전체 목록 반환.

#### `GET /api/users/:userId?requesterId={id}`
개별 사용자 조회. 다른 부서 접근 시 `403`.

#### `GET /api/users/department/:departmentId?requesterId={id}`
특정 부서 직원 목록 반환. 달력의 부서별 현황 조회에 사용.

**응답 필드**: `id, email, name, group, departmentId, department, position, employeeNo, totalLeaves, usedLeaves`

**에러 응답**:
| 코드 | 상황 |
|------|------|
| 400 | requesterId 누락 |
| 403 | 다른 부서 접근 |
| 404 | 사용자 없음 |

---

### 연차

> 엔드포인트별 접근 범위가 다릅니다.

| 엔드포인트 | 접근 범위 |
|---|---|
| `GET /api/leaves/user/:userId` | **본인만** |
| `POST /api/leaves` | **본인만** |
| `GET /api/leaves/month/:year/:month` | 같은 부서 |
| `GET /api/leaves/pending` | **L4 + 같은 부서** |
| `PATCH /api/leaves/:id/status` | **L4 + 같은 부서** |

#### `GET /api/leaves/user/:userId?requesterId={id}`
본인 연차 전체 조회. `userId !== requesterId`이면 `403`.

#### `GET /api/leaves/month/:year/:month?requesterId={id}&targetDepartmentId={deptId}`
달력용 월별 연차 조회. **승인된 연차만** 포함. 날짜별로 분할 반환.
`targetDepartmentId` 생략 시 requesterId의 부서 기준.

```json
// Response 예시
{
  "2026-05-14": [{ "userId": "5", "name": "최도윤", "department": "IT팀" }],
  "2026-05-20": [{ "userId": "6", "name": "김봉균", "department": "IT팀" }]
}
```

#### `GET /api/leaves/pending?requesterId={id}`
승인 대기 연차 목록. L4만 가능, 같은 부서만 반환.
L4 아닌 경우 `403`.

#### `POST /api/leaves`
연차 신청. 본인만 가능 (`userId === requesterId`).

```json
// Request Body
{
  "requesterId": "1",
  "userId": "1",
  "startDate": "2026-06-10",
  "endDate": "2026-06-12",
  "reason": "가족 여행"
}

// Response 201
{
  "id": "80",
  "userId": "1",
  "startDate": "2026-06-10",
  "endDate": "2026-06-12",
  "reason": "가족 여행",
  "status": "pending",
  "createdAt": "2026-05-15"
}
```

#### `PATCH /api/leaves/:id/status`
연차 승인 또는 반려. L4만 가능, 같은 부서만 처리.

```json
// Request Body
{ "status": "approved", "requesterId": "6" }
// or
{ "status": "rejected", "requesterId": "6" }

// Response 200 — 업데이트된 연차 객체 반환
```

**에러 응답**:
| 코드 | 상황 |
|------|------|
| 400 | status 값 오류 또는 필수 항목 누락 |
| 403 | L4 아닌 사용자 접근, 또는 다른 부서 연차 처리 시도 |
| 404 | 연차 요청 없음 |

---

## Mock 데이터

### 부서 마스터 (`src/data/departments.js`)

| departmentId | 부서명 | 그룹 |
|---|---|---|
| D001 | IT팀 | 경영지원그룹 |
| D002 | 테이블게임팀 | 카지노오퍼레이션그룹 |
| D003 | 전자게임팀 | 카지노오퍼레이션그룹 |
| D004 | 오퍼레이션지원팀 | 카지노오퍼레이션그룹 |
| D005 | 카지노CS팀 | 카지노오퍼레이션그룹 |

### IT팀 사용자 (`src/data/users.js`, ID 1~10)

| ID | 이름 | 직급 | 이메일 |
|----|------|------|--------|
| 1 | 이정호 | L2 | jeongho.l@workboard.com |
| 2 | 김민준 | L2 | minjun.kim@workboard.com |
| 3 | 이서준 | L1 | seojun.lee@workboard.com |
| 4 | 박지훈 | L2 | jihun.park@workboard.com |
| 5 | 최도윤 | L1 | doyun.choi@workboard.com |
| 6 | **김봉균** | **L4** | goodman@workboard.com |
| 7 | 강민서 | L3 | minseo.kang@workboard.com |
| 8 | 윤서연 | L2 | seoyeon.yoon@workboard.com |
| 9 | 장예준 | L1 | yejun.jang@workboard.com |
| 10 | 한지우 | L1 | jiwoo.han@workboard.com |

각 부서 L4 승인권자:
- D002 테이블게임팀: 정민하 (minha.j@workboard.com)
- D003 전자게임팀: 임채원 (chaewon.lim@workboard.com)
- D004 오퍼레이션지원팀: 고미래 (mirae.ko@workboard.com)
- D005 카지노CS팀: 탁현준 (hyunjun.tak@workboard.com)

### 연차 데이터 (`src/data/leaves.js`)
- 초기 79건 (부서별 분산)
- 필드: id, userId, startDate, endDate, reason, status, createdAt
- status: `"pending"` 또는 `"approved"`
- **서버 재시작 시 초기 상태로 돌아옴** (메모리 기반)

---

## 주의사항

### 메모리 기반 데이터
- `POST /api/leaves`로 추가된 연차는 서버 재시작 시 사라짐
- 개발/테스트 용도로만 사용

### 현재 보안 한계 (MVP)
- 비밀번호 평문 저장
- 인증 토큰 없음 (requesterId 파라미터로 대체)
- CORS 모든 origin 허용

---

## 향후 계획

| Phase | 내용 | 상태 |
|---|---|---|
| 1 | Express 기반 mock API 구축 | ✅ 완료 |
| 2 | Oracle DB 연결 (node-oracledb) | 미완료 |
| 3 | 출결 API 추가 (attendance) | 미완료 |
| 4 | JWT 인증 도입 | 미완료 |
| 5 | 비밀번호 bcrypt 해싱 | 미완료 |

---

## 문제 해결

### 포트 3000이 이미 사용 중인 경우
```bash
PORT=3001 npm start
```

### 모듈을 찾을 수 없음
```bash
npm install
```

---

## 관련 프로젝트
- 프론트엔드: `workboard/` (Expo React Native)
- 마이그레이션 문서: `workboard/docs/`
