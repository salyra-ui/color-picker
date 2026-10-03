import releases from '../../documentation/releases.json';
import { escape } from './gallery';
import type { Kit } from './snippets';
export function changelogContent(base: string, kit: Kit) {
  const versionLink = (version: string) =>
    `${base}versions/${version}/docs.html?kit=${kit}`;
  return `<main id="main" class="catalog-page release-page">
    <header class="page-heading"><div><p class="product-label">Release notes</p><h1>Changelog</h1></div><div class="page-intro"><p>What's new, what's changed and what's been fixed.</p></div></header>
    <nav class="release-kit-tabs" aria-label="Changelog package">
      <a href="${base}changelog.html?kit=color-picker" ${kit === 'color-picker' ? 'aria-current="page"' : ''}>Color picker</a>
      <a href="${base}changelog.html?kit=theme-studio" ${kit === 'theme-studio' ? 'aria-current="page"' : ''}>Theme studio</a>
    </nav>
    <div class="release-list">${releases.versions
      .map((release) => {
        const date = release.date
          ? new Date(release.date + 'T12:00:00Z').toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              timeZone: 'Europe/Bucharest',
            })
          : 'Not released yet';
        return `<article class="release-entry" id="v${release.version}">
        <header><div><h2>v${release.version}</h2><span class="release-status" data-status="${release.status}">${release.status === 'preview' ? 'Preview' : 'Released'}</span><p>${date}</p></div><a href="${versionLink(release.version)}">Read documentation</a></header>
        <div class="release-changes">${Object.entries(release.changes[kit])
          .map(
            ([label, items]) =>
              `<section><h3>${label}</h3><ul>${(items as string[]).map((text) => `<li>${escape(text)}</li>`).join('')}</ul></section>`,
          )
          .join('')}</div>
      </article>`;
      })
      .join('')}</div>
  </main>`;
}
