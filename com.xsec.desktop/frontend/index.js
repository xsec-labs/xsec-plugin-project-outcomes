// 与 XSEC Desktop 同一套设计 token。Desktop 把当前主题写成 --xsec-<name> 变量（window-background、
// content-surface、bg-subtle、bg-hover、text-primary、text-secondary、text-accent、border-default、
// status-error、status-success、status-warning、radius-md、radius-lg）；宿主没有提供时用下面的默认值，
// 默认值取自 Desktop 的亮、暗两套 token，并跟随系统外观。
const THEME_CSS=`
:root {
  --d-canvas: #f7f7f8; --d-surface: #ffffff; --d-subtle: #f0f0f2; --d-hover: #eaeaed;
  --d-text: #18181b; --d-muted: #62626b; --d-border: #dcdce1; --d-accent: #0169cc;
  --d-danger: #b42318; --d-success: #187344; --d-warning: #8a5700;
}
@media (prefers-color-scheme: dark) {
  :root {
    --d-canvas: #111113; --d-surface: #19191c; --d-subtle: #232327; --d-hover: #2d2d33;
    --d-text: #f4f4f5; --d-muted: #a1a1aa; --d-border: #35353c; --d-accent: #0169cc;
    --d-danger: #ff938a; --d-success: #7ad6a0; --d-warning: #e9bd70;
  }
}
:root {
  --ui-canvas: var(--xsec-window-background, var(--d-canvas));
  --ui-surface: var(--xsec-content-surface, var(--d-surface));
  --ui-subtle: var(--xsec-bg-subtle, var(--d-subtle));
  --ui-hover: var(--xsec-bg-hover, var(--d-hover));
  --ui-text: var(--xsec-text-primary, var(--d-text));
  --ui-muted: var(--xsec-text-secondary, var(--d-muted));
  --ui-border: var(--xsec-border-default, var(--d-border));
  --ui-accent: var(--xsec-text-accent, var(--d-accent));
  --ui-on-accent: #ffffff;
  --ui-danger: var(--xsec-status-error, var(--d-danger));
  --ui-success: var(--xsec-status-success, var(--d-success));
  --ui-warning: var(--xsec-status-warning, var(--d-warning));
  --ui-radius: var(--xsec-radius-md, 8px);
  --ui-radius-panel: var(--xsec-radius-lg, 12px);
  /* 由上面几项推出：强调色当文字用时向正文色靠拢，亮暗两套底上都读得清；淡底用于选中和高亮。 */
  --ui-accent-text: color-mix(in srgb, var(--ui-accent) 64%, var(--ui-text));
  --ui-accent-soft: color-mix(in srgb, var(--ui-accent) 14%, transparent);
  --ui-accent-hover: color-mix(in srgb, var(--ui-accent) 88%, var(--ui-text));
  --ui-faint: color-mix(in srgb, var(--ui-muted) 72%, var(--ui-surface));
  --ui-hairline: color-mix(in srgb, var(--ui-border) 70%, transparent);
  --ui-danger-soft: color-mix(in srgb, var(--ui-danger) 12%, transparent);
  --ui-success-soft: color-mix(in srgb, var(--ui-success) 14%, transparent);
  --ui-warning-soft: color-mix(in srgb, var(--ui-warning) 16%, transparent);
  --ui-shadow: 0 8px 24px rgb(0 0 0 / 12%), 0 1px 2px rgb(0 0 0 / 8%);
  --ui-font: var(--xsec-font-family, system-ui, -apple-system, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif);
  --ui-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  --ui-ease: cubic-bezier(.2, 0, 0, 1);
  background: var(--ui-surface);
  color: var(--ui-text);
  font: 13px/1.5 var(--ui-font);
  -webkit-font-smoothing: antialiased;
}
*, *::before, *::after { box-sizing: border-box; }
html, body, [data-xsec-plugin-root] { min-width: 0; min-height: 100%; margin: 0; }
button, textarea, input { font: inherit; color: inherit; }
button { -webkit-tap-highlight-color: transparent; }
:focus-visible { outline: 2px solid var(--ui-accent-text); outline-offset: 1px; }
::selection { background: color-mix(in srgb, var(--ui-accent) 28%, transparent); }
* { scrollbar-width: thin; scrollbar-color: color-mix(in srgb, var(--ui-muted) 40%, transparent) transparent; }

/* 按钮：默认灰底，主操作强调色实心，图标按钮透明底。高度 28，与 Desktop 面板的紧凑密度一致。 */
.ui-button {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  height: 28px; padding: 0 10px; border: 0; border-radius: var(--ui-radius);
  background: var(--ui-subtle); color: var(--ui-text); font-weight: 500; white-space: nowrap; cursor: pointer;
  transition: background-color .12s var(--ui-ease), color .12s var(--ui-ease), opacity .12s var(--ui-ease);
}
.ui-button:hover:not(:disabled) { background: var(--ui-hover); }
.ui-button:active:not(:disabled) { background: color-mix(in srgb, var(--ui-hover) 80%, var(--ui-text)); }
.ui-button:disabled { cursor: not-allowed; opacity: .45; }
.ui-button.is-primary { background: var(--ui-accent); color: var(--ui-on-accent); }
.ui-button.is-primary:hover:not(:disabled) { background: var(--ui-accent-hover); }
.ui-button.is-ghost { background: transparent; color: var(--ui-muted); }
.ui-button.is-ghost:hover:not(:disabled) { background: var(--ui-hover); color: var(--ui-text); }
.ui-button.is-icon { width: 28px; padding: 0; }
.ui-button[aria-busy="true"] svg { animation: ui-spin .9s linear infinite; }
.ui-button svg { flex: 0 0 auto; }

/* 提示条只用于错误；成功的确认用底部的状态气泡。 */
.ui-notice {
  display: flex; align-items: flex-start; gap: 8px; margin: 8px 12px 0; padding: 8px 10px;
  border-radius: var(--ui-radius); background: var(--ui-danger-soft); color: var(--ui-danger); overflow-wrap: anywhere;
}
.ui-notice svg { flex: 0 0 auto; margin-top: 2px; }
.ui-notice span { flex: 1; min-width: 0; }
.ui-notice .ui-button { height: 24px; margin: -2px 0; background: transparent; color: inherit; box-shadow: inset 0 0 0 1px currentColor; }
.ui-toast {
  position: fixed; left: 50%; bottom: 16px; z-index: 5; transform: translateX(-50%);
  display: flex; align-items: center; gap: 8px; max-width: calc(100% - 32px); padding: 7px 12px 7px 10px;
  border: 1px solid var(--ui-hairline); border-radius: 999px; background: var(--ui-surface); color: var(--ui-text);
  box-shadow: var(--ui-shadow); animation: ui-rise .2s var(--ui-ease);
}
.ui-toast svg { flex: 0 0 auto; color: var(--ui-success); }
.ui-toast span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.ui-empty { display: grid; justify-items: center; align-content: center; gap: 10px; min-height: 220px; padding: 32px 24px; color: var(--ui-muted); text-align: center; }
.ui-empty-mark { display: grid; width: 40px; height: 40px; place-items: center; border-radius: var(--ui-radius-panel); background: var(--ui-subtle); color: var(--ui-muted); }
.ui-empty strong { color: var(--ui-text); font-size: 14px; font-weight: 600; }
.ui-empty.is-error .ui-empty-mark { background: var(--ui-danger-soft); color: var(--ui-danger); }
.ui-empty p { max-width: 320px; margin: 0; overflow-wrap: anywhere; }

.ui-skeleton { display: grid; gap: 10px; padding: 12px 16px; }
.ui-skeleton span {
  display: block; height: 14px; border-radius: 4px;
  background: linear-gradient(90deg, var(--ui-subtle) 25%, var(--ui-hover) 50%, var(--ui-subtle) 75%) 0 0 / 200% 100%;
  animation: ui-shimmer 1.4s linear infinite;
}
.ui-skeleton span:nth-child(3n + 1) { width: 62%; }
.ui-skeleton span:nth-child(3n + 2) { width: 84%; }
.ui-skeleton span:nth-child(3n) { width: 46%; }

@keyframes ui-spin { to { transform: rotate(360deg); } }
@keyframes ui-shimmer { to { background-position: -200% 0; } }
@keyframes ui-rise { from { opacity: 0; transform: translate(-50%, 6px); } }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
`;

const LABEL={finding:"正式漏洞",evidence:"原始证据",report:"报告","shared-finding":"共享发现","passive-finding":"被动线索","task-conclusion":"任务结论"};
const KIND_ICON={finding:"bug",evidence:"file",report:"report","shared-finding":"share","passive-finding":"radar","task-conclusion":"check"};
const KIND_TONE={finding:"danger",evidence:"neutral",report:"info","shared-finding":"warning","passive-finding":"neutral","task-conclusion":"success"};
const SOURCE={finding:"finding-detail",evidence:"evidence-detail",report:"report-detail","task-conclusion":"task-detail"};
const TITLE={"project-outcomes":"项目成果","finding-detail":"漏洞详情","report-detail":"报告详情","task-detail":"任务详情","evidence-detail":"证据详情"};
const FIELD={description:"说明",impact:"影响",reproduction_steps:"复现步骤",remediation:"修复建议",status:"状态",severity:"严重度",confidence:"置信度",endpoint:"端点",parameter:"参数",executive_summary:"执行摘要",scope:"范围",methodology:"方法",limitations:"限制",conclusion:"结论",filename:"文件名",kind:"类型",content_type:"内容类型",size_bytes:"大小",sha256:"SHA256",created_at:"创建时间",updated_at:"更新时间",assignment_id:"任务",run_id:"运行"};
// 严重度和状态的中文名与语气，和 Desktop 的徽标一致；表里没有的值原样显示、语气中性。
const SEVERITY={critical:["严重","critical"],high:["高","danger"],medium:["中","warning"],low:["低","info"],info:["信息","neutral"],informational:["信息","neutral"]};
const STATUS={active:["进行中","info"],running:["运行中","info"],starting:["启动中","info"],in_progress:["进行中","info"],queued:["等待运行","warning"],waiting:["等待运行","warning"],draft:["待复核","warning"],open:["待复核","warning"],pending:["待处理","warning"],waiting_user:["等待用户","warning"],waiting_permission:["等待权限","warning"],interrupted:["已中断","warning"],completed:["已完成","success"],done:["已完成","success"],final:["可交付","success"],verified:["已验证","success"],resolved:["已解决","success"],accepted:["已确认","info"],confirmed:["已确认","info"],new:["新增","success"],failed:["失败","danger"],error:["出错","danger"],invalid:["无效","danger"],idle:["空闲","neutral"],paused:["已暂停","neutral"],archived:["已归档","neutral"],cancelled:["已取消","neutral"],canceled:["已取消","neutral"],stopped:["已停止","neutral"],closed:["已关闭","neutral"],stale:["已过期","neutral"],duplicate:["重复","neutral"]};
const OUTCOME_LIMIT=500;
const PERCENT_SCALE=100;
const SEARCH_DEBOUNCE_MS=300;
const TASK_ID_DISPLAY_START=0;
const TASK_ID_DISPLAY_LENGTH=12;
const LONG_VALUE_LENGTH=48;
// 叙述性的字段各占一整行，排在短字段之后。
const NARRATIVE=new Set(["说明","影响","复现步骤","修复建议","执行摘要","范围","方法","限制","结论","摘要","输入","输出"]);
const CSS=THEME_CSS+`
.app{display:flex;flex-direction:column;min-height:100vh;background:var(--ui-surface)}
.heading{position:sticky;top:0;z-index:3;display:flex;align-items:center;gap:4px;height:44px;flex:0 0 auto;padding:0 8px 0 16px;border-bottom:1px solid var(--ui-hairline);background:var(--ui-surface)}
.heading h1{flex:0 1 auto;min-width:0;margin:0;overflow:hidden;font-size:14px;font-weight:600;text-overflow:ellipsis;white-space:nowrap}
.heading-info{display:grid;place-items:center;width:20px;height:20px;margin-right:auto;color:var(--ui-faint);cursor:help}
.heading h1:last-of-type:not(:has(+ .heading-info)){margin-right:auto}
.body{display:grid;align-content:start;gap:12px;flex:1;min-width:0;padding:12px 16px 24px}
.controls{display:grid;gap:8px}
.scope{display:inline-flex;justify-self:start;gap:2px;padding:2px;border-radius:var(--ui-radius);background:var(--ui-subtle)}
.scope button{height:26px;padding:0 12px;border:0;border-radius:6px;background:transparent;color:var(--ui-muted);font-weight:500;cursor:pointer;transition:background-color .12s var(--ui-ease),color .12s var(--ui-ease)}
.scope button:hover:not(:disabled){color:var(--ui-text)}
.scope button[aria-pressed=true]{background:var(--ui-surface);color:var(--ui-text);box-shadow:0 1px 2px rgb(0 0 0 / 14%),0 0 0 1px var(--ui-hairline)}
.scope button:disabled{cursor:not-allowed;opacity:.45}
.search-field{position:relative;display:block}
.search-field svg{position:absolute;top:50%;left:10px;transform:translateY(-50%);color:var(--ui-faint);pointer-events:none}
.search{width:100%;height:32px;padding:0 10px 0 32px;border:1px solid transparent;border-radius:var(--ui-radius);background:var(--ui-subtle);color:var(--ui-text);transition:border-color .12s var(--ui-ease),background-color .12s var(--ui-ease)}
.search::placeholder{color:var(--ui-faint)}
.search:focus{border-color:var(--ui-accent-text);background:var(--ui-surface);outline:0}
.filters{display:flex;flex-wrap:wrap;gap:6px}
.filter{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 10px;border:0;border-radius:999px;background:var(--ui-subtle);color:var(--ui-muted);font-weight:500;white-space:nowrap;cursor:pointer;transition:background-color .12s var(--ui-ease),color .12s var(--ui-ease)}
.filter:hover{background:var(--ui-hover);color:var(--ui-text)}
.filter span{color:var(--ui-faint);font-size:12px;font-variant-numeric:tabular-nums}
.filter.is-active{background:var(--ui-accent);color:var(--ui-on-accent)}
.filter.is-active span{color:inherit;opacity:.8}
.notice{margin:0;color:var(--ui-faint);font-size:12px;overflow-wrap:anywhere}
.notice:empty{display:none}
.notice.error{padding:8px 10px;border-radius:var(--ui-radius);background:var(--ui-danger-soft);color:var(--ui-danger);font-size:13px}
.list{display:grid;gap:8px}
.row{display:flex;align-items:center;min-width:0;border:1px solid var(--ui-hairline);border-radius:var(--ui-radius-panel);background:var(--ui-surface);transition:border-color .12s var(--ui-ease),background-color .12s var(--ui-ease)}
.row:hover,.row:focus-within{border-color:var(--ui-border);background:color-mix(in srgb,var(--ui-subtle) 55%,var(--ui-surface))}
.outcome-open{display:grid;grid-template-columns:32px minmax(0,1fr);align-items:start;gap:10px;flex:1;min-width:0;padding:10px 4px 10px 12px;border:0;border-radius:var(--ui-radius-panel);background:transparent;text-align:left;cursor:pointer}
.outcome-open:focus-visible{outline-offset:-2px}
.outcome-icon{display:grid;place-items:center;width:32px;height:32px;border-radius:var(--ui-radius);background:var(--ui-subtle);color:var(--ui-muted)}
.outcome-icon.is-danger{background:var(--ui-danger-soft);color:var(--ui-danger)}
.outcome-icon.is-warning{background:var(--ui-warning-soft);color:var(--ui-warning)}
.outcome-icon.is-success{background:var(--ui-success-soft);color:var(--ui-success)}
.outcome-icon.is-info{background:var(--ui-accent-soft);color:var(--ui-accent-text)}
.card-copy{display:grid;min-width:0;gap:1px}
.card-head{display:flex;align-items:center;gap:8px;min-width:0}
.card-head strong{min-width:0;overflow:hidden;font-weight:600;text-overflow:ellipsis;white-space:nowrap}
.meta{overflow:hidden;color:var(--ui-muted);text-overflow:ellipsis;white-space:nowrap}
.meta.is-faint{color:var(--ui-faint);font-size:12px;font-variant-numeric:tabular-nums}
.add{margin:0 8px 0 4px;opacity:0}
.row:hover .add,.add:focus-visible{opacity:1}
.add:hover:not(:disabled){background:var(--ui-accent-soft);color:var(--ui-accent-text)}
.tag{display:inline-flex;align-items:center;flex:0 0 auto;max-width:100%;height:20px;padding:0 8px;overflow:hidden;border-radius:999px;background:var(--ui-subtle);color:var(--ui-muted);font-size:12px;font-weight:500;text-overflow:ellipsis;white-space:nowrap}
.tag.is-danger{background:var(--ui-danger-soft);color:var(--ui-danger)}
.tag.is-warning{background:var(--ui-warning-soft);color:var(--ui-warning)}
.tag.is-success{background:var(--ui-success-soft);color:var(--ui-success)}
.tag.is-info{background:var(--ui-accent-soft);color:var(--ui-accent-text)}
.tag.is-critical{background:var(--ui-danger);color:var(--ui-surface);font-weight:600}
.tag.is-outline{background:transparent;box-shadow:inset 0 0 0 1px var(--ui-border)}
.empty,.loading{display:grid;justify-items:center;align-content:center;gap:10px;min-height:200px;padding:32px 16px;color:var(--ui-muted);text-align:center;overflow-wrap:anywhere}
.loading::before{content:"";width:20px;height:20px;border:2px solid var(--ui-hover);border-top-color:var(--ui-accent-text);border-radius:50%;animation:ui-spin .8s linear infinite}
.detail{display:grid;gap:12px;min-width:0}
.detail h2{margin:0;font-size:14px;font-weight:600;overflow-wrap:anywhere}
.back{display:flex;align-items:center;gap:8px;min-width:0;margin:-4px 0 0 -8px;padding:4px 8px 4px 4px;border:0;border-radius:var(--ui-radius);background:none;color:var(--ui-text);text-align:left;cursor:pointer;transition:background-color .12s var(--ui-ease)}
.back:hover{background:var(--ui-hover)}
.back>svg{flex:0 0 auto;color:var(--ui-muted)}
.detail-title{display:grid;min-width:0}
.detail-title small{color:var(--ui-faint);font-size:12px}
.detail-title strong{font-size:14px;font-weight:600;overflow-wrap:anywhere}
.actions{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.summary{margin:0;color:var(--ui-text);white-space:pre-wrap;overflow-wrap:anywhere}
.preview{display:block;max-width:100%;max-height:260px;border:1px solid var(--ui-hairline);border-radius:var(--ui-radius)}
.code{margin:0;padding:10px 12px;overflow:auto;border-radius:var(--ui-radius);background:var(--ui-subtle);color:var(--ui-text);font:12px/1.6 var(--ui-mono);white-space:pre-wrap;overflow-wrap:anywhere}
.details{padding:12px;border:1px solid var(--ui-hairline);border-radius:var(--ui-radius-panel)}
.details dl{display:grid;grid-template-columns:minmax(64px,max-content) minmax(0,1fr);gap:8px 16px;margin:0}
.details dt{color:var(--ui-muted)}
.details dd{min-width:0;margin:0;overflow-wrap:anywhere;white-space:pre-wrap}
.details dt.is-block{grid-column:1 / -1;margin-top:4px;padding-top:10px;border-top:1px solid var(--ui-hairline);font-size:12px;font-weight:600}
.details dt.is-block:first-child{margin-top:0;padding-top:0;border-top:0}
.details dd.is-block{grid-column:1 / -1;margin-top:-4px}
.details dd.is-mono{font:12px/1.6 var(--ui-mono)}
.raw summary{display:inline-flex;align-items:center;gap:6px;padding:4px 8px 4px 4px;margin-left:-4px;border-radius:var(--ui-radius);color:var(--ui-muted);font-weight:500;list-style:none;cursor:pointer}
.raw summary::-webkit-details-marker{display:none}
.raw summary:hover{background:var(--ui-hover);color:var(--ui-text)}
.raw summary svg{transition:transform .12s var(--ui-ease)}
.raw[open] summary svg{transform:rotate(90deg)}
.raw pre{margin:8px 0 0}
.panel-static-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 12px;border:1px solid var(--ui-hairline);border-radius:var(--ui-radius-panel);background:var(--ui-surface)}
.panel-static-row>span:first-child{display:grid;gap:1px;min-width:0}
.panel-static-row strong,.panel-static-row small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.panel-static-row strong{font-weight:600}
.panel-static-row small{color:var(--ui-muted);font-size:13px}
@media (hover:none){.add{opacity:1}}
`;

const SVG_NAMESPACE="http://www.w3.org/2000/svg";
const ICON_PATHS={
  arrowLeft:["M19 12H5","M11 6l-6 6 6 6"],
  at:["M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z","M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"],
  bug:["M8 8a4 4 0 0 1 8 0","M7 9h10v5a5 5 0 0 1-10 0Z","M12 13v6","M3 13h4","M17 13h4","M4.5 7l3 2.5","M19.5 7l-3 2.5","M5 20l2.6-3","M19 20l-2.6-3"],
  check:["M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z","M8.5 12.5l2.5 2.5 4.5-5"],
  chevronRight:["M9 6l6 6-6 6"],
  external:["M14 4h6v6","M20 4l-9 9","M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"],
  file:["M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z","M14 3v5h5"],
  info:["M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z","M12 11v5","M12 7.5v.01"],
  radar:["M21 12a9 9 0 1 1-9-9","M16 12a4 4 0 1 1-4-4","M12 12l7-7"],
  refresh:["M20 11a8 8 0 0 0-14.3-4.3L4 8.5","M4 4v4.5h4.5","M4 13a8 8 0 0 0 14.3 4.3l1.7-1.8","M20 20v-4.5h-4.5"],
  report:["M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z","M14 3v5h5","M9 13h6","M9 17h4"],
  search:["M17 11a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z","M20 20l-4.5-4.5"],
  share:["M8.5 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z","M20.5 6a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z","M20.5 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z","M8.2 10.8l7.6-3.7","M8.2 13.2l7.6 3.7"],
};
function icon(name,size=16){
  const svg=document.createElementNS(SVG_NAMESPACE,"svg");
  for(const[key,value]of Object.entries({"aria-hidden":"true",fill:"none",width:size,height:size,viewBox:"0 0 24 24",stroke:"currentColor","stroke-width":"1.75","stroke-linecap":"round","stroke-linejoin":"round"}))svg.setAttribute(key,String(value));
  for(const d of ICON_PATHS[name]??[]){const path=document.createElementNS(SVG_NAMESPACE,"path");path.setAttribute("d",d);svg.append(path)}
  return svg;
}

function el(tag,className,value){const node=document.createElement(tag);if(className)node.className=className;if(value!==undefined)node.textContent=value;return node}
function button(className,label,onClick){const node=el("button",className,label);node.type="button";node.addEventListener("click",onClick);return node}
function iconButton(className,name,label,onClick){const node=button("ui-button is-ghost is-icon "+className,"",onClick);node.setAttribute("aria-label",label);node.title=label;node.append(icon(name));return node}
function items(value){return Array.isArray(value)?value:Array.isArray(value?.items)?value.items:[]}
function text(value,empty="—"){return typeof value==="string"&&value.trim()?value:empty}
function pad(value){return String(value).padStart(2,"0")}
function time(value){if(value===null||value===undefined||value==="")return "—";const stamp=new Date(Number(value));return Number.isNaN(stamp.getTime())?"—":stamp.getFullYear()+"-"+pad(stamp.getMonth()+1)+"-"+pad(stamp.getDate())+" "+pad(stamp.getHours())+":"+pad(stamp.getMinutes())}
function safe(value){if(value===null||value===undefined)return value;return JSON.parse(JSON.stringify(value,(key,item)=>key==="storage_path"?undefined:item))}
function failure(error){return text(error?.message,String(error))}
function badge(table,value,fallbackTone="neutral"){const known=table[String(value).trim().toLowerCase()],node=el("span","tag is-"+(known?known[1]:fallbackTone),known?known[0]:String(value));return node}
function invoke(host,options){
  const {method,params}=options;
  if(method==="xsec.outcomes.list")return host.request("xsec.outcomes.list",params);
  if(method==="xsec.outcomes.get")return host.request("xsec.outcomes.get",params);
  if(method==="xsec.outcomes.resolve")return host.request("xsec.outcomes.resolve",params);
  if(method==="xsec.outcomes.task.get")return host.request("xsec.outcomes.task.get",params);
  if(method==="xsec.outcomes.evidence.list")return host.request("xsec.outcomes.evidence.list",params);
  if(method==="xsec.outcomes.reference.add")return host.request("xsec.outcomes.reference.add",params);
  if(method==="xsec.workspace.tool.open")return host.request("xsec.workspace.tool.open",params);
  throw new Error("Unsupported project outcomes request: "+method);
}
function isOutcomesTool(state){return state.context.tool==="project-outcomes"}
function outcomeTitle(row){return text(row?.title,text(row?.outcome_id))}
function taskProgress(value){if(value===null||value===undefined||value==="")return undefined;const progress=Number(value);return Number.isFinite(progress)?Math.round(progress*PERCENT_SCALE)+"%":undefined}
function setNotice(state,message,error=false){state.nodes.notice.textContent=message;state.nodes.notice.className=error?"notice error":"notice"}
function ownsNotice(state,kind,revision){return state.noticeOwner?.kind===kind&&state.noticeOwner.revision===revision}
function hasActionNotice(state){return state.noticeOwner?.kind==="reference"||state.noticeOwner?.kind==="source"}
function claimActionNotice(state,kind){const navigationRevision=state.navigationRevision,revision=++state.referenceRevision,token=kind+":"+navigationRevision+":"+revision;state.pendingReferences.add(token);state.noticeOwner={kind,revision};return {kind,revision,token,navigationRevision}}
function finishActionNotice(state,claim,message,error=false){state.pendingReferences.delete(claim.token);if(message===undefined)return;if(claim.navigationRevision===state.navigationRevision&&claim.revision===state.referenceRevision&&ownsNotice(state,claim.kind,claim.revision))setNotice(state,message,error)}
function replaceContent(state,node){state.viewRevision+=1;state.nodes.content.replaceChildren(node)}
function contextInfo(context){const workspace=context?.workspace??{},binding=workspace.binding??{},entityId=context?.tool?.entityId;return{tool:context?.tool?.kind??"project-outcomes",mode:workspace.mode,entityId,assignmentId:binding.assignmentId,canAdd:workspace.canAddComposerReference===true}}
function outcomeSource(context,row){const toolId=SOURCE[row.kind],entityId=row.kind==="task-conclusion"?row.assignment_id:row.entity_id;if(context.mode==="observe"&&toolId==="task-detail")return undefined;return toolId&&entityId?{toolId,entityId}:undefined}

function addReference(state,target,outcomeId){
  const params=target==="collection"?{target}:{target,outcomeId},claim=claimActionNotice(state,"reference");setNotice(state,"正在添加到对话…");
  console.info("project-outcomes.reference.started",{target});
  void state.invoke({method:"xsec.outcomes.reference.add",params}).then(()=>{console.info("project-outcomes.reference.completed",{target});finishActionNotice(state,claim,"已添加到对话")}).catch((error)=>{console.error("project-outcomes.reference.failed",{target,message:failure(error)});finishActionNotice(state,claim,"添加到对话失败："+failure(error),true)});
}
function openSource(state,row){
  const target=outcomeSource(state.context,row);if(!target)return;
  const claim=claimActionNotice(state,"source");
  console.info("project-outcomes.source-open.started",{toolId:target.toolId});
  void state.invoke({method:"xsec.workspace.tool.open",params:{pluginId:"com.xsec.workspace.project-outcomes",toolId:target.toolId,title:outcomeTitle(row),entityId:target.entityId}}).then(()=>{console.info("project-outcomes.source-open.completed",{toolId:target.toolId});finishActionNotice(state,claim,"")}).catch((error)=>{console.error("project-outcomes.source-open.failed",{toolId:target.toolId,message:failure(error)});finishActionNotice(state,claim,"打开来源失败："+failure(error),true)});
}
function renderFilters(state){
  if(!state.nodes.filters)return;const counts=state.list.reduce((result,row)=>{result[row.kind]=(result[row.kind]??0)+1;return result},{}),showCounts=state.kind==="all"&&!state.query.trim()&&state.list.length<OUTCOME_LIMIT,filters=el("div","filters"),buttons=new Map();
  for(const[kind,label]of[["all","全部"],...Object.entries(LABEL)]){const active=state.kind===kind,filter=button("filter"+(active?" is-active":""),label,()=>{state.kind=kind;showOutcomeList(state)});buttons.set(kind,filter);filter.setAttribute("aria-pressed",String(active));if(showCounts)filter.append(el("span","",String(kind==="all"?state.list.length:counts[kind]??0)));filters.append(filter)}
  state.nodes.filterButtons=buttons;
  state.nodes.filters.replaceChildren(filters);
}
function renderScope(state){
  if(!state.nodes.scope)return;const scope=state.nodes.scope;scope.replaceChildren();for(const[value,label]of[["project","整个项目"],["assignment","当前任务"]]){const item=button("",label,()=>{state.scope=value;showOutcomeList(state)});item.disabled=value==="assignment"&&!state.context.assignmentId;item.setAttribute("aria-pressed",String(state.scope===value));scope.append(item)}
}
function appendReferenceAction(state,article,row){const action=iconButton("add","at","添加成果 "+outcomeTitle(row)+" 到对话",()=>addReference(state,"outcome",row.outcome_id));action.title="添加到对话";article.append(action)}
function kindIcon(kind){const mark=el("span","outcome-icon is-"+(KIND_TONE[kind]??"neutral"));mark.append(icon(KIND_ICON[kind]??"file"));return mark}
function renderOutcomeRow(state,row){
  const article=el("article","row"),open=button("outcome-open","",()=>loadOutcomeDetail(state,row.outcome_id)),copy=el("span","card-copy"),head=el("span","card-head");
  const title=outcomeTitle(row);open.setAttribute("aria-label","查看成果 "+title);open.append(kindIcon(row.kind));head.append(el("strong","",title));if(row.severity)head.append(badge(SEVERITY,row.severity,"danger"));
  copy.append(head,el("span","meta",text(row.summary,text(row.source_label))),el("span","meta is-faint",(LABEL[row.kind]??"成果")+" · "+time(row.updated_at)));open.append(copy);article.append(open);if(state.context.canAdd)appendReferenceAction(state,article,row);return article;
}
function renderOutcomeList(state){
  const filtered=state.kind!=="all"||state.query.trim();renderFilters(state);const list=el("div","list"),rows=state.list;
  if(!rows.length)list.append(el("div","empty",filtered?"没有匹配的项目成果":"暂无项目成果"));for(const row of rows)list.append(renderOutcomeRow(state,row));replaceContent(state,list);
}
function renderPreview(detail){
  const preview=detail.preview;if(!preview||preview.kind==="unavailable")return preview?el("p","meta",text(preview.reason)):null;
  if(preview.kind==="image"&&/^image\/[a-z0-9.+-]+$/i.test(preview.mime_type)){const image=document.createElement("img");image.className="preview";image.alt=outcomeTitle(detail);image.src="data:"+preview.mime_type+";base64,"+preview.data_base64;return image}
  return preview.kind==="text"?el("pre","code",preview.text):null;
}
// 短值排成“标签 + 值”两列，长文本和结构化数据各占一整行。
function isBlockField(label,value){if(value===null||value===undefined||value==="")return false;if(typeof value==="object"||NARRATIVE.has(label))return true;const rendered=String(value);return rendered.length>LONG_VALUE_LENGTH||rendered.includes("\n")}
function appendOrderedFields(dl,fields){for(const block of[false,true])for(const[label,value]of fields)if(isBlockField(label,value)===block)appendDetailField(dl,label,value)}
function fieldValue(key,value){if(typeof value!=="string")return value;const known=(key==="severity"?SEVERITY:key==="status"?STATUS:{})[value.trim().toLowerCase()];return known?known[0]:value}
function appendDetailField(dl,label,value){
  if(value===null||value===undefined||value==="")return;const object=typeof value==="object",rendered=object?JSON.stringify(value,null,2):String(value),block=isBlockField(label,value);
  const mono=!object&&/^(成果 ID|ID|SHA256|绑定 run|任务|运行|端点|参数|文件名)$/.test(label);
  dl.append(el("dt",block?"is-block":"",label),el("dd",(object?"code ":"")+(block?"is-block":"")+(mono?" is-mono":""),rendered));
}
function appendDetailFields(panel,detail){
  const facts=[["成果 ID",detail.outcome_id],["来源",detail.source_label],["更新时间",time(detail.updated_at)],["内容类型",detail.content_type],["大小",detail.size_bytes==null?null:String(detail.size_bytes)+" B"]];
  const fields=Object.entries(safe(detail.details)??{}).filter(([key,value])=>key!=="storage_path"&&value!==null&&value!==""&&value!==undefined).map(([key,value])=>[FIELD[key]??key,fieldValue(key,value)]),section=el("section","details"),dl=el("dl");
  appendOrderedFields(dl,[...facts,...fields]);section.append(dl);panel.append(section);
}
function appendBackAction(panel,back,detail){
  const action=button("back","",back),title=el("span","detail-title");action.setAttribute("aria-label","返回项目成果");title.append(el("small","",detail.kind==="evidence"?"证据详情":"成果详情"),el("strong","",outcomeTitle(detail)));action.append(icon("arrowLeft"),title);panel.append(action);
}
function sourceButton(state,detail){const action=button("ui-button action","打开来源",()=>openSource(state,detail));action.append(icon("external",14));return action}
function appendDetailActions(state,panel,detail,options){
  if(!options.referenceable||!state.context.canAdd){if(options.sourceable&&outcomeSource(state.context,detail))appendSourceAction(state,panel,detail);return}
  const actions=el("div","actions"),add=button("ui-button is-primary action primary","",()=>addReference(state,"outcome",detail.outcome_id));add.append(icon("at",14),"添加到对话");actions.append(add);if(options.sourceable&&outcomeSource(state.context,detail))actions.append(sourceButton(state,detail));panel.append(actions);
}
function appendSourceAction(state,panel,detail){const actions=el("div","actions");actions.append(sourceButton(state,detail));panel.append(actions)}
function appendBadges(panel,detail){const badges=el("div","actions");badges.append(el("span","tag is-outline",LABEL[detail.kind]??"成果"));if(detail.severity)badges.append(badge(SEVERITY,detail.severity,"danger"));if(detail.status)badges.append(badge(STATUS,detail.status));panel.append(badges)}
function appendRawDetail(panel,details){const raw=el("details","raw"),summary=el("summary","");summary.append(icon("chevronRight",14),"查看结构化数据");raw.append(summary,el("pre","code",JSON.stringify(safe(details)??{},null,2)));panel.append(raw)}
function renderOutcomeDetail(state,detail,options){
  const panel=el("article","detail");if(options.back)appendBackAction(panel,options.back,detail);appendBadges(panel,detail);if(detail.summary)panel.append(el("p","summary",detail.summary));appendDetailActions(state,panel,detail,options);
  const preview=renderPreview(detail);if(preview)panel.append(preview);appendDetailFields(panel,detail);appendRawDetail(panel,detail.details);replaceContent(state,panel);
}

function request(state,options){
  const revision=++state.revision;if(!options.preserveNotice)setNotice(state,options.notice??"");replaceContent(state,el("div","loading",options.loading));
  console.info("project-outcomes.request.started",{method:options.method});
  void state.invoke(options).then((value)=>{console.info("project-outcomes.request.completed",{method:options.method,count:items(value).length});if(revision===state.revision)options.success(value)}).catch((error)=>{console.error("project-outcomes.request.failed",{method:options.method,message:failure(error)});if(revision===state.revision)options.failure(error)});
}
function showFailure(state,message){if(!hasActionNotice(state))setNotice(state,message,true);replaceContent(state,el("div","empty",message))}
function cancelOutcomeSearch(state){if(state.searchTimer!==undefined){clearTimeout(state.searchTimer);state.searchTimer=undefined}}
function scheduleOutcomeSearch(state){cancelOutcomeSearch(state);state.revision+=1;state.searchTimer=setTimeout(()=>{state.searchTimer=undefined;loadOutcomes(state)},SEARCH_DEBOUNCE_MS)}
function loadOutcomes(state){
  cancelOutcomeSearch(state);
  const listRevision=++state.listRequestRevision,canOwnNotice=state.pendingReferences.size===0;if(canOwnNotice)state.noticeOwner={kind:"list",revision:listRevision};
  request(state,{method:"xsec.outcomes.list",params:{assignmentOnly:state.scope==="assignment",kinds:state.kind==="all"?undefined:[state.kind],query:state.query.trim()||undefined,limit:OUTCOME_LIMIT},loading:"正在读取项目成果…",notice:canOwnNotice?"正在读取项目成果…":undefined,preserveNotice:!canOwnNotice,success:(page)=>{state.list=items(page);if(ownsNotice(state,"list",listRevision))setNotice(state,"已加载 "+state.list.length+" 项真实成果");renderOutcomeList(state)},failure:(error)=>{if(ownsNotice(state,"list",listRevision))showFailure(state,"读取项目成果失败："+failure(error));else replaceContent(state,el("div","empty","读取项目成果失败："+failure(error)))}});
}
function syncScopeButtons(state){
  if(!state.nodes.scope)return;for(const[index,value]of["project","assignment"].entries()){const item=state.nodes.scope.children[index];if(item)item.setAttribute("aria-pressed",String(state.scope===value))}
}
function syncFilterButtons(state){
  if(!state.nodes.filterButtons)return;for(const[kind,item]of state.nodes.filterButtons){const active=state.kind===kind;item.classList.toggle("is-active",active);item.setAttribute("aria-pressed",String(active));item.querySelector("span")?.remove()}
}
function showOutcomeList(state){const navigate=state.panel!=="list";state.panel="list";if(navigate)build(state);else{syncScopeButtons(state);syncFilterButtons(state)}loadOutcomes(state)}
function loadOutcomeDetail(state,outcomeId){
  cancelOutcomeSearch(state);state.panel="detail";build(state);request(state,{method:"xsec.outcomes.get",params:{outcomeId},loading:"正在读取成果详情…",notice:"正在读取成果详情…",success:(detail)=>{if(!hasActionNotice(state))setNotice(state,"");renderOutcomeDetail(state,detail,{back:()=>showOutcomeList(state),referenceable:true,sourceable:true})},failure:(error)=>showFailure(state,"读取成果详情失败："+failure(error))});
}
function loadBoundDetail(state){
  request(state,{method:"xsec.outcomes.resolve",params:{},loading:"正在读取详情…",success:(detail)=>renderOutcomeDetail(state,detail,{referenceable:false,sourceable:false}),failure:(error)=>showFailure(state,"读取详情失败："+failure(error))});
}
function renderEvidenceRow(row){const article=el("article","panel-static-row"),copy=el("span","");copy.append(el("strong","",text(row.title)),el("small","",text(row.summary)));article.append(copy,el("span","tag",text(row.source_label)));return article}
function renderEvidenceList(state,evidence){const list=el("div","list");if(!evidence.length)list.append(el("div","empty","暂无可用证据"));for(const row of evidence)list.append(renderEvidenceRow(row));replaceContent(state,list)}
function loadEvidenceList(state){request(state,{method:"xsec.outcomes.evidence.list",params:{},loading:"正在读取证据…",success:(page)=>renderEvidenceList(state,items(page)),failure:(error)=>showFailure(state,"读取证据失败："+failure(error))})}
function renderTaskCall(state,call){
  const panel=el("article","detail"),badges=el("div","actions"),section=el("section","details"),dl=el("dl");panel.append(el("h2","",text(call.title??call.kind,"工具调用")));badges.append(badge(STATUS,text(call.status)),el("span","tag is-outline",text(call.kind)));panel.append(badges);
  for(const[label,value]of[["ID",call.tool_call_id],["输入",call.raw_input],["输出",call.raw_output??call.content]])appendDetailField(dl,label,safe(value));section.append(dl);panel.append(section);replaceContent(state,panel);
}
function renderTaskDetail(state,task){
  const panel=el("article","detail"),badges=el("div","actions"),section=el("section","details"),dl=el("dl");panel.append(el("h2","","任务 "+text(task.id).slice(TASK_ID_DISPLAY_START,TASK_ID_DISPLAY_LENGTH)));badges.append(badge(STATUS,text(task.status)));panel.append(badges);
  for(const[label,value]of[["进度",taskProgress(task.progress)],["摘要",task.summary],["绑定 run",task.run_id]])appendDetailField(dl,label,value);section.append(dl);panel.append(section);replaceContent(state,panel);
}
function renderTaskPayload(state,payload){if(payload.type==="tool-call")return renderTaskCall(state,payload);return renderTaskDetail(state,payload)}
function loadTaskDetail(state){request(state,{method:"xsec.outcomes.task.get",params:{},loading:"正在读取任务详情…",success:(payload)=>renderTaskPayload(state,payload),failure:(error)=>showFailure(state,"读取任务详情失败："+failure(error))})}
function refreshView(state){
  if(isOutcomesTool(state))return showOutcomeList(state);if(state.context.tool==="task-detail"&&state.context.entityId)return loadTaskDetail(state);if(state.context.entityId)return loadBoundDetail(state);if(state.context.tool==="evidence-detail")return loadEvidenceList(state);replaceContent(state,el("div","empty",state.context.tool==="task-detail"?"选中工具调用或任务事件后，会在此展示输入、输出与执行状态。":"请选择成果后查看详情。"));
}

function appendCollectionAction(state,actions){actions.push(iconButton("icon-btn","at","添加项目成果集合到对话",()=>addReference(state,"collection")))}
function appendHeader(state,app){
  const heading=el("header","heading"),actions=[],info=el("span","heading-info");info.title="项目内共享 · 跨对话复用";info.setAttribute("role","img");info.setAttribute("aria-label","项目内共享 · 跨对话复用");info.append(icon("info",14));
  if(isOutcomesTool(state)&&state.context.canAdd)appendCollectionAction(state,actions);
  actions.push(iconButton("icon-btn","refresh","刷新项目成果",()=>refreshView(state)));heading.append(el("h1","",TITLE[state.context.tool]??"项目成果"),info,...actions);app.append(heading);
}
function appendControls(state,body){
  const controls=el("section","controls"),scope=el("div","scope");scope.setAttribute("role","group");scope.setAttribute("aria-label","成果范围");state.nodes.scope=scope;renderScope(state);
  const field=el("label","search-field"),search=document.createElement("input");search.className="search";search.type="search";search.placeholder="搜索成果标题、摘要或来源";search.setAttribute("aria-label","搜索成果");search.value=state.query;search.addEventListener("input",()=>{state.query=search.value;scheduleOutcomeSearch(state)});field.append(icon("search",14),search);state.nodes.filters=el("div","");controls.append(scope,field,state.nodes.filters);body.append(controls);
}
function build(state){state.viewRevision+=1;state.navigationRevision+=1;state.pendingReferences.clear();state.noticeOwner=undefined;state.root.replaceChildren(el("style","",CSS));const app=el("main","app"),body=el("div","body");appendHeader(state,app);state.nodes.notice=el("p","notice");state.nodes.notice.setAttribute("role","status");state.nodes.content=el("section","");state.nodes.filters=undefined;state.nodes.filterButtons=undefined;state.nodes.scope=undefined;if(isOutcomesTool(state)&&state.panel==="list")appendControls(state,body);body.append(state.nodes.notice,state.nodes.content);app.append(body);state.root.append(app)}
function update(state,context){cancelOutcomeSearch(state);state.revision+=1;state.context=contextInfo(context);state.panel="list";if(state.scope==="assignment"&&!state.context.assignmentId)state.scope="project";build(state);if(isOutcomesTool(state))loadOutcomes(state);else refreshView(state)}
function createController(host){
  const state={invoke:(options)=>invoke(host,options),root:null,list:[],query:"",kind:"all",scope:"project",panel:"list",revision:0,viewRevision:0,navigationRevision:0,referenceRevision:0,listRequestRevision:0,pendingReferences:new Set(),noticeOwner:undefined,searchTimer:undefined,nodes:{},context:contextInfo(host.context)};
  return{mount(root){console.info("project-outcomes.mount",{tool:state.context.tool});state.root=root;update(state,host.context)},update(context){update(state,context)},dispose(){console.debug("project-outcomes.dispose",{tool:state.context.tool});cancelOutcomeSearch(state);state.viewRevision+=1;state.navigationRevision+=1;state.pendingReferences.clear();state.noticeOwner=undefined;state.revision+=1;state.root?.replaceChildren()}};
}
export function activate(host){console.debug("project-outcomes.activate",{apiVersion:host.apiVersion});return createController(host)}
