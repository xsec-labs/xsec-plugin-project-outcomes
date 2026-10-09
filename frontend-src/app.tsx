import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Badge, ControlButton, ControlIconButton, EmptyState, ErrorState, Field, Input, PageHeader, Spinner } from "@xsec/ui-react";
import { ArrowLeft, ArrowRight, FileSearch, MessageSquarePlus, RefreshCw } from "lucide-react";
import { LABELS, confirmed, errorMessage, kind as parseKind, parseBoundDetail, parseDetail, parseItems, parsePage, parseTask, record, request, type Context, type Detail, type Method, type Outcome, type OutcomeKind, type Owner, type Page, type PluginHost, type Task } from "./host";
import { EvidenceList, OutcomeDetail, TaskDetail, sourceTarget, timestamp } from "./detail";

const TITLES = { "project-outcomes": "项目成果", "finding-detail": "漏洞详情", "report-detail": "报告详情", "task-detail": "任务详情", "evidence-detail": "证据详情" };
type View = { status: "loading" } | { status: "failed"; message: string } | { status: "list"; page: Page } | { status: "detail"; detail: Detail } | { status: "task"; task: Task } | { status: "evidence"; items: Outcome[] } | { status: "empty"; message: string };
type Feedback = { status: "success" | "failed"; message: string };
export function ProjectOutcomesApp({ host, context, owner }: { host: PluginHost; context: Context; owner: Owner }) {
  const [query, setQuery] = useState(""), [kind, setKind] = useState<OutcomeKind | "all">("all"), [scope, setScope] = useState<"project" | "assignment">("project");
  const [offsets, setOffsets] = useState([0]), [selection, setSelection] = useState<string | null>(null), [refresh, setRefresh] = useState(0);
  const [view, setView] = useState<View>({ status: "loading" }), [feedback, setFeedback] = useState<Feedback | null>(null), [busy, setBusy] = useState(false);
  const readToken = useRef<object | null>(null), actionToken = useRef<object | null>(null), lastQuery = useRef(""), focusTarget = useRef<string | null>(null), lastSelection = useRef<string | null>(null), root = useRef<HTMLElement>(null);
  const offset = offsets[offsets.length - 1], listTool = context.tool === "project-outcomes";
  useLayoutEffect(() => { const target = focusTarget.current; if (!target || view.status === "loading" || view.status === "failed") return;
    const node = target === "detail" ? root.current?.querySelector<HTMLElement>(".po-detail-title") : [...(root.current?.querySelectorAll<HTMLElement>("[data-outcome-id]") ?? [])].find(node => node.dataset.outcomeId === target);
    if (node) { node.focus(); focusTarget.current = null; }
  }, [view]);
  useEffect(() => {
    if (!owner.active) return;
    const token = {}; readToken.current = token; setView({ status: "loading" }); setFeedback(null);
    let timer: ReturnType<typeof setTimeout> | undefined;
    const load = async () => {
      try {
        let result: View;
        if (listTool && selection === null) result = { status: "list", page: await request(host, "xsec.outcomes.list", { assignmentOnly: scope === "assignment", kinds: kind === "all" ? undefined : [kind], query: query.trim() || undefined, limit: 50, offset }, value => parsePage(value, context.projectId, offset)) };
        else if (listTool) result = { status: "detail", detail: await request(host, "xsec.outcomes.get", { outcomeId: selection }, value => { const detail = parseDetail(value, context.projectId); if (detail.outcome_id !== selection) throw new Error("成果详情与当前选择不匹配"); return detail; }) };
        else if (context.tool === "task-detail" && context.entityId) result = { status: "task", task: await request(host, "xsec.outcomes.task.get", {}, parseTask) };
        else if (context.entityId) result = { status: "detail", detail: await request(host, "xsec.outcomes.resolve", {}, value => parseBoundDetail(value, context)) };
        else if (context.tool === "evidence-detail") result = { status: "evidence", items: await request(host, "xsec.outcomes.evidence.list", {}, value => parseItems(record(value).items, context.projectId)) };
        else result = { status: "empty", message: context.tool === "task-detail" ? "选中工具调用或任务事件后查看详情" : "请选择成果后查看详情" };
        if (owner.active && readToken.current === token) setView(result);
      } catch (error) { if (owner.active && readToken.current === token) setView({ status: "failed", message: errorMessage(error) }); }
    };
    const changedQuery = lastQuery.current !== query; lastQuery.current = query;
    if (changedQuery && listTool && selection === null) timer = setTimeout(() => void load(), 300); else void load();
    return () => { if (timer) clearTimeout(timer); if (readToken.current === token) readToken.current = null; };
  }, [host, context, owner, listTool, selection, query, kind, scope, offset, refresh]);
  useEffect(() => () => { readToken.current = null; actionToken.current = null; }, [owner]);
  function navigate(update: () => void) { if (!owner.active || actionToken.current) return; readToken.current = null; setView({ status: "loading" }); setFeedback(null); update(); }
  async function action(method: Method, params: Record<string, unknown>, message: string) {
    if (!owner.active || actionToken.current || view.status === "loading" || view.status === "failed") return;
    const token = {}; actionToken.current = token; setBusy(true); setFeedback(null);
    try { await request(host, method, params, confirmed); if (owner.active && actionToken.current === token) setFeedback({ status: "success", message }); }
    catch (error) { if (owner.active && actionToken.current === token) setFeedback({ status: "failed", message: errorMessage(error) }); }
    finally { if (actionToken.current === token) { actionToken.current = null; if (owner.active) setBusy(false); } }
  }
  const add = (row?: Outcome) => void action("xsec.outcomes.reference.add", row ? { target: "outcome", outcomeId: row.outcome_id } : { target: "collection" }, "已添加到对话");
  const openSource = (row: Outcome) => { const target = sourceTarget(context, row); if (target) void action("xsec.workspace.tool.open", { pluginId: "com.xsec.workspace.project-outcomes", title: row.title, ...target }, "已打开成果来源"); };
  return <main className="po" ref={root}>
    <PageHeader title={TITLES[context.tool]} description="项目内共享 · 跨对话复用" actions={<>{listTool && context.canAdd ? <ControlIconButton label="添加项目成果集合到对话" disabled={busy || view.status === "loading" || view.status === "failed"} onClick={() => add()}><MessageSquarePlus size={17} aria-hidden="true" /></ControlIconButton> : null}<ControlIconButton label="刷新项目成果" disabled={busy} onClick={() => navigate(() => setRefresh(value => value + 1))}><RefreshCw size={17} aria-hidden="true" /></ControlIconButton></>} />
    {listTool && selection === null ? <section className="po-controls" aria-label="成果筛选"><div className="po-scopes" role="group" aria-label="成果范围">{(["project", "assignment"] as const).map(value => <ControlButton key={value} variant={scope === value ? "primary" : "outline"} aria-pressed={scope === value} disabled={busy || (value === "assignment" && !context.assignmentId)} onClick={() => { if (scope !== value) navigate(() => { setScope(value); setOffsets([0]); }); }}>{value === "project" ? "整个项目" : "当前任务"}</ControlButton>)}</div>
      <Field label="搜索成果">{props => <Input {...props} type="search" maxLength={256} placeholder="成果标题、摘要或来源" value={query} disabled={busy} onChange={event => { if (event.target.value !== query) navigate(() => { setQuery(event.target.value); setOffsets([0]); }); }} />}</Field>
      <div className="po-filters" role="group" aria-label="成果类型">{(["all", ...Object.keys(LABELS)] as (OutcomeKind | "all")[]).map(value => <ControlButton key={value} size="sm" variant={kind === value ? "primary" : "outline"} aria-pressed={kind === value} disabled={busy} onClick={() => { if (kind !== value) navigate(() => { setKind(value === "all" ? "all" : parseKind(value)); setOffsets([0]); }); }}>{value === "all" ? "全部" : LABELS[value]}{view.status === "list" ? <span className="po-count">{value === "all" ? view.page.total : view.page.counts[value] ?? 0}</span> : null}</ControlButton>)}</div>
    </section> : null}
    {feedback ? feedback.status === "failed" ? <ErrorState title="操作失败" description={feedback.message} /> : <p className="po-success" role="status">{feedback.message}</p> : null}
    {listTool && selection !== null && view.status !== "detail" ? <ControlButton variant="ghost" disabled={busy} onClick={() => navigate(() => { focusTarget.current = lastSelection.current; setSelection(null); })}><ArrowLeft size={16} aria-hidden="true" />返回项目成果</ControlButton> : null}
    {listTool && selection === null && view.status === "failed" && offsets.length > 1 ? <ControlButton variant="outline" disabled={busy} onClick={() => navigate(() => setOffsets(values => values.slice(0, -1)))}><ArrowLeft size={16} aria-hidden="true" />上一页</ControlButton> : null}
    <section className="po-content" aria-label="成果内容" aria-busy={view.status === "loading"}>
      {view.status === "loading" ? <Spinner label="正在读取项目成果" /> : view.status === "failed" ? <ErrorState title="成果读取失败" description={view.message} action={<ControlButton variant="outline" onClick={() => navigate(() => setRefresh(value => value + 1))}>重新读取</ControlButton>} /> : view.status === "empty" ? <EmptyState title={view.message} /> : view.status === "task" ? <TaskDetail task={view.task} /> : view.status === "evidence" ? <EvidenceList items={view.items} /> : view.status === "detail" ? <OutcomeDetail detail={view.detail} context={context} standalone={!listTool} busy={busy} onAdd={add} onSource={openSource} onBack={() => navigate(() => { focusTarget.current = lastSelection.current; setSelection(null); })} /> : <>
        <p className="po-muted" role="status">{view.page.total ? `共 ${view.page.total} 项成果，当前 ${offset + 1}–${offset + view.page.items.length}` : "共 0 项成果"}</p>
        {view.page.items.length ? <div className="po-list">{view.page.items.map(row => <article className="po-row" key={row.outcome_id}><ControlButton variant="ghost" className="po-open" data-outcome-id={row.outcome_id} aria-label={`查看成果 ${row.title}`} disabled={busy} onClick={() => navigate(() => { lastSelection.current = row.outcome_id; focusTarget.current = "detail"; setSelection(row.outcome_id); })}><FileSearch size={20} aria-hidden="true" /><span className="po-copy"><strong>{row.title}</strong>{row.summary || row.source_label ? <span className="po-muted">{row.summary ?? row.source_label}</span> : null}<span className="po-meta"><Badge>{LABELS[row.kind]}</Badge>{row.severity ? <Badge tone="danger">{row.severity}</Badge> : null}<span>{timestamp(row.updated_at)}</span></span></span></ControlButton>{context.canAdd ? <ControlIconButton label={`添加成果 ${row.title} 到对话`} disabled={busy} onClick={() => add(row)}><MessageSquarePlus size={17} aria-hidden="true" /></ControlIconButton> : null}</article>)}</div> : <EmptyState title={query.trim() || kind !== "all" ? "没有匹配的项目成果" : "暂无项目成果"} />}
        <nav className="po-pagination" aria-label="成果分页"><ControlButton variant="outline" disabled={busy || offsets.length < 2} onClick={() => navigate(() => setOffsets(values => values.slice(0, -1)))}><ArrowLeft size={16} aria-hidden="true" />上一页</ControlButton><ControlButton variant="outline" disabled={busy || view.page.next_offset === null} onClick={() => { const next = view.page.next_offset; if (next !== null) navigate(() => setOffsets(values => [...values, next])); }}>下一页<ArrowRight size={16} aria-hidden="true" /></ControlButton></nav>
      </>}
    </section>
  </main>;
}
