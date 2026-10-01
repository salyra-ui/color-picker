export const seed = '#5268E0';
export const actions = (buttons: string) =>
  `<div class="recipe-actions">${buttons}</div>`;
export const button = (id: string, label: string) =>
  `<button type="button" data-action="${id}">${label}</button>`;
export const field = (label: string, selector: string, options: string) =>
  `<label>${label}<select aria-label="${label}" data-${selector}>${options}</select></label>`;
export const listenButton = (
  host: HTMLElement,
  id: string,
  run: () => void,
) => {
  host.querySelector<HTMLButtonElement>(`[data-action="${id}"]`)!.onclick = run;
};
export const output = (host: HTMLElement, value: string) => {
  host.querySelector('[data-result]')!.textContent = value;
};
