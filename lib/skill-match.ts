import { normalizeSkills } from './skills';

export interface SkillMatchInput {
  profileSkills: string[] | null;
  ontologySkills: string[];
  additionalSkills: string[];
}

export interface SkillMatchSummary {
  matched: number;
  total: number;
  matchedSkills: string[];
}

/** Compares a profile against the unique normalized skills on a job. */
export function matchSkills(input: SkillMatchInput): SkillMatchSummary | null {
  const profile = normalizeSkills(input.profileSkills);
  if (profile.length === 0) return null;

  const job = normalizeSkills([...input.ontologySkills, ...input.additionalSkills]);
  const profileNames = new Set(profile.map((skill) => skill.name));
  const matched = job.filter((skill) => profileNames.has(skill.name));

  return {
    matched: matched.length,
    total: job.length,
    matchedSkills: matched.map((skill) => skill.sourceLabels[0]),
  };
}
