import {
  Bell,
  Check,
  CircleAlert,
  Ellipsis,
  ExternalLink,
  Link2,
  Settings,
  SlidersHorizontal,
  TestTubeDiagonal,
  ToggleLeft,
  ToggleRight,
  Wifi,
} from "lucide-react";
import {
  statusBadgeClasses,
  statusDotClasses,
} from "../constants/watcherStatus";
import type { Watcher } from "../types/watcher";
import { DetailRow } from "./DetailRow";

export function WatcherDetail({
  watcher,
  onToggleWatcher,
  isUpdating = false,
}: {
  watcher: Watcher | null;
  onToggleWatcher: (watcher: Watcher) => Promise<void>;
  isUpdating?: boolean;
}) {
  console.log("🚀 ~ WatcherDetail ~ watcher:", watcher);
  if (!watcher) {
    return (
      <aside className="detail-panel detail-empty-state">
        <div>
          <h2>감시 대상을 선택해주세요.</h2>
          <p>목록에서 감시 대상을 선택하거나 새 대상을 등록할 수 있습니다.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="detail-panel">
      <div className="detail-header">
        <div className="detail-title-block">
          <div className="detail-title-row">
            <h2>{watcher.name}</h2>
            <span
              className={`status-badge ${statusBadgeClasses[watcher.status]}`}
            >
              <span
                className={`status-dot ${statusDotClasses[watcher.status]}`}
              />
              {watcher.statusLabel}
            </span>
          </div>
          <p>{watcher.description}</p>
        </div>
        <button
          aria-label="감시 대상 메뉴"
          className="icon-button"
          title="감시 대상 메뉴"
          type="button"
        >
          <Ellipsis aria-hidden="true" size={19} />
        </button>
      </div>

      <div className="enabled-row">
        <div>
          <p className="enabled-title">감시 활성화</p>
          <p className="enabled-description">
            {watcher.enabled
              ? "Worker가 이 카페를 주기적으로 확인합니다."
              : "감시가 일시 중단되어 새 글을 확인하지 않습니다."}
          </p>
        </div>
        <button
          aria-label={watcher.enabled ? "감시 일시 중단" : "감시 재개"}
          className={`toggle-button ${watcher.enabled ? "" : "toggle-button-paused"}`}
          disabled={isUpdating}
          onClick={() => void onToggleWatcher(watcher)}
          title={watcher.enabled ? "감시 일시 중단" : "감시 재개"}
          type="button"
        >
          {watcher.enabled ? (
            <ToggleRight aria-hidden="true" size={34} strokeWidth={1.7} />
          ) : (
            <ToggleLeft aria-hidden="true" size={34} strokeWidth={1.7} />
          )}
        </button>
      </div>

      <DetailSection
        icon={<Link2 aria-hidden="true" size={15} />}
        title="연결 정보"
      >
        <div className="detail-group">
          <DetailRow label="네이버 카페" mono value={watcher.naverCafeUrl} />
          <DetailRow
            label="Discord 웹훅"
            mono
            value={watcher.discordWebhookMasked}
          />
        </div>
      </DetailSection>

      <DetailSection
        icon={<SlidersHorizontal aria-hidden="true" size={15} />}
        title="실행 설정"
      >
        <div className="detail-group">
          <DetailRow
            label="확인 주기"
            value={`${watcher.pollIntervalSeconds}초`}
          />
          <DetailRow label="최근 확인" value="1분 전" />
          <DetailRow label="최근 새 글" value="12분 전" />
        </div>
      </DetailSection>

      <DetailSection
        icon={<CircleAlert aria-hidden="true" size={15} />}
        title="최근 오류"
      >
        {watcher.lastError ? (
          <div className="empty-state error-state">
            <span className="empty-icon error-icon">
              <CircleAlert aria-hidden="true" size={16} />
            </span>
            <div>
              <p>실행 오류</p>
              <span>{watcher.lastError}</span>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon">
              <Check aria-hidden="true" size={16} />
            </span>
            <div>
              <p>오류 없음</p>
              <span>최근 실행이 정상적으로 완료되었습니다.</span>
            </div>
          </div>
        )}
      </DetailSection>

      <DetailSection
        className="recent-section"
        icon={<Bell aria-hidden="true" size={15} />}
        title="최근 알림"
        action={<button type="button">전체 보기</button>}
      >
        <div className="recent-alert">
          <span className="alert-icon">
            <Wifi aria-hidden="true" size={15} />
          </span>
          <div>
            <p>서비스 점검 일정 안내</p>
            <span>12분 전 전송 완료</span>
          </div>
          <ExternalLink aria-hidden="true" size={14} />
        </div>
      </DetailSection>

      <div className="detail-actions">
        <button className="secondary-button" type="button">
          <TestTubeDiagonal aria-hidden="true" size={16} />
          연결 테스트
        </button>
        <button className="primary-button" type="button">
          <Settings aria-hidden="true" size={16} />
          수정
        </button>
      </div>
    </aside>
  );
}

function DetailSection({
  icon,
  title,
  children,
  action,
  className = "",
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`detail-section ${className}`}>
      <div
        className={`section-heading ${action ? "section-heading-spread" : ""}`}
      >
        <div className="section-heading">
          {icon}
          <h3>{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
