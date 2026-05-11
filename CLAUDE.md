# CLAUDE.md — WorkBoard 백엔드

## 프로젝트 개요

근태/연차 관리 MVP 백엔드 API 서버. Node.js + Express.js 기반, 현재 전부 mock 데이터로 동작.
추후 Oracle DB로 전환 예정.

- **런타임**: Node.js
- **프레임워크**: Express.js 5.2.1
- **포트**: 3000 (기본값, `PORT` 환경변수로 변경 가능)

## 명령어

```bash
npm install       # 의존성 설치
npm run dev       # nodemon 개발 모드 (파일 변경 시 자동 재시작)
npm start         # 프로덕션 모드
```

헬스 체크: `GET http://localhost:3000/health`

## 아키텍처

```
src/
├── index.js               # Express 앱 초기화, 미들웨어, 라우트 마운트, 서버 시작
├── middleware/
│   └── requester.js       # resolveRequester: requesterId 검증 후 req.requester 주입
├── routes/
│   ├── auth.js            # POST /api/auth/login
│   ├── users.js           # GET /api/users, GET /api/users/:userId
│   └── leaves.js          # GET/POST /api/leaves, GET /api/leaves/user/:userId, GET /api/leaves/month/:year/:month
└── data/
    ├── departments.js     # mockDepartments 배열 (D001~D005)
    ├── users.js           # mockUsers 배열 (50명, departmentId 포함)
    └── leaves.js          # mockLeaveRequests 배열 (11건 초기값, POST로 추가 가능)
```

## 데이터 구조

### 사용자 (mockUsers)

```js
{
  id: string,            // '1' ~ '50'
  employeeNo: string,    // 'YYYY000' 형식
  name: string,
  group: string,         // 그룹명 (경영지원그룹 | 카지노오퍼레이션그룹)
  departmentId: string,  // 부서 ID — D001~D005, 접근 제어 비교에 사용
  department: string,    // 부서명 (표시용)
  position: string,      // 'L1' ~ 'L4'
  email: string,
  totalLeaves: number,
  usedLeaves: number,
}
```

부서 마스터 (`src/data/departments.js`):
| departmentId | name | group |
|---|---|---|
| D001 | IT팀 | 경영지원그룹 |
| D002 | 테이블게임팀 | 카지노오퍼레이션그룹 |
| D003 | 전자게임팀 | 카지노오퍼레이션그룹 |
| D004 | 오퍼레이션지원팀 | 카지노오퍼레이션그룹 |
| D005 | 카지노CS팀 | 카지노오퍼레이션그룹 |

### 연차 요청 (mockLeaveRequests)

```js
{
  id: string,
  userId: string,
  startDate: string,   // 'YYYY-MM-DD'
  endDate: string,     // 'YYYY-MM-DD'
  reason: string,
  status: 'pending' | 'approved',
  createdAt: string,   // 'YYYY-MM-DD'
}
```

## 조직 구조

```
경영지원그룹
└── IT팀 (ID: 1~10)

카지노오퍼레이션그룹
├── 테이블게임팀 (ID: 11~20)
├── 전자게임팀 (ID: 21~30)
├── 오퍼레이션지원팀 (ID: 31~40)
└── 카지노CS팀 (ID: 41~50)
```

## 접근 제어 규칙

모든 `/api/users`, `/api/leaves` 엔드포인트는 **`requesterId` 필수**.
`resolveRequester` 미들웨어가 공통으로 처리하며, `req.requester`에 요청자 객체를 주입한다.

- GET 요청: `?requesterId={id}` 쿼리 파라미터
- POST 요청: body에 `requesterId` 포함

엔드포인트별 접근 범위:

| 엔드포인트 | 접근 범위 | 비교 방식 |
|---|---|---|
| `GET /api/users` | 같은 부서 | `departmentId` 비교 |
| `GET /api/users/:userId` | 같은 부서 | `departmentId` 비교 |
| `GET /api/leaves/user/:userId` | **본인만** | `userId === requesterId` |
| `POST /api/leaves` | **본인만** | `userId === requesterId` |
| `GET /api/leaves/month/:year/:month` | 같은 부서 | `departmentId` 비교 (달력용) |

`department` 문자열은 표시용. 비교는 반드시 **`departmentId`** 로만 수행한다.

추후 JWT 도입 시 `resolveRequester` 미들웨어만 교체하면 된다.

## API 요약

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | /api/auth/login | 로그인 (requesterId 불필요) |
| GET | /api/users?requesterId={id} | 같은 부서 사용자 목록 |
| GET | /api/users/:userId?requesterId={id} | 개별 사용자 조회 (타부서 403) |
| GET | /api/leaves/user/:userId?requesterId={id} | 본인 연차 조회 (타인 403) |
| GET | /api/leaves/month/:year/:month?requesterId={id} | 같은 부서 월별 연차 (달력용) |
| POST | /api/leaves | 연차 신청 (본인만, body에 requesterId, 타인 403) |

모든 Mock 계정 비밀번호: `1234`

## 주의사항

- Mock 데이터는 메모리에서만 동작 — 서버 재시작 시 POST로 추가된 연차 요청이 사라짐
- `leaves.js`의 `mockLeaveRequests`는 모듈 레벨 변수이므로 서버가 살아있는 동안은 상태 유지
- 현재 인증 없이 모든 API 접근 가능 (MVP 단계)
- 프론트엔드 위치: `C:\ClaudeTest\WorkBoard` (Expo React Native)

## 향후 전환 계획

1. **Oracle DB 연동**: `node-oracledb` 설치, 서비스 레이어 추가
2. **JWT 인증**: 로그인 시 토큰 발급, 미들웨어로 보호
3. **비밀번호 암호화**: bcrypt 적용
