interface CommandResult {
  type: "output" | "error";
  content: string;
}

const fileSystem = {
  "/": ["bin", "etc", "home", "usr", "var", "tmp"],
  "/home": ["user"],
  "/home/user": ["Documents", "Downloads", "Desktop"],
};

let currentPath = "/home/user";

export function executeCommand(cmd: string): CommandResult | CommandResult[] {
  const parts = cmd.trim().split(" ");
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (command) {
    case "help":
      return [
        {
          type: "output",
          content: "Available commands (100+ Linux commands):",
        },
        {
          type: "output",
          content: "Type 'man [command]' for details. Common commands:",
        },
        {
          type: "output",
          content:
            "FILE: ls, cd, pwd, mkdir, rmdir, touch, rm, cp, mv, cat, more, less, head, tail",
        },
        {
          type: "output",
          content:
            "TEXT: grep, sed, awk, sort, uniq, wc, cut, paste, tr, diff, nano, vi",
        },
        {
          type: "output",
          content:
            "SYSTEM: ps, top, htop, free, df, du, uptime, uname, whoami, hostname, date",
        },
        {
          type: "output",
          content:
            "NETWORK: ping, curl, wget, netstat, ifconfig, ip, ssh, scp, ftp",
        },
        {
          type: "output",
          content: "PROCESS: kill, killall, bg, fg, jobs, nice",
        },
        { type: "output", content: "ARCHIVE: tar, zip, unzip, gzip, gunzip" },
        { type: "output", content: "PACKAGE: apt, dpkg, yum, rpm" },
        { type: "output", content: "SEARCH: find, locate, which, whereis" },
        { type: "output", content: "PERMS: chmod, chown, chgrp" },
        {
          type: "output",
          content: "OTHER: clear, echo, history, alias, export, env, sudo, su",
        },
        { type: "output", content: "" },
      ];

    case "man":
      if (args.length === 0) {
        return { type: "error", content: "man: missing command operand" };
      }
      return {
        type: "output",
        content: `Manual page for ${args[0]}:\n  A simulated Linux command. Type 'help' for available commands.`,
      };

    case "clear":
      // This should be handled in the Terminal component
      return { type: "output", content: "" };

    case "ls":
      const dir = fileSystem[currentPath as keyof typeof fileSystem] || [];
      if (dir.length === 0) {
        return { type: "output", content: "" };
      }
      return dir.map((item) => ({ type: "output" as const, content: item }));

    case "pwd":
      return { type: "output", content: currentPath };

    case "cd":
      if (args.length === 0) {
        currentPath = "/home/user";
        return { type: "output", content: "" };
      }
      const target = args[0];
      if (target === "..") {
        const parts = currentPath.split("/").filter(Boolean);
        parts.pop();
        currentPath = "/" + parts.join("/");
        if (currentPath === "/") currentPath = "/";
        return { type: "output", content: "" };
      } else if (target.startsWith("/")) {
        // Absolute path
        if (fileSystem[target as keyof typeof fileSystem]) {
          currentPath = target;
          return { type: "output", content: "" };
        }
        return {
          type: "error",
          content: `cd: ${target}: No such file or directory`,
        };
      } else {
        // Relative path
        const newPath =
          currentPath === "/" ? `/${target}` : `${currentPath}/${target}`;
        if (fileSystem[newPath as keyof typeof fileSystem]) {
          currentPath = newPath;
          return { type: "output", content: "" };
        }
        return {
          type: "error",
          content: `cd: ${target}: No such file or directory`,
        };
      }

    case "echo":
      return { type: "output", content: args.join(" ") };

    case "date":
      return { type: "output", content: new Date().toString() };

    case "whoami":
      return { type: "output", content: "user" };

    case "uname":
      if (args[0] === "-a") {
        return {
          type: "output",
          content: "OWASP 5.15.0-1.0 #1 SMP x86_64 GNU/Linux",
        };
      }
      return { type: "output", content: "OWASP" };

    case "ps":
      return [
        { type: "output", content: "  PID TTY          TIME CMD" },
        { type: "output", content: " 1234 pts/0    00:00:00 bash" },
        { type: "output", content: " 5678 pts/0    00:00:01 owasp-term" },
        { type: "output", content: " 9012 pts/0    00:00:00 ps" },
        { type: "output", content: "" },
      ];

    case "mkdir":
      if (args.length === 0) {
        return { type: "error", content: "mkdir: missing operand" };
      }
      const dirName = args[0];
      const newDirPath =
        currentPath === "/" ? `/${dirName}` : `${currentPath}/${dirName}`;

      // Add directory to file system
      (fileSystem as any)[newDirPath] = [];

      // Add directory to parent's listing
      const currentDir = fileSystem[currentPath as keyof typeof fileSystem];
      if (currentDir && !currentDir.includes(dirName)) {
        currentDir.push(dirName);
      }

      return { type: "output", content: `Created directory: ${dirName}` };

    case "touch":
      if (args.length === 0) {
        return { type: "error", content: "touch: missing file operand" };
      }
      const fileName = args[0];
      const touchDir = fileSystem[currentPath as keyof typeof fileSystem];
      if (touchDir && !touchDir.includes(fileName)) {
        touchDir.push(fileName);
      }
      return { type: "output", content: `Created file: ${fileName}` };

    case "rm":
      if (args.length === 0) {
        return { type: "error", content: "rm: missing operand" };
      }
      const targetFile = args[0];
      const rmDir = fileSystem[currentPath as keyof typeof fileSystem];
      if (rmDir) {
        const index = rmDir.indexOf(targetFile);
        if (index > -1) {
          rmDir.splice(index, 1);
          return { type: "output", content: `Removed: ${targetFile}` };
        }
      }
      return {
        type: "error",
        content: `rm: cannot remove '${targetFile}': No such file or directory`,
      };

    case "cat":
      if (args.length === 0) {
        return { type: "error", content: "cat: missing file operand" };
      }
      return {
        type: "output",
        content: `This is a simulated file content for ${args[0]}`,
      };

    case "grep":
      if (args.length < 2) {
        return { type: "error", content: "grep: missing pattern or file" };
      }
      return {
        type: "output",
        content: `Searching for '${args[0]}' in ${args[1]}...`,
      };

    case "history":
      return {
        type: "output",
        content: "Command history available. Use arrow keys to navigate.",
      };

    case "neofetch":
      return [
        { type: "output", content: "       ___           " },
        { type: "output", content: "      /   \\          OS: OWASP Linux" },
        { type: "output", content: "     |  O  |         Kernel: 5.15.0-1.0" },
        { type: "output", content: "      \\___/          Uptime: 4 mins" },
        { type: "output", content: "     ___|___         Shell: bash" },
        {
          type: "output",
          content: "    /       \\        Terminal: OWASP-term",
        },
        { type: "output", content: "" },
      ];

    // FILE OPERATIONS
    case "cp":
      if (args.length < 2)
        return { type: "error", content: "cp: missing file operand" };
      return { type: "output", content: `Copied ${args[0]} to ${args[1]}` };

    case "mv":
      if (args.length < 2)
        return { type: "error", content: "mv: missing file operand" };
      return { type: "output", content: `Moved ${args[0]} to ${args[1]}` };

    case "rmdir":
      if (args.length === 0)
        return { type: "error", content: "rmdir: missing operand" };
      return { type: "output", content: `Removed directory: ${args[0]}` };

    case "ln":
      if (args.length < 2)
        return { type: "error", content: "ln: missing file operand" };
      return {
        type: "output",
        content: `Created link from ${args[0]} to ${args[1]}`,
      };

    case "file":
      if (args.length === 0)
        return { type: "error", content: "file: missing file operand" };
      return { type: "output", content: `${args[0]}: ASCII text` };

    case "stat":
      if (args.length === 0)
        return { type: "error", content: "stat: missing file operand" };
      return {
        type: "output",
        content: `File: ${args[0]}\nSize: 4096\nAccess: 0755`,
      };

    case "more":
    case "less":
      if (args.length === 0)
        return { type: "error", content: `${command}: missing file operand` };
      return {
        type: "output",
        content: `Displaying ${args[0]}... (press q to quit)`,
      };

    case "head":
      if (args.length === 0)
        return { type: "error", content: "head: missing file operand" };
      return { type: "output", content: `First 10 lines of ${args[0]}` };

    case "tail":
      if (args.length === 0)
        return { type: "error", content: "tail: missing file operand" };
      return { type: "output", content: `Last 10 lines of ${args[0]}` };

    // TEXT PROCESSING
    case "sed":
      return {
        type: "output",
        content: "sed: stream editor for filtering text",
      };

    case "awk":
      return {
        type: "output",
        content: "awk: pattern scanning and processing",
      };

    case "sort":
      if (args.length === 0)
        return { type: "output", content: "sort: reading from stdin" };
      return { type: "output", content: `Sorted contents of ${args[0]}` };

    case "uniq":
      return { type: "output", content: "uniq: report or omit repeated lines" };

    case "wc":
      if (args.length === 0)
        return { type: "error", content: "wc: missing file operand" };
      return { type: "output", content: `  42  256  1834 ${args[0]}` };

    case "cut":
      return { type: "output", content: "cut: remove sections from lines" };

    case "paste":
      return { type: "output", content: "paste: merge lines of files" };

    case "tr":
      return { type: "output", content: "tr: translate or delete characters" };

    case "diff":
      if (args.length < 2)
        return { type: "error", content: "diff: missing operand" };
      return { type: "output", content: `Comparing ${args[0]} and ${args[1]}` };

    case "nano":
    case "vi":
    case "vim":
      return { type: "output", content: `${command}: text editor (simulated)` };

    // SYSTEM INFO
    case "top":
    case "htop":
      return [
        {
          type: "output",
          content: "top - 12:34:56 up 4 min, 1 user, load: 0.52, 0.43, 0.21",
        },
        {
          type: "output",
          content: "Tasks: 124 total, 1 running, 123 sleeping",
        },
        { type: "output", content: "CPU: 3.2%us, 1.8%sy, 0.0%ni, 94.2%id" },
        { type: "output", content: "" },
      ];

    case "free":
      return [
        {
          type: "output",
          content: "              total        used        free",
        },
        {
          type: "output",
          content: "Mem:       16384000     8192000     8192000",
        },
        {
          type: "output",
          content: "Swap:       4096000           0     4096000",
        },
        { type: "output", content: "" },
      ];

    case "df":
      return [
        {
          type: "output",
          content: "Filesystem     1K-blocks    Used Available Use% Mounted on",
        },
        {
          type: "output",
          content: "/dev/sda1       51474912 20589824  28246540  43% /",
        },
        { type: "output", content: "" },
      ];

    case "du":
      return { type: "output", content: "4.0K\t./directory" };

    case "uptime":
      return {
        type: "output",
        content: "12:34:56 up 4 min, 1 user, load average: 0.52, 0.43, 0.21",
      };

    case "hostname":
      return { type: "output", content: "owasp-terminal" };

    case "who":
      return {
        type: "output",
        content: "user     pts/0        2025-10-01 12:30",
      };

    case "w":
      return [
        {
          type: "output",
          content: "12:34:56 up 4 min, 1 user, load average: 0.52, 0.43, 0.21",
        },
        {
          type: "output",
          content:
            "USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT",
        },
        {
          type: "output",
          content:
            "user     pts/0    -                12:30    0.00s  0.12s  0.00s w",
        },
        { type: "output", content: "" },
      ];

    case "id":
      return {
        type: "output",
        content: "uid=1000(user) gid=1000(user) groups=1000(user)",
      };

    case "groups":
      return { type: "output", content: "user sudo docker" };

    case "last":
      return {
        type: "output",
        content: "user     pts/0        Mon Oct  1 12:30   still logged in",
      };

    case "lastlog":
      return {
        type: "output",
        content: "Username         Port     From             Latest",
      };

    // NETWORK COMMANDS
    case "ping":
      if (args.length === 0)
        return { type: "error", content: "ping: missing host operand" };
      return [
        {
          type: "output",
          content: `PING ${args[0]} (93.184.216.34): 56 data bytes`,
        },
        {
          type: "output",
          content: `64 bytes from ${args[0]}: icmp_seq=0 ttl=54 time=12.3 ms`,
        },
        { type: "output", content: "" },
      ];

    case "curl":
      if (args.length === 0)
        return { type: "error", content: "curl: no URL specified" };
      return { type: "output", content: `Fetching ${args[0]}...` };

    case "wget":
      if (args.length === 0)
        return { type: "error", content: "wget: missing URL" };
      return { type: "output", content: `Downloading ${args[0]}...` };

    case "netstat":
      return [
        { type: "output", content: "Active Internet connections" },
        {
          type: "output",
          content:
            "Proto Recv-Q Send-Q Local Address           Foreign Address         State",
        },
        {
          type: "output",
          content:
            "tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN",
        },
        { type: "output", content: "" },
      ];

    case "ifconfig":
    case "ip":
      return [
        {
          type: "output",
          content: "eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500",
        },
        {
          type: "output",
          content: "        inet 192.168.1.100  netmask 255.255.255.0",
        },
        {
          type: "output",
          content: "        ether 02:42:ac:11:00:02  txqueuelen 0",
        },
        { type: "output", content: "" },
      ];

    case "traceroute":
      if (args.length === 0)
        return { type: "error", content: "traceroute: missing host" };
      return {
        type: "output",
        content: `traceroute to ${args[0]}, 30 hops max`,
      };

    case "nslookup":
    case "dig":
      if (args.length === 0)
        return { type: "error", content: `${command}: missing host` };
      return {
        type: "output",
        content: `Name: ${args[0]}\nAddress: 93.184.216.34`,
      };

    case "ssh":
      if (args.length === 0)
        return { type: "error", content: "ssh: missing hostname" };
      return { type: "output", content: `Connecting to ${args[0]}...` };

    case "scp":
      if (args.length < 2)
        return { type: "error", content: "scp: missing file operand" };
      return { type: "output", content: `Copying ${args[0]} to ${args[1]}...` };

    case "ftp":
      return { type: "output", content: "ftp: file transfer protocol client" };

    case "telnet":
      if (args.length === 0)
        return { type: "error", content: "telnet: missing host" };
      return { type: "output", content: `Trying to connect to ${args[0]}...` };

    case "nc":
    case "netcat":
      return {
        type: "output",
        content: "nc: arbitrary TCP and UDP connections",
      };

    // PROCESS MANAGEMENT
    case "kill":
      if (args.length === 0)
        return { type: "error", content: "kill: missing process ID" };
      return { type: "output", content: `Killed process ${args[0]}` };

    case "killall":
      if (args.length === 0)
        return { type: "error", content: "killall: missing process name" };
      return { type: "output", content: `Killed all ${args[0]} processes` };

    case "pkill":
      if (args.length === 0)
        return { type: "error", content: "pkill: missing pattern" };
      return {
        type: "output",
        content: `Killed processes matching ${args[0]}`,
      };

    case "nice":
      return {
        type: "output",
        content: "nice: run a program with modified scheduling priority",
      };

    case "renice":
      return {
        type: "output",
        content: "renice: alter priority of running processes",
      };

    case "bg":
      return { type: "output", content: "bg: put job in background" };

    case "fg":
      return { type: "output", content: "fg: bring job to foreground" };

    case "jobs":
      return { type: "output", content: "No background jobs" };

    case "nohup":
      return {
        type: "output",
        content: "nohup: run a command immune to hangups",
      };

    case "screen":
      return { type: "output", content: "screen: screen manager (simulated)" };

    case "tmux":
      return {
        type: "output",
        content: "tmux: terminal multiplexer (simulated)",
      };

    // ARCHIVE COMMANDS
    case "tar":
      return { type: "output", content: "tar: tape archive utility" };

    case "zip":
      if (args.length < 2)
        return { type: "error", content: "zip: missing file operand" };
      return { type: "output", content: `Creating ${args[0]}.zip` };

    case "unzip":
      if (args.length === 0)
        return { type: "error", content: "unzip: missing file operand" };
      return { type: "output", content: `Extracting ${args[0]}...` };

    case "gzip":
      if (args.length === 0)
        return { type: "error", content: "gzip: missing file operand" };
      return { type: "output", content: `Compressing ${args[0]}...` };

    case "gunzip":
      if (args.length === 0)
        return { type: "error", content: "gunzip: missing file operand" };
      return { type: "output", content: `Decompressing ${args[0]}...` };

    case "bzip2":
      if (args.length === 0)
        return { type: "error", content: "bzip2: missing file operand" };
      return {
        type: "output",
        content: `Compressing ${args[0]} with bzip2...`,
      };

    case "bunzip2":
      if (args.length === 0)
        return { type: "error", content: "bunzip2: missing file operand" };
      return { type: "output", content: `Decompressing ${args[0]}...` };

    case "xz":
      if (args.length === 0)
        return { type: "error", content: "xz: missing file operand" };
      return { type: "output", content: `Compressing ${args[0]} with xz...` };

    case "unxz":
      if (args.length === 0)
        return { type: "error", content: "unxz: missing file operand" };
      return { type: "output", content: `Decompressing ${args[0]}...` };

    // PACKAGE MANAGEMENT
    case "apt":
    case "apt-get":
      return {
        type: "output",
        content: `${command}: package management tool (requires sudo)`,
      };

    case "dpkg":
      return { type: "output", content: "dpkg: Debian package manager" };

    case "yum":
      return {
        type: "output",
        content: "yum: package manager for RPM-based distributions",
      };

    case "rpm":
      return { type: "output", content: "rpm: RPM package manager" };

    case "snap":
      return { type: "output", content: "snap: package management system" };

    case "flatpak":
      return {
        type: "output",
        content: "flatpak: application deployment framework",
      };

    case "brew":
      return {
        type: "output",
        content: "brew: package manager for macOS/Linux",
      };

    // SEARCH COMMANDS
    case "find":
      return {
        type: "output",
        content: "find: search for files in directory hierarchy",
      };

    case "locate":
      if (args.length === 0)
        return { type: "error", content: "locate: missing pattern" };
      return { type: "output", content: `Searching for ${args[0]}...` };

    case "which":
      if (args.length === 0)
        return { type: "error", content: "which: missing command" };
      return { type: "output", content: `/usr/bin/${args[0]}` };

    case "whereis":
      if (args.length === 0)
        return { type: "error", content: "whereis: missing command" };
      return {
        type: "output",
        content: `${args[0]}: /usr/bin/${args[0]} /usr/share/man/man1/${args[0]}.1`,
      };

    case "type":
      if (args.length === 0)
        return { type: "error", content: "type: missing command" };
      return { type: "output", content: `${args[0]} is /usr/bin/${args[0]}` };

    // PERMISSIONS
    case "chmod":
      if (args.length < 2)
        return { type: "error", content: "chmod: missing operand" };
      return {
        type: "output",
        content: `Changed permissions of ${args[1]} to ${args[0]}`,
      };

    case "chown":
      if (args.length < 2)
        return { type: "error", content: "chown: missing operand" };
      return {
        type: "output",
        content: `Changed owner of ${args[1]} to ${args[0]}`,
      };

    case "chgrp":
      if (args.length < 2)
        return { type: "error", content: "chgrp: missing operand" };
      return {
        type: "output",
        content: `Changed group of ${args[1]} to ${args[0]}`,
      };

    case "umask":
      return { type: "output", content: "0022" };

    // DISK MANAGEMENT
    case "mount":
      return {
        type: "output",
        content: "/dev/sda1 on / type ext4 (rw,relatime)",
      };

    case "umount":
      if (args.length === 0)
        return { type: "error", content: "umount: missing device" };
      return { type: "output", content: `Unmounted ${args[0]}` };

    case "fdisk":
      return {
        type: "output",
        content: "fdisk: partition table manipulator (requires sudo)",
      };

    case "mkfs":
      return {
        type: "output",
        content: "mkfs: build a Linux filesystem (requires sudo)",
      };

    case "fsck":
      return {
        type: "output",
        content: "fsck: filesystem consistency check (requires sudo)",
      };

    case "lsblk":
      return [
        {
          type: "output",
          content: "NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT",
        },
        { type: "output", content: "sda      8:0    0    50G  0 disk" },
        { type: "output", content: "└─sda1   8:1    0    50G  0 part /" },
        { type: "output", content: "" },
      ];

    case "blkid":
      return {
        type: "output",
        content: '/dev/sda1: UUID="123-456" TYPE="ext4"',
      };

    // USER MANAGEMENT
    case "useradd":
    case "adduser":
      if (args.length === 0)
        return { type: "error", content: `${command}: missing username` };
      return {
        type: "output",
        content: `Created user ${args[0]} (requires sudo)`,
      };

    case "userdel":
      if (args.length === 0)
        return { type: "error", content: "userdel: missing username" };
      return {
        type: "output",
        content: `Deleted user ${args[0]} (requires sudo)`,
      };

    case "passwd":
      return {
        type: "output",
        content: "passwd: change user password (requires sudo)",
      };

    case "su":
      return { type: "output", content: "su: switch user (requires password)" };

    case "sudo":
      return {
        type: "output",
        content: "sudo: execute command as superuser (requires password)",
      };

    // ENVIRONMENT
    case "env":
      return [
        { type: "output", content: "PATH=/usr/local/bin:/usr/bin:/bin" },
        { type: "output", content: "HOME=/home/user" },
        { type: "output", content: "SHELL=/bin/bash" },
        { type: "output", content: "" },
      ];

    case "export":
      return { type: "output", content: "export: set environment variable" };

    case "alias":
      return { type: "output", content: "alias ll='ls -la'" };

    case "unalias":
      return { type: "output", content: "unalias: remove alias definition" };

    case "source":
      if (args.length === 0)
        return { type: "error", content: "source: missing filename" };
      return { type: "output", content: `Sourced ${args[0]}` };

    // MISC UTILITIES
    case "sleep":
      if (args.length === 0)
        return { type: "error", content: "sleep: missing operand" };
      return { type: "output", content: `Sleeping for ${args[0]} seconds...` };

    case "watch":
      if (args.length === 0)
        return { type: "error", content: "watch: missing command" };
      return { type: "output", content: `Watching ${args.join(" ")}...` };

    case "xargs":
      return {
        type: "output",
        content: "xargs: build and execute command lines",
      };

    case "tee":
      return {
        type: "output",
        content: "tee: read from stdin and write to stdout and files",
      };

    case "yes":
      return { type: "output", content: "y" };

    case "bc":
      return { type: "output", content: "bc: arbitrary precision calculator" };

    case "cal":
      return {
        type: "output",
        content:
          "     October 2025\nSu Mo Tu We Th Fr Sa\n          1  2  3  4",
      };

    case "factor":
      if (args.length === 0)
        return { type: "error", content: "factor: missing operand" };
      return { type: "output", content: `${args[0]}: ${args[0]}` };

    case "seq":
      if (args.length === 0)
        return { type: "error", content: "seq: missing operand" };
      return { type: "output", content: "1\n2\n3" };

    case "shuf":
      return { type: "output", content: "shuf: generate random permutations" };

    case "base64":
      return { type: "output", content: "base64: base64 encode/decode data" };

    case "md5sum":
    case "sha256sum":
      if (args.length === 0)
        return { type: "error", content: `${command}: missing file` };
      return { type: "output", content: `a1b2c3d4e5f6...  ${args[0]}` };

    case "cksum":
      if (args.length === 0)
        return { type: "error", content: "cksum: missing file" };
      return { type: "output", content: `1234567890 ${args[0]}` };

    case "banner":
      return {
        type: "output",
        content: "  #####  #     # #     #\n #     # #  #  # #     #",
      };

    case "figlet":
      if (args.length === 0)
        return { type: "error", content: "figlet: missing text" };
      return {
        type: "output",
        content:
          "  ___  _        ___   __  ___\n / _ \\| |      / _ \\ / / / _ \\",
      };

    case "cowsay":
      const message = args.length > 0 ? args.join(" ") : "Moo!";
      return [
        { type: "output", content: ` ${"-".repeat(message.length + 2)}` },
        { type: "output", content: `< ${message} >` },
        { type: "output", content: ` ${"-".repeat(message.length + 2)}` },
        { type: "output", content: "        \\   ^__^" },
        { type: "output", content: "         \\  (oo)\\_______" },
        { type: "output", content: "            (__)\\       )\\/\\" },
        { type: "output", content: "                ||----w |" },
        { type: "output", content: "                ||     ||" },
        { type: "output", content: "" },
      ];

    case "fortune":
      const fortunes = [
        "You will have a pleasant surprise today.",
        "A journey of a thousand miles begins with a single step.",
        "The best time to plant a tree was 20 years ago. The second best time is now.",
      ];
      return {
        type: "output",
        content: fortunes[Math.floor(Math.random() * fortunes.length)],
      };

    case "lolcat":
      return {
        type: "output",
        content: "lolcat: rainbow coloring for text (simulated)",
      };

    default:
      return {
        type: "error",
        content: `Command not found: ${command}. Type 'help' for available commands.`,
      };
  }
}
