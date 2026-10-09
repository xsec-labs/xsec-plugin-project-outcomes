export interface Subscription { dispose(): void; }
export interface PluginHost {
  readonly context: unknown;
  request(method: string, params?: Record<string, unknown>): Promise<unknown>;
  onTheme(listener: (theme: Record<string, string>) => void): Subscription;
}
export interface Owner { active: boolean; }
export const LABELS = { finding: "正式漏洞", evidence: "原始证据", report: "报告", "shared-finding": "共享发现", "passive-finding": "被动线索", "task-conclusion": "任务结论" } as const;
export type OutcomeKind = keyof typeof LABELS;
export type ToolKind = "project-outcomes" | "finding-detail" | "report-detail" | "task-detail" | "evidence-detail";
export interface Context { projectId: string; sessionId: string | null; assignmentId: string | null; runId: string | null; tool: ToolKind; entityId: string | null; canAdd: boolean; observe: boolean; }
export interface Outcome {
  outcome_id: string; entity_id: string; project_id: string; assignment_id: string | null; run_id: string | null;
  kind: OutcomeKind; title: string; summary: string | null; severity: string | null; status: string | null;
  source_label: string | null; content_type: string | null; size_bytes: number | null; created_at: number; updated_at: number;
}
export interface Page { items: Outcome[]; counts: Partial<Record<OutcomeKind, number>>; total: number; next_offset: number | null; }
export type Preview = { kind: "text"; text: string; truncated: boolean } | { kind: "image"; mime_type: string; data_base64: string } | { kind: "unavailable"; reason: string };
export interface Detail extends Outcome { details: Record<string, unknown>; preview: Preview | null; transport_truncated: boolean; }
export type Task = { type: "task"; id: string; status: string; summary: string | null; progress: number | null; run_id: string | null }
  | { type: "tool-call"; tool_call_id: string; title: string | null; kind: string | null; status: string; raw_input: unknown; raw_output: unknown; content: unknown };
export type Method = "xsec.outcomes.list" | "xsec.outcomes.get" | "xsec.outcomes.resolve" | "xsec.outcomes.task.get" | "xsec.outcomes.evidence.list" | "xsec.outcomes.reference.add" | "xsec.workspace.tool.open";

export function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Host 返回对象格式无效");
  return value as Record<string, unknown>;
}
function string(value: unknown, name: string): string { if (typeof value !== "string" || !value) throw new Error(name + "格式无效"); return value; }
function textValue(value: unknown, name: string): string { if (typeof value !== "string") throw new Error(name + "格式无效"); return value; }
function nullableString(value: unknown, name: string): string | null { if (value == null) return null; if (typeof value !== "string") throw new Error(name + "格式无效"); return value; }
function number(value: unknown, name: string): number { if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(name + "格式无效"); return value; }
function integer(value: unknown, name: string): number { const n = number(value, name); if (!Number.isSafeInteger(n) || n < 0) throw new Error(name + "格式无效"); return n; }
function timeNumber(value: unknown, name: string): number { const n = number(value, name); if (Number.isNaN(new Date(n).getTime())) throw new Error(name + "格式无效"); return n; }
function progressPercent(value: unknown): number { const n = integer(value, "进度"); if (n > 100) throw new Error("进度格式无效"); return n; }
function boolean(value: unknown, name: string): boolean { if (typeof value !== "boolean") throw new Error(name + "格式无效"); return value; }
export function kind(value: unknown): OutcomeKind { if (typeof value !== "string" || !Object.hasOwn(LABELS, value)) throw new Error("成果类型格式无效"); return value as OutcomeKind; }
export function parseContext(value: unknown): Context {
  const context = record(value), workspace = record(context.workspace), binding = record(workspace.binding), tool = record(context.tool);
  const name = string(tool.kind, "工作区工具");
  if (!["project-outcomes", "finding-detail", "report-detail", "task-detail", "evidence-detail"].includes(name)) throw new Error("工作区工具类型无效");
  if (workspace.mode !== "interactive" && workspace.mode !== "observe") throw new Error("工作区模式无效");
  return { projectId: string(binding.projectId, "项目绑定"), sessionId: nullableString(binding.sessionId, "会话绑定"), assignmentId: nullableString(binding.assignmentId, "任务绑定"), runId: nullableString(binding.runId, "运行绑定"), tool: name as ToolKind, entityId: nullableString(tool.entityId, "实体绑定"), canAdd: boolean(workspace.canAddComposerReference, "引用权限"), observe: workspace.mode === "observe" };
}
export function parseOutcome(value: unknown, projectId: string): Outcome {
  const row = record(value), project = string(row.project_id, "成果项目"); if (project !== projectId) throw new Error("成果不属于当前项目");
  return { outcome_id: string(row.outcome_id, "成果 ID"), entity_id: string(row.entity_id, "实体 ID"), project_id: project,
    assignment_id: nullableString(row.assignment_id, "任务"), run_id: nullableString(row.run_id, "运行"), kind: kind(row.kind), title: string(row.title, "成果标题"),
    summary: nullableString(row.summary, "摘要"), severity: nullableString(row.severity, "严重度"), status: nullableString(row.status, "状态"), source_label: nullableString(row.source_label, "来源"), content_type: nullableString(row.content_type, "内容类型"), size_bytes: row.size_bytes == null ? null : integer(row.size_bytes, "大小"), created_at: timeNumber(row.created_at, "创建时间"), updated_at: timeNumber(row.updated_at, "更新时间") };
}
export function parseItems(value: unknown, projectId: string): Outcome[] {
  if (!Array.isArray(value)) throw new Error("成果列表格式无效"); const ids = new Set<string>();
  return value.map(item => { const row = parseOutcome(item, projectId); if (ids.has(row.outcome_id)) throw new Error("成果列表 ID 重复"); ids.add(row.outcome_id); return row; });
}
export function parsePage(value: unknown, projectId: string, offset: number): Page {
  const page = record(value), items = parseItems(page.items, projectId), total = integer(page.total, "成果总数"), counts: Page["counts"] = {};
  for (const [name, count] of Object.entries(record(page.counts))) counts[kind(name)] = integer(count, "成果类型计数");
  const next = page.next_offset === null ? null : integer(page.next_offset, "下一页偏移");
  const consumed = offset + items.length, counted = Object.values(counts).reduce((sum, count) => sum + count, 0);
  if (items.length > 50 || total > 500 || counted !== total || consumed > total || (next === null ? consumed !== total : next !== consumed || next <= offset || next >= total)) throw new Error("成果分页返回格式无效");
  return { items, counts, total, next_offset: next };
}
export function parseDetail(value: unknown, projectId: string): Detail {
  const row = record(value); let preview: Preview | null = null;
  if (row.preview != null) { const p = record(row.preview); if (p.kind === "text") preview = { kind: "text", text: textValue(p.text, "预览正文"), truncated: boolean(p.truncated, "正文截断状态") };
    else if (p.kind === "image") { const mime = string(p.mime_type, "图片类型"); if (!/^image\/[a-z0-9.+-]+$/i.test(mime)) throw new Error("图片类型无效"); preview = { kind: "image", mime_type: mime, data_base64: string(p.data_base64, "图片正文") }; }
    else if (p.kind === "unavailable") preview = { kind: "unavailable", reason: string(p.reason, "预览状态") }; else throw new Error("预览类型格式无效"); }
  return { ...parseOutcome(row, projectId), details: record(row.details), preview, transport_truncated: boolean(row.transport_truncated, "传输截断状态") };
}
export function parseBoundDetail(value: unknown, context: Context): Detail {
  const detail = parseDetail(value, context.projectId);
  const expected = { "finding-detail": "finding", "report-detail": "report", "evidence-detail": "evidence" }[context.tool as "finding-detail" | "report-detail" | "evidence-detail"];
  const entityId = context.entityId === "assignment" ? context.assignmentId : context.entityId;
  if (!expected || !entityId || detail.kind !== expected || detail.entity_id !== entityId || detail.outcome_id !== `${expected}:${entityId}`) throw new Error("成果详情与当前工具绑定不匹配");
  return detail;
}
export function parseTask(value: unknown): Task {
  const task = record(value), status = string(task.status, "任务状态");
  if (task.type === "task") return { type: "task", id: string(task.id, "任务 ID"), status, summary: nullableString(task.summary, "任务摘要"), progress: task.progress == null ? null : progressPercent(task.progress), run_id: nullableString(task.run_id, "运行 ID") };
  if (task.type === "tool-call") return { type: "tool-call", tool_call_id: string(task.tool_call_id, "调用 ID"), status, title: nullableString(task.title, "调用标题"), kind: nullableString(task.kind, "调用类型"), raw_input: task.raw_input, raw_output: task.raw_output, content: task.content };
  throw new Error("任务详情类型格式无效");
}
export function confirmed(value: unknown): void { if (record(value).ok !== true) throw new Error("Host 未确认操作成功"); }
export function errorMessage(value: unknown): string { return value instanceof Error ? value.message : typeof value === "string" && value ? value : "Host 错误返回格式无效"; }
export async function request<T>(host: PluginHost, method: Method, params: Record<string, unknown>, parse: (value: unknown) => T): Promise<T> {
  const operationId = crypto.randomUUID(), start = performance.now(); let received = false;
  console.info("project-outcomes.operation.started", { operationId, method });
  try { const response = await host.request(method, params); received = true; const result = parse(response); console.info("project-outcomes.operation.completed", { operationId, method, elapsedMs: Math.round(performance.now() - start) }); return result; }
  catch (error) { const cancelled = error instanceof Error && error.message === "plugin frontend disposed";
    console[cancelled ? "debug" : "error"](cancelled ? "project-outcomes.operation.cancelled" : "project-outcomes.operation.failed", { operationId, method, outcome: cancelled ? "cancelled" : "failed", error_code: cancelled ? "FRONTEND_DISPOSED" : received ? "RESPONSE_INVALID" : "HOST_REQUEST_FAILED", elapsedMs: Math.round(performance.now() - start) }); throw error; }
}
