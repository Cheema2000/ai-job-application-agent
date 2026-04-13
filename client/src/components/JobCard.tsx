import type { Job } from '../App';

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  new:            { label: 'New',          color: '#6c757d' },
  resume_done:    { label: 'Resume Ready', color: '#fd7e14' },
  ready_to_apply: { label: 'Apply Ready',  color: '#28a745' },
};

interface Props {
  job:     Job;
  onClick: () => void;
}

export default function JobCard({ job, onClick }: Props) {
  const status  = STATUS_CONFIG[job.status] ?? { label: job.status, color: '#6c757d' };
  const hasFiles = job.resume_path || job.cover_letter_path;
  // Cap score bar at 20 for visual purposes
  const barPct  = Math.min(100, (job.relevance_score / 20) * 100);

  return (
    <div className="job-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}>

      <div className="job-card-header">
        <div className="job-card-titles">
          <div className="job-card-title">{job.title}</div>
          <div className="job-card-company">{job.company}</div>
        </div>
        <span
          className="job-card-status"
          style={{
            background:   `${status.color}1a`,
            color:        status.color,
            borderColor:  `${status.color}50`,
          }}
        >
          {status.label}
        </span>
      </div>

      <div className="job-card-meta">
        <span>📍 {job.location}</span>
        <span>🗓 {job.date_found}</span>
        {job.source && <span className="job-card-source">{job.source}</span>}
      </div>

      <div className="job-card-footer">
        <div className="relevance-bar">
          <span className="relevance-label">Relevance</span>
          <div className="relevance-track">
            <div className="relevance-fill" style={{ width: `${barPct}%` }} />
          </div>
          <span className="relevance-score">{job.relevance_score}</span>
        </div>
        {hasFiles && <span className="has-files-badge">📄 Preview</span>}
      </div>
    </div>
  );
}
