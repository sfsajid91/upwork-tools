import { describe, expect, test } from 'bun:test';
import { normalizeSkillName, normalizeSkills } from '../../src/lib/skills';

describe('skill normalization', () => {
  test('normalizes case, whitespace, punctuation, and explicit aliases', () => {
    expect(normalizeSkillName('  JAVASCRIPT  ')).toBe('JavaScript');
    expect(normalizeSkillName('type-script')).toBe('TypeScript');
    expect(normalizeSkillName('React.js')).toBe('React');
  });
  test('preserves symbolic skill names', () => {
    expect(normalizeSkillName(' C++ ')).toBe('C++');
    expect(normalizeSkillName('c#')).toBe('C#');
    expect(normalizeSkillName(' .NET ')).toBe('.NET');
    expect(normalizeSkillName('NODE.JS')).toBe('Node.js');
    expect(normalizeSkillName('vue.js')).toBe('Vue.js');
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
  test('keeps C, C++, and C# distinct while deduplicating variants', () => {
    expect(normalizeSkills(['C', 'C++', 'c++', 'C#', 'c#'])).toEqual([
      { name: 'c', sourceLabels: ['C'] },
      { name: 'C++', sourceLabels: ['C++', 'c++'] },
      { name: 'C#', sourceLabels: ['C#', 'c#'] },
    ]);
  });

  test('omits blank and non-string runtime values', () => {
    expect(normalizeSkills(['  ', '', 'Python', null as unknown as string])).toEqual([
      { name: 'python', sourceLabels: ['Python'] },
    ]);
  });
});
