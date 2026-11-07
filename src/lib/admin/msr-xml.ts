export function decodeXml(value: string) {
  return value
    .replace(/&#(\d+);/g, (_, digits: string) => String.fromCodePoint(Number(digits)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&apos;/g, "'").replace(/&amp;/g, "&");
}

export function tagAttributes(tag: string) {
  const values: Record<string, string> = {};
  for (const match of tag.matchAll(/([\w:]+)="([^"]*)"/g)) values[match[1]] = decodeXml(match[2]);
  return values;
}

export function sharedStrings(xml: string) {
  return [...xml.matchAll(/<si\b[\s\S]*?<\/si>/g)].map(item =>
    [...item[0].matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map(match => decodeXml(match[1])).join(""));
}

export function cellValue(tag: string, inner: string | undefined, strings: string[]) {
  const attrs = tagAttributes(`<c ${tag}>`);
  const formula = inner?.match(/<f\b[^>]*>([\s\S]*?)<\/f>/)?.[1];
  const value = inner?.match(/<v\b[^>]*>([\s\S]*?)<\/v>/)?.[1];
  const inline = inner?.match(/<t\b[^>]*>([\s\S]*?)<\/t>/)?.[1];
  let raw: string | null = null;
  if (attrs.t === "s" && value != null) raw = strings[Number(value)] ?? "";
  else if (attrs.t === "inlineStr" && inline != null) raw = decodeXml(inline);
  else if (value != null) raw = decodeXml(value);
  return { raw, formula: formula == null ? null : decodeXml(formula) };
}

export function columnIndex(ref: string) {
  const letters = ref.match(/^[A-Z]+/)?.[0] ?? "";
  return letters.split("").reduce((total, char) => total * 26 + char.charCodeAt(0) - 64, 0) - 1;
}
