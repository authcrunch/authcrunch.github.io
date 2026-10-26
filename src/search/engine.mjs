/** Browser-local ranking, excerpts, and literal highlighting, adapted from RapidKnot. */
/** @typedef {{path:string,title:string,description:string,category:string,headings:string,text:string}} SearchPage */

/** @param {string} value */
export const normalizeSearchText = value => value.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
/** @param {string} query */
export const searchTerms = query => [...new Set(normalizeSearchText(query).split(' ').filter(Boolean))].slice(0, 12);

/** @param {SearchPage[]} pages */
export function prepareSearchIndex(pages) {
  return pages.map(page => ({page, title: normalizeSearchText(page.title), fields: [page.title, page.headings, page.description, page.text].map(text => [...new Set(normalizeSearchText(text).split(' ').filter(Boolean))])}));
}

/** @param {ReturnType<typeof prepareSearchIndex>} index */
export function searchPages(index, query) {
  const terms = searchTerms(query);
  if (!terms.length) return [];
  const phrase = terms.join(' '), weights = [12, 6, 4, 1];
  return index.flatMap(({page, title, fields}) => {
    let score = title === phrase ? 100 : ` ${title} `.includes(` ${phrase} `) ? 30 : 0;
    for (const term of terms) {
      let termScore = 0;
      fields.forEach((words, i) => {
        if (words.includes(term)) termScore += weights[i];
        else if (term.length >= 2 && words.some(word => word.startsWith(term))) termScore += weights[i] / 2;
      });
      if (!termScore) return [];
      score += termScore;
    }
    return [{page, score}];
  }).sort((a, b) => b.score - a.score || a.page.title.localeCompare(b.page.title, 'en'));
}

/** @param {string} text @param {string} query */
export function highlightSearchText(text, query) {
  const terms = searchTerms(query);
  return text.split(/([\p{L}\p{N}][\p{L}\p{N}\p{M}]*)/u).filter(Boolean).map(part => {
    const word = normalizeSearchText(part);
    return {text: part, match: terms.some(term => word === term || (term.length >= 2 && word.startsWith(term)))};
  });
}

/** @param {SearchPage} page */
export function searchExcerpt(page, query, length = 210) {
  const text = `${page.description} ${page.text}`.trim();
  let offset = 0;
  for (const part of highlightSearchText(text, query)) {if (part.match) break; offset += part.text.length;}
  let start = Math.max(0, (offset === text.length ? 0 : offset) - 65);
  if (start > 0) {const boundary = text.indexOf(' ', start); start = boundary < 0 ? 0 : boundary + 1;}
  let end = Math.min(text.length, start + length);
  if (end < text.length) {const boundary = text.lastIndexOf(' ', end); if (boundary > start) end = boundary;}
  return `${start ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`;
}

export function validSearchPage(page) {
  if (!page || !['path', 'title', 'description', 'category', 'headings', 'text'].every(key => typeof page[key] === 'string')) return false;
  return page.path.startsWith('/') && !page.path.startsWith('//') && !/[\\\s?#]/u.test(page.path) && new URL(page.path, 'https://local.invalid').origin === 'https://local.invalid';
}
