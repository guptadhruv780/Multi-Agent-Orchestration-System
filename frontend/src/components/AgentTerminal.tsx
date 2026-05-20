import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import type { AgentLog } from "../types/agent";

type Props = {
  logs: AgentLog[];
};

export function AgentTerminal({ logs }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const term = new Terminal({
      theme: { background: "#09090b" },
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      convertEol: true,
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(el);
    term.writeln("\x1b[32mAgent terminal\x1b[0m — logs stream here after orchestration is wired.");
    fit.fit();
    termRef.current = term;
    fitRef.current = fit;

    const ro = new ResizeObserver(() => fit.fit());
    ro.observe(el);
    return () => {
      ro.disconnect();
      term.dispose();
      termRef.current = null;
      fitRef.current = null;
    };
  }, []);

  useEffect(() => {
    const term = termRef.current;
    if (!term || logs.length === 0) return;
    const last = logs[logs.length - 1];
    const color =
      last.level === "error" ? "\x1b[31m" : last.level === "warning" ? "\x1b[33m" : "\x1b[36m";
    term.writeln(`${color}[${last.agent_name}]\x1b[0m ${last.message}`);
  }, [logs]);

  return <div ref={containerRef} className="h-full min-h-[200px] w-full overflow-hidden rounded border border-zinc-800" />;
}
