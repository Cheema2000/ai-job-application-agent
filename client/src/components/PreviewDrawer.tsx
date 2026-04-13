import { useEffect, useState } from 'react';
import type { Job } from '../App';

interface Props {
  job:     Job;
  onClose: () => void;
}

async function fetchText(relPath: string | null): Promise<string> {
  if (!relPath) return '';
  try {
    const r = await fetch(`/files/${relPath}`);
    if (!r.ok) return `[Could not load file — ${r.status} ${r.statusText}]`;
    return r.text();
  } catch {
    return '[Network error loading file]';
  }
}

const STATUS_META: Record<string, { label: string; color: string }> = {
  new:            { label: '● New',          color: '#6c757d' },
  resume_done:    { label: '● Resume Ready', color: '#fd7e14' },
  ready_to_apply: { label: '● Apply Ready',  color: '#28a745' },
};

export default function PreviewDrawer({ job, onClose }: Props) {
  const [resume,      setResume]      = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading,     setLoading]     = useState(true);

  // Fetch file contents whenever job changes
  useEffect(() => {
    setLoading(true);
    setResume('');
    setCoverLetter('');
    Promise.all([
      fetchText(job.resume_path),
      fetchText(job.cover_letter_path),
    ]).then(([r, c]) => {
      setResume(r);
      setCoverLetter(c);
      setLoading(false);
    });
  }, [job.job_id]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const statusMeta = STATUS_META[job.status] ?? { label: `● ${job.status}`, color: '#6c757d' };

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />

      <div className="drawer" role="dialog" aria-modal="true">
        {/* Header */}
        <div className="drawer-header">
          <button className="drawer-close" onClick={onClose} aria-label="Close preview">✕</button>

          <div className="drawer-job-info">
            <span className="drawer-title">{job.title}</span>
            <span className="drawer-sep">@</span>
            <span className="drawer-company">{job.company}</span>
            <span className="drawer-location">📍 {job.location}</span>
          </div>

          <div className="drawer-header-right">
            <span className="drawer-status" style={{ color: statusMeta.color }}>
              {statusMeta.label}
            </span>
            {job.job_url && (
              <a
                className="drawer-apply-btn"
                href={job.job_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Apply Now →
              </a>
            )}
          </div>
        </div>

        {/* Body: side-by-side panes */}
        <div className="drawer-body">
          {loading ? (
            <div className="drawer-loading">
              <span className="drawer-loading-spinner" />
              Loading files…
            </div>
          ) : (
            <>
              <PreviewPane title="📄 Resume"       content={resume}      empty="No resume generated yet." />
              <div className="preview-divider" />
              <PreviewPane title="✉️ Cover Letter" content={coverLetter} empty="No cover letter generated yet." />
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ── Sub-component ─────────────────────────────────────────────────────────────

function PreviewPane({ title, content, empty }: { title: string; content: string; empty: string }) {
  return (
    <div className="preview-pane">
      <div className="preview-pane-title">{title}</div>
      <pre className="preview-content">
        {content || <span className="preview-empty">{empty}</span>}
      </pre>
    </div>
  );
}
