import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import remarkFrontmatter from 'remark-frontmatter';

const parser = unified().use(remarkParse).use(remarkMdx).use(remarkFrontmatter);
const ignored = new Set(['script', 'style', 'svg', 'nav', 'footer', 'button', 'noscript', 'template']);
const blocks = new Set(['root', 'heading', 'paragraph', 'list', 'listItem', 'blockquote', 'code', 'thematicBreak']);
const clean = value => value.replace(/\s+/g, ' ').trim();

/** Extract authored prose/code without executing MDX, imports, or expressions. */
export function extractSearchContent(source) {
  const headings = [], rawImports = [];
  const visit = node => {
    if (node.type === 'yaml') return '';
    if (node.type === 'mdxjsEsm') {
      for (const match of node.value.matchAll(/from\s+['"]([^'"]*Caddyfile\?raw)['"]/g)) rawImports.push(match[1]);
      return '';
    }
    if (node.type.endsWith('Expression')) return '';
    if (node.type.startsWith('mdxJsx')) {
      if (ignored.has(node.name)) return '';
      if (node.attributes?.some(attr => attr.name === 'hidden' || attr.name === 'data-search-ignore' || (attr.name === 'aria-hidden' && attr.value === 'true') || (['className', 'class'].includes(attr.name) && /(?:^|\s)(?:sr-only|visually-hidden)(?:\s|$)/.test(attr.value ?? '')))) return '';
      const text = (node.children ?? []).map(visit).join('');
      return node.type === 'mdxJsxTextElement' ? text : ` ${text} `;
    }
    if (node.type === 'code' && node.lang === 'mermaid') return ` ${[...node.value.matchAll(/^\s*acc(?:Title|Descr):\s*(.+)$/gm)].map(match => match[1]).join(' ')} `;
    if (node.type === 'text' || node.type === 'inlineCode') return node.value;
    if (node.type === 'image') return node.alt ?? '';
    const text = node.value ?? (node.children ?? []).map(visit).join('');
    if (node.type === 'heading') headings.push(clean(text));
    return blocks.has(node.type) ? ` ${text} ` : text;
  };
  return {text: clean(visit(parser.parse(source))), headings: headings.join(' '), rawImports};
}
