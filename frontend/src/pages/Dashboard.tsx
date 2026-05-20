import { useMemo, useState } from "react";
import { IssueInputForm } from "../components/IssueInputForm";
import { AgentTerminal } from "../components/AgentTerminal";
import { AgentStatusBar } from "../components/AgentStatusBar";
import { DiffViewer } from "../components/DiffViewer";
import { TestResultPanel } from "../components/TestResultPanel";
import { PRResultCard } from "../components/PRResultCard";
import { useAgentStream } from "../hooks/useAgentStream";

export function Dashboard() {
  const [runId, setRunId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const { logs, state, status } = useAgentStream(runId);

  const firstDiff = useMemo(() => {
    const changes = state?.file_changes;
    if (!changes?.length) return null;
    return changes.map((c) => c.diff).join("\n");
  }, [state]);

  function handleSubmit(payload: { issueUrl: string; githubToken: string; modelName: string }) {
    void payload;
    const id = crypto.randomUUID();
    setHistory((h) => [id, ...h].slice(0, 20));
    setRunId(id);
  }

  return (
    <div className="flex h-full flex-col bg-zinc-950 text-zinc-100 md:flex-row">
      <aside className="w-full border-b border-zinc-800 p-4 md:w-[30%] md:border-b-0 md:border-r">
        <h1 className="mb-4 text-lg font-semibold tracking-tight">Orchestrator</h1>
        <IssueInputForm onSubmitRun={handleSubmit} disabled={status === "running"} />
        <div className="mt-6">
          <h2 className="mb-2 text-xs font-semibold uppercase text-zinc-500">Recent run ids (local)</h2>
          <ul className="max-h-40 space-y-1 overflow-auto text-xs text-zinc-400">
            {history.map((id) => (
              <li key={id}>
                <button type="button" className="truncate text-left hover:text-zinc-200" onClick={() => setRunId(id)}>
                  {id}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <main className="flex flex-1 flex-col gap-4 p-4 md:w-[70%]">
        <AgentStatusBar active={null} />
        <div className="min-h-0 flex-1">
          <AgentTerminal logs={logs} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <section>
            <h2 className="mb-2 text-sm font-medium text-zinc-400">Diff</h2>
            <DiffViewer diff={firstDiff} />
          </section>
          <section>
            <h2 className="mb-2 text-sm font-medium text-zinc-400">Tests</h2>
            <TestResultPanel result={state?.test_result ?? null} />
          </section>
        </div>
        <section>
          <h2 className="mb-2 text-sm font-medium text-zinc-400">State</h2>
          <pre className="max-h-48 overflow-auto rounded border border-zinc-800 bg-zinc-900/50 p-2 text-xs">
            {state ? JSON.stringify(state, null, 2) : "—"}
          </pre>
        </section>
        <PRResultCard prUrl={state?.pr_url ?? null} />
      </main>
    </div>
  );
}
