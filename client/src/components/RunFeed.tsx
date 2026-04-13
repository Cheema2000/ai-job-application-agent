import { useEffect, useRef } from 'react';
import type { LogEntry, RunStatus } from '../App';

interface Props {
  logs:      LogEntry[];
  runStatus: RunStatus;
}

const STATUS_META: Record<RunStatus, { label: string; cls: string }> = {
  idle:      { label: 'Idle',      cls: 'status-idle' },
  running:   { label: 'Running',   cls: 'status-running' },
  completed: { label: 'Completed', cls: 'status-completed' },
  failed:    { label: 'Failed',    cls: 'status-failed' },
};

function lineClass(line: string): string {
  if (line.includes('✅') || line.toLowerCase().includes('done'))          return 'log-success';
  if (line.includes('❌') || line.includes('[error]') || line.includes('[stderr]')) return 'log-error';
  if (line.includes('⚠️') || line.toLowerCase().includes('warn'))          return 'log-warn';
  if (/step\s+\d|🚀|📝|🔍|✉️|📊|📍/u.test(line))                        return 'log-step';
  return 'log-default';
}

export default function RunFeed({ logs, runStatus }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { label, cls } = STATUS_META[runStatus];

  // Auto-scroll to newest log line
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length]);

  return (
    <div className="run-feed">
      <div className="run-feed-header">
        <span className="run-feed-title">Live Feed</span>
        <span className={`run-status-badge ${cls}`}>{label}</span>
      </div>

      <div className="run-feed-logs">
        {logs.length === 0 ? (
          <span className="log-empty">Trigger a run to see live output here.</span>
        ) : (
          logs.map((entry, i) => (
            <div key={i} className={`log-line ${lineClass(entry.line)}`}>
              {entry.line}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
