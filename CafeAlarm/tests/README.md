# Tests

이 폴더의 테스트는 Node.js 기본 테스트 도구인 `node:test`와 `node:assert`를 사용합니다. 별도의 테스트 라이브러리는 필요하지 않습니다.

## 실행 방법

전체 테스트:

```bash
node --test tests/*.test.js
```

특정 테스트 파일만 실행:

```bash
node --test tests/stateStore.test.js
```

테스트는 실제 Discord 웹훅이나 네이버 카페 API를 호출하지 않습니다.

## 테스트 구성

### `config.test.js`

`src/config.js`의 `loadConfig()`가 환경변수를 올바르게 읽고 검증하는지 확인합니다.

검증하는 동작:

- 모든 환경변수가 정상일 때 설정 객체를 반환한다.
- 필수 환경변수가 빠지면 오류를 발생시킨다.
- `POLL_INTERVAL_SECONDS`가 숫자가 아니면 오류를 발생시킨다.
- 확인 주기가 60초보다 짧으면 오류를 발생시킨다.

테스트 중에는 실제 `.env` 값을 덮어쓰지 않도록 기존 환경변수를 임시 보관합니다. 각 테스트가 끝나면 원래 환경변수로 복구합니다.

### `stateStore.test.js`

`src/stateStore.js`가 게시글 상태 파일을 안전하게 읽고 저장하는지 확인합니다.

검증하는 동작:

- 저장 파일이 없으면 첫 실행으로 판단한다.
- 게시글 배열을 저장한 뒤 `articleId` 목록으로 다시 읽을 수 있다.
- 저장 파일의 JSON 문법이 깨졌으면 오류를 발생시킨다.
- 저장된 데이터가 배열이 아니면 오류를 발생시킨다.

실제 `data/data.json`은 사용하지 않습니다. 운영 데이터를 변경하지 않도록 운영체제의 임시 폴더에 테스트 전용 JSON 파일을 만들고, 테스트가 끝나면 삭제합니다.

### `naverCafe.test.js`

`src/naverCafe.js`의 `getCafeData()`가 네이버 카페 API 응답을 올바르게 처리하는지 확인합니다.

검증하는 동작:

- API 응답의 게시글을 앱에서 사용하는 게시글 객체로 변환한다.
- 게시글 URL을 `cafeId`와 `articleId`로 생성한다.
- HTTP 요청이 실패하면 오류를 발생시킨다.
- 응답에 `articleList`가 없으면 오류를 발생시킨다.

실제 네이버 API를 호출하지 않고 `globalThis.fetch`를 테스트용 함수로 잠시 교체합니다. 테스트가 끝나면 원래 `fetch`로 복구합니다.

### `discordWebhook.test.js`

`src/discordWebhook.js`의 `sendDiscordWebhook()`이 올바른 Discord payload를 만드는지 확인합니다.

검증하는 동작:

- 지정한 웹훅 URL에 `POST` 요청을 보낸다.
- 요청의 `content-type`이 `application/json`인지 확인한다.
- 게시글 정보를 Discord `embeds` 형식으로 변환한다.
- Discord 응답이 실패하면 상태 코드와 응답 내용을 포함한 오류를 발생시킨다.

실제 Discord에는 메시지를 보내지 않습니다. `globalThis.fetch`를 테스트용 함수로 교체해 요청 URL, 옵션, body만 검사합니다.

## 테스트에서 사용하는 주요 개념

### Mock Fetch

외부 서비스 요청을 실제로 보내지 않고, 원하는 응답을 돌려주는 가짜 `fetch`를 사용하는 방식입니다.

```js
globalThis.fetch = async () => ({
  ok: true,
  json: async () => ({
    result: {
      articleList: [],
    },
  }),
});
```

외부 서비스의 상태나 네트워크 연결에 영향을 받지 않고 빠르고 반복 가능한 테스트를 만들 수 있습니다.

### 임시 파일

상태 저장 테스트는 실제 데이터 파일 대신 `os.tmpdir()` 아래의 임시 폴더를 사용합니다.

```txt
테스트 시작
-> 임시 폴더 생성
-> 테스트 파일 읽기 및 쓰기
-> 테스트 종료
-> 임시 폴더 삭제
```

이를 통해 테스트가 실제 앱 데이터에 영향을 주는 것을 막습니다.

## 현재 테스트하지 않는 범위

`src/index.js`는 import하는 즉시 무한 반복 실행을 시작하며 내부 함수가 export되어 있지 않습니다. 따라서 기존 소스를 수정하지 않는 현재 조건에서는 직접 단위 테스트하지 않습니다.

현재는 `index.js`가 사용하는 각 구성 요소를 개별적으로 테스트하여 핵심 동작을 검증합니다.
