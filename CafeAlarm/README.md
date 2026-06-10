# CafeAlarm

여러 네이버 카페의 새 게시글을 감시하고 각 감시 대상에 연결된 Discord 웹훅으로 알림을 보내는 프로젝트입니다.

프로젝트는 두 애플리케이션으로 나뉩니다.

- **Worker (`src/`)**: MongoDB에서 실행할 감시 대상을 읽고 새 글을 확인해 Discord 알림을 전송합니다.
- **Dashboard (`dashboard/`)**: Basic Auth로 보호되며 감시 대상을 조회, 생성, 삭제하는 Next.js 관리자 화면과 API입니다.

## 동작 흐름

```txt
Dashboard에서 감시 대상 생성
-> Discord 웹훅 URL 암호화 후 watchers 컬렉션에 저장
-> Worker가 10초마다 실행 시점이 된 감시 대상을 조회
-> 네이버 카페 게시글 조회
-> seenarticles 컬렉션과 비교
-> 새 게시글을 Discord로 전송
-> 전송에 성공한 게시글 저장
-> 감시 대상의 상태와 마지막 실행 시각 갱신
```

감시 대상별 실제 실행 주기는 MongoDB의 `pollIntervalSeconds` 값으로 결정됩니다. Worker의 10초 주기는 실행 시점이 된 대상을 찾는 내부 스케줄러 주기입니다.

처음 실행되는 감시 대상은 현재 게시글을 기준 데이터로만 저장하며 기존 게시글 알림은 보내지 않습니다.

감시 대상을 일시 중단하면 Worker 실행 대상에서 제외됩니다. 재개할 때는 기존 게시글 기록을 비우고 현재 게시글을 새 기준 데이터로 저장하므로, 중단 기간의 게시글 알림은 보내지 않습니다. 감시 대상을 삭제하면 연결된 게시글 기록도 함께 완전히 삭제됩니다.

## 데이터 구조

### `watchers`

Dashboard에서 관리하는 감시 대상입니다. 카페 API URL, 실행 주기, 상태, 마지막 실행 결과와 암호화된 Discord 웹훅 정보를 저장합니다.

### `seenarticles`

Worker가 이미 확인한 게시글을 저장합니다. `watcherId`와 `articleId` 조합은 중복 저장되지 않으며, 게시글 제목, 요약, 메뉴명, URL도 함께 저장합니다.

## 환경 변수

루트와 `dashboard/`에서 각각 `.env.example`을 복사해 `.env`를 만듭니다.

```env
MONGODB_URI=mongodb+srv://username:password@cluster/CafeAlarm
WEBHOOK_ENCRYPTION_KEY=32-byte-base64-value
```

두 애플리케이션은 같은 MongoDB와 같은 `WEBHOOK_ENCRYPTION_KEY`를 사용해야 합니다. 암호화 키는 한 번 생성한 뒤 안전하게 보관하세요.

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
```

키를 잃거나 변경하면 기존에 저장된 Discord 웹훅 URL을 복호화할 수 없습니다. `.env` 파일은 Git에 커밋하지 않습니다.

## 로컬 실행

Worker:

```bash
npm install
npm start
```

Dashboard:

```bash
cd dashboard
npm install
npm run dev
```

Dashboard는 기본적으로 `http://localhost:3000`에서 실행됩니다.

## 테스트

Worker:

```bash
npm test
```

Dashboard:

```bash
cd dashboard
npm test
npm run lint
npm run build
```

현재 Worker 테스트는 네이버 응답 변환, Discord 요청, 예전 JSON 상태 저장 모듈을 검증합니다. 스케줄러, MongoDB 저장소, `runWatcher` 통합 흐름은 아직 자동 테스트가 없습니다. 자세한 내용은 [tests/README.md](tests/README.md)를 참고하세요.

## 배포 방향

- Dashboard: Vercel에 배포하고 프로젝트 루트 디렉터리를 `CafeAlarm/dashboard`로 설정합니다.
- Worker: Google Compute Engine에서 PM2로 **한 개 인스턴스만** 계속 실행합니다.

```bash
pm2 start npm --name cafe-alarm-worker -- start
pm2 save
```

여러 Worker 인스턴스를 동시에 실행하면 같은 게시글 알림이 중복 전송될 수 있습니다.

## 프로젝트 구조

```txt
CafeAlarm/
├─ src/
│  ├─ index.js                 # Worker 스케줄러
│  ├─ runWatcher.js            # 감시 대상 한 개의 실행 흐름
│  ├─ watcherStore.js          # 실행 대상 조회 및 상태 갱신
│  ├─ seenArticleStore.js      # 확인한 게시글 저장
│  ├─ naverCafe.js             # 네이버 카페 게시글 조회
│  ├─ discordWebhook.js        # Discord 알림 전송
│  ├─ webhookCrypto.js         # 웹훅 URL 복호화
│  ├─ mongodb.js               # Worker MongoDB 연결
│  └─ stateStore.js            # 이전 JSON 저장 방식, 현재 Worker에서는 미사용
├─ tests/                      # Worker 단위 테스트
├─ dashboard/                  # Next.js 관리자 화면과 API
├─ .env.example
└─ package.json
```

## 배포 전 보완점

- Dashboard Basic Auth에 충분히 긴 관리자 비밀번호를 설정하고 HTTPS 환경에서만 사용해야 합니다.
- 잘못된 실행 주기를 가진 감시 대상은 Worker가 조용히 건너뜁니다.
- Worker 다중 인스턴스 실행을 막는 분산 락이 없습니다.
- Worker 핵심 실행 흐름과 MongoDB 저장소 테스트를 추가해야 합니다.
