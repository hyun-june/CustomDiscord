import { ChevronRight, ListFilter, Plus, Search, Trash2 } from "lucide-react";
import {
  statusBadgeClasses,
  statusDotClasses,
} from "../constants/watcherStatus";
import type { Watcher } from "../types/watcher";

export function WatcherList({
  watchers,
  selectedWatcherId,
  onSelectWatcher,
  onCreateWatcher,
  onDeleteWatcher,
}: {
  watchers: Watcher[];
  selectedWatcherId?: string;
  onSelectWatcher: (watcher: Watcher) => void;
  onCreateWatcher: () => void;
  onDeleteWatcher: (watcher: Watcher) => Promise<void>;
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
        {watchers.length === 0 ? (
          <div className="list-empty-state">
            <p>등록된 감시 대상이 없습니다.</p>
            <span>추가 버튼을 눌러 첫 감시 대상을 등록해보세요.</span>
          </div>
        ) : (
          watchers.map((watcher) => (
            <WatcherRow
              isSelected={watcher.id === selectedWatcherId}
              key={watcher.id}
              watcher={watcher}
              onDeleteWatcher={onDeleteWatcher}
              onSelectWatcher={onSelectWatcher}
            />
          ))
        )}
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
  onDeleteWatcher,
}: {
  watcher: Watcher;
  isSelected: boolean;
  onSelectWatcher: (watcher: Watcher) => void;
  onDeleteWatcher: (watcher: Watcher) => Promise<void>;
}) {
  const activityClass = watcher.status === "error" ? "text-rose-600" : "";

  return (
    <div className={`watcher-row ${isSelected ? "watcher-row-selected" : ""}`}>
      <button
        className="watcher-select-button"
        onClick={() => onSelectWatcher(watcher)}
        type="button"
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
        <ChevronRight
          aria-hidden="true"
          className="watcher-chevron"
          size={17}
        />
      </button>
      <button
        aria-label={`${watcher.name} 삭제`}
        className="watcher-delete-button"
        onClick={() => void onDeleteWatcher(watcher)}
        title="감시 대상 삭제"
        type="button"
      >
        <Trash2 aria-hidden="true" size={15} />
      </button>
    </div>
  );
}
