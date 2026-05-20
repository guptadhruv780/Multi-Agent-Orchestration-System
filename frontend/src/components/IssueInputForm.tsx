import { FormEvent, useState } from "react";

type Props = {
  onSubmitRun: (payload: { issueUrl: string; githubToken: string; modelName: string }) => void;
  disabled?: boolean;
};

export function IssueInputForm({ onSubmitRun, disabled }: Props) {
  const [issueUrl, setIssueUrl] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [modelName, setModelName] = useState("claude-sonnet-4-20250514");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmitRun({ issueUrl, githubToken, modelName });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-sm">
      <label className="flex flex-col gap-1">
        <span className="text-zinc-400">GitHub issue URL</span>
        <input
          className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-100"
          value={issueUrl}
          onChange={(e) => setIssueUrl(e.target.value)}
          placeholder="https://github.com/owner/repo/issues/1"
          required
          disabled={disabled}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-zinc-400">GitHub PAT</span>
        <input
          type="password"
          className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-100"
          value={githubToken}
          onChange={(e) => setGithubToken(e.target.value)}
          autoComplete="off"
          disabled={disabled}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-zinc-400">Model</span>
        <input
          className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-100"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
          disabled={disabled}
        />
      </label>
      <button
        type="submit"
        className="rounded bg-emerald-600 px-3 py-2 font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
        disabled={disabled}
      >
        Start run
      </button>
    </form>
  );
}
