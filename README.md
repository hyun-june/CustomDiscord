# CustomDiscord

Discord 관련 커스텀 도구를 모아 관리하는 저장소입니다.

## Projects

```text
CustomDiscord/
  alarmForDiscord/  기존 Discord 알람 프로젝트
  ScheduleBot/      TypeScript 기반 Discord 일정관리 봇
```

## alarmForDiscord

기존에 관리하던 Discord 알람 프로젝트입니다.

```bash
cd alarmForDiscord
npm install
```

자세한 사용법은 `alarmForDiscord/README.md`를 확인하세요.

## ScheduleBot

Discord 서버 안에서 일정을 등록하고, 다가오는 일정과 오늘 일정을 확인하며, 지정한 시간에 채널로 알림을 보내는 봇입니다.

```bash
cd ScheduleBot
npm install
npm run deploy:commands
npm run dev
```

PowerShell 실행 정책 오류가 나면 `npm.cmd`를 사용하세요.

```bash
npm.cmd install
npm.cmd run deploy:commands
npm.cmd run dev
```

자세한 사용법은 `ScheduleBot/README.md`를 확인하세요.

## Environment

각 프로젝트의 `.env.example`을 복사해서 `.env`를 만든 뒤 값을 채워주세요.

`.env`, `data/`, `dist/`, `node_modules/`는 Git에 올리지 않습니다.
