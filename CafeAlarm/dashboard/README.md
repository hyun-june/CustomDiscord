# CafeAlarm Dashboard

CafeAlarm Worker가 사용할 감시 대상을 관리하는 Next.js 관리자 화면입니다.

## 현재 기능

- 감시 대상 목록 조회
- 감시 대상 생성
- 감시 대상 삭제
- 감시 대상 일시 중단 및 재개
- 감시 상태, 마지막 확인 시각, 최근 오류 표시
- Discord 웹훅 URL AES-256-GCM 암호화 저장
- `proxy.ts` 기반 Basic Auth 접근 제한

Dashboard는 알림을 직접 보내지 않습니다. 생성한 감시 대상은 MongoDB의 `watchers` 컬렉션에 저장되며, 별도로 실행 중인 Worker가 이를 읽어 처리합니다.

## 환경 변수

`.env.example`을 복사해 `.env`를 만듭니다.

```env
MONGODB_URI=mongodb+srv://username:password@cluster/CafeAlarm
WEBHOOK_ENCRYPTION_KEY=32-byte-base64-value
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-this-password
```

Worker와 같은 MongoDB 및 암호화 키를 사용해야 합니다.
`ADMIN_USERNAME`과 `ADMIN_PASSWORD`는 Dashboard 화면과 API에 접근할 때 브라우저가 요청하는 관리자 계정입니다. 예시 비밀번호를 그대로 사용하지 마세요.

암호화 키 생성:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
```

기존 평문 웹훅 URL을 암호화 필드로 이전:

```bash
npm run migrate:webhooks
```

키를 변경하거나 잃으면 기존 웹훅 URL을 복호화할 수 없습니다.

## 실행

```bash
npm install
npm run dev
```

기본 주소는 `http://localhost:3000`입니다.

## 명령어

```bash
npm run dev       # 개발 서버
npm test          # Dashboard 테스트
npm run lint      # ESLint 검사
npm run build     # 배포 빌드 검사
npm run start     # 빌드된 앱 실행
```

## API

- `GET /api/watchers`: 전체 감시 대상 조회
- `POST /api/watchers`: 감시 대상 생성 및 웹훅 URL 암호화
- `PATCH /api/watchers/:id`: 감시 대상 일시 중단 또는 재개
- `DELETE /api/watchers/:id`: 감시 대상과 연결 게시글 기록 완전 삭제

API 응답에는 평문 웹훅 URL이나 암호화 원문 필드를 포함하지 않습니다.

재개 시에는 기존 게시글 기록을 비웁니다. Worker가 다음 실행에서 현재 게시글을 새 기준으로 저장하므로 중단 기간에 올라온 글은 알림으로 전송하지 않습니다.

## Vercel 배포

Vercel 프로젝트의 루트 디렉터리를 `CafeAlarm/dashboard`로 설정하고, `.env.example`에 적힌 네 환경 변수를 등록합니다.

Dashboard와 API는 `proxy.ts`의 Basic Auth로 보호됩니다. 충분히 긴 비밀번호를 사용하고 HTTPS 환경에서만 접속하세요. 브라우저가 인증 정보를 기억하므로 일반적인 로그아웃 버튼은 제공되지 않습니다.
