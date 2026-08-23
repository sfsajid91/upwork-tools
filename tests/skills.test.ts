import { describe, expect, test } from 'bun:test';
import { normalizeSkillName, normalizeSkills } from '../lib/skills';

describe('skill normalization', () => {
  test('normalizes case, whitespace, punctuation, and explicit aliases', () => {
    expect(normalizeSkillName('  JAVASCRIPT  ')).toBe('JavaScript');
    expect(normalizeSkillName('type-script')).toBe('TypeScript');
    expect(normalizeSkillName('React.js')).toBe('React');
  });

  test('keeps unknown labels explainable without fuzzy matching', () => {
    expect(normalizeSkillName('  Data / Visualization  ')).toBe('data visualization');
    expect(normalizeSkillName('Data Visualisation')).toBe('data visualisation');
    expect(normalizeSkillName('')).toBe('');
  });

  test('deduplicates normalized names in first-seen order and preserves sources', () => {
    expect(
      normalizeSkills(['JavaScript', ' javascript ', 'REACT JS', 'React.js', 'TypeScript']),
    ).toEqual([
      { name: 'JavaScript', sourceLabels: ['JavaScript', ' javascript '] },
      { name: 'React', sourceLabels: ['REACT JS', 'React.js'] },
      { name: 'TypeScript', sourceLabels: ['TypeScript'] },
    ]);
  });

  test('omits blank and non-string runtime values', () => {
    expect(normalizeSkills(['  ', '', 'Python', null as unknown as string])).toEqual([
      { name: 'python', sourceLabels: ['Python'] },
    ]);
  });
});
