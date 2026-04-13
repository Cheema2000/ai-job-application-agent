# ⚡ Job Agent — AI-Powered Job Application Platform

> A full-stack AI platform that scrapes LinkedIn & Indeed, tailors your resume per company using Claude AI, writes personalised cover letters, and streams everything live to a React dashboard — fully automated, every morning at 8 AM.

![Python](https://img.shields.io/badge/Python-3.10+-blue?style=flat-square&logo=python)
![React](https://img.shields.io/badge/React-TypeScript-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-REST_+_WebSocket-339933?style=flat-square&logo=node.js)
![Claude AI](https://img.shields.io/badge/Claude_AI-Anthropic-purple?style=flat-square)
![SQLite](https://img.shields.io/badge/Database-SQLite-lightgrey?style=flat-square)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 📸 Screenshots

### Live Dashboard — Real-Time Job Pipeline
![Dashboard](D3_AS_IS_diagram.png)

> 143 jobs scraped, relevance-scored, and filtered in real time. The live terminal feed streams every pipeline step as it executes.

### Document Preview — AI-Tailored Resume + Cover Letter
![Preview Drawer](D3_AS_IS_diagram.png)

> Side-by-side preview of the AI-generated resume and cover letter for each job. One click to Apply Now.

---

## 🎯 The Problem

Job searching in 2026 is broken:

- **2–3 hours** wasted daily manually searching LinkedIn, Indeed, and other boards
- **76%** of resumes never reach a human reviewer — ATS filters them out first
- Generic resumes sent to every job result in low keyword match scores
- Rewriting cover letters from scratch for every application is tedious and inconsistent

---

## 💡 The Solution

A full-stack AI platform that does everything automatically — scraping, scoring, tailoring, and previewing — while you watch it happen live in your browser.

```bash
# One click in the dashboard, or schedule it:
0 8 * * * node server.js --trigger
```

In ~7 minutes the platform:
1. Scrapes LinkedIn & Indeed across 14 query/location combinations
2. Scores each job by keyword relevance (out of 20)
3. Sends the top 10 jobs to Claude AI for resume tailoring
4. Writes a personalised cover letter per company
5. Streams every step live to your React dashboard via WebSocket
6. Displays all results in a searchable, filterable job board with document preview

---

## 🏗️ Architecture — 4 Layers

```
┌─────────────────────────────────────────────────────────────────┐
│  Layer 4: React + TypeScript Frontend (Vite)                     │
│  JobGrid · JobCard · PreviewDrawer · RunFeed · WebSocket client  │
├─────────────────────────────────────────────────────────────────┤
│  Layer 3: Node.js API Server                                     │
│  POST /runs/trigger · GET /runs/:id · GET /jobs · GET /files/*   │
│  WebSocket — streams stdout/stderr from Python process live      │
├─────────────────────────────────────────────────────────────────┤
│  Layer 2: Candidate Profile                                      │
│  data/hamza_profile.json — single source of truth for all prompts│
├─────────────────────────────────────────────────────────────────┤
│  Layer 1: Python AI Agent Pipeline                               │
│  Manager → Job Search Agent → Resume Tailor → Cover Letter Writer│
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚙️ How It Works

### Layer 1 — Python Agent Pipeline

| Agent | What It Does |
|-------|-------------|
| `manager_agent.py` | Orchestrator — runs the full pipeline sequentially, creates output directories, streams structured logs |
| `agent_job_search.py` | Scrapes LinkedIn & Indeed via JobSpy across 14 query/location combos; scores jobs by keyword relevance; saves to SQLite with duplicate prevention |
| `agent_resume_tailor.py` | Reads top 10 jobs from SQLite; sends each to Claude AI with your full profile; Claude rewrites summary, reorders skills, highlights relevant projects |
| `agent_cover_letter.py` | Writes a personalised cover letter per job — opens with a hook, references two achievements with numbers, names the company specifically |

**Search coverage:**
- AI Engineer, LLM Engineer, Full Stack Developer — Remote
- Software Engineer, Data Analyst — Newfoundland + Nova Scotia
- Business Intelligence Analyst, Analytics Engineer — Canada

**Relevance scoring keywords:** `llm` · `agent` · `react` · `typescript` · `node.js` · `aws` · `python` · `sql` · `power bi` · `claude` · `anthropic`

### Layer 2 — Candidate Profile

`data/hamza_profile.json` — single source of truth fed into every Claude prompt:
- Target roles, skills, projects, experience, education
- Used by both resume tailor and cover letter agents to ensure consistency

### Layer 3 — Node.js API Server

| Endpoint | What It Does |
|----------|-------------|
| `POST /runs/trigger` | Spawns `manager_agent.py` as child process, assigns UUID run ID, returns immediately |
| `GET /runs/:id` | Returns run status (running/completed/failed), full log array, timestamps |
| `GET /jobs` | Reads SQLite — all jobs joined with resume and cover letter paths, ordered by relevance |
| `GET /files/*` | Serves resume and cover letter `.txt` files to frontend preview |
| `ws://host/ws` | Streams every stdout/stderr line from Python in real time; sends run snapshot on connect |

Uses Node's built-in `node:sqlite` — no native compilation needed. In-memory `Map` tracks all runs per session.

### Layer 4 — React Frontend

| Component | What It Does |
|-----------|-------------|
| `App.tsx` | Root — manages WebSocket, job list state, run status, auto-reconnect |
| `RunFeed.tsx` | Dark terminal sidebar — colour-coded live logs (blue=steps, green=success, red=error, yellow=warning), auto-scrolls, animating status badge |
| `JobGrid.tsx` | Searchable job board — filters across title, company, location simultaneously |
| `JobCard.tsx` | Cards with relevance score bar (gradient, out of 20), source badge, pipeline stage indicator |
| `PreviewDrawer.tsx` | Side-by-side Resume + Cover Letter preview, spring animation, Apply Now → direct link, Escape to close |

**Filter pills with live counts:**
- `All 143` · `New 132` · `Resume Ready` · `Apply Ready 11`

---

## 📊 Live Results — Real Run (April 13, 2026)

| Metric | Result |
|--------|--------|
| Jobs Scraped | **143** total (92 new this run) |
| Search Combinations | **14** query/location pairs |
| AI-Tailored Resumes | **10** (one per top-scored job) |
| Personalised Cover Letters | **10** (one per company) |
| Apply Ready | **11** jobs with full document set |
| Runtime | **~7 minutes** end-to-end |

**Sample jobs found this run:**
- Verafin — Software Developer Specialist (St. John's, NL) ← local!
- AI/ML Engineer — YO IT Consulting (Remote)
- Data & Reporting Analyst — EfficiencyOne (Dartmouth, NS)
- Senior Backend Engineer — Releady (Remote)
- Junior Data Scientist — Liferaft (Halifax, NS)

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18, TypeScript, Vite | Job dashboard, document preview, live feed |
| Styling | Plain CSS | Zero framework dependency |
| API Server | Node.js, built-in `node:sqlite` | REST endpoints, WebSocket streaming |
| AI Engine | Claude AI (Anthropic SDK) | Resume tailoring, cover letter writing |
| Job Scraping | JobSpy | LinkedIn & Indeed real-time scraping |
| Database | SQLite | Job storage, deduplication, run history |
| Pipeline | Python, Pandas | Agent orchestration, scoring, file management |
| Scheduling | cron | Automated 8 AM daily trigger |

---

## 📁 Project Structure

```
ai-job-application-agent/
├── client/
│   └── src/
│       ├── App.tsx              # Root — WebSocket, state, run management
│       ├── RunFeed.tsx          # Live terminal sidebar
│       ├── JobGrid.tsx          # Searchable + filterable job board
│       ├── JobCard.tsx          # Individual job card with relevance score
│       └── PreviewDrawer.tsx    # Side-by-side resume + cover letter preview
├── agents/
│   ├── manager_agent.py         # Pipeline orchestrator
│   ├── agent_job_search.py      # LinkedIn & Indeed scraper + scorer
│   ├── agent_resume_tailor.py   # Claude AI resume customisation
│   └── agent_cover_letter.py    # Claude AI cover letter generation
├── data/
│   ├── hamza_profile.json       # Candidate profile — fed into all Claude prompts
│   └── jobs.db                  # SQLite job tracker
├── reports/                     # Generated HTML digests
├── resumes/                     # AI-tailored resumes (.txt per job)
├── cover_letters/               # Personalised cover letters (.txt per job)
├── server.js                    # Node.js API + WebSocket server
├── run_job_agent.sh             # One-command launcher
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

```bash
Python 3.10+
Node.js 20+
```

### Install & Run

```bash
# Clone
git clone https://github.com/Cheema2000/ai-job-application-agent.git
cd ai-job-application-agent

# Python dependencies
pip install anthropic jobspy pandas

# Set your API key
export ANTHROPIC_API_KEY=your_key_here

# Node dependencies
npm install

# Start the server
node server.js

# Open dashboard
open http://localhost:3000
```

### Schedule Daily (Optional)

```bash
# Runs automatically at 8 AM every day
0 8 * * * cd /path/to/ai-job-application-agent && node server.js --trigger
```

---

## 🔮 Planned Improvements

1. **📧 Email Delivery** — Send HTML digest to inbox at 8 AM automatically
2. **🔔 Slack Alerts** — Instant ping for jobs scoring above 35 relevance
3. **📈 Application Tracker** — Track response rates, interview callbacks, offer rate
4. **🌍 More Locations** — Expand beyond NL/NS to Toronto, Vancouver, all Remote Canada
5. **🔐 Auth Layer** — Multi-user support with per-profile job pipelines
6. **📊 Analytics Dashboard** — Weekly job market trends, keyword frequency, company activity

---

## 🎓 Built With

- **[Anthropic Claude AI](https://anthropic.com)** — Resume tailoring and cover letter generation
- **[JobSpy](https://github.com/Bunsly/JobSpy)** — LinkedIn & Indeed scraping
- **[React](https://react.dev)** + **[Vite](https://vitejs.dev)** — Frontend dashboard
- **techNL AI for Data Science & Analytics** program — Project inspiration

---

## 👤 Author

**Muhammad Hamza**
M.A.Sc. Computer Engineering — Memorial University of Newfoundland
St. John's, NL, Canada

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat-square&logo=linkedin)](https://linkedin.com/in/muhammad-hamza-74035518a)
[![GitHub](https://img.shields.io/badge/GitHub-Cheema2000-black?style=flat-square&logo=github)](https://github.com/Cheema2000)
[![Email](https://img.shields.io/badge/Email-Contact-red?style=flat-square&logo=gmail)](mailto:muhammadhamzacheema786@gmail.com)

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

*Built with Claude AI · React · TypeScript · Node.js · Python · JobSpy · Vite*