type Props = {
  prUrl: string | null;
};

export function PRResultCard({ prUrl }: Props) {
  if (!prUrl) return null;
  return (
    <a
      href={prUrl}
      target="_blank"
      rel="noreferrer"
      className="mt-2 block rounded border border-emerald-800 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-300 hover:bg-emerald-900/50"
    >
      Open pull request →
    </a>
  );
}
