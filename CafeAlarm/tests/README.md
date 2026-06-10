# Worker Tests

Worker 테스트는 Node.js 기본 테스트 도구인 `node:test`와 `node:assert`를 사용합니다.

## 실행

루트 `CafeAlarm/` 폴더에서 실행합니다.

```bash
npm test
```

특정 파일만 실행하려면 다음처럼 지정합니다.

```bash
node --test tests/naverCafe.test.js
```

## 현재 테스트

### `naverCafe.test.js`

`fetchCafeData()`가 네이버 카페 응답을 게시글 객체로 변환하고 게시글 URL을 만드는지 검증합니다. 실패 응답과 잘못된 응답 구조도 확인합니다.

### `discordWebhook.test.js`

`sendDiscordWebhook()`이 올바른 Discord `embeds` 요청을 만들고, 실패 응답을 오류로 처리하는지 검증합니다.

### `stateStore.test.js`

이전 JSON 파일 기반 저장 모듈인 `stateStore.js`의 읽기와 저장을 검증합니다. 현재 MongoDB 기반 Worker 실행 흐름에서는 사용하지 않지만, 모듈이 남아 있어 테스트도 함께 유지하고 있습니다.

테스트에서는 실제 네이버 카페나 Discord에 요청하지 않습니다. `fetch`를 임시 함수로 교체하고, 파일 테스트는 운영 데이터가 아닌 임시 폴더를 사용합니다.

Dashboard 테스트는 `dashboard/tests/`에 있으며, 삭제 후 목록 선택과 상태 변경 후 목록 갱신, API 응답의 활성화 상태 변환, 웹훅 암호화를 검증합니다.

## 아직 필요한 테스트

- `watcherStore.js`: 실행 주기가 지난 감시 대상만 선택하는지 검증
- `seenArticleStore.js`: 감시 대상별 게시글 저장과 중복 방지 검증
- `runWatcher.js`: 첫 실행, 새 글 전송 성공, 전송 실패 흐름 검증
- `webhookCrypto.js`: Dashboard에서 암호화한 값을 Worker가 복호화하는지 검증
- `index.js`: 한 감시 대상의 실패가 다른 감시 대상 실행을 막지 않는지 검증
