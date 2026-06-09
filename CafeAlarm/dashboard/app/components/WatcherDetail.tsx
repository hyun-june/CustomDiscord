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
  ToggleRight,
  Wifi,
} from "lucide-react";
import { statusBadgeClasses, statusDotClasses } from "../mocks/watchers";
import type { Watcher } from "../types/watcher";
import { DetailRow } from "./DetailRow";

export function WatcherDetail({ watcher }: { watcher: Watcher }) {
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
            Worker가 이 카페를 주기적으로 확인합니다.
          </p>
        </div>
        <button
          aria-label="감시 활성화됨"
          className="toggle-button"
          title="감시 활성화"
          type="button"
        >
          <ToggleRight aria-hidden="true" size={34} strokeWidth={1.7} />
        </button>
      </div>

      <DetailSection
        icon={<Link2 aria-hidden="true" size={15} />}
        title="연결 정보"
      >
        <div className="detail-group">
          <DetailRow
            label="네이버 카페"
            mono
            value="apis.naver.com/.../31719263"
          />
          <DetailRow
            label="Discord 웹훅"
            mono
            value="discord.com/.../1499••••••"
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
        <div className="empty-state">
          <span className="empty-icon">
            <Check aria-hidden="true" size={16} />
          </span>
          <div>
            <p>오류 없음</p>
            <span>최근 실행이 정상적으로 완료되었습니다.</span>
          </div>
        </div>
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
