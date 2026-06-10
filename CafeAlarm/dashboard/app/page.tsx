"use client";
import { useEffect, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { WatcherDetail } from "./components/WatcherDetail";
import { WatcherList } from "./components/WatcherList";
import { WatcherCreateForm } from "./components/WatcherCreateForm";
import type { ApiWatcher, CreateWatcherInput, Watcher } from "./types/watcher";
import { mapWatcher } from "./mappers/watchMapper";
import {
  removeWatcherFromList,
  replaceWatcherInList,
} from "./utils/watcherList";

export default function Home() {
  const [selectedWatcher, setSelectedWatcher] = useState<Watcher | null>(null);
  const [panelMode, setPanelMode] = useState("detail");
  const [watcherList, setWatcherList] = useState<Watcher[]>([]);
  const [loadError, setLoadError] = useState("");
  const [updatingWatcherId, setUpdatingWatcherId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const loadWatchers = async () => {
      try {
        const response = await fetch("/api/watchers");

        if (!response.ok) {
          throw new Error("감시 대상 조회에 실패했습니다.");
        }

        const data: ApiWatcher[] = await response.json();
        const mappedWatchers = data.map(mapWatcher);

        setWatcherList(mappedWatchers);
        setSelectedWatcher(mappedWatchers[0] ?? null);
        setLoadError("");
      } catch (error) {
        console.error(error);
        setLoadError("감시 대상 목록을 불러오지 못했습니다.");
      }
    };

    loadWatchers();
  }, []);

  const handleSelectWatcher = (watcher: Watcher) => {
    setSelectedWatcher(watcher);
    setPanelMode("detail");
  };

  const handleCreateWatcher = async (input: CreateWatcherInput) => {
    const response = await fetch("/api/watchers", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);

      throw new Error(
        errorBody?.message ?? "감시 대상 생성에 실패했습니다.",
      );
    }

    const createdWatcher = mapWatcher(await response.json());

    setWatcherList((previous) => [createdWatcher, ...previous]);
    setSelectedWatcher(createdWatcher);
    setPanelMode("detail");
  };

  const handleDeleteWatcher = async (watcher: Watcher) => {
    if (
      !window.confirm(
        `"${watcher.name}" 감시 대상과 저장된 게시글 기록을 모두 삭제하시겠습니까?`,
      )
    ) {
      return;
    }

    const response = await fetch(`/api/watchers/${watcher.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      window.alert(errorBody?.message ?? "감시 대상 삭제에 실패했습니다.");
      return;
    }

    const nextState = removeWatcherFromList(
      watcherList,
      selectedWatcher,
      watcher.id,
    );

    setWatcherList(nextState.watchers);
    setSelectedWatcher(nextState.selectedWatcher);
  };

  const handleToggleWatcher = async (watcher: Watcher) => {
    const enabled = !watcher.enabled;

    if (
      enabled &&
      !window.confirm(
        `"${watcher.name}" 감시를 재개하시겠습니까? 현재 게시글을 새 기준으로 저장하고 이후 글부터 알림을 보냅니다.`,
      )
    ) {
      return;
    }

    setUpdatingWatcherId(watcher.id);

    try {
      const response = await fetch(`/api/watchers/${watcher.id}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ enabled }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(
          errorBody?.message ?? "감시 대상 상태 변경에 실패했습니다.",
        );
      }

      const updatedWatcher = mapWatcher(await response.json());
      const nextState = replaceWatcherInList(
        watcherList,
        selectedWatcher,
        updatedWatcher,
      );

      setWatcherList(nextState.watchers);
      setSelectedWatcher(nextState.selectedWatcher);
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "감시 대상 상태 변경에 실패했습니다.",
      );
    } finally {
      setUpdatingWatcherId(null);
    }
  };

  return (
    <main className="app-shell">
      <Topbar />

      <div className="workspace">
        <Sidebar watcherCount={watcherList.length} />
        <WatcherList
          onCreateWatcher={() => setPanelMode("create")}
          onDeleteWatcher={handleDeleteWatcher}
          onSelectWatcher={handleSelectWatcher}
          selectedWatcherId={selectedWatcher?.id}
          watchers={watcherList}
        />

        {loadError ? (
          <aside className="detail-panel detail-empty-state">
            <div>
              <h2>목록을 불러오지 못했습니다.</h2>
              <p>{loadError}</p>
            </div>
          </aside>
        ) : (
          <WatcherDetail
            isUpdating={updatingWatcherId === selectedWatcher?.id}
            onToggleWatcher={handleToggleWatcher}
            watcher={selectedWatcher}
          />
        )}

        {panelMode === "create" && (
          <WatcherCreateForm
            onCancel={() => setPanelMode("detail")}
            onCreate={handleCreateWatcher}
          />
        )}
      </div>
    </main>
  );
}
