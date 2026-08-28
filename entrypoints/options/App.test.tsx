import { describe, expect, test } from 'bun:test';
import { renderToString } from 'react-dom/server';
import OptionsApp, {
  adjustEditingIndex,
  isHttpPortfolioUrl,
  isOptionsPortfolioEntry,
  isOptionsProfile,
  parseHourlyRate,
  splitList,
  validatePortfolioDraft,
} from './App';

describe('options surface', () => {
  test('renders accessible profile and portfolio forms', () => {
    const html = renderToString(<OptionsApp />);
    const addEntryButton = html.match(/<button[^>]*>\s*Add entry\s*<\/button>/)?.[0] ?? '';
    expect(addEntryButton.includes('disabled')).toBe(true);
    const profileSaveButton = html.match(/<button[^>]*>\s*Save profile\s*<\/button>/)?.[0] ?? '';
    expect(profileSaveButton.includes('disabled')).toBe(true);
    const portfolioTitleInput = html.match(/<input[^>]*id="portfolio-title"[^>]*>/)?.[0] ?? '';
    expect(portfolioTitleInput.includes('disabled')).toBe(true);
    expect(html.includes('Your profile')).toBe(true);
    expect(html.includes('for="profile-skills"')).toBe(true);
    expect(html.includes('Fallback hourly rate')).toBe(true);
    expect(html.includes('Portfolio')).toBe(true);
    expect(html.includes('Watchlist')).toBe(true);
    expect(html.includes('No saved jobs yet.')).toBe(true);
    expect(html.includes('for="portfolio-url"')).toBe(true);
  });

  test('normalizes list fields and rejects invalid fallback values and URLs', () => {
    expect(splitList('React, TypeScript\nReact')).toEqual(['React', 'TypeScript']);
    expect(parseHourlyRate('')).toBeNull();
    expect(parseHourlyRate('0')).toBe(0);
    expect(Number.isNaN(parseHourlyRate('-1'))).toBe(true);
    expect(
      validatePortfolioDraft({ title: '', skills: '', tags: '', url: '' })?.includes('title'),
    ).toBe(true);
    expect(
      validatePortfolioDraft({
        title: 'Project',
        skills: '',
        tags: '',
        url: 'javascript:alert(1)',
      })?.includes('http'),
    ).toBe(true);
    expect(
      validatePortfolioDraft({
        title: 'Project',
        skills: '',
        tags: '',
        url: 'https://example.test/project',
      }),
    ).toBeNull();
    expect(adjustEditingIndex(null, 0)).toBeNull();
    expect(adjustEditingIndex(2, 1)).toBe(1);
    expect(adjustEditingIndex(1, 2)).toBe(1);
    expect(adjustEditingIndex(2, 2)).toBeNull();
    expect(isOptionsProfile({ hourlyRate: null, skills: [], preferences: {} })).toBe(true);
    expect(isOptionsProfile({ hourlyRate: 0, skills: [], preferences: {} })).toBe(true);
    expect(isOptionsProfile({ hourlyRate: -1, skills: [], preferences: {} })).toBe(false);
    expect(isHttpPortfolioUrl(null)).toBe(true);
    expect(isHttpPortfolioUrl('javascript:alert(1)')).toBe(false);
    expect(
      isOptionsPortfolioEntry({
        title: 'Project',
        skills: [],
        tags: [],
        url: 'ftp://example.test',
      }),
    ).toBe(false);
    expect(isOptionsPortfolioEntry({ title: ' ', skills: [], tags: [], url: null })).toBe(false);
    expect(isOptionsPortfolioEntry({ title: 'Project', skills: [''], tags: [], url: null })).toBe(
      false,
    );
    expect(
      isOptionsPortfolioEntry({
        title: 'Project',
        skills: [],
        tags: [],
        url: 'https://example.test',
      }),
    ).toBe(true);
  });
});
