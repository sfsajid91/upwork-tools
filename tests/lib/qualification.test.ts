import { describe, expect, test } from 'bun:test';
import {
  deriveQualificationSummary,
  normalizeQualificationMatches,
  parseQualificationMatches,
  summarizeQualificationMatches,
} from '../../src/lib/qualification';

const match = (overrides: Record<string, unknown> = {}) => ({
  qualification: 'EnglishLevel',
  clientPreferred: '3',
  clientPreferredLabel: 'Fluent',
  freelancerValue: '3',
  freelancerValueLabel: 'Fluent',
  qualified: true,
  ...overrides,
});

describe('qualification details', () => {
  test('keeps meaningful matched and unmatched details and summarizes them', () => {
    const payload = {
      data: {
        jobAuthDetails: {
          currentUserInfo: {
            freelancerInfo: {
              qualificationsMatches: {
                matches: [
                  match(),
                  match({
                    qualification: 'MinimumJobSuccessScore',
                    clientPreferred: '90',
                    clientPreferredLabel: 'At least 90%',
                    freelancerValue: '70',
                    freelancerValueLabel: '70%',
                    qualified: false,
                  }),
                  {
                    qualification: 'Portfolio',
                    clientPreferred: 'true',
                    clientPreferredLabel: 'Portfolio required',
                    qualified: false,
                  },
                ],
              },
            },
          },
        },
      },
    };

    expect(parseQualificationMatches(payload)).toEqual([
      {
        requirementName: 'EnglishLevel',
        clientLabel: 'Fluent',
        freelancerValue: '3',
        freelancerLabel: 'Fluent',
        matched: true,
      },
      {
        requirementName: 'MinimumJobSuccessScore',
        clientLabel: 'At least 90%',
        freelancerValue: '70',
        freelancerLabel: '70%',
        matched: false,
      },
      {
        requirementName: 'Portfolio',
        clientLabel: 'Portfolio required',
        freelancerValue: null,
        freelancerLabel: null,
        matched: false,
      },
    ]);
    expect(summarizeQualificationMatches(payload)).toEqual({
      matched: 1,
      total: 3,
      details: parseQualificationMatches(payload),
    });
  });

  test('suppresses Any, empty, JSS zero, and false/default records', () => {
    const records = [
      match({ clientPreferred: 'ANY', clientPreferredLabel: 'Any' }),
      match({ qualification: '', clientPreferredLabel: 'Fluent' }),
      match({
        qualification: 'MinimumJobSuccessScore',
        clientPreferred: '0',
        clientPreferredLabel: 'At least 0%',
      }),
      match({
        qualification: 'Portfolio',
        clientPreferred: false,
        clientPreferredLabel: 'No preference',
        qualified: false,
      }),
      match({
        qualification: 'Language',
        clientPreferred: 'en',
        clientPreferredLabel: '',
        freelancerValue: 'en',
        freelancerValueLabel: 'English',
      }),
    ];

    expect(normalizeQualificationMatches(records)).toEqual([]);
    expect(deriveQualificationSummary(records)).toEqual({ matched: 0, total: 0, details: [] });
  });

  test('preserves a meaningful zero instead of treating every zero as a default', () => {
    const records = [
      match({
        qualification: 'ExperienceYears',
        clientPreferred: '0',
        clientPreferredLabel: '0 years',
        freelancerValue: '0',
        freelancerValueLabel: '0 years',
      }),
      match({
        qualification: 'MinimumJobSuccessScore',
        clientPreferred: '0',
        clientPreferredLabel: 'At least 0%',
      }),
      match({
        qualification: 'HoursBilled',
        clientPreferred: '0',
        clientPreferredLabel: 'At least 0 hours',
        freelancerValue: '0',
        freelancerValueLabel: '0',
      }),
      match({
        qualification: 'Earnings',
        clientPreferred: '0',
        clientPreferredLabel: '0',
        freelancerValue: '0',
        freelancerValueLabel: '0',
      }),
    ];

    expect(parseQualificationMatches(records)).toEqual([
      {
        requirementName: 'ExperienceYears',
        clientLabel: '0 years',
        freelancerValue: '0',
        freelancerLabel: '0 years',
        matched: true,
      },
    ]);
  });
  test('suppresses trailing-plus default zero values but keeps near misses', () => {
    const defaults = [
      match({
        qualification: 'MinimumJobSuccessScore',
        clientPreferred: '0',
        clientPreferredLabel: '0%+',
      }),
      match({
        qualification: 'HoursBilled',
        clientPreferred: '0',
        clientPreferredLabel: '0+ hours',
      }),
      match({
        qualification: 'ExperienceYears',
        clientPreferred: '0',
        clientPreferredLabel: '0+ years',
      }),
      match({
        qualification: 'MinimumJobSuccessScore',
        clientPreferred: '0',
        clientPreferredLabel: 'At least 0.0%+',
      }),
    ];
    expect(parseQualificationMatches(defaults)).toHaveLength(1);
    expect(parseQualificationMatches(defaults)[0]?.requirementName).toBe('ExperienceYears');

    const nearMisses = [
      match({
        qualification: 'MinimumJobSuccessScore',
        clientPreferred: '10',
        clientPreferredLabel: '10%+',
      }),
      match({
        qualification: 'HoursBilled',
        clientPreferred: '0.5',
        clientPreferredLabel: '0.5%+',
      }),
      match({
        qualification: 'HoursBilled',
        clientPreferred: '100',
        clientPreferredLabel: '100+ hours',
      }),
    ];
    expect(parseQualificationMatches(nearMisses)).toHaveLength(3);
  });
});
