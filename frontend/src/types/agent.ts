/** TypeScript mirrors of backend/core/state.py and WebSocket event payloads. */

export type AgentName = "research" | "coding" | "testing" | "pr" | "system";
export type LogLevel = "info" | "warning" | "error" | "debug";
export type TestResultStatus = "pass" | "fail" | "error" | "pending";
export type FinalStatus = "running" | "success" | "failed";

/** UI connection lifecycle (not stored in AgentState). */
export type RunStatus = "idle" | "running" | "done" | "failed";

export interface FileChange {
  file_path: string;
  original_content: string;
  patched_content: string;
  diff: string;
  change_description: string;
}

export interface TestResult {
  status: TestResultStatus;
  total_tests: number;
  passed: number;
  failed: number;
  errors: number;
  stdout: string;
  stderr: string;
  exit_code: number;
  duration_seconds: number;
}

export interface AgentLog {
  agent_name: AgentName;
  level: LogLevel;
  message: string;
  timestamp: string;
}

export interface AgentState {
  run_id: string;
  issue_url: string;
  repo_owner: string;
  repo_name: string;
  issue_number: number;
  github_token: string;
  model_name: string;

  issue_title: string | null;
  issue_body: string | null;
  relevant_files: string[] | null;
  codebase_context: string | null;
  repo_structure: string | null;

  file_changes: FileChange[] | null;
  patch_summary: string | null;

  test_result: TestResult | null;
  retry_count: number;

  branch_name: string | null;
  pr_url: string | null;
  pr_number: number | null;

  logs: AgentLog[];
  current_node: string;
  final_status: FinalStatus;
  error_message: string | null;
}

export type AgentEvent =
  | {
      type: "agent_log";
      run_id: string;
      agent: AgentName;
      level: LogLevel;
      message: string;
      timestamp: string;
    }
  | { type: "node_start"; run_id: string; node: string }
  | { type: "node_complete"; run_id: string; node: string }
  | { type: "state_update"; run_id: string; state: AgentState }
  | { type: "diff_ready"; run_id: string; diff: string }
  | { type: "test_result"; run_id: string; result: TestResult }
  | { type: "pr_created"; run_id: string; pr_url: string; pr_number?: number }
  | { type: "run_failed"; run_id: string; message: string }
  | { type: "run_complete"; run_id: string }
  | { type: "ping" };
