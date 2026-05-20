type AgentKey = "research" | "coding" | "testing" | "pr";

const agents: AgentKey[] = ["research", "coding", "testing", "pr"];

type Props = {
  active?: AgentKey | null;
};

export function AgentStatusBar({ active }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {agents.map((a) => {
        const on = active === a;
        return (
          <span
            key={a}
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              on ? "bg-emerald-600 text-white" : "bg-zinc-800 text-zinc-400"
            }`}
          >
            {a}
          </span>
        );
      })}
    </div>
  );
}
