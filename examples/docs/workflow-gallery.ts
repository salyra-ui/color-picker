import { codePanel, escape } from './gallery';
import { mountWorkflow as mountColor } from './color-workflows';
import { mountWorkflow as mountTheme } from './theme-workflows';
import { workflows, type WorkflowKit } from './workflow-data';
import { workflowSources } from './workflow-sources';
import helpers from './workflow-ui.ts?raw';
const styles = `@import '@salyra-ui/color-picker/styles.min.css';
@import '@salyra-ui/theme-studio/styles.min.css';
body { font-family: Helvetica, Arial, sans-serif; max-width: 860px; margin: 40px auto; padding: 0 20px; }
.workflow-preview { display: grid; gap: 24px; }
.workflow-preview > [data-picker] { max-width: 360px; }
.recipe-actions { display: flex; flex-wrap: wrap; gap: 8px; margin: 20px 0; }
button, input, select, textarea { font: inherit; }
button { padding: 8px 12px; border: 1px solid #ddd; background: white; cursor: pointer; }
button:disabled { opacity: .4; cursor: default; }
.workflow-field { display: grid; gap: 8px; margin: 16px 0; }
.workflow-locks { display: flex; flex-wrap: wrap; gap: 16px; }
[data-controls] > label { display: flex; gap: 12px; margin: 12px 0; align-items: center; }
[data-text-sample] { padding: 24px; font-size: 24px; }
.workflow-pairs { display: flex; gap: 12px; }
.workflow-pairs article { padding: 24px; flex: 1; }
.recipe-preview { background: hsl(var(--background)); color: hsl(var(--foreground)); padding: 24px; border-radius: var(--border-radius-card); border: var(--border-width-card) solid currentColor; }
.recipe-preview button { background: hsl(var(--primary)); color: hsl(var(--primary-foreground)); border: var(--border-width-button) solid currentColor; }
pre { overflow: auto; max-height: 400px; white-space: pre-wrap; background: #f7f7f8; padding: 20px; }
textarea { width:100%; box-sizing:border-box; }
`;
export function workflowFiles(kit: WorkflowKit, id: string) {
  return [
    {
      name: 'workflow.ts',
      code: workflowSources[kit][id],
    },
    {
      name: 'main.ts',
      code: `import { mountWorkflow } from './workflow';\nimport './styles.css';\n\nconst cleanup = mountWorkflow(document.querySelector<HTMLElement>('#example')!);\n// Call cleanup() when removing this view.\nwindow.addEventListener('pagehide', cleanup, { once: true });`,
    },
    { name: 'workflow-ui.ts', code: helpers },
    {
      name: 'styles.css',
      code:
        kit === 'color-picker'
          ? styles.replace(
              "@import '@salyra-ui/theme-studio/styles.min.css';\n",
              '',
            )
          : styles.replace(
              "@import '@salyra-ui/color-picker/styles.min.css';\n",
              '',
            ),
    },
    {
      name: 'index.html',
      code: '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Salyra UI workflow</title></head><body><main id="example"></main><script type="module" src="/main.ts"></script></body></html>',
    },
    {
      name: 'package.json',
      code: JSON.stringify(
        {
          private: true,
          type: 'module',
          scripts: { dev: 'vite', build: 'vite build' },
          dependencies: { [`@salyra-ui/${kit}`]: '^1.0.0' },
          devDependencies: { vite: '^6.1.0', typescript: '~5.8.3' },
        },
        null,
        2,
      ),
    },
    {
      name: 'README.md',
      code: `# ${workflows[kit].find((item) => item.id === id)!.title}\n\nRun npm install, then npm run dev.\n\nThis example uses Vanilla controls and framework-independent helpers. The same helpers work with every native framework provider. See the ${kit === 'color-picker' ? 'Forms & saved colors' : 'Draft & Apply'} example for complete native framework components.\n`,
    },
  ];
}
export function mountWorkflowGallery(host: HTMLElement, kit: WorkflowKit) {
  const items = workflows[kit];
  let selected: string = items[0].id,
    dispose: (() => void) | undefined;
  host.classList.add('workflow-gallery');
  host.innerHTML = `<div class="workflow-selector"><label>Workflow<select aria-label="${kit === 'color-picker' ? 'Color picker' : 'Theme studio'} workflow">${items.map((item) => `<option value="${item.id}">${escape(item.title)}</option>`).join('')}</select></label><div class="view-tabs" role="group" aria-label="Workflow display"><button type="button" data-view="preview" aria-pressed="true">Preview</button><button type="button" data-view="code" aria-pressed="false">Code</button></div></div><div class="workflow-summary"><h3></h3><p></p><span>Vanilla controls · Framework-independent core</span></div><div data-workflow-preview></div><div data-workflow-code hidden></div>`;
  const preview = host.querySelector<HTMLElement>('[data-workflow-preview]')!,
    code = host.querySelector<HTMLElement>('[data-workflow-code]')!;
  const panel = codePanel(code, () => '', {
    file: 'TypeScript',
    baseName: kit + '-workflow',
    downloadName: () => `${kit}-${selected}`,
    files: () => workflowFiles(kit, selected),
  });
  const update = () => {
    dispose?.();
    const item = items.find((item) => item.id === selected)!;
    host.querySelector('h3')!.textContent = item.title;
    host.querySelector('.workflow-summary p')!.textContent = item.description;
    dispose = (kit === 'color-picker' ? mountColor : mountTheme)(
      preview,
      selected,
    );
    panel.refresh();
  };
  host.querySelector<HTMLSelectElement>('select')!.onchange = (e) => {
    selected = (e.currentTarget as HTMLSelectElement).value;
    update();
  };
  for (const b of host.querySelectorAll<HTMLButtonElement>('[data-view]'))
    b.onclick = () => {
      const showCode = b.dataset.view === 'code';
      preview.hidden = showCode;
      code.hidden = !showCode;
      for (const other of host.querySelectorAll<HTMLButtonElement>(
        '[data-view]',
      ))
        other.setAttribute('aria-pressed', String(other === b));
    };
  update();
  return () => {
    dispose?.();
    host.replaceChildren();
  };
}
