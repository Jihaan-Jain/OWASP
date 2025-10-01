import { useState, useRef, useEffect } from "react";
import { executeCommand } from "@/lib/commands";

interface TerminalLine {
  type: "command" | "output" | "error";
  content: string;
}

interface TerminalProps {
  tabId: string;
}

export const Terminal = ({ tabId }: TerminalProps) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", content: "OWASP Terminal v1.0.0" },
    { type: "output", content: "Type 'help' for available commands" },
    { type: "output", content: "" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLines((prev) => [...prev, { type: "command", content: input }]);
    setHistory((prev) => [...prev, input]);
    setHistoryIndex(-1);

    const result = executeCommand(input.trim());

    if (Array.isArray(result)) {
      setLines((prev) => [...prev, ...result]);
    } else {
      setLines((prev) => [...prev, result]);
    }

    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex =
          historyIndex === -1
            ? history.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = Math.min(history.length - 1, historyIndex + 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    }
  };

  return (
    <div
      ref={terminalRef}
      className="h-full bg-terminal-bg p-4 font-mono text-sm overflow-y-auto terminal-scroll cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="space-y-1">
        {lines.map((line, idx) => (
          <div
            key={idx}
            className={
              line.type === "command"
                ? "text-terminal-prompt"
                : line.type === "error"
                ? "text-terminal-error"
                : "text-terminal-text"
            }
          >
            {line.type === "command" && (
              <span className="text-terminal-prompt">user@owasp:~$ </span>
            )}
            {line.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center mt-1">
        <span className="text-terminal-prompt glow-text">user@owasp:~$ </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-terminal-text ml-2"
          autoFocus
        />
        <span className="terminal-cursor"></span>
      </form>
    </div>
  );
};
