import { deriveApplicantMetrics } from '../lib/applicant-metrics';
import { aggregateConversionStats } from '../lib/conversion';
import {
  enforceHistoryRetention,
  listApplications,
  listJobSnapshots,
  openDatabase,
} from '../lib/database';
import { summarizeJobSnapshots } from '../lib/history';
import type { JobInsights } from '../lib/insights';
import { deriveClientPayProfile } from '../lib/pay-profile';
import type { JobHistoryResponse } from '../lib/protocol';
import { normalizeJobId } from '../lib/job-page';
import { calculateProposalVelocity } from '../lib/velocity';

export interface BackgroundHistoryState {
  generation: number;
  removed: boolean;
}

export interface BackgroundHistoryDependencies {
  getTabState: (tabId: number) => BackgroundHistoryState;
  currentTabJobId: (tabId: number) => Promise<string | null>;
  readVerifiedSession: (tabId: number, currentJobId: string) => Promise<JobInsights | null>;
}

export function createJobHistoryReader({
  getTabState,
  currentTabJobId,
  readVerifiedSession,
}: BackgroundHistoryDependencies) {
  return async function readJobHistory(
    tabId: number,
    jobId: string,
  ): Promise<JobHistoryResponse | null> {
    const state = getTabState(tabId);
    const generation = state.generation;
    try {
      const normalizedJobId = normalizeJobId(jobId);
      if (!normalizedJobId || (await currentTabJobId(tabId)) !== normalizedJobId) return null;
      await enforceHistoryRetention();
      const database = await openDatabase();
      if (!database) return null;
      const snapshots = await listJobSnapshots(normalizedJobId);
      const summary = summarizeJobSnapshots(snapshots, normalizedJobId);
      const insights = await readVerifiedSession(tabId, normalizedJobId);
      const payProfile = deriveClientPayProfile({
        client: insights?.client,
        history: insights?.history.recentJobs,
      });
      const conversion = aggregateConversionStats(await listApplications());
      if (state.removed || state.generation !== generation) return null;
      if (!summary) {
        return {
          jobId: normalizedJobId,
          captures: [],
          summary: null,
          velocity: null,
          payProfile,
          conversion,
        };
      }
      const metrics = deriveApplicantMetrics(summary.snapshots);
      const firstSeenApplicants =
        typeof summary.firstSeen?.applicants === 'number' &&
        Number.isFinite(summary.firstSeen.applicants) &&
        summary.firstSeen.applicants >= 0
          ? summary.firstSeen.applicants
          : null;
      return {
        jobId: normalizedJobId,
        captures: summary.snapshots.map(({ capturedAt, applicants }) => ({
          capturedAt,
          applicants,
        })),
        summary: {
          snapshotCount: summary.snapshots.length,
          latestApplicants: metrics.latestApplicantCount,
          firstSeenApplicants,
          firstSeenDelta: metrics.firstSeenDelta,
          recentDelta: metrics.recentDelta,
        },
        velocity: calculateProposalVelocity(
          summary.velocityBaseline?.applicants,
          summary.latest?.applicants,
          summary.velocityBaseline?.capturedAt,
          summary.latest?.capturedAt,
        ),
        payProfile,
        conversion,
      };
    } catch {
      return null;
    }
  };
}
