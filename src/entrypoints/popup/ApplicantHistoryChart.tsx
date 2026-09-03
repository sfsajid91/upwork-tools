import { formatNumber, formatRelativeCaptureTime } from '../../lib/format';
import type { JobHistoryCapture } from '../../lib/protocol';

export function ApplicantHistoryChart({ captures }: { captures: JobHistoryCapture[] }) {
  const points = captures.flatMap((capture) =>
    capture.applicants === null ? [] : [{ capture, applicants: capture.applicants }],
  );
  const chartWidth = 320;
  const chartHeight = 104;
  const padding = 14;
  const baselineY = chartHeight - padding;
  const maxApplicants = Math.max(...points.map((point) => point.applicants), 0);
  const minApplicants = Math.min(...points.map((point) => point.applicants), maxApplicants);
  const applicantRange = maxApplicants - minApplicants;
  const xFor = (index: number) =>
    points.length === 1
      ? chartWidth / 2
      : padding + (index / (points.length - 1)) * (chartWidth - padding * 2);
  const yFor = (applicants: number) =>
    applicantRange === 0
      ? chartHeight / 2
      : padding + ((maxApplicants - applicants) / applicantRange) * (baselineY - padding);
  const path = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${xFor(index)} ${yFor(point.applicants)}`)
    .join(' ');
  const areaPath =
    points.length > 1
      ? `${path} L ${xFor(points.length - 1)} ${baselineY} L ${xFor(0)} ${baselineY} Z`
      : '';
  const firstPoint = points[0] ?? null;
  const latestPoint = points.at(-1) ?? null;
  return (
    <div className="mt-3">
      {points.length === 0 ? (
        <p className="py-5 text-center text-[11px] text-slate-500 dark:text-slate-400">
          Applicant counts are not available for these captures.
        </p>
      ) : (
        <>
          <svg
            className="h-24 w-full overflow-visible text-emerald-500 dark:text-emerald-400"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            role="img"
            aria-label={`Proposal count progression across ${points.length} captures`}
          >
            <title>Proposal count progression across captures</title>
            <desc>
              Each point shows the captured proposal count and change from the prior point.
            </desc>
            <defs>
              <linearGradient id="applicant-history-area" x1="0" x2="0" y1="0" y2="1">
                <stop
                  className="stop-emerald-500 dark:stop-emerald-400"
                  offset="0%"
                  stopOpacity="0.18"
                />
                <stop
                  className="stop-emerald-500 dark:stop-emerald-400"
                  offset="100%"
                  stopOpacity="0.01"
                />
              </linearGradient>
            </defs>
            <line
              x1={padding}
              x2={chartWidth - padding}
              y1={baselineY}
              y2={baselineY}
              className="stroke-slate-200 dark:stroke-slate-700"
              strokeWidth="1"
            />
            {areaPath && <path d={areaPath} fill="url(#applicant-history-area)" stroke="none" />}
            {points.length > 1 && (
              <path
                d={path}
                fill="none"
                className="stroke-current"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            )}
            {points.map((point, index) => {
              const previousApplicants = points[index - 1]?.applicants ?? point.applicants;
              const delta = index === 0 ? 0 : point.applicants - previousApplicants;
              const deltaLabel = delta > 0 ? `+${formatNumber(delta)}` : formatNumber(delta);
              return (
                <g key={`${point.capture.capturedAt}-${point.applicants}`}>
                  {index === points.length - 1 && (
                    <circle
                      cx={xFor(index)}
                      cy={yFor(point.applicants)}
                      r="7"
                      className="fill-none stroke-emerald-500/30 dark:stroke-emerald-400/40"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                    />
                  )}
                  <circle
                    cx={xFor(index)}
                    cy={yFor(point.applicants)}
                    r="3.5"
                    className="fill-white stroke-current dark:fill-slate-900"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  >
                    <title>
                      {`Capture ${formatRelativeCaptureTime(point.capture.capturedAt)}: ${formatNumber(point.applicants)} proposals (${deltaLabel})`}
                    </title>
                  </circle>
                </g>
              );
            })}
          </svg>
          {firstPoint && latestPoint && (
            <div className="mt-0.5 flex items-center justify-between gap-3 text-[10px] text-slate-500 dark:text-slate-400">
              <span>
                {formatNumber(firstPoint.applicants)} proposals ·{' '}
                {formatRelativeCaptureTime(firstPoint.capture.capturedAt)}
              </span>
              <span className="text-right">
                {formatNumber(latestPoint.applicants)} proposals ·{' '}
                {formatRelativeCaptureTime(latestPoint.capture.capturedAt)}
              </span>
            </div>
          )}
          <p className="mt-1 text-[10.5px] text-slate-400 dark:text-slate-500">
            Hover over points to view capture details
          </p>
          {captures.length === 1 && (
            <p className="text-[10px] text-slate-500 dark:text-slate-400">First capture recorded</p>
          )}
        </>
      )}
    </div>
  );
}
