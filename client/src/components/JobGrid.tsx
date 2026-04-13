import { useMemo, useState } from 'react';
import type { Job } from '../App';
import JobCard from './JobCard';

interface Props {
  jobs:     Job[];
  onSelect: (job: Job) => void;
}

type StatusFilter = 'all' | 'new' | 'resume_done' | 'ready_to_apply';

const FILTER_LABELS: Record<StatusFilter, string> = {
  all:            'All',
  new:            'New',
  resume_done:    'Resume Ready',
  ready_to_apply: 'Apply Ready',
};

export default function JobGrid({ jobs, onSelect }: Props) {
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const counts = useMemo(() => ({
    all:            jobs.length,
    new:            jobs.filter(j => j.status === 'new').length,
    resume_done:    jobs.filter(j => j.status === 'resume_done').length,
    ready_to_apply: jobs.filter(j => j.status === 'ready_to_apply').length,
  }), [jobs]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return jobs.filter(j => {
      const matchSearch =
        !q ||
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q);
      const matchStatus =
        statusFilter === 'all' || j.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [jobs, search, statusFilter]);

  return (
    <div className="job-grid-container">
      {/* Toolbar */}
      <div className="job-grid-toolbar">
        <input
          className="job-search"
          type="search"
          placeholder="Search title, company, location…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="status-filters">
          {(Object.keys(FILTER_LABELS) as StatusFilter[]).map(key => (
            <button
              key={key}
              className={`filter-btn filter-${key} ${statusFilter === key ? 'active' : ''}`}
              onClick={() => setStatusFilter(key)}
            >
              {FILTER_LABELS[key]}
              <span className="filter-count">{counts[key]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid or empty state */}
      {filtered.length === 0 ? (
        <div className="job-grid-empty">
          {jobs.length === 0
            ? "No jobs yet — trigger a run to scrape today's listings."
            : 'No jobs match your filters.'}
        </div>
      ) : (
        <div className="job-grid">
          {filtered.map(job => (
            <JobCard key={job.job_id} job={job} onClick={() => onSelect(job)} />
          ))}
        </div>
      )}
    </div>
  );
}
