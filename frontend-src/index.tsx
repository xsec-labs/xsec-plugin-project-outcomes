import { createRoot, type Root } from "react-dom/client";
import { ErrorState } from "@xsec/ui-react";
import tokenStyles from "@xsec/design-tokens/styles.css";
import componentStyles from "@xsec/ui-react/styles.css";
import styles from "./styles.css";
import { ProjectOutcomesApp } from "./app";
import { errorMessage, parseContext, type Context, type Owner, type PluginHost } from "./host";
import { PluginTheme } from "./theme";

export function activate(host: PluginHost) {
  let root: Root | undefined, owner: Owner = { active: false }, identity: string | undefined, revision = 0;
  console.debug("project-outcomes.activate");
  function render(value: unknown) {
    let context: Context | undefined, error: string | undefined;
    try { context = parseContext(value); } catch (cause) { error = errorMessage(cause); }
    const next = context ? JSON.stringify(context) : undefined;
    if (next !== identity || !owner.active) { owner.active = false; owner = { active: !error }; identity = next; revision += 1; }
    root?.render(<><style>{tokenStyles + componentStyles + styles}</style><PluginTheme host={host}>{context ? <ProjectOutcomesApp key={revision} host={host} context={context} owner={owner} /> : <ErrorState title="项目成果不可用" description={error} />}</PluginTheme></>);
  }
  return { mount(element: HTMLElement, context = host.context) { if (root) throw new Error("项目成果控制器已经挂载"); root = createRoot(element); console.info("project-outcomes.mount"); render(context); }, update(context = host.context) { console.debug("project-outcomes.update"); render(context); }, dispose() { console.debug("project-outcomes.dispose"); owner.active = false; root?.unmount(); root = undefined; identity = undefined; } };
}
