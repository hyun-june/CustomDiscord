import type { Watcher, WatcherStatus } from "../types/watcher";

export const watchers: Watcher[] = [
  {
    id: "naver-official",
    name: "네이버 공식 공지",
    description: "서비스 운영 및 업데이트 공지",
    status: "healthy",
    statusLabel: "정상",
    lastChecked: "1분 전 확인",
    recentActivity: "새 글 없음",
    pollIntervalSeconds: 60,
  },
  {
    id: "game-update",
    name: "게임 카페 업데이트",
    description: "패치 노트와 이벤트 알림",
    status: "healthy",
    statusLabel: "정상",
    lastChecked: "방금 확인",
    recentActivity: "새 글 2개",
    pollIntervalSeconds: 60,
  },
  {
    id: "operations",
    name: "운영 공지",
    description: "관리자 게시판 연결 상태",
    status: "error",
    statusLabel: "오류",
    lastChecked: "5분 전 확인",
    recentActivity: "연결 실패",
    pollIntervalSeconds: 120,
  },
  {
    id: "test-cafe",
    name: "테스트 카페",
    description: "개발 중 테스트용 감시 대상",
    status: "paused",
    statusLabel: "중지됨",
    lastChecked: "어제 확인",
    recentActivity: "수동 중지",
    pollIntervalSeconds: 300,
  },
];

export const statusDotClasses: Record<WatcherStatus, string> = {
  healthy: "bg-emerald-500",
  error: "bg-rose-500",
  paused: "bg-zinc-400",
};

export const statusBadgeClasses: Record<WatcherStatus, string> = {
  healthy: "text-emerald-700 bg-emerald-50 border-emerald-200",
  error: "text-rose-700 bg-rose-50 border-rose-200",
  paused: "text-zinc-600 bg-zinc-100 border-zinc-200",
};
