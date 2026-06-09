"use client";
import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { WatcherDetail } from "./components/WatcherDetail";
import { WatcherList } from "./components/WatcherList";
import { watchers } from "./mocks/watchers";
import { WatcherCreateForm } from "./components/WatcherCreateForm";
import type { Watcher } from "./types/watcher";

export default function Home() {
  const [selectedWatcher, setSelectedWatcher] = useState(watchers[0]);
  const [panelMode, setPanelMode] = useState("detail");

  const handleSelectWatcher = (watcher: Watcher) => {
    setSelectedWatcher(watcher);
    setPanelMode("detail");
  };

  return (
    <main className="app-shell">
      <Topbar />

      <div className="workspace">
        <Sidebar watcherCount={12} />
        <WatcherList
          onCreateWatcher={() => setPanelMode("create")}
          onSelectWatcher={handleSelectWatcher}
          selectedWatcherId={selectedWatcher.id}
          watchers={watchers}
        />

        <WatcherDetail watcher={selectedWatcher} />

        {panelMode === "create" && (
          <WatcherCreateForm onCancel={() => setPanelMode("detail")} />
        )}
      </div>
    </main>
  );
}
