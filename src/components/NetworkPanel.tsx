import { useEffect, useState } from "react";

export const NetworkPanel = () => {
  const [traffic, setTraffic] = useState<number[]>(Array(20).fill(0));

  useEffect(() => {
    const interval = setInterval(() => {
      setTraffic((prev) => {
        const newTraffic = [...prev.slice(1), Math.random()];
        return newTraffic;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full bg-panel-bg p-4 text-xs font-mono flex flex-col gap-4">
      {" "}
      <div className="border-b border-panel-border pb-2">
        <div className="text-panel-header text-[10px] mb-1">PANEL</div>
        <div className="text-panel-header text-[10px]">NETWORK</div>
      </div>
      <div className="border border-panel-border p-3 glow-border">
        <div className="text-panel-header mb-2">NETWORK STATUS</div>
        <div className="text-muted-foreground space-y-1 text-[10px]">
          <div>
            <span className="text-panel-header">STATE</span> IPV4
          </div>
          <div>
            <span className="text-panel-header">ONLINE</span> 137.97.164.34
          </div>
          <div>
            <span className="text-panel-header">PING</span> 6ms
          </div>
        </div>
      </div>
      <div className="border border-panel-border p-3 glow-border">
        <div className="text-panel-header mb-2">WORLD VIEW</div>
        <div className="text-panel-header text-[10px] mb-1">
          GLOBAL NETWORK MAP
        </div>
        <div className="text-muted-foreground mb-2">
          <div>ENDPOINT LATLON 21.870, 78.000</div>
        </div>
        <div className="h-40 bg-input relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 grid-bg opacity-10"></div>
          <div className="text-primary text-6xl opacity-20">🌐</div>
        </div>
      </div>
      <div className="border border-panel-border p-3 glow-border flex-1">
        <div className="text-panel-header mb-2">
          NETWORK TRAFFIC UP / DOWN. MB/S
        </div>
        <div className="text-muted-foreground text-[10px] mb-2">
          <div>TOTAL ————————————————— 06.007,00.00</div>
        </div>
        <div className="h-40 bg-input relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-20"></div>
          <svg className="w-full h-full" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              points={traffic
                .map((value, index) => {
                  const x = (index / (traffic.length - 1)) * 100;
                  const y = 100 - value * 80;
                  return `${x},${y}`;
                })
                .join(" ")}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-primary opacity-50"></div>
        </div>
      </div>
    </div>
  );
};
