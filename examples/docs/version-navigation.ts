interface DocumentationRelease {
  version: string;
  status: 'released' | 'preview';
  date?: string;
}
interface DocumentationCatalog {
  current: string;
  versions: DocumentationRelease[];
}
export function documentationURL(
  siteRoot: string,
  version: string,
  page: string,
  search: string,
  hash: string,
) {
  const safePage = [
    'docs.html',
    'color.html',
    'generator.html',
    'site.html',
    'index.html',
  ].includes(page)
    ? page
    : 'docs.html';
  return `${siteRoot}versions/${version}/${safePage}${search}${hash}`;
}
async function mountVersionNavigation() {
  const sidebar = document.querySelector<HTMLElement>('.docs-sidebar');
  if (!sidebar || sidebar.querySelector('[data-version-selector]')) return;
  const root = document.body.dataset.siteRoot!;
  const version = document.body.dataset.docsVersion!;
  if (!root || !version) return;
  const response = await fetch(root + 'docs-versions.json', {
    cache: 'no-cache',
  });
  if (!response.ok) throw Error('Could not load documentation versions');
  const catalog: DocumentationCatalog = await response.json();
  const current = catalog.versions.find((item) => item.version === version);
  const box = document.createElement('div');
  box.className = 'docs-version-picker';
  box.dataset.versionSelector = '';
  const label = document.createElement('label');
  label.textContent = 'Documentation version';
  const select = document.createElement('select');
  select.setAttribute('aria-label', 'Documentation version');
  const latest = catalog.versions.find(
    (item) => item.status === 'released',
  )?.version;
  for (const release of catalog.versions) {
    const option = document.createElement('option');
    option.value = release.version;
    option.textContent = `v${release.version}${release.status === 'preview' ? ' · Preview' : release.version === latest ? ' · Latest' : ''}`;
    option.selected = release.version === version;
    select.append(option);
  }
  label.append(select);
  box.append(label);
  const changelog = document.createElement('a');
  const kit =
    new URLSearchParams(location.search).get('kit') === 'theme-studio'
      ? 'theme-studio'
      : 'color-picker';
  changelog.href = `${root}changelog.html?kit=${kit}#v${version}`;
  changelog.textContent = 'Changelog';
  box.append(changelog);
  sidebar.prepend(box);
  const banner = document.querySelector<HTMLElement>('#overview > .api-note');
  if (banner) {
    banner.textContent =
      current?.status === 'preview' ? `v${version} preview` : `v${version}`;
    banner.dataset.releaseStatus = current?.status ?? 'released';
  }
  select.addEventListener('change', () => {
    location.assign(
      documentationURL(
        root,
        select.value,
        'docs.html',
        location.search,
        location.hash,
      ),
    );
  });
}
const start = () => {
  void mountVersionNavigation().catch((error) => {
    // Navigation failure never prevents reading the documentation itself.
    const sidebar = document.querySelector('.docs-sidebar');
    if (!sidebar || sidebar.querySelector('[data-version-error]')) return;
    const note = document.createElement('p');
    note.dataset.versionError = '';
    note.textContent =
      'Version selection could not load. Refresh to try again.';
    sidebar.prepend(note);
  });
};
if (document.readyState === 'complete') start();
else window.addEventListener('DOMContentLoaded', start, { once: true });
