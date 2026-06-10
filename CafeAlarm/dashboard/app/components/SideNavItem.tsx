import type { LucideIcon } from "lucide-react";

export const SideNavItem = ({
  icon: Icon,
  label,
  active = false,
  count,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  count?: number;
}) => {
  return (
    <button
      className={`sidebar-item ${active ? "sidebar-item-active" : ""}`}
      type="button"
    >
      <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
      <span>{label}</span>
      {count !== undefined && <span className="sidebar-count">{count}</span>}
    </button>
  );
};
