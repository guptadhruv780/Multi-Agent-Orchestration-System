import { useCallback, useEffect, useRef, useState } from "react";
import type { AgentLog, AgentState, AgentEvent, RunStatus } from "../types/agent";

function wsUrlForRun(runId: string): string {
  const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${proto}//${window.location.host}/ws/${runId}`;
}

export function useAgentStream(runId: string | null) {
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [state, setState] = useState<AgentState | null>(null);
  const [status, setStatus] = useState<RunStatus>("idle");
  const wsRef = useRef<WebSocket | null>(null);
  const statusRef = useRef<RunStatus>("idle");

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const connect = useCallback(() => {
    if (!runId) return;
    setStatus("running");
    const ws = new WebSocket(wsUrlForRun(runId));
    wsRef.current = ws;

    ws.onmessage = (event: MessageEvent<string>) => {
      let data: AgentEvent;
      try {
        data = JSON.parse(event.data) as AgentEvent;
      } catch {
        return;
      }
      switch (data.type) {
        case "agent_log":
          setLogs((prev) => [
            ...prev,
            {
              agent_name: data.agent,
              level: data.level,
              message: data.message,
              timestamp: data.timestamp ?? new Date().toISOString(),
            },
          ]);
          break;
        case "state_update":
          setState(data.state);
          break;
        case "run_complete":
          setStatus("done");
          break;
        case "run_failed":
          setStatus("failed");
          break;
        case "ping":
          break;
        default:
          break;
      }
    };

    ws.onclose = (ev) => {
      if (ev.code !== 1000 && statusRef.current === "running") {
        window.setTimeout(connect, 2000);
      }
    };
  }, [runId]);

  useEffect(() => {
    if (!runId) {
      setLogs([]);
      setState(null);
      setStatus("idle");
      return;
    }
    setLogs([]);
    setState(null);
    connect();
    return () => {
      wsRef.current?.close(1000);
      wsRef.current = null;
    };
  }, [runId, connect]);

  return { logs, state, status };
}
