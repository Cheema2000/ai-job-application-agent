import { useEffect, useRef, useState } from 'react';
import RunFeed from './components/RunFeed';
import JobGrid from './components/JobGrid';
import PreviewDrawer from './components/PreviewDrawer';

// ── Shared types ─────────────────────────────────────────────────────────────

export interface Job {
  job_id:           string;
  title:            string;
  company:          string;
  location:         string;
  job_url:          string;
  date_posted:      string;
  date_found:       string;
  source:           string;
  relevance_score:  number;
  status:           string;
  resume_path:      string | null;
  cover_letter_path: string | null;
}

export interface LogEntry {
  runId: string;
  line:  string;
  ts:    number;
}

export type RunStatus = 'idle' | 'running' | 'completed' | 'failed';

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [jobs,        setJobs]        = useState<Job[]>([]);
  const [logs,        setLogs]        = useState<LogEntry[]>([]);
  const [runStatus,   setRunStatus]   = useState<RunStatus>('idle');
  const [triggering,  setTriggering]  = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const currentRunId = useRef<string | null>(null);

  // ── Fetch jobs ──────────────────────────────────────────────────────────────

  const fetchJobs = () => {
    fetch('/jobs')
      .then(r => r.json())
      .then((data: Job[]) => setJobs(data))
      .catch(console.error);
  };

  useEffect(() => { fetchJobs(); }, []);

  // ── WebSocket ───────────────────────────────────────────────────────────────

  useEffect(() => {
    const ws = new WebSocket(`ws://${location.host}/ws`);

    ws.onopen  = () => setWsConnected(true);
    ws.onclose = () => setWsConnected(false);

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data as string);

      // On connect: restore any run that was already in progress
      if (msg.type === 'connected') {
        const active = (msg.runs ?? []).find((r: { status: string }) => r.status === 'running');
        if (active) {
          currentRunId.current = active.id;
          setRunStatus('running');
          setLogs(
            (active.logs as string[]).map((line, i) => ({
              runId: active.id, line, ts: i,
            }))
          );
        }
        return;
      }

      if (msg.runId !== currentRunId.current) return;

      if (msg.type === 'log') {
        setLogs(prev => [...prev, { runId: msg.runId, line: msg.data as string, ts: Date.now() }]);
      } else if (msg.type === 'status') {
        const next = msg.data as RunStatus;
        setRunStatus(next);
        if (next === 'completed' || next === 'failed') fetchJobs();
      }
    };

    return () => ws.close();
  }, []);

  // ── Trigger run ─────────────────────────────────────────────────────────────

  const triggerRun = async () => {
    setTriggering(true);
    setLogs([]);
    setRunStatus('running');
    try {
      const res = await fetch('/runs/trigger', { method: 'POST' });
      const { runId } = await res.json() as { runId: string };
      currentRunId.current = runId;
    } catch (e) {
      console.error(e);
      setRunStatus('failed');
    } finally {
      setTriggering(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-brand">
          <span className="header-logo">⚡</span>
          <span className="header-title">Job Agent</span>
        </div>
        <div className="header-actions">
          <span className={`ws-dot ${wsConnected ? 'connected' : ''}`} title={wsConnected ? 'Live' : 'Disconnected'} />
          <span className="ws-label">{wsConnected ? 'Live' : 'Offline'}</span>
          <button
            className={`trigger-btn ${runStatus === 'running' ? 'running' : ''}`}
            onClick={triggerRun}
            disabled={triggering || runStatus === 'running'}
          >
            {runStatus === 'running' ? '⟳ Running…' : '▶ Trigger Run'}
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="app-body">
        <aside className="sidebar">
          <RunFeed logs={logs} runStatus={runStatus} />
        </aside>
        <main className="main-content">
          <JobGrid jobs={jobs} onSelect={setSelectedJob} />
        </main>
      </div>

      {/* Preview drawer */}
      {selectedJob && (
        <PreviewDrawer job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
}
