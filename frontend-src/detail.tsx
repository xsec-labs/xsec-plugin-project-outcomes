import { Badge, ControlButton, EmptyState } from "@xsec/ui-react";
import { ArrowLeft, ExternalLink, MessageSquarePlus } from "lucide-react";
import { LABELS, type Context, type Detail, type Outcome, type Task } from "./host";

const FIELDS: Record<string, string> = { description: "说明", impact: "影响", reproduction_steps: "复现步骤", remediation: "修复建议", status: "状态", severity: "严重度", confidence: "置信度", endpoint: "端点", parameter: "参数", executive_summary: "执行摘要", scope: "范围", methodology: "方法", limitations: "限制", conclusion: "结论", filename: "文件名", kind: "类型", content_type: "内容类型", size_bytes: "大小", sha256: "SHA256", created_at: "创建时间", updated_at: "更新时间", assignment_id: "任务", run_id: "运行" };
export function safeValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(safeValue);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).filter(([key]) => key !== "storage_path").map(([key, item]) => [key, safeValue(item)]));
  return value;
}
function show(value: unknown): string { return typeof value === "string" ? value : JSON.stringify(safeValue(value), null, 2); }
export function timestamp(value: number): string { const date = new Date(value); if (Number.isNaN(date.getTime())) throw new Error("成果时间格式无效"); return date.toLocaleString("zh-CN"); }
export function sourceTarget(context: Context, row: Outcome): { toolId: string; entityId: string } | null {
  const tools = { finding: "finding-detail", evidence: "evidence-detail", report: "report-detail", "task-conclusion": "task-detail" };
  const toolId = tools[row.kind as keyof typeof tools];
  if (!toolId || (context.observe && toolId === "task-detail")) return null;
  const entityId = row.kind === "task-conclusion" ? row.assignment_id : row.entity_id;
  return entityId ? { toolId, entityId } : null;
}
function Fields({ values }: { values: [string, unknown][] }) {
  return <dl className="po-fields">{values.filter(([, value]) => value !== null && value !== undefined && value !== "").map(([label, value], index) => <div key={index}><dt>{label}</dt><dd>{typeof value === "object" ? <pre className="po-code">{show(value)}</pre> : String(value)}</dd></div>)}</dl>;
}
export function OutcomeDetail({ detail, context, standalone, busy, onBack, onAdd, onSource }: {
  detail: Detail; context: Context; standalone: boolean; busy: boolean; onBack(): void; onAdd(row: Outcome): void; onSource(row: Outcome): void;
}) {
  const preview = detail.preview, structured = safeValue(detail.details) as Record<string, unknown>;
  return <article className="po-detail">
    {standalone ? null : <ControlButton variant="ghost" disabled={busy} onClick={onBack}><ArrowLeft size={16} aria-hidden="true" />返回项目成果</ControlButton>}
    <h2 className="po-detail-title" tabIndex={-1}>{detail.title}</h2>
    <div className="po-badges"><Badge>{LABELS[detail.kind]}</Badge>{detail.severity ? <Badge tone="danger">{detail.severity}</Badge> : null}{detail.status ? <Badge>{detail.status}</Badge> : null}</div>
    {!standalone && (context.canAdd || sourceTarget(context, detail)) ? <div className="po-actions">{context.canAdd ? <ControlButton loading={busy} onClick={() => onAdd(detail)}><MessageSquarePlus size={16} aria-hidden="true" />添加到对话</ControlButton> : null}{sourceTarget(context, detail) ? <ControlButton variant="outline" disabled={busy} onClick={() => onSource(detail)}><ExternalLink size={16} aria-hidden="true" />打开来源</ControlButton> : null}</div> : null}
    {detail.summary ? <p className="po-summary">{detail.summary}</p> : null}
    {detail.transport_truncated ? <p role="status" className="po-muted">详情已按 Host 的传输上限截断；完整内容保存在成果来源中。</p> : null}
    {preview?.kind === "text" ? <section aria-label="正文预览"><pre className="po-code" tabIndex={0}>{preview.text}</pre>{preview.truncated ? <p className="po-muted">正文预览已截断</p> : null}</section> : preview?.kind === "image" ? <img className="po-image" alt={detail.title} src={`data:${preview.mime_type};base64,${preview.data_base64}`} /> : preview?.kind === "unavailable" ? <p className="po-muted">{preview.reason}</p> : null}
    <Fields values={[["成果 ID", detail.outcome_id], ["来源", detail.source_label], ["更新时间", timestamp(detail.updated_at)], ["内容类型", detail.content_type], ["大小", detail.size_bytes === null ? null : `${detail.size_bytes} B`], ...Object.entries(structured).map(([key, value]) => [FIELDS[key] ?? key, value] as [string, unknown])]} />
    <details className="po-raw"><summary>查看结构化数据</summary><pre className="po-code" tabIndex={0}>{show(structured)}</pre></details>
  </article>;
}
export function TaskDetail({ task }: { task: Task }) {
  const call = task.type === "tool-call";
  return <article className="po-detail"><h2 className="po-detail-title" tabIndex={-1}>{call ? task.title ?? task.kind ?? "工具调用" : `任务 ${task.id.slice(0, 12)}`}</h2><div className="po-badges"><Badge>{task.status}</Badge>{call && task.kind ? <Badge>{task.kind}</Badge> : null}</div>
    <Fields values={call ? [["调用 ID", task.tool_call_id], ["输入", safeValue(task.raw_input)], ["输出", safeValue(task.raw_output ?? task.content)]] : [["进度", task.progress === null ? null : `${task.progress}%`], ["摘要", task.summary], ["绑定 run", task.run_id]]} />
  </article>;
}
export function EvidenceList({ items }: { items: Outcome[] }) {
  return items.length ? <div className="po-list">{items.map(row => <article className="po-evidence-row" key={row.outcome_id}><div><h2>{row.title}</h2>{row.summary ? <p>{row.summary}</p> : null}</div>{row.source_label ? <Badge>{row.source_label}</Badge> : null}</article>)}</div> : <EmptyState title="暂无可用证据" />;
}
