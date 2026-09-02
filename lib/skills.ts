export interface NormalizedSkill {
  /** Canonical comparison/display name. */
  name: string;
  /** Labels exactly as supplied by each source. */
  sourceLabels: string[];
}

const ALIASES: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  reactjs: 'React',
};
const SYMBOLIC_ALIASES: Record<string, string> = {
  'c++': 'C++',
  'c#': 'C#',
  '.net': '.NET',
  'node.js': 'Node.js',
  'vue.js': 'Vue.js',
};

/**
 * Produces the stable key used for explicit aliases and unknown labels.
 * Punctuation is a separator, rather than a fuzzy-match signal.
 */
function skillKey(label: string): string {
  return label
    .normalize('NFKC')
    .toLocaleLowerCase('en-US')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

/** Normalizes one label without guessing at unknown skill names. */
export function normalizeSkillName(label: string): string {
  if (typeof label !== 'string') return '';
  const normalizedLabel = label.normalize('NFKC').trim();
  if (!normalizedLabel) return '';
  const exact = SYMBOLIC_ALIASES[normalizedLabel.toLocaleLowerCase('en-US')];
  if (exact) return exact;
  const key = skillKey(normalizedLabel);
  return ALIASES[key.replace(/\s/g, '')] ?? key;
}

/**
 * Normalizes labels in source order, merging only exact normalized names.
 * The first occurrence determines output order and each source label is kept
 * once in its original form for display or provenance.
 */
export function normalizeSkills(labels: readonly string[] | null | undefined): NormalizedSkill[] {
  if (!Array.isArray(labels)) return [];

  const normalized = new Map<string, NormalizedSkill>();
  for (const sourceLabel of labels) {
    if (typeof sourceLabel !== 'string' || sourceLabel.trim() === '') continue;
    const name = normalizeSkillName(sourceLabel);
    if (!name) continue;

    const existing = normalized.get(name);
    if (existing) {
      if (!existing.sourceLabels.includes(sourceLabel)) existing.sourceLabels.push(sourceLabel);
      continue;
    }
    normalized.set(name, { name, sourceLabels: [sourceLabel] });
  }
  return [...normalized.values()];
}
