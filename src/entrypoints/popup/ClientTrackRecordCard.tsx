import { Badge } from '@/components/ui/badge';
import {
  formatDate,
  formatMoney,
  formatNumber,
  formatPercent,
  formatRating,
} from '../../lib/format';
import type { JobInsights } from '../../lib/insights';
import { MetricCell } from './PopupComponents';
import { BuildingIcon, CheckCircleIcon, MapPinIcon, StarIcon } from './PopupIcons';

export function ClientTrackRecordCard({ client }: { client: JobInsights['client'] }) {
  const location = [client.city, client.country].filter(Boolean).join(', ') || 'Not available';

  return (
    <section
      className="rounded-xl border border-border bg-card p-3.5 shadow-xs text-card-foreground"
      aria-labelledby="client-heading"
    >
      <div className="mb-3 flex items-center justify-between border-b border-border/60 pb-2">
        <div className="flex items-center gap-1.5">
          <BuildingIcon className="size-3.5 text-muted-foreground" />
          <h2 id="client-heading" className="text-xs font-bold text-foreground">
            Client Track Record
          </h2>
        </div>
        {client.topClient && (
          <Badge
            variant="outline"
            className="border-indigo-500/30 bg-indigo-50/80 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 font-semibold text-[10px]"
          >
            Top Client
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <MetricCell
          label="Payment Status"
          value={
            client.paymentVerified === true ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                <CheckCircleIcon className="size-3.5" />
                <span>Verified</span>
              </span>
            ) : client.paymentVerified === false ? (
              <span className="text-muted-foreground">Unverified</span>
            ) : (
              'Not available'
            )
          }
        />

        <MetricCell
          label="Rating & Reviews"
          value={
            client.rating !== null ? (
              <span className="inline-flex items-center gap-1 font-semibold">
                <StarIcon className="size-3 fill-amber-400 text-amber-500" />
                <span>{formatRating(client.rating)}</span>
              </span>
            ) : (
              'Not available'
            )
          }
          subvalue={
            client.feedbackCount !== null
              ? `(${formatNumber(client.feedbackCount)} reviews)`
              : undefined
          }
        />

        <MetricCell
          label="Total Spend"
          value={formatMoney(client.totalCharges, 'USD')}
          accent={client.totalCharges !== null && client.totalCharges > 0}
        />

        <MetricCell
          label="Hire Rate"
          value={formatPercent(client.hireRate)}
          accent={client.hireRate !== null && client.hireRate >= 50}
          subvalue={
            client.totalJobsWithHires !== null && client.jobsPosted !== null
              ? `${formatNumber(client.totalJobsWithHires)}/${formatNumber(client.jobsPosted)} jobs`
              : undefined
          }
        />

        <MetricCell label="Avg Hourly Paid" value={formatMoney(client.averageHourlyRate, 'USD')} />

        <MetricCell label="Member Since" value={formatDate(client.memberSince)} />

        <div className="col-span-2 flex items-center gap-1.5 pt-1 text-[11px] text-muted-foreground">
          <MapPinIcon className="size-3 text-muted-foreground/80" />
          <span>{location}</span>
        </div>
      </div>
    </section>
  );
}
