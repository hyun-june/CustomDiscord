# CafeAlarm

네이버 카페 게시판을 일정 주기로 확인하고, 새 게시글을 발견하면 Discord 웹훅으로 알림을 보내는 Node.js 애플리케이션입니다.

## 동작 흐름

```txt
환경변수 검증
-> 이전 게시글 데이터 읽기
-> 네이버 카페 게시글 조회
-> 이전 데이터와 최신 데이터 비교
-> 새 게시글을 Discord로 전송
-> 최신 게시글 데이터 저장
-> 설정된 시간만큼 대기 후 반복
```

첫 실행처럼 저장된 데이터 파일이 없으면 현재 게시글을 저장만 하고 기존 게시글 알림은 보내지 않습니다.

## 프로젝트 구조

```txt
CafeAlarm/
├─ .github/
│  └─ workflows/
│     └─ test.yml            # push 및 pull request 자동 테스트
├─ data/                    # 이전에 확인한 게시글 데이터
├─ docs/
│  └─ alarm-plan.md         # 개발 과정과 다음 작업 메모
├─ src/
│  ├─ config.js             # 환경변수 읽기 및 검증
│  ├─ discordWebhook.js     # Discord 웹훅 알림 전송
│  ├─ index.js              # 전체 실행 흐름과 반복 실행
│  ├─ naverCafe.js          # 네이버 카페 게시글 조회 및 변환
│  └─ stateStore.js         # 게시글 상태 파일 읽기 및 저장
├─ tests/
│  ├─ config.test.js
│  ├─ discordWebhook.test.js
│  ├─ naverCafe.test.js
│  ├─ stateStore.test.js
│  └─ README.md             # 테스트별 의도와 실행 방법
├─ .env                     # 실제 환경변수, Git 커밋 금지
├─ .env.example             # 환경변수 예시
└─ package.json
```

## 환경변수

`.env.example`을 참고하여 `.env` 파일을 만듭니다.

```env
DISCORD_WEBHOOK_URL=
NAVER_CAFE_URL=
POLL_INTERVAL_SECONDS=60
DATA_PATH=./data/data.json
```

- `DISCORD_WEBHOOK_URL`: 알림을 전송할 Discord 웹훅 URL
- `NAVER_CAFE_URL`: 게시글을 조회할 네이버 카페 API URL
- `POLL_INTERVAL_SECONDS`: 게시글 확인 간격이며 현재 최소값은 60초
- `DATA_PATH`: 이전 게시글 데이터를 저장할 JSON 파일 경로

Discord 웹훅 URL과 같은 비밀값이 들어 있는 `.env` 파일은 Git에 올리지 않습니다.

## 실행

```bash
npm start
```

프로그램은 시작 즉시 한 번 게시글을 확인합니다. 이후 `POLL_INTERVAL_SECONDS`만큼 기다린 뒤 다시 확인합니다.

## 테스트

전체 테스트 실행:

```bash
node --test tests/*.test.js
```

각 테스트는 실제 네이버 카페나 Discord에 요청하지 않습니다. 테스트용 `fetch` 응답과 임시 파일을 사용합니다.

현재 테스트별 자세한 설명은 [tests/README.md](tests/README.md)를 참고하세요.

## GitHub Actions

`.github/workflows/test.yml`은 GitHub에 코드를 push하거나 pull request를 생성할 때 자동으로 전체 테스트를 실행합니다.

```txt
저장소 코드 가져오기
-> Node.js 24 설정
-> npm ci로 의존성 설치
-> 전체 테스트 실행
```

GitHub 저장소의 `Actions` 탭에서 실행 결과와 실패한 테스트 로그를 확인할 수 있습니다.

## 현재 범위

- 단일 네이버 카페 게시판 감시
- 새 게시글 감지
- Discord embed 알림 전송
- JSON 파일 기반 상태 저장
- 설정, 상태 저장, 네이버 응답, Discord 요청 단위 테스트

여러 카페 지원이나 서버 자동 배포는 이후 확장 대상으로 둡니다.
