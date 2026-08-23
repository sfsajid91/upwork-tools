import { describe, expect, test } from 'bun:test';
import { parseRestrictions, restrictionLabels } from './restrictions';

describe('restrictionLabels', () => {
  test('parses explicit locations, JSS, language, hours, earnings, portfolio, and on-site requirements', () => {
    expect(
      restrictionLabels({
        countries: ['US', { name: 'Canada' }, 'ANY', ''],
        locations: [{ label: 'New York' }],
        minJobSuccessScore: 90,
        prefEnglishSkill: 'FLUENT',
        minOdeskHours: 100,
        earnings: { amount: 1_000, currencyCode: 'USD' },
        shouldHavePortfolio: true,
        onSiteType: 'REQUIRED',
      }),
    ).toEqual([
      'US',
      'Canada',
      'New York',
      '90%+ JSS',
      'English: FLUENT',
      '100+ hours',
      'USD 1000+ earnings',
      'On-site: REQUIRED',
      'Portfolio required',
    ]);
  });

  test('suppresses missing, default, zero, false, and empty values', () => {
    expect(
      parseRestrictions({
        countries: null,
        locations: [],
        minJobSuccessScore: 0,
        minOdeskHours: 0,
        earnings: { amount: 0, currencyCode: 'USD' },
        prefEnglishSkill: ' Any ',
        shouldHavePortfolio: false,
        onSiteType: null,
        readyToStartToday: false,
      }),
    ).toEqual([]);
    expect(parseRestrictions(null)).toEqual([]);
    expect(parseRestrictions({})).toEqual([]);
  });

  test('does not infer restrictions from unrelated or invalid values', () => {
    expect(
      restrictionLabels({
        locationCheckRequired: true,
        localMarket: true,
        risingTalent: true,
        minJobSuccessScore: 101,
        minOdeskHours: Number.NaN,
        earnings: { value: -10, currencyCode: 'USD' },
        shouldHavePortfolio: 'true',
        onSiteType: true,
      }),
    ).toEqual([]);
  });

  test('deduplicates repeated location labels while preserving source order', () => {
    expect(
      restrictionLabels({ countries: ['US', 'US'], states: [{ state: 'CA' }, { state: 'CA' }] }),
    ).toEqual(['US', 'CA']);
  });
});
