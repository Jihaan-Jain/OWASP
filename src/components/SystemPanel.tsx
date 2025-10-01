import { useEffect, useState } from "react";

export const SystemPanel = () => {
  const [time, setTime] = useState(new Date());
  const [uptime, setUptime] = useState({
    days: 0,
    hours: 0,
    minutes: 4,
    seconds: 49,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setUptime((prev) => {
        let newSeconds = prev.seconds + 1;
        let newMinutes = prev.minutes;
        let newHours = prev.hours;
        let newDays = prev.days;

        if (newSeconds >= 60) {
          newSeconds = 0;
          newMinutes += 1;
        }
        if (newMinutes >= 60) {
          newMinutes = 0;
          newHours += 1;
        }
        if (newHours >= 24) {
          newHours = 0;
          newDays += 1;
        }

        return {
          days: newDays,
          hours: newHours,
          minutes: newMinutes,
          seconds: newSeconds,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour12: false });
  };

  const formatDate = () => {
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    return `${new Date().getFullYear()} ${
      months[new Date().getMonth()]
    } ${new Date().getDate()}`;
  };

  return (
    <div className="h-full bg-panel-bg p-4 text-xs font-mono flex flex-col gap-4">
      {" "}
      <div className="border-b border-panel-border pb-2">
        <div className="text-panel-header text-[10px] mb-1">PANEL</div>
        <div className="text-panel-header text-[10px]">SYSTEM</div>
      </div>
      <div className="border border-panel-border p-3 glow-border">
        <div className="text-4xl text-primary glow-text font-bold tracking-wider mb-2">
          {formatTime(time)}
        </div>
        <div className="text-muted-foreground text-[10px] space-y-1">
          <div>{formatDate()}</div>
          <div>
            UPTIME: {uptime.days}d {uptime.hours.toString().padStart(2, "0")}:
            {uptime.minutes.toString().padStart(2, "0")}:
            {uptime.seconds.toString().padStart(2, "0")}
          </div>
          <div>TYPE: POWER</div>
          <div>SEP 30 0:d0d:49 wfp 00%</div>
        </div>
      </div>
      <div className="border border-panel-border p-3 glow-border">
        <div className="text-panel-header mb-2">MANUFACTURER MODEL CHASSIS</div>
        <div className="text-muted-foreground space-y-1">
          <div>NONE</div>
          <div>NONE</div>
          <div>NONE</div>
        </div>
      </div>
      <div className="border border-panel-border p-3 glow-border">
        <div className="text-panel-header mb-2">MEMORY</div>
        <div className="h-20 bg-input relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-20"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary glow-border"></div>
        </div>
        <div className="mt-2 text-muted-foreground space-y-1">
          <div>SWAP ——————————————— 0.0 GIB</div>
        </div>
      </div>
      <div className="border border-panel-border p-3 glow-border flex-1">
        <div className="text-panel-header mb-2">
          TOP PROCESSES PID | NAME | CPU | MEM
        </div>
        <div className="text-muted-foreground space-y-1 text-[10px]">
          <div>0 System Idle Pr.. 94.7% 0%</div>
          <div>3000 chrome.exe 1% 17.2%</div>
          <div>1136 svchost.exe 1% 0.1%</div>
          <div>4 System 0.5% 0%</div>
          <div>1760 dwm.exe 0.4% 1.2%</div>
        </div>
      </div>
    </div>
  );
};
