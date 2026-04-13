/**
 * server.js — Job Agent REST + WebSocket service
 *
 * REST
 *   POST /runs/trigger      — kick off the Python pipeline, returns { runId }
 *   GET  /runs/:id          — poll a run's status + buffered logs
 *   GET  /jobs              — read all jobs from SQLite
 *
 * WebSocket (ws://<host>/ws)
 *   On connect  → { type: "connected", runs: [...snapshot] }
 *   While run   → { runId, type: "log",    data: "<line>" }
 *   On finish   → { runId, type: "status", data: "completed"|"failed" }
 */

'use strict';

const express   = require('express');
const http      = require('http');
const { WebSocketServer } = require('ws');
const { spawn } = require('child_process');
const { randomUUID } = require('crypto');
const { DatabaseSync } = require('node:sqlite');
const path      = require('path');

// ---------------------------------------------------------------------------
// App + WebSocket setup
// ---------------------------------------------------------------------------

const app    = express();
const server = http.createServer(app);
const wss    = new WebSocketServer({ server, path: '/ws' });

app.use(express.json());

// ---------------------------------------------------------------------------
// In-memory run store
// { [runId]: { id, status, logs, startedAt, finishedAt } }
// ---------------------------------------------------------------------------

const runs = new Map();

function broadcast(msg) {
  const payload = JSON.stringify(msg);
  for (const client of wss.clients) {
    if (client.readyState === 1 /* OPEN */) {
      client.send(payload);
    }
  }
}

// ---------------------------------------------------------------------------
// POST /runs/trigger
// ---------------------------------------------------------------------------

app.post('/runs/trigger', (req, res) => {
  const runId = randomUUID();
  const run = {
    id:         runId,
    status:     'running',
    logs:       [],
    startedAt:  new Date().toISOString(),
    finishedAt: null,
  };
  runs.set(runId, run);

  broadcast({ runId, type: 'status', data: 'running' });

  const proc = spawn(
    'python3',
    [path.join(__dirname, 'agents', 'manager_agent.py')],
    { cwd: __dirname, env: { ...process.env } }
  );

  proc.stdout.on('data', chunk => {
    const line = chunk.toString().trimEnd();
    run.logs.push(line);
    broadcast({ runId, type: 'log', data: line });
  });

  proc.stderr.on('data', chunk => {
    const line = chunk.toString().trimEnd();
    run.logs.push(`[stderr] ${line}`);
    broadcast({ runId, type: 'log', data: `[stderr] ${line}` });
  });

  proc.on('close', code => {
    run.status     = code === 0 ? 'completed' : 'failed';
    run.finishedAt = new Date().toISOString();
    broadcast({ runId, type: 'status', data: run.status });
  });

  proc.on('error', err => {
    run.status     = 'failed';
    run.finishedAt = new Date().toISOString();
    run.logs.push(`[error] ${err.message}`);
    broadcast({ runId, type: 'status', data: 'failed' });
  });

  res.status(202).json({ runId, status: 'running' });
});

// ---------------------------------------------------------------------------
// GET /runs/:id
// ---------------------------------------------------------------------------

app.get('/runs/:id', (req, res) => {
  const run = runs.get(req.params.id);
  if (!run) return res.status(404).json({ error: 'Run not found' });
  res.json(run);
});

// ---------------------------------------------------------------------------
// GET /jobs  (includes resume_path + cover_letter_path from applications)
// ---------------------------------------------------------------------------

app.get('/jobs', (req, res) => {
  const dbPath = path.join(__dirname, 'data', 'applications.db');
  let db;
  try {
    db = new DatabaseSync(dbPath);
    const rows = db.prepare(`
      SELECT
        j.job_id, j.title, j.company, j.location, j.job_url,
        j.date_posted, j.date_found, j.source, j.relevance_score, j.status,
        a.resume_path, a.cover_letter_path
      FROM jobs j
      LEFT JOIN applications a ON j.job_id = a.job_id
      ORDER BY j.relevance_score DESC, j.date_found DESC
    `).all();
    res.json(rows);
  } catch (err) {
    // DB not initialised yet — no pipeline run has happened
    if (
      err.message.includes('SQLITE_CANTOPEN') ||
      err.message.includes('unable to open') ||
      err.message.includes('no such table')
    ) {
      return res.json([]);
    }
    res.status(500).json({ error: err.message });
  } finally {
    try { db?.close(); } catch (_) {}
  }
});

// ---------------------------------------------------------------------------
// GET /files/resumes/:file  &  GET /files/cover_letters/:file
// Serve generated .txt files to the frontend preview
// ---------------------------------------------------------------------------

app.get('/files/*', (req, res) => {
  const filePath = req.params[0];                       // e.g. "resumes/Resume_X.txt"
  if (!filePath.startsWith('resumes/') && !filePath.startsWith('cover_letters/')) {
    return res.status(403).end();
  }
  res.sendFile(path.join(__dirname, filePath));
});

// ---------------------------------------------------------------------------
// WebSocket: send a snapshot of all runs to each new client
// ---------------------------------------------------------------------------

wss.on('connection', ws => {
  const snapshot = [...runs.values()];
  ws.send(JSON.stringify({ type: 'connected', runs: snapshot }));
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Job Agent API  →  http://localhost:${PORT}`);
  console.log(`WebSocket      →  ws://localhost:${PORT}/ws`);
});
