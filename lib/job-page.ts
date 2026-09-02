export function normalizeJobId(value: string | null | undefined): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const seoIndex = trimmed.lastIndexOf('_~');
  if (seoIndex !== -1) {
    const suffix = trimmed.slice(seoIndex + 2).trim();
    return suffix.startsWith('~') ? suffix.slice(1).trim() || null : suffix || null;
  }
  return trimmed.startsWith('~') ? trimmed.slice(1).trim() || null : trimmed;
}

export function jobIdFromPageUrl(url: string | undefined): string | null {
  if (typeof url !== 'string' || url.trim() === '') return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'upwork.com' && !parsed.hostname.endsWith('.upwork.com')) return null;
    const detailMatch = parsed.pathname.match(/(?:^|\/)details\/([^/]+)/);
    if (detailMatch) return normalizeJobId(detailMatch[1]);
    const applyMatch = parsed.pathname.match(/(?:^|\/)freelance-jobs\/apply\/([^/]+)/);
    if (applyMatch) return normalizeJobId(applyMatch[1]);
    const jobsMatch = parsed.pathname.match(/(?:^|\/)jobs\/([^/]+)/);
    return normalizeJobId(jobsMatch?.[1]);
  } catch {
    return null;
  }
}

export function isJobPage(url: string | undefined): boolean {
  return jobIdFromPageUrl(url) !== null;
}
