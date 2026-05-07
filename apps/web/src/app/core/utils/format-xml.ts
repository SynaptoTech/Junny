/** Formatação simples de XML no browser (indentação). Falha silenciosa → texto original. */
export function tryFormatXml(source: string): string {
  if (typeof DOMParser === 'undefined') return source;
  try {
    const trimmed = source.trim();
    if (!trimmed) return source;
    const doc = new DOMParser().parseFromString(trimmed, 'text/xml');
    if (doc.querySelector('parsererror')) return source;
    const decl = trimmed.match(/^<\?xml[\s\S]*?\?>/)?.[0];
    const lines: string[] = [];
    if (decl) lines.push(decl);
    formatElement(doc.documentElement, 0, lines);
    return lines.join('\n');
  } catch {
    return source;
  }
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
}

function escapeText(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatElement(el: Element, depth: number, lines: string[]): void {
  const pad = '  '.repeat(depth);
  const attrs = Array.from(el.attributes)
    .map((a) => ` ${a.name}="${escapeAttr(a.value)}"`)
    .join('');
  const childElements = [...el.childNodes].filter(
    (n) => n.nodeType === Node.ELEMENT_NODE,
  ) as Element[];
  const significantText = [...el.childNodes]
    .filter((n) => n.nodeType === Node.TEXT_NODE)
    .map((n) => (n.textContent ?? '').trim())
    .filter(Boolean)
    .join('');

  if (childElements.length === 0 && !significantText) {
    lines.push(`${pad}<${el.nodeName}${attrs}/>`);
    return;
  }

  if (childElements.length === 0 && significantText) {
    lines.push(
      `${pad}<${el.nodeName}${attrs}>${escapeText(significantText)}</${el.nodeName}>`,
    );
    return;
  }

  lines.push(`${pad}<${el.nodeName}${attrs}>`);
  for (const c of el.childNodes) {
    if (c.nodeType === Node.ELEMENT_NODE) {
      formatElement(c as Element, depth + 1, lines);
    } else if (c.nodeType === Node.TEXT_NODE && c.textContent?.trim()) {
      lines.push(
        `${'  '.repeat(depth + 1)}${escapeText(c.textContent.trim())}`,
      );
    }
  }
  lines.push(`${pad}</${el.nodeName}>`);
}
