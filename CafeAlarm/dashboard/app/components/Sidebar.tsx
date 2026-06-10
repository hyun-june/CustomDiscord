import { Activity, Bell, BellRing, Settings } from "lucide-react";
import { SideNavItem } from "./SideNavItem";

export function Sidebar({ watcherCount }: { watcherCount: number }) {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav" aria-label="주요 메뉴">
        <SideNavItem
          active
          count={watcherCount}
          icon={BellRing}
          label="감시 대상"
        />
        <SideNavItem icon={Bell} label="알림 기록" />
        <SideNavItem icon={Activity} label="시스템 상태" />
      </nav>

      <div className="sidebar-bottom">
        <SideNavItem icon={Settings} label="설정" />
        <div className="sidebar-version">
          <span className="status-dot bg-emerald-500" />
          <span>Worker v0.1.0</span>
        </div>
      </div>
    </aside>
  );
}
