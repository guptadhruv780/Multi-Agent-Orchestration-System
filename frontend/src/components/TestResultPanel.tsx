import type { TestResult } from "../types/agent";

type Props = {
  result: TestResult | null;
};

export function TestResultPanel({ result }: Props) {
  if (!result) {
    return <p className="text-sm text-zinc-500">No test results yet.</p>;
  }
  return (
    <div className="space-y-2 text-sm">
      <p className="font-medium text-zinc-200">
        Status: <span className="text-emerald-400">{result.status}</span>
      </p>
      <p className="text-zinc-400">
        passed {result.passed} / {result.total_tests} (failed {result.failed}, errors {result.errors})
      </p>
      <details className="text-zinc-500">
        <summary className="cursor-pointer text-zinc-400">stdout</summary>
        <pre className="mt-1 max-h-40 overflow-auto whitespace-pre-wrap text-xs">{result.stdout}</pre>
      </details>
    </div>
  );
}
