import { describe, expect, test } from 'bun:test';
import { isJobPage, jobIdFromPageUrl, normalizeJobId } from './job-page';

describe('job page identity', () => {
  test('extracts and normalizes detail route IDs', () => {
    expect(
      jobIdFromPageUrl(
        'https://www.upwork.com/nx/find-work/best-matches/details/~022091692980112360430?pageTitle=Job%20Details',
      ),
    ).toBe('022091692980112360430');
    expect(jobIdFromPageUrl('https://www.upwork.com/nx/jobs/details/~job-2')).toBe('job-2');
    expect(jobIdFromPageUrl('https://www.upwork.com/ab/jobs/~job-1#details')).toBe('job-1');
    expect(normalizeJobId('  ~022  ')).toBe('022');
    expect(normalizeJobId('0007')).toBe('0007');
  });
  test('extracts IDs from SEO and apply routes', () => {
    expect(jobIdFromPageUrl('https://www.upwork.com/jobs/Title_~0193eabc')).toBe('0193eabc');
    expect(jobIdFromPageUrl('https://www.upwork.com/jobs/Title_~0193eabc?source=search#top')).toBe(
      '0193eabc',
    );
    expect(jobIdFromPageUrl('https://www.upwork.com/freelance-jobs/apply/Title_~0193eabc/')).toBe(
      '0193eabc',
    );
    expect(normalizeJobId('Title_With_Underscores_~0193eabc')).toBe('0193eabc');
    expect(normalizeJobId('Title_~')).toBeNull();
  });

  test('rejects non-job and malformed routes', () => {
    expect(jobIdFromPageUrl('https://example.com/details/job-1')).toBeNull();
    expect(jobIdFromPageUrl('https://www.upwork.com/nx/find-work/best-matches')).toBeNull();
    expect(jobIdFromPageUrl('https://www.upwork.com/details/')).toBeNull();
    expect(jobIdFromPageUrl('not a url')).toBeNull();
    expect(isJobPage('https://www.upwork.com/jobs/~job-1')).toBe(true);
    expect(isJobPage('https://www.upwork.com/jobs/')).toBe(false);
  });
});
