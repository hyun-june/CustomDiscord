import { ChevronRight, ListFilter, Plus, Search } from "lucide-react";
import { statusBadgeClasses, statusDotClasses } from "../mocks/watchers";
import type { Watcher } from "../types/watcher";

export function WatcherList({
  watchers,
  selectedWatcherId,
  onSelectWatcher,
  onCreateWatcher,
}: {
  watchers: Watcher[];
  selectedWatcherId: string;
  onSelectWatcher: (watcher: Watcher) => void;
  onCreateWatcher: () => void;
}) {
  return (
    <section className="watcher-column">
      <div className="column-header">
        <div>
          <div className="heading-row">
            <h1>감시 대상</h1>
            <span className="count-badge">{watchers.length}</span>
          </div>
          <p>등록된 카페의 연결 상태를 관리합니다.</p>
        </div>
        <button
          className="primary-button"
          onClick={onCreateWatcher}
          type="button"
        >
          <Plus aria-hidden="true" size={16} />
          추가
        </button>
      </div>

      <div className="list-toolbar">
        <label className="search-box">
          <Search aria-hidden="true" size={16} />
          <input
            aria-label="감시 대상 검색"
            placeholder="감시 대상 검색"
            type="search"
          />
        </label>
        <button
          aria-label="목록 필터"
          className="icon-button"
          title="목록 필터"
          type="button"
        >
          <ListFilter aria-hidden="true" size={17} />
        </button>
      </div>

      <div className="segment-control" aria-label="상태 필터">
        <button className="segment-active" type="button">
          전체
        </button>
        <button type="button">정상</button>
        <button type="button">오류</button>
        <button type="button">중지</button>
      </div>

      <div className="watcher-list">
        {watchers.map((watcher) => {
          return (
            <WatcherRow
              isSelected={watcher.id === selectedWatcherId}
              key={watcher.id}
              watcher={watcher}
              onSelectWatcher={onSelectWatcher}
            />
          );
        })}
      </div>

      <div className="list-footer">
        <span>{watchers.length}개 표시 중</span>
        <button type="button">전체 감시 대상 보기</button>
      </div>
    </section>
  );
}

function WatcherRow({
  watcher,
  isSelected,
  onSelectWatcher,
}: {
  watcher: Watcher;
  isSelected: boolean;
  onSelectWatcher: (watcher: Watcher) => void;
}) {
  const activityClass =
    watcher.status === "error"
      ? "text-rose-600"
      : watcher.recentActivity.includes("2개")
        ? "text-emerald-700"
        : "";

  return (
    <button
      className={`watcher-row ${isSelected ? "watcher-row-selected" : ""}`}
      type="button"
      onClick={() => onSelectWatcher(watcher)}
    >
      <span className={`status-dot ${statusDotClasses[watcher.status]}`} />
      <span className="watcher-content">
        <span className="watcher-title-row">
          <span className="watcher-name">{watcher.name}</span>
          <span
            className={`status-badge ${statusBadgeClasses[watcher.status]}`}
          >
            {watcher.statusLabel}
          </span>
        </span>
        <span className="watcher-description">{watcher.description}</span>
        <span className="watcher-meta">
          <span>{watcher.lastChecked}</span>
          <span className="meta-divider">·</span>
          <span className={activityClass}>{watcher.recentActivity}</span>
        </span>
      </span>
      <ChevronRight aria-hidden="true" className="watcher-chevron" size={17} />
    </button>
  );
}
