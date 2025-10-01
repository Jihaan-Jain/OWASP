import { useState } from "react";
import { BootSequence } from "@/components/BootSequence";
import { SystemPanel } from "@/components/SystemPanel";
import { NetworkPanel } from "@/components/NetworkPanel";
import { Terminal } from "@/components/Terminal";
import { FileSystem } from "@/components/FileSystem";

const Index = () => {
  const [booting, setBooting] = useState(true);
  const [tabs, setTabs] = useState([
    { id: "main", title: "MAIN", active: true },
    { id: "empty1", title: "EMPTY", active: false },
    { id: "empty2", title: "EMPTY", active: false },
    { id: "empty3", title: "EMPTY", active: false },
  ]);

  if (booting) {
    return <BootSequence onComplete={() => setBooting(false)} />;
  }

  const activeTab = tabs.find((tab) => tab.active)?.id || "main";

  return (
    <div className="h-screen w-screen bg-background overflow-hidden flex flex-col scanlines">
      {/* Main Content - 3 column layout */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Panel - System Info - Fixed width */}
        <div className="w-60 flex-shrink-0 overflow-y-auto">
          <SystemPanel />
        </div>

        {/* Center - Terminal - Takes remaining space */}
        <div className="flex-1 flex flex-col min-w-0 border-x border-panel-border">
          {/* Terminal Tabs */}
          <div className="bg-panel-bg border-b border-panel-border flex flex-shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setTabs((prev) =>
                    prev.map((t) => ({ ...t, active: t.id === tab.id }))
                  )
                }
                className={`flex-1 max-w-[200px] py-2 text-xs font-mono border-r border-panel-border transition-colors ${
                  tab.active
                    ? "bg-terminal-bg text-terminal-prompt glow-text"
                    : "text-muted-foreground hover:text-terminal-text"
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>

          {/* Terminal Content - Scrollable */}
          <div className="flex-1 overflow-hidden min-h-0">
            <Terminal tabId={activeTab} />
          </div>

          {/* File System - Fixed height */}
          <div className="flex-shrink-0">
            <FileSystem />
          </div>
        </div>

        {/* Right Panel - Network - Fixed width */}
        <div className="w-80 flex-shrink-0 overflow-y-auto">
          <NetworkPanel />
        </div>
      </div>
    </div>
  );
};

export default Index;
