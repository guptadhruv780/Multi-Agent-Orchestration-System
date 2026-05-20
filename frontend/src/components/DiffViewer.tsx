type Props = {
  diff: string | null;
};

export function DiffViewer({ diff }: Props) {
  if (!diff) {
    return <p className="text-sm text-zinc-500">No diff yet.</p>;
  }
  return (
    <pre className="max-h-64 overflow-auto rounded border border-zinc-800 bg-zinc-950 p-2 text-xs text-zinc-200">
      {diff}
    </pre>
  );
}
