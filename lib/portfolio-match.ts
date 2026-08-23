import type { PortfolioEntry } from './storage';

export interface PortfolioMatchJob {
  title?: string | null;
  skills?: readonly string[] | null;
  tags?: readonly string[] | null;
}

/** The overlap labels explain why a local project matched; URLs remain untouched data. */
export interface PortfolioMatch extends PortfolioEntry {
  titleOverlap: string[];
  skillOverlap: string[];
  tagOverlap: string[];
}

const ALIASES: Record<string, string> = {
  js: 'javascript',
  javascript: 'javascript',
  ts: 'typescript',
  'type script': 'typescript',
  typescript: 'typescript',
  node: 'nodejs',
  'node js': 'nodejs',
  nodejs: 'nodejs',
  'react js': 'react',
  reactjs: 'react',
  react: 'react',
  'next js': 'nextjs',
  nextjs: 'nextjs',
  'vue js': 'vue',
  vuejs: 'vue',
  vue: 'vue',
  'cloudflare workers': 'cloudflare workers',
  workers: 'cloudflare workers',
};

const STOP_WORDS = new Set(['a', 'an', 'and', 'for', 'in', 'of', 'on', 'the', 'to', 'with', 'developer', 'development', 'project', 'app', 'application']);

function canonical(value: string): string {
  const cleaned = value.normalize('NFKC').toLocaleLowerCase('en-US').replace(/ς/g, 'σ').replace(/\p{M}/gu, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
  return ALIASES[cleaned] ?? cleaned;
}

function tokens(value: string | null | undefined): Set<string> {
  if (!value) return new Set();
  return new Set(value.normalize('NFKC').toLocaleLowerCase('en-US').replace(/ς/g, 'σ').replace(/\p{M}/gu, '').split(/[^\p{L}\p{N}]+/gu).map(canonical).filter((token) => token.length > 1 && !STOP_WORDS.has(token)));
}

function values(value: readonly string[] | null | undefined): Set<string> {
  const result = new Set<string>();
  for (const item of value ?? []) {
    if (typeof item !== 'string') continue;
    const token = canonical(item);
    if (token && !STOP_WORDS.has(token)) result.add(token);
  }
  return result;
}

function overlap(left: Set<string>, right: Set<string>): string[] {
  return [...left].filter((item) => right.has(item)).sort();
}

/**
 * Ranks local portfolio entries against a job without storage, network, or URL access.
 * A match needs at least two meaningful overlap labels; results are capped at three.
 */
export function rankPortfolioMatches(
  entries: readonly PortfolioEntry[] | null | undefined,
  job: PortfolioMatchJob | null | undefined,
): PortfolioMatch[] {
  if (!Array.isArray(entries) || !job || !job.title && !(job.skills?.length) && !(job.tags?.length)) return [];

  const jobTitle = tokens(job.title);
  const jobSkills = values(job.skills);
  const jobTags = values(job.tags);
  return entries
    .map((entry, index) => {
      if (!entry || typeof entry.title !== 'string') return null;
      const titleOverlap = overlap(jobTitle, tokens(entry.title));
      const skillOverlap = overlap(jobSkills, values(entry.skills));
      const tagOverlap = overlap(jobTags, values(entry.tags));
      const strength = titleOverlap.length + skillOverlap.length + tagOverlap.length;
      if (strength < 2) return null;
      return { entry, index, titleOverlap, skillOverlap, tagOverlap, strength };
    })
    .filter((match): match is NonNullable<typeof match> => match !== null)
    .sort((left, right) => right.strength - left.strength || left.index - right.index)
    .slice(0, 3)
    .map(({ entry, titleOverlap, skillOverlap, tagOverlap }) => ({
      ...entry,
      titleOverlap,
      skillOverlap,
      tagOverlap,
      skills: [...entry.skills],
      tags: [...entry.tags],
    }));
}

export const matchPortfolio = rankPortfolioMatches;
