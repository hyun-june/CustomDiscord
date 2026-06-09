import { BellRing, Clock3 } from "lucide-react";

export function Topbar() {
  return (
    <header className="topbar">
      <div className="brand-block">
        <div className="brand-mark" aria-hidden="true">
          <BellRing size={18} strokeWidth={2.2} />
        </div>
        <div>
          <p className="brand-name">CafeAlarm</p>
          <p className="brand-subtitle">Console</p>
        </div>
      </div>

      <div className="worker-summary">
        <span className="worker-status">
          <span className="status-dot bg-emerald-500" />
          Worker 정상
        </span>
        <span className="worker-divider" />
        <span className="worker-sync">
          <Clock3 aria-hidden="true" size={14} />
          마지막 동기화 방금 전
        </span>
      </div>
    </header>
  );
}
