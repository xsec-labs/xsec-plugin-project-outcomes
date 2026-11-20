// 颜色只用 Desktop 推送给插件的 --xsec-* 变量（window-background、content-surface、bg-subtle、bg-hover、
// text-primary、text-secondary、text-accent、border-default、border-subtle、status-error、status-success、
// status-warning、radius-md、radius-lg、space-3、space-4）；宿主没有提供时用下面的默认值，
// 默认值取自 Desktop 的亮、暗两套 token，并跟随系统外观。其余颜色都由这些变量推出。
const CSS=`
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
  --ui-surface: var(--xsec-content-surface, var(--d-surface));
  --ui-subtle: var(--xsec-bg-subtle, var(--d-subtle));
  --ui-hover: var(--xsec-bg-hover, var(--d-hover));
  --ui-text: var(--xsec-text-primary, var(--d-text));
  --ui-muted: var(--xsec-text-secondary, var(--d-muted));
  --ui-border: var(--xsec-border-default, var(--d-border));
  --ui-accent: var(--xsec-text-accent, var(--d-accent));
  --ui-danger: var(--xsec-status-error, var(--d-danger));
  --ui-success: var(--xsec-status-success, var(--d-success));
  --ui-warning: var(--xsec-status-warning, var(--d-warning));
  --ui-radius: var(--xsec-radius-md, 8px);
  --ui-radius-panel: var(--xsec-radius-lg, 12px);
  /* 强调色当文字用时向正文色靠拢；“中”级严重度取错误色与警告色之间的橙。 */
  --ui-ink: color-mix(in srgb, var(--ui-accent) 64%, var(--ui-text));
  --ui-orange: color-mix(in srgb, var(--ui-danger) 45%, var(--ui-warning));
  --ui-hair: color-mix(in srgb, var(--ui-text) 10%, transparent);
  --ui-shadow: 0 8px 24px rgb(0 0 0 / 12%), 0 1px 2px rgb(0 0 0 / 8%);
  --ui-font: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", system-ui, sans-serif;
  --ui-mono: ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas, "Liberation Mono", monospace;
  --ui-ease: cubic-bezier(.2, 0, 0, 1);
  background: var(--ui-surface);
  color: var(--ui-text);
  font: 13px/1.45 var(--ui-font);
  -webkit-font-smoothing: antialiased;
}
*, *::before, *::after { box-sizing: border-box; }
[hidden] { display: none !important; }
html, body, [data-xsec-plugin-root] { min-width: 0; height: 100%; margin: 0; }
button, input { font: inherit; color: inherit; }
button { -webkit-tap-highlight-color: transparent; }
:focus-visible { outline: 2px solid var(--ui-ink); outline-offset: 1px; }
::selection { background: color-mix(in srgb, var(--ui-accent) 28%, transparent); }
* { scrollbar-width: thin; scrollbar-color: color-mix(in srgb, var(--ui-muted) 40%, transparent) transparent; }
svg { width: 16px; height: 16px; flex: none; }

.app { display: flex; flex-direction: column; height: 100vh; min-height: 0; background: var(--ui-surface); }
.bar { position: relative; display: flex; align-items: center; gap: 6px; flex: none; height: 44px; padding: 0 8px; }
.app.is-detail .bar { border-bottom: 1px solid var(--ui-hair); }
.search { display: flex; flex: 1; align-items: center; gap: 6px; min-width: 0; height: 28px; padding: 0 4px 0 8px; border-radius: var(--ui-radius); background: var(--ui-subtle); color: var(--ui-muted); }
.search:focus-within { box-shadow: 0 0 0 1px var(--ui-ink); }
.search input { flex: 1; min-width: 0; height: 100%; padding: 0; border: 0; outline: 0; background: transparent; color: var(--ui-text); }
.search input::placeholder { color: var(--ui-muted); }
.search input::-webkit-search-cancel-button { display: none; }
.search .ib { width: 22px; height: 22px; border-radius: 6px; }
.seg { display: flex; flex: none; gap: 2px; padding: 2px; border-radius: var(--ui-radius); background: var(--ui-subtle); }
.seg button { height: 24px; padding: 0 9px; border: 0; border-radius: 6px; background: transparent; color: var(--ui-muted); font-size: 12px; font-weight: 500; cursor: pointer; }
.seg button:hover:not(:disabled):not([aria-pressed=true]) { color: var(--ui-text); }
.seg button[aria-pressed=true] { background: var(--ui-surface); color: var(--ui-text); box-shadow: 0 0 0 1px var(--ui-hair); }
.seg button:disabled { cursor: not-allowed; opacity: .38; }
.ib { position: relative; display: grid; flex: none; place-items: center; width: 28px; height: 28px; padding: 0; border: 0; border-radius: var(--ui-radius); background: transparent; color: var(--ui-muted); cursor: pointer; }
.ib:hover:not(:disabled), .ib[aria-expanded=true] { background: var(--ui-hover); color: var(--ui-text); }
.ib:disabled { cursor: not-allowed; opacity: .38; }
.ib[aria-busy=true] svg { animation: spin .9s linear infinite; }
.crumb { flex: 1; min-width: 0; overflow: hidden; color: var(--ui-muted); font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
.cta { display: inline-flex; flex: none; align-items: center; gap: 5px; height: 28px; padding: 0 10px; border: 0; border-radius: var(--ui-radius); background: var(--ui-subtle); color: var(--ui-text); font-weight: 500; cursor: pointer; }
.cta:hover { background: var(--ui-hover); }
.menu { position: absolute; top: 38px; right: 8px; z-index: 6; display: grid; min-width: 168px; padding: 4px; border: 1px solid var(--ui-hair); border-radius: var(--ui-radius-panel); background: var(--ui-surface); box-shadow: var(--ui-shadow); }
.menu button { display: flex; align-items: center; gap: 8px; height: 30px; padding: 0 8px; border: 0; border-radius: 6px; background: transparent; text-align: left; cursor: pointer; }
.menu button:hover { background: var(--ui-subtle); }
.menu svg { color: var(--ui-muted); }
.progress { position: relative; flex: none; height: 2px; overflow: hidden; }
.progress::after { content: ""; position: absolute; inset: 0 auto 0 0; width: 40%; background: linear-gradient(90deg, transparent, var(--ui-ink), transparent); animation: slide 1.2s var(--ui-ease) infinite; }
.chips { display: flex; flex: none; gap: 4px; padding: 0 8px 8px; overflow-x: auto; border-bottom: 1px solid var(--ui-hair); }
.chip { flex: none; height: 24px; padding: 0 8px; border: 0; border-radius: 6px; background: transparent; color: var(--ui-muted); font-size: 12px; white-space: nowrap; cursor: pointer; }
.chip:hover:not(.is-on) { color: var(--ui-text); }
.chip i { margin-left: 4px; font-style: normal; font-variant-numeric: tabular-nums; opacity: .7; }
.chip.is-on { background: var(--ui-subtle); color: var(--ui-text); font-weight: 600; }
.app.no-chips .list-wrap { border-top: 1px solid var(--ui-hair); }
.list-wrap { flex: 1; min-height: 0; overflow-y: auto; }

.item { position: relative; display: grid; grid-template-columns: 22px minmax(0, 1fr) auto; column-gap: 8px; align-items: center; padding: 7px 10px 7px 12px; border-bottom: 1px solid var(--ui-hair); }
.item:hover, .item:focus-within { background: var(--ui-subtle); }
.item-hit { position: absolute; inset: 0; z-index: 0; padding: 0; border: 0; background: transparent; cursor: pointer; }
.item-hit:focus-visible { outline-offset: -2px; }
.item.is-static .item-hit { display: none; }
.item > :not(.item-hit) { position: relative; pointer-events: none; }
.sev { grid-row: 1 / 3; align-self: start; display: grid; place-items: center; width: 22px; height: 20px; margin-top: 1px; border-radius: 5px; color: var(--t); background: color-mix(in srgb, var(--t) 14%, var(--ui-surface)); font-size: 11px; font-weight: 600; }
.sev.c { --t: var(--ui-danger); background: var(--ui-danger); color: var(--ui-surface); }
.sev.h { --t: var(--ui-danger); }
.sev.m { --t: var(--ui-orange); }
.sev.l { --t: var(--ui-ink); }
.sev.k { background: none; color: var(--ui-muted); }
.t { overflow: hidden; font-weight: 500; text-overflow: ellipsis; white-space: nowrap; }
.d { grid-column: 2 / 4; overflow: hidden; color: var(--ui-muted); font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
.trail { display: grid; justify-items: end; }
.trail > * { grid-area: 1 / 1; }
.time { color: var(--ui-muted); font-size: 12px; font-variant-numeric: tabular-nums; white-space: nowrap; }
.act { display: flex; gap: 2px; margin: -4px -4px -4px 0; visibility: hidden; }
.act .ib { width: 24px; height: 24px; border-radius: 6px; pointer-events: auto; }
.item:hover .time, .item:focus-within .time { visibility: hidden; }
.item:hover .act, .item:focus-within .act { visibility: visible; }
.item.is-static .act { display: none; }
.item.is-static:hover .time { visibility: visible; }
@media (hover: none) { .item:not(.is-static) .time { visibility: hidden; } .act { visibility: visible; } }
[data-tip]:hover::after, [data-tip]:focus-visible::after { content: attr(data-tip); position: absolute; top: 50%; right: calc(100% + 6px); z-index: 4; transform: translateY(-50%); padding: 3px 8px; border-radius: 6px; background: var(--ui-text); color: var(--ui-surface); font-size: 12px; font-weight: 400; white-space: nowrap; pointer-events: none; }

.err { flex: none; margin: 8px; border: 1px solid color-mix(in srgb, var(--ui-danger) 32%, transparent); border-radius: var(--ui-radius); background: color-mix(in srgb, var(--ui-danger) 8%, var(--ui-surface)); }
.err-row { display: flex; align-items: center; gap: 8px; height: 34px; padding: 0 4px 0 10px; }
.err-row svg { color: var(--ui-danger); }
.err-row span { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.err-more { padding: 0 6px; border: 0; background: transparent; color: var(--ui-muted); font-size: 12px; cursor: pointer; }
.err-more:hover { color: var(--ui-text); }
.err-retry { padding: 4px 8px; border: 0; border-radius: 6px; background: var(--ui-surface); font-weight: 500; cursor: pointer; }
.err-detail { margin: 0; padding: 0 10px 8px 34px; color: var(--ui-muted); font-size: 12px; overflow-wrap: anywhere; white-space: pre-wrap; }
.stopped { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 6px 8px 6px 12px; border-bottom: 1px solid var(--ui-hair); background: var(--ui-subtle); color: var(--ui-muted); font-size: 12px; }
.foot { display: flex; flex: none; align-items: center; height: 28px; padding: 0 12px; border-top: 1px solid var(--ui-hair); color: var(--ui-muted); font-size: 12px; }
.more { display: block; width: 100%; height: 36px; border: 0; background: transparent; color: var(--ui-muted); cursor: pointer; }
.more:hover:not(:disabled) { background: var(--ui-subtle); color: var(--ui-text); }
.more:disabled { cursor: default; }
.center { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; min-height: 260px; height: 100%; padding: 0 40px; color: var(--ui-muted); text-align: center; overflow-wrap: anywhere; }
.center svg { width: 22px; height: 22px; margin-bottom: 6px; }
.center strong { color: var(--ui-text); font-size: 14px; }
.center .btn { height: 28px; margin-top: 10px; padding: 0 12px; border: 0; border-radius: var(--ui-radius); background: var(--ui-subtle); color: var(--ui-text); font-weight: 500; cursor: pointer; }
.center .btn:hover { background: var(--ui-hover); }
.sk { display: block; height: 10px; border-radius: 4px; background: linear-gradient(90deg, var(--ui-subtle) 25%, var(--ui-hover) 50%, var(--ui-subtle) 75%) 0 0 / 200% 100%; animation: shimmer 1.4s linear infinite; }

.body { flex: 1; min-height: 0; padding: 12px 14px 20px; overflow-y: auto; }
.body h2 { margin: 0; font-size: 15px; font-weight: 600; line-height: 1.35; overflow-wrap: anywhere; }
.meta { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin: 6px 0 12px; color: var(--ui-muted); font-size: 12px; }
.pill { height: 20px; padding: 0 7px; border-radius: 5px; background: color-mix(in srgb, var(--t) 14%, var(--ui-surface)); color: var(--t); font-size: 11px; font-weight: 600; line-height: 20px; --t: var(--ui-muted); }
.pill.c { background: var(--ui-danger); color: var(--ui-surface); }
.pill.h { --t: var(--ui-danger); }
.pill.m { --t: var(--ui-orange); }
.pill.ok { --t: var(--ui-success); }
.pill.warn { --t: var(--ui-warning); }
.pill.run, .pill.l { --t: var(--ui-ink); }
.pg { height: 4px; margin: 2px 0 10px; overflow: hidden; border-radius: 2px; background: var(--ui-subtle); }
.pg i { display: block; height: 100%; background: var(--ui-ink); }
.kv { display: grid; grid-template-columns: 64px minmax(0, 1fr); gap: 5px 10px; margin: 0; padding: 10px 0; border-top: 1px solid var(--ui-hair); }
.kv dt { color: var(--ui-muted); font-size: 12px; line-height: 19px; }
.kv dd { min-width: 0; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mono { font: 12px/19px var(--ui-mono); }
.sec { padding: 10px 0 2px; border-top: 1px solid var(--ui-hair); }
.sec h3 { display: flex; align-items: center; margin: 0 0 4px; color: var(--ui-muted); font-size: 12px; font-weight: 600; }
.sec h3 span { margin-left: auto; font-weight: 400; }
.sec p { margin: 0 0 8px; overflow-wrap: anywhere; white-space: pre-wrap; }
.sec ol { margin: 0 0 8px; padding-left: 18px; overflow-wrap: anywhere; }
.sec .muted { color: var(--ui-muted); }
.code { margin: 0 0 8px; padding: 8px 10px; overflow: auto; border-radius: var(--ui-radius); background: var(--ui-subtle); font: 12px/1.55 var(--ui-mono); overflow-wrap: anywhere; white-space: pre-wrap; }
.preview { display: block; max-width: 100%; max-height: 320px; margin: 0 0 8px; border: 1px solid var(--ui-hair); border-radius: var(--ui-radius); }

.toast { position: fixed; left: 50%; bottom: 16px; z-index: 8; display: flex; align-items: center; gap: 8px; max-width: calc(100% - 32px); padding: 7px 12px 7px 10px; border: 1px solid var(--ui-hair); border-radius: 999px; background: var(--ui-surface); box-shadow: var(--ui-shadow); transform: translateX(-50%); animation: rise .2s var(--ui-ease); }
.toast svg { color: var(--ui-success); }
.toast.is-error svg { color: var(--ui-danger); }
.toast span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes shimmer { to { background-position: -200% 0; } }
@keyframes slide { from { transform: translateX(-100%); } to { transform: translateX(250%); } }
@keyframes rise { from { opacity: 0; transform: translate(-50%, 6px); } }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }
`;

const KIND_LABEL={finding:"正式漏洞",evidence:"原始证据",report:"报告","shared-finding":"共享发现","passive-finding":"被动线索","task-conclusion":"任务结论"};
const CHIP_LABEL={finding:"漏洞",evidence:"证据",report:"报告","shared-finding":"共享发现","passive-finding":"被动线索","task-conclusion":"任务结论"};
const CRUMB={finding:"漏洞",evidence:"证据",report:"报告","shared-finding":"共享发现","passive-finding":"被动线索","task-conclusion":"任务结论",task:"任务"};
const KIND_ICON={finding:"warn",evidence:"file",report:"report","shared-finding":"warn","passive-finding":"warn","task-conclusion":"check"};
const SOURCE={finding:"finding-detail",evidence:"evidence-detail",report:"report-detail","task-conclusion":"task-detail"};
const FIELD={description:"说明",impact:"影响",reproduction_steps:"复现步骤",remediation:"修复建议",confidence:"置信度",endpoint:"端点",parameter:"参数",executive_summary:"执行摘要",scope:"范围",methodology:"方法",limitations:"限制",conclusion:"结论",filename:"文件名",kind:"类别",content_type:"内容类型",sha256:"SHA256",assignment_id:"任务",run_id:"运行",finding_id:"漏洞 ID",report_id:"报告 ID"};
// 严重度：危、高、中、低；表里没有的值原样显示。
const SEVERITY={critical:["危","c"],high:["高","h"],medium:["中","m"],low:["低","l"],info:["信息","k"],informational:["信息","k"]};
const CONFIDENCE={high:"高",medium:"中",low:"低"};
const STATUS={active:["进行中","run"],running:["运行中","run"],starting:["启动中","run"],in_progress:["进行中","run"],queued:["等待运行","warn"],waiting:["等待运行","warn"],draft:["待复核","warn"],open:["待复核","warn"],pending:["待处理","warn"],waiting_user:["等待用户","warn"],waiting_permission:["等待权限","warn"],interrupted:["已中断","warn"],completed:["已完成","ok"],done:["已完成","ok"],final:["可交付","ok"],verified:["已验证","ok"],resolved:["已解决","ok"],accepted:["已确认","run"],confirmed:["已确认","ok"],new:["新增","ok"],failed:["失败","h"],error:["出错","h"],invalid:["无效","h"],idle:["空闲",""],paused:["已暂停",""],archived:["已归档",""],cancelled:["已取消",""],canceled:["已取消",""],stopped:["已停止",""],closed:["已关闭",""],stale:["已过期",""],duplicate:["重复",""]};
// 叙述性字段按这个顺序成节；内容和前面的节相同的会跳过。
const SECTIONS=[["description","说明"],["executive_summary","执行摘要"],["scope","范围"],["methodology","方法"],["limitations","限制"],["reproduction_steps","复现步骤"],["impact","影响"],["remediation","修复建议"],["conclusion","结论"]];
const KV_KEYS=["endpoint","parameter","sha256","kind","content_type","assignment_id","run_id","finding_id","report_id"];
const MONO_KEYS=new Set(["endpoint","parameter","sha256","assignment_id","run_id","finding_id","report_id"]);
const HIDDEN_KEYS=new Set(["confidence","id","project_id","storage_path","upload_expires_at","created_at","updated_at","title","severity","status","summary","filename","size_bytes"]);
const PAGE_SIZE=50;
const PERCENT_SCALE=100;
const SEARCH_DEBOUNCE_MS=300;
const TOAST_MS=2400;
const TASK_ID_DISPLAY_LENGTH=12;
const SECONDS_LIMIT=100000000000;
const DAY_MS=86400000;
const SHORT_VALUE_LENGTH=80;
const HASH_HEAD=12;
const HASH_TAIL=6;
const KIB=1024;

const SVG_NAMESPACE="http://www.w3.org/2000/svg";
const ICON_PATHS={
  search:["M11.5 7a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z","m13.5 13.5-3-3"],
  refresh:["M13 8a5 5 0 1 1-1.5-3.5","M13 3v3h-3"],
  x:["m4 4 8 8M12 4l-8 8"],
  at:["M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z","M10.5 5.5v3.2a1.6 1.6 0 0 0 3 .6A6 6 0 1 0 11 13.2"],
  open:["m6 3 5 5-5 5"],
  back:["m10 3-5 5 5 5"],
  more:["M3.5 8h.01M8 8h.01M12.5 8h.01"],
  file:["M9 2H4.5v12h7V4.5z","M9 2v2.5h2.5"],
  report:["M9 2H4.5v12h7V4.5z","M9 2v2.5h2.5","M6.5 8h3M6.5 10.5h3"],
  check:["M13.5 8a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z","m5.8 8.2 1.6 1.6 3-3.4"],
  box:["M2.5 5 8 2.5 13.5 5v6L8 13.5 2.5 11z","M2.5 5 8 7.5 13.5 5M8 7.5v6"],
  warn:["M8 2.5 14 13H2z","M8 6.5v3M8 11.3v.1"],
  stop:["m4 4 8 8M12 4l-8 8"],
  copy:["M13.5 7a1.5 1.5 0 0 0-1.5-1.5H7A1.5 1.5 0 0 0 5.5 7v5A1.5 1.5 0 0 0 7 13.5h5a1.5 1.5 0 0 0 1.5-1.5Z","M10.5 3.5v-1h-8v8h1"],
  external:["M9 3h4v4M13 3 7.5 8.5M11 9.5V13H3V5h3.5"],
  braces:["M6 3C4.5 3 4.5 4 4.5 5.5S4.5 7.5 3 8c1.5.5 1.5 1 1.5 2.5S4.5 13 6 13","M10 3c1.5 0 1.5 1 1.5 2.5S11.5 7.5 13 8c-1.5.5-1.5 1-1.5 2.5S11.5 13 10 13"],
};
function icon(name,size){
  const svg=document.createElementNS(SVG_NAMESPACE,"svg");
  for(const[key,value]of Object.entries({"aria-hidden":"true",fill:"none",viewBox:"0 0 16 16",stroke:"currentColor","stroke-width":"1.6","stroke-linecap":"round","stroke-linejoin":"round"}))svg.setAttribute(key,value);
  if(size){svg.style.width=size+"px";svg.style.height=size+"px"}
  for(const d of ICON_PATHS[name]??[]){const path=document.createElementNS(SVG_NAMESPACE,"path");path.setAttribute("d",d);svg.append(path)}
  return svg;
}

function el(tag,className,value){const node=document.createElement(tag);if(className)node.className=className;if(value!==undefined)node.textContent=value;return node}
function button(className,label,onClick){const node=el("button",className,label);node.type="button";node.addEventListener("click",onClick);return node}
function iconButton(className,name,label,onClick,tip){const node=button("ib "+className,"",onClick);node.setAttribute("aria-label",label);if(tip)node.dataset.tip=tip;node.append(icon(name));return node}
function items(value){return Array.isArray(value)?value:Array.isArray(value?.items)?value.items:[]}
function text(value,empty="—"){return typeof value==="string"&&value.trim()?value:empty}
function pad(value){return String(value).padStart(2,"0")}
function safe(value){if(value===null||value===undefined)return value;return JSON.parse(JSON.stringify(value,(key,item)=>key==="storage_path"?undefined:item))}
function failure(error){return text(error?.message,String(error))}
function stamp(value){const n=Number(value);if(value===null||value===undefined||value===""||!Number.isFinite(n)||n<=0)return null;return new Date(n<SECONDS_LIMIT?n*1000:n)}
function clock(date){return pad(date.getHours())+":"+pad(date.getMinutes())}
// 今天、昨天只写“今天 14:20”“昨天”，更早写月-日；跨年带年份。full 时一律带时分。
function when(value,full){
  const date=stamp(value);if(!date)return "";
  const now=new Date(),day=item=>new Date(item.getFullYear(),item.getMonth(),item.getDate()).getTime(),diff=Math.round((day(now)-day(date))/DAY_MS);
  if(diff===0)return "今天 "+clock(date);
  if(diff===1)return full?"昨天 "+clock(date):"昨天";
  const md=pad(date.getMonth()+1)+"-"+pad(date.getDate()),label=date.getFullYear()===now.getFullYear()?md:date.getFullYear()+"-"+md;
  return full?label+" "+clock(date):label;
}
function bytes(value){const n=Number(value);if(value===null||value===undefined||!Number.isFinite(n))return "";if(n<KIB)return n+" B";if(n<KIB*KIB)return (n/KIB).toFixed(1)+" KB";return (n/KIB/KIB).toFixed(1)+" MB"}
function plain(value){return typeof value==="string"?value:JSON.stringify(safe(value),null,2)}
function outcomeTitle(row){return text(row?.title,text(row?.outcome_id))}
function severityOf(value){return value?SEVERITY[String(value).trim().toLowerCase()]:undefined}
function pill(label,tone){return el("span","pill"+(tone?" "+tone:""),label)}
function statusPill(value){const known=STATUS[String(value).trim().toLowerCase()];return pill(known?known[0]:String(value),known?known[1]:"")}
function severityPill(value){const known=severityOf(value);return pill(known?known[0]:String(value),known?known[1]:"h")}
function confidence(value){if(value===null||value===undefined||value==="")return "";if(typeof value==="number")return String(value>0&&value<=1?Math.round(value*PERCENT_SCALE)+"%":value);return CONFIDENCE[String(value).trim().toLowerCase()]??String(value)}

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
function contextInfo(context){const workspace=context?.workspace??{},binding=workspace.binding??{};return{tool:context?.tool?.kind??"project-outcomes",mode:workspace.mode,entityId:context?.tool?.entityId,assignmentId:binding.assignmentId,canAdd:workspace.canAddComposerReference===true}}
function outcomeSource(context,row){const toolId=SOURCE[row.kind],entityId=row.kind==="task-conclusion"?row.assignment_id:row.entity_id;if(context.mode==="observe"&&toolId==="task-detail")return undefined;return toolId&&entityId?{toolId,entityId}:undefined}

// ---- 提示 ----
function toast(state,message,error){
  state.nodes.toast?.remove();clearTimeout(state.toastTimer);
  const node=el("div","toast"+(error?" is-error":""));node.setAttribute("role","status");node.append(icon(error?"warn":"check"),el("span","",message));
  state.root.append(node);state.nodes.toast=node;state.toastTimer=setTimeout(()=>{node.remove();if(state.nodes.toast===node)state.nodes.toast=undefined},TOAST_MS);
}
function addReference(state,target,outcomeId){
  const params=target==="collection"?{target}:{target,outcomeId};
  console.info("project-outcomes.reference.started",{target});
  void state.invoke({method:"xsec.outcomes.reference.add",params}).then(()=>{console.info("project-outcomes.reference.completed",{target});toast(state,"已引用到对话",false)}).catch((error)=>{console.error("project-outcomes.reference.failed",{target,message:failure(error)});toast(state,"引用到对话失败："+failure(error),true)});
}
function openSource(state,row){
  const target=outcomeSource(state.context,row);if(!target)return;
  console.info("project-outcomes.source-open.started",{toolId:target.toolId});
  void state.invoke({method:"xsec.workspace.tool.open",params:{pluginId:"com.xsec.workspace.project-outcomes",toolId:target.toolId,title:outcomeTitle(row),entityId:target.entityId}}).then(()=>{console.info("project-outcomes.source-open.completed",{toolId:target.toolId})}).catch((error)=>{console.error("project-outcomes.source-open.failed",{toolId:target.toolId,message:failure(error)});toast(state,"打开来源失败："+failure(error),true)});
}
function copyText(state,value,done){
  const write=navigator.clipboard?.writeText?.(value);
  if(!write){toast(state,"复制失败：当前环境不支持剪贴板",true);return}
  void write.then(()=>toast(state,done,false)).catch((error)=>toast(state,"复制失败："+failure(error),true));
}

// ---- 公共部件 ----
function errorBar(state,message,retry){
  const bar=el("div","err"),row=el("div","err-row"),short=message.length>SHORT_VALUE_LENGTH?message.slice(0,SHORT_VALUE_LENGTH)+"…":message,detail=el("p","err-detail",message);
  bar.setAttribute("role","alert");detail.hidden=true;
  row.append(icon("warn"),el("span","",short),button("err-more","详情",()=>{detail.hidden=!detail.hidden}),button("err-retry","重试",retry));
  bar.append(row,detail);return bar;
}
function skeletonRows(){
  const list=el("div","");list.setAttribute("aria-busy","true");
  for(const width of[62,48,70,40,56,66]){const row=el("div","item is-static"),mark=el("span","sev k"),line=el("span","sk"),sub=el("span","d");mark.append(Object.assign(el("span","sk"),{}));mark.firstChild.style.cssText="width:22px;height:20px";line.style.width=width+"%";const bar=el("span","sk");bar.style.cssText="width:"+(width+18)+"%;height:8px;margin-top:8px";sub.append(bar);row.append(mark,line,el("span",""),sub);list.append(row)}
  return list;
}
function skeletonBody(){
  const body=el("div","");body.setAttribute("aria-busy","true");
  const lines=(widths,gap)=>{const group=el("div","");group.style.cssText="padding:"+gap+"px 0 4px;border-top:1px solid var(--ui-hair)";for(const width of widths){const line=el("span","sk");line.style.cssText="width:"+width+"%;margin:0 0 10px";group.append(line)}return group};
  const title=el("span","sk");title.style.cssText="width:55%;height:14px;margin:4px 0 12px";const sub=el("span","sk");sub.style.cssText="width:30%;margin:0 0 14px";
  body.append(title,sub,lines([92,84,60],14),lines([88,70],14));return body;
}
function centerMessage(name,title,body,action){
  const box=el("div","center");box.append(icon(name),el("strong","",title));if(body)box.append(el("span","",body));if(action)box.append(action);return box;
}

// ---- 列表 ----
function listParams(state,extra){return{assignmentOnly:state.scope==="assignment",kinds:state.kind==="all"?undefined:[state.kind],query:state.query.trim()||undefined,limit:PAGE_SIZE,...extra}}
function cancelSearch(state){if(state.searchTimer!==undefined){clearTimeout(state.searchTimer);state.searchTimer=undefined}}
function scheduleSearch(state){cancelSearch(state);state.listRev+=1;state.searchTimer=setTimeout(()=>{state.searchTimer=undefined;loadOutcomes(state,{counts:true})},SEARCH_DEBOUNCE_MS)}
// 数量取自不带类型筛选的结果，选了类型之后再补一次只取数量的请求；选类型本身不用重取数量。
function loadOutcomes(state,options){
  cancelSearch(state);
  const rev=++state.listRev,wanted=state.kind==="all"?undefined:[state.kind],withCounts=options?.counts!==false;
  state.loading=true;state.stopped=false;state.error=null;state.loadingMore=false;renderList(state);
  console.info("project-outcomes.request.started",{method:"xsec.outcomes.list"});
  const main=state.invoke({method:"xsec.outcomes.list",params:listParams(state)});
  const side=wanted&&withCounts?state.invoke({method:"xsec.outcomes.list",params:{...listParams(state),kinds:undefined,limit:1}}).catch(()=>null):Promise.resolve(null);
  void Promise.all([main,side]).then(([page,all])=>{
    if(rev!==state.listRev)return;
    console.info("project-outcomes.request.completed",{method:"xsec.outcomes.list",count:items(page).length});
    state.items=items(page);state.nextOffset=page?.next_offset??null;state.loading=false;state.updatedAt=Date.now();
    const source=wanted?all:page;if(source){state.counts=source.counts??{};state.total=source.total??items(source).length}
    renderList(state);
  }).catch((error)=>{
    if(rev!==state.listRev)return;
    console.error("project-outcomes.request.failed",{method:"xsec.outcomes.list",message:failure(error)});
    state.loading=false;state.error=failure(error);renderList(state);
  });
}
function loadMore(state){
  if(state.loadingMore||state.nextOffset===null)return;
  const rev=state.listRev;state.loadingMore=true;renderList(state);
  void state.invoke({method:"xsec.outcomes.list",params:listParams(state,{offset:state.nextOffset})}).then((page)=>{
    if(rev!==state.listRev)return;
    state.items=state.items.concat(items(page));state.nextOffset=page?.next_offset??null;state.loadingMore=false;renderList(state);
  }).catch((error)=>{
    if(rev!==state.listRev)return;
    state.loadingMore=false;renderList(state);toast(state,"加载更多失败："+failure(error),true);
  });
}
function stopLoading(state){state.listRev+=1;state.loading=false;state.loadingMore=false;state.stopped=true;renderList(state)}
function setScope(state,value){if(state.scope===value)return;state.scope=value;loadOutcomes(state,{counts:true})}
function setKind(state,value){if(state.kind===value)return;state.kind=value;loadOutcomes(state,{counts:false})}
function clearFilters(state){state.query="";state.kind="all";if(state.nodes.input)state.nodes.input.value="";loadOutcomes(state,{counts:true})}

function buildListShell(state){
  const app=state.nodes.app;app.className="app";app.replaceChildren();closeMenu(state);
  const bar=el("div","bar"),search=el("label","search"),input=document.createElement("input"),clear=iconButton("","x","清除搜索",()=>{state.query="";input.value="";clear.hidden=true;loadOutcomes(state,{counts:true});input.focus()}),seg=el("div","seg");
  input.type="search";input.placeholder="搜索成果";input.setAttribute("aria-label","搜索成果标题、摘要或来源");input.value=state.query;clear.hidden=!state.query;clear.firstChild.style.cssText="width:12px;height:12px";
  input.addEventListener("input",()=>{state.query=input.value;clear.hidden=!input.value;scheduleSearch(state)});
  search.append(icon("search"),input,clear);
  seg.setAttribute("role","group");seg.setAttribute("aria-label","成果范围");
  for(const[value,label]of[["project","项目"],["assignment","当前任务"]]){const item=button("",label,()=>{setScope(state,value);for(const node of seg.children)node.setAttribute("aria-pressed",String(node===item))});item.disabled=value==="assignment"&&!state.context.assignmentId;item.setAttribute("aria-pressed",String(state.scope===value));seg.append(item)}
  const refresh=iconButton("","refresh","刷新项目成果",()=>{if(state.loading)stopLoading(state);else loadOutcomes(state,{counts:true})});
  bar.append(search,seg);
  if(state.context.canAdd)bar.append(iconButton("","at","引用全部项目成果到对话",()=>addReference(state,"collection"),"引用全部成果"));
  bar.append(refresh);
  state.nodes.input=input;state.nodes.refresh=refresh;state.nodes.progress=el("div","progress");state.nodes.chips=el("div","chips");state.nodes.err=el("div","");state.nodes.list=el("div","list-wrap");state.nodes.foot=el("div","");
  app.append(bar,state.nodes.progress,state.nodes.chips,state.nodes.err,state.nodes.list,state.nodes.foot);
}
function renderChips(state){
  const filtered=state.kind!=="all"||state.query.trim(),node=state.nodes.chips;
  if(!state.total&&!filtered){node.hidden=true;state.nodes.app.classList.add("no-chips");return}
  node.hidden=false;state.nodes.app.classList.remove("no-chips");
  const chips=[["all","全部",state.total]];
  for(const kind of Object.keys(CHIP_LABEL)){const count=state.counts[kind]??0;if(count>0||state.kind===kind)chips.push([kind,CHIP_LABEL[kind],count])}
  node.replaceChildren(...chips.map(([kind,label,count])=>{const chip=button("chip"+(state.kind===kind?" is-on":""),label,()=>setKind(state,kind));chip.setAttribute("aria-pressed",String(state.kind===kind));chip.append(el("i","",String(count)));return chip}));
}
function sevMark(row){
  const known=severityOf(row.severity),mark=el("span","sev "+(known&&known[1]!=="k"?known[1]:"k"));
  if(known&&known[1]!=="k")mark.textContent=known[0];else mark.append(icon(KIND_ICON[row.kind]??"file"));
  return mark;
}
function outcomeRow(state,row,options){
  const article=el("article","item"+(options?.static?" is-static":"")),title=outcomeTitle(row),sub=[text(row.summary,text(row.source_label,"")),options?.plainKind?"":KIND_LABEL[row.kind]??"成果"].filter(Boolean).join(" · "),trail=el("span","trail"),act=el("span","act");
  article.append(sevMark(row),el("span","t",title),trail,el("span","d",sub));
  trail.append(el("span","time",when(row.updated_at)));
  if(!options?.static){
    const hit=button("item-hit","",()=>openOutcome(state,row));hit.setAttribute("aria-label","打开详情："+title);article.prepend(hit);
    if(state.context.canAdd)act.append(iconButton("","at","引用到对话："+title,()=>addReference(state,"outcome",row.outcome_id),"引用到对话"));
    act.append(iconButton("","open","打开详情："+title,()=>openOutcome(state,row),"打开详情"));
    trail.append(act);
  }
  return article;
}
function renderList(state){
  if(!state.nodes.list)return;
  const nodes=state.nodes,filtered=state.kind!=="all"||state.query.trim(),loadingFirst=state.loading&&!state.items.length;
  nodes.refresh.setAttribute("aria-busy","false");nodes.refresh.replaceChildren(icon(state.loading?"stop":"refresh"));nodes.refresh.setAttribute("aria-label",state.loading?"停止读取":"刷新项目成果");
  nodes.progress.hidden=!state.loading;renderChips(state);
  nodes.err.replaceChildren();if(state.error)nodes.err.append(errorBar(state,"读取失败："+state.error,()=>loadOutcomes(state,{counts:true})));
  const body=nodes.list;
  if(loadingFirst)body.replaceChildren(skeletonRows());
  else if(state.stopped&&!state.items.length)body.replaceChildren(centerMessage("stop","已停止读取","",button("btn","重新读取",()=>loadOutcomes(state,{counts:true}))));
  else if(!state.items.length&&!state.error){
    const clear=filtered?button("btn",state.query.trim()?"清除搜索":"显示全部",()=>clearFilters(state)):null;
    body.replaceChildren(filtered?centerMessage("search","没有匹配的成果","换个关键词，或在整个项目范围里查找。",clear):centerMessage("box","还没有项目成果","Agent 确认的漏洞、证据和报告会显示在这里。"));
  }else{
    const list=el("div",""),single=state.kind!=="all"||Object.values(state.counts).filter(Boolean).length<=1;for(const row of state.items)list.append(outcomeRow(state,row,{plainKind:single}));
    if(state.nextOffset!==null){const more=button("more",state.loadingMore?"正在加载…":"加载更多",()=>loadMore(state));more.disabled=state.loadingMore;list.append(more)}
    if(state.stopped){const note=el("div","stopped");note.append(el("span","","已停止读取，列表可能与当前搜索和筛选不一致"),button("err-retry","重新读取",()=>loadOutcomes(state,{counts:true})));list.prepend(note)}
    body.replaceChildren(list);
  }
  nodes.foot.className=state.error&&state.updatedAt?"foot":"";nodes.foot.textContent=state.error&&state.updatedAt?"上次更新 "+clock(new Date(state.updatedAt)):"";
}

// ---- 详情 ----
function closeMenu(state){state.menuClose?.();state.menuClose=undefined}
function openOutcome(state,row){
  openDetail(state,{type:"outcome",method:"xsec.outcomes.get",params:{outcomeId:row.outcome_id},crumb:CRUMB[row.kind]??"成果",back:()=>backToList(state),referenceable:true,sourceable:true});
}
function backToList(state){
  state.detailRev+=1;closeMenu(state);state.view="list";buildListShell(state);renderList(state);
}
function openDetail(state,spec){
  closeMenu(state);state.view="detail";state.spec=spec;state.detail=null;state.detailError=null;state.detailLoading=true;state.showRaw=false;
  const rev=++state.detailRev;renderDetail(state);
  console.info("project-outcomes.request.started",{method:spec.method});
  void state.invoke({method:spec.method,params:spec.params}).then((value)=>{
    if(rev!==state.detailRev)return;
    console.info("project-outcomes.request.completed",{method:spec.method,count:items(value).length});
    state.detail=value;state.detailLoading=false;renderDetail(state);
  }).catch((error)=>{
    if(rev!==state.detailRev)return;
    console.error("project-outcomes.request.failed",{method:spec.method,message:failure(error)});
    state.detailLoading=false;state.detailError=failure(error);renderDetail(state);
  });
}
function detailCrumb(state){
  const spec=state.spec,detail=state.detail;let name=spec.crumb;
  if(spec.type==="outcome"&&detail?.kind)name=CRUMB[detail.kind]??name;
  if(spec.type==="task")name="任务";if(spec.type==="evidenceList")name="证据";
  return "项目成果 / "+name;
}
function menuItems(state){
  const spec=state.spec,detail=state.detail,list=[];
  if(spec.type!=="outcome"||!detail)return list;
  if(spec.sourceable&&outcomeSource(state.context,detail))list.push(["external","打开来源",()=>openSource(state,detail)]);
  list.push(["copy","复制成果 ID",()=>copyText(state,detail.outcome_id,"已复制成果 ID")]);
  list.push(["braces",state.showRaw?"隐藏结构化数据":"查看结构化数据",()=>{state.showRaw=!state.showRaw;renderDetail(state)}]);
  return list;
}
function openMenu(state,anchor,entries){
  closeMenu(state);
  const menu=el("div","menu");menu.setAttribute("role","menu");anchor.setAttribute("aria-expanded","true");
  for(const[name,label,run]of entries){const item=button("",label,()=>{closeMenu(state);run()});item.setAttribute("role","menuitem");item.prepend(icon(name));menu.append(item)}
  const away=event=>{if(!menu.contains(event.target)&&!anchor.contains(event.target))closeMenu(state)},keys=event=>{if(event.key==="Escape"){closeMenu(state);anchor.focus()}};
  document.addEventListener("pointerdown",away,true);document.addEventListener("keydown",keys,true);
  state.menuClose=()=>{document.removeEventListener("pointerdown",away,true);document.removeEventListener("keydown",keys,true);menu.remove();anchor.setAttribute("aria-expanded","false")};
  anchor.parentElement.append(menu);menu.firstChild?.focus();
}
function renderDetail(state){
  const app=state.nodes.app,spec=state.spec,detail=state.detail,ready=detail&&!state.detailLoading&&!state.detailError;
  app.className="app is-detail";app.replaceChildren();
  const bar=el("div","bar");
  if(spec.back){const back=iconButton("","back","返回项目成果",spec.back);bar.append(back)}
  bar.append(el("span","crumb",detailCrumb(state)));
  if(ready&&spec.type==="outcome"&&spec.referenceable&&state.context.canAdd){const cta=button("cta","",()=>addReference(state,"outcome",detail.outcome_id));cta.append(icon("at"),"引用到对话");bar.append(cta)}
  const entries=ready?menuItems(state):[];
  if(entries.length){const more=iconButton("","more","更多操作",()=>{if(state.menuClose)closeMenu(state);else openMenu(state,more,entries)});more.setAttribute("aria-haspopup","menu");more.setAttribute("aria-expanded","false");bar.append(more)}
  else if(!ready||spec.type!=="outcome"){const refresh=iconButton("","refresh","刷新",()=>openDetail(state,spec));refresh.setAttribute("aria-busy",String(state.detailLoading));bar.append(refresh)}
  app.append(bar);
  if(state.detailLoading){app.append(el("div","progress"));const body=el("div","body");body.append(skeletonBody());app.append(body);return}
  if(state.detailError){app.append(errorBar(state,"读取详情失败："+state.detailError,()=>openDetail(state,spec)),el("div","body"));return}
  const body=el("div","body");
  if(spec.type==="outcome")renderOutcomeBody(state,body,detail);
  else if(spec.type==="task")renderTaskBody(body,detail);
  else renderEvidenceList(state,body,items(detail));
  app.append(body);
}
function section(title,node,extra){
  const box=el("div","sec"),head=el("h3","",title);if(extra)head.append(el("span","",extra));box.append(head);if(Array.isArray(node))box.append(...node);else box.append(node);return box;
}
function codeBlock(value){return el("pre","code",value)}
// 正文里的 ``` 围栏当代码块；“1. …”开头的每一行当有序列表。
function richText(value){
  const nodes=[],parts=String(value).split(/```[^\n]*\n?/);
  parts.forEach((part,index)=>{
    const chunk=part.replace(/^\n+|\n+$/g,"");if(!chunk.trim())return;
    if(index%2===1){nodes.push(codeBlock(chunk));return}
    const lines=chunk.split("\n").filter(line=>line.trim());
    if(lines.length>1&&lines.every(line=>/^\s*\d+[.)、]\s*/.test(line))){const list=el("ol");for(const line of lines)list.append(el("li","",line.replace(/^\s*\d+[.)、]\s*/,"")));nodes.push(list)}
    else nodes.push(el("p","",chunk));
  });
  return nodes;
}
function kvList(rows){
  const dl=el("dl","kv");
  for(const[label,value,mono,full]of rows){const dd=el("dd",mono?"mono":"",value);dd.title=full??value;dl.append(el("dt","",label),dd)}
  return dl;
}
function middle(value){return value.length>HASH_HEAD+HASH_TAIL+1?value.slice(0,HASH_HEAD)+"…"+value.slice(-HASH_TAIL):value}
function renderPreview(detail){
  const preview=detail.preview;if(!preview)return null;
  if(preview.kind==="image"&&/^image\/[a-z0-9.+-]+$/i.test(preview.mime_type)){const image=document.createElement("img");image.className="preview";image.alt=outcomeTitle(detail);image.src="data:"+preview.mime_type+";base64,"+preview.data_base64;return section("内容",image)}
  if(preview.kind==="text")return section("内容",codeBlock(preview.text??""),preview.truncated?"已截断":"");
  if(preview.kind==="unavailable")return section("内容",el("p","muted",text(preview.reason,"暂无预览")));
  return null;
}
function renderOutcomeBody(state,body,detail){
  const info=safe(detail.details)??{},facts=[],sections=[],used=new Set(),seen=new Set();
  const show=value=>value!==null&&value!==undefined&&value!==""&&typeof value!=="object";
  body.append(el("h2","",outcomeTitle(detail)));
  const meta=el("div","meta"),notes=[];
  if(detail.severity)meta.append(severityPill(detail.severity));
  if(detail.status)meta.append(statusPill(detail.status));
  if(show(info.confidence))notes.push("置信度 "+confidence(info.confidence));
  if(detail.kind==="evidence"){if(detail.content_type)notes.push(detail.content_type);if(detail.size_bytes!==null&&detail.size_bytes!==undefined)notes.push(bytes(detail.size_bytes))}
  const stampText=when(detail.updated_at??detail.created_at,true);if(stampText)notes.push(stampText);
  if(notes.length)meta.append(el("span","",notes.join(" · ")));
  body.append(meta);
  for(const key of KV_KEYS){
    used.add(key);const value=info[key];
    if(!show(value)||key==="content_type"&&detail.kind==="evidence")continue;
    const rendered=String(value);facts.push([FIELD[key]??key,key==="sha256"?middle(rendered):rendered,MONO_KEYS.has(key),rendered]);
  }
  const source=text(detail.source_label,"");if(source&&detail.kind!=="evidence"&&source!==CRUMB[detail.kind]&&source!==KIND_LABEL[detail.kind])facts.splice(Math.min(2,facts.length),0,["来源",source,false,source]);
  const summary=text(detail.summary,"");
  if(summary){seen.add(summary.trim());sections.push(section(typeof info.executive_summary==="string"&&info.executive_summary.trim()===summary.trim()?"执行摘要":"摘要",richText(summary)))}
  for(const[key,label]of SECTIONS){used.add(key);const value=info[key];if(typeof value!=="string"||!value.trim()||seen.has(value.trim()))continue;seen.add(value.trim());sections.push(section(label,richText(value)))}
  for(const[key,value]of Object.entries(info)){
    if(used.has(key)||HIDDEN_KEYS.has(key)||!show(value))continue;
    const rendered=String(value);if(rendered.length<=SHORT_VALUE_LENGTH&&!rendered.includes("\n"))facts.push([FIELD[key]??key,rendered,false,rendered]);
  }
  if(facts.length)body.append(kvList(facts));
  const preview=renderPreview(detail);if(preview)sections.unshift(preview);
  body.append(...sections);
  if(state.showRaw)body.append(section("结构化数据",codeBlock(JSON.stringify(safe(info),null,2))));
}
function renderTaskBody(body,payload){
  if(payload.type==="tool-call"){
    body.append(el("h2","",text(payload.title,text(payload.kind,"工具调用"))));
    const meta=el("div","meta");if(payload.status)meta.append(statusPill(payload.status));if(payload.kind)meta.append(el("span","",payload.kind));body.append(meta);
    if(payload.tool_call_id)body.append(kvList([["ID",String(payload.tool_call_id),true]]));
    const input=payload.raw_input,output=payload.raw_output??payload.content;
    if(input!==null&&input!==undefined&&input!=="")body.append(section("输入",codeBlock(plain(input))));
    if(output!==null&&output!==undefined&&output!=="")body.append(section("输出",codeBlock(plain(output))));
    return;
  }
  body.append(el("h2","","任务 "+text(payload.id).slice(0,TASK_ID_DISPLAY_LENGTH)));
  const meta=el("div","meta"),progress=Number(payload.progress);if(payload.status)meta.append(statusPill(payload.status));
  if(payload.progress!==null&&payload.progress!==undefined&&Number.isFinite(progress))meta.append(el("span","","进度 "+Math.round(progress*PERCENT_SCALE)+"%"));body.append(meta);
  if(payload.progress!==null&&payload.progress!==undefined&&Number.isFinite(progress)){const track=el("div","pg"),fill=el("i");fill.style.width=Math.max(0,Math.min(1,progress))*PERCENT_SCALE+"%";track.append(fill);body.append(track)}
  const rows=[["任务",text(payload.id),true]];if(payload.run_id)rows.push(["运行",String(payload.run_id),true]);body.append(kvList(rows));
  if(typeof payload.summary==="string"&&payload.summary.trim())body.append(section("结论",richText(payload.summary)));
}
function renderEvidenceList(state,body,rows){
  body.style.padding="0";
  if(!rows.length){body.append(centerMessage("file","暂无可用证据","Agent 保存的原始证据会显示在这里。"));return}
  for(const row of rows)body.append(outcomeRow(state,{...row,summary:text(row.summary,""),severity:undefined},{static:true}));
}

// ---- 生命周期 ----
function refreshView(state){
  const context=state.context;
  if(context.tool==="task-detail"&&context.entityId)return openDetail(state,{type:"task",method:"xsec.outcomes.task.get",params:{},crumb:"任务"});
  if(context.tool==="evidence-detail"&&!context.entityId)return openDetail(state,{type:"evidenceList",method:"xsec.outcomes.evidence.list",params:{},crumb:"证据"});
  if(context.entityId)return openDetail(state,{type:"outcome",method:"xsec.outcomes.resolve",params:{},crumb:"成果",referenceable:false,sourceable:false});
  state.view="empty";state.nodes.app.className="app";state.nodes.app.replaceChildren(el("div","body"));
  state.nodes.app.firstChild.append(centerMessage("box",context.tool==="task-detail"?"选中工具调用或任务事件后，会在此展示输入、输出与执行状态。":"请选择成果后查看详情。"));
}
function reset(state){
  cancelSearch(state);closeMenu(state);clearTimeout(state.toastTimer);state.listRev+=1;state.detailRev+=1;
  state.root.replaceChildren(el("style","",CSS));
  const app=el("main","app");state.nodes={app};state.root.append(app);
}
function update(state,context){
  state.context=contextInfo(context);state.items=[];state.counts={};state.total=0;state.nextOffset=null;state.error=null;state.loading=false;
  if(state.scope==="assignment"&&!state.context.assignmentId)state.scope="project";
  reset(state);
  if(isOutcomesTool(state)){state.view="list";buildListShell(state);loadOutcomes(state,{counts:true})}else refreshView(state);
}
function createController(host){
  const state={invoke:(options)=>invoke(host,options),root:null,context:contextInfo(host.context),scope:"project",kind:"all",query:"",items:[],counts:{},total:0,nextOffset:null,loading:false,loadingMore:false,stopped:false,error:null,updatedAt:null,view:"list",spec:null,detail:null,detailError:null,detailLoading:false,showRaw:false,listRev:0,detailRev:0,searchTimer:undefined,toastTimer:undefined,menuClose:undefined,nodes:{}};
  return{mount(root){console.info("project-outcomes.mount",{tool:state.context.tool});state.root=root;update(state,host.context)},update(context){update(state,context)},dispose(){console.debug("project-outcomes.dispose",{tool:state.context.tool});cancelSearch(state);closeMenu(state);clearTimeout(state.toastTimer);state.listRev+=1;state.detailRev+=1;state.root?.replaceChildren()}};
}
export function activate(host){console.debug("project-outcomes.activate",{apiVersion:host.apiVersion});return createController(host)}
