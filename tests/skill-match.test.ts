import { describe, expect, test } from 'bun:test';
import { matchSkills } from '../lib/skill-match';

describe('skill matching', () => {
  test('matches aliases and punctuation across profile and job labels', () => {
    expect(
      matchSkills({
        profileSkills: ['JavaScript', 'React.js'],
        ontologySkills: ['javascript', 'React JS'],
        additionalSkills: ['TypeScript'],
      }),
    ).toEqual({ matched: 2, total: 3, matchedSkills: ['javascript', 'React JS'] });
  });

  test('compares ontology and additional skills together and deduplicates them', () => {
    expect(
      matchSkills({
        profileSkills: ['TypeScript', 'Python'],
        ontologySkills: ['TypeScript', 'Type-Script'],
        additionalSkills: ['Python', 'python', 'Cloudflare'],
      }),
    ).toEqual({ matched: 2, total: 3, matchedSkills: ['TypeScript', 'Python'] });
  });
  test('does not conflate symbolic languages with plain C', () => {
    expect(
      matchSkills({ profileSkills: ['C++'], ontologySkills: ['C'], additionalSkills: [] }),
    ).toEqual({ matched: 0, total: 1, matchedSkills: [] });
    expect(
      matchSkills({ profileSkills: ['c#'], ontologySkills: ['C#'], additionalSkills: [] }),
    ).toEqual({ matched: 1, total: 1, matchedSkills: ['C#'] });
  });

  test('returns unavailable for null or empty profiles', () => {
    const job = { ontologySkills: ['TypeScript'], additionalSkills: [] };
    expect(matchSkills({ profileSkills: null, ...job })).toBeNull();
    expect(matchSkills({ profileSkills: [], ...job })).toBeNull();
    expect(matchSkills({ profileSkills: ['  '], ...job })).toBeNull();
  });

  test('does not invent a zero score when the job has no skills', () => {
    expect(
      matchSkills({ profileSkills: ['TypeScript'], ontologySkills: [], additionalSkills: [] }),
    ).toEqual({ matched: 0, total: 0, matchedSkills: [] });
  });
});
