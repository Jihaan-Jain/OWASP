import { Folder, HardDrive } from "lucide-react";

const folders = [
  { name: "Show disks", icon: HardDrive },
  { name: "Go up", icon: Folder },
  { name: "blob_storage", icon: Folder },
  { name: "Cache", icon: Folder },
  { name: "Code Cache", icon: Folder },
  { name: "Dictionaries", icon: Folder },
  { name: "fonts", icon: Folder },
  { name: "geoIPCache", icon: Folder },
  { name: "GPUCache", icon: Folder },
  { name: "keyboards", icon: Folder },
  { name: "Local Storage", icon: Folder },
  { name: "Session Stor..", icon: Folder },
  { name: "themes", icon: Folder },
  { name: "Cookies", icon: Folder },
];

export const FileSystem = () => {
  return (
    <div className="bg-panel-bg border-t border-panel-border p-3 max-h-[180px] overflow-y-auto">
      <div className="text-panel-header text-[10px] mb-2 font-mono">
        FILESYSTEM - TRACKING FAILED, RUNNING DETACHED FROM TTY
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {folders.map((folder, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center gap-1 min-w-[70px] cursor-pointer group"
          >
            <div className="w-12 h-12 border border-panel-border glow-border bg-input flex items-center justify-center group-hover:bg-panel-bg transition-colors">
              <folder.icon className="w-6 h-6 text-primary" />
            </div>
            <div className="text-[10px] text-muted-foreground text-center font-mono max-w-[70px] truncate">
              {folder.name}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 text-[10px] text-muted-foreground font-mono">
        C:\Users\[user]\AppData\Roaming\OWASP-Terminal
      </div>
      <div className="mt-1 text-[10px] text-muted-foreground font-mono">
        Mount C: used 80%
      </div>
    </div>
  );
};
