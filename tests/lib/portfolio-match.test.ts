import { describe, expect, test } from 'bun:test';
import { rankPortfolioMatches } from '../../src/lib/portfolio-match';
import type { PortfolioEntry } from '../../src/lib/storage';

const entry = (title: string, skills: string[] = [], tags: string[] = []): PortfolioEntry => ({
  title,
  skills,
  tags,
  url: 'https://example.test/opaque',
});

describe('portfolio ranking', () => {
  test('returns strong title, skill, and tag overlap with visible labels', () => {
    const result = rankPortfolioMatches(
      [entry('Cloudflare API dashboard', ['TypeScript'], ['Workers', 'API'])],
      { title: 'Cloudflare API integration', skills: ['TS'], tags: ['API'] },
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      titleOverlap: ['api', 'cloudflare'],
      skillOverlap: ['typescript'],
      tagOverlap: ['api'],
    });
  });

  test('rejects weak matches and empty job/profile input', () => {
    expect(
      rankPortfolioMatches([entry('Unrelated site', ['Python'], ['blog'])], {
        title: 'Cloudflare API',
        skills: ['TypeScript'],
      }),
    ).toEqual([]);
    expect(rankPortfolioMatches([], { title: 'Cloudflare API' })).toEqual([]);
    expect(rankPortfolioMatches([entry('Cloudflare API')], null)).toEqual([]);
    expect(rankPortfolioMatches([entry('Cloudflare API')], {})).toEqual([]);
  });

  test('normalizes aliases, repeated whitespace, and locale-sensitive letters consistently', () => {
    const result = rankPortfolioMatches(
      [entry('İŞ React   app', ['  JavaScript   '], ['Node.js'])],
      { title: 'İŞ react app', skills: ['JS'], tags: ['Node'] },
    );
    expect(result).toHaveLength(1);
    expect(result[0]?.titleOverlap).toEqual(['iş', 'react']);
    expect(result[0]?.skillOverlap).toEqual(['javascript']);
    expect(result[0]?.tagOverlap).toEqual(['nodejs']);
    const typeScript = rankPortfolioMatches([entry('API', ['Type Script'])], {
      title: 'API',
      skills: ['TS'],
    });
    expect(typeScript[0]?.skillOverlap).toEqual(['typescript']);
  });

  test('preserves symbolic skill names during matching', () => {
    for (const skill of ['C++', 'C#', '.NET', 'Node.js']) {
      const result = rankPortfolioMatches([entry('API project', [skill])], {
        title: 'API project',
        skills: [skill],
      });

      expect(result).toHaveLength(1);
      expect(result[0]?.skillOverlap).toEqual([
        skill === 'Node.js' ? 'nodejs' : skill.toLocaleLowerCase('en-US'),
      ]);
    }
  });
  test('matches portfolio tags against job title and skills', () => {
    const result = rankPortfolioMatches([entry('API case study', [], ['GraphQL', 'TypeScript'])], {
      title: 'Dashboard build',
      skills: ['GraphQL', 'TypeScript'],
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.tagOverlap).toEqual(['graphql', 'typescript']);
  });

  test('orders deterministic ties by original entry order and caps at three', () => {
    const entries = [1, 2, 3, 4].map((number) => entry(`API ${number}`, ['TypeScript']));
    const result = rankPortfolioMatches(entries, { title: 'API', skills: ['TS'] });
    expect(result).toHaveLength(3);
    expect(result.map(({ title }) => title)).toEqual(['API 1', 'API 2', 'API 3']);
  });
});
