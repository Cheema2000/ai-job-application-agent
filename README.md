# 🤖 AI Job Application Agent

> Automated job search, AI-tailored resumes, and personalized cover letters — fully hands-free, every morning at 8 AM.

![Python](https://img.shields.io/badge/Python-3.10+-blue?style=flat-square&logo=python)
![Claude AI](https://img.shields.io/badge/Claude_AI-Anthropic-purple?style=flat-square)
![SQLite](https://img.shields.io/badge/Database-SQLite-lightgrey?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)

---

## 🎯 The Problem

Job searching in 2026 is broken:

- **76%** of resumes never reach a human reviewer — ATS filters them out
- **2–3 hours** wasted daily manually searching LinkedIn, Indeed, and other job boards
- Generic resumes sent to every job result in low keyword match scores and fewer callbacks
- Rewriting cover letters from scratch for every application is tedious and inconsistent

---

## 💡 The Solution

A fully automated, AI-powered job application pipeline that runs every morning at 8 AM with **zero manual involvement**.

One command. Fully automated. Every morning.

```bash
bash run_job_agent.sh
```

In ~7 minutes, the agent:
1. Scrapes LinkedIn & Indeed for jobs posted in the last 24 hours
2. Filters by location (Newfoundland, Nova Scotia, Remote Canada)
3. Scores each job by relevance to your profile
4. Generates a tailored resume per company using Claude AI
5. Writes a personalized cover letter per role
6. Delivers a beautiful HTML digest with **Apply Now** buttons — ready to click

---

## 🏗️ System Architecture — 5 Layers

```
┌─────────────────────────────────────────────────────────┐
│  Layer 5: Agent SDK — Scheduled task, runs at 8 AM daily │
├─────────────────────────────────────────────────────────┤
│  Layer 4: Sub-Agents — 3 agents running in PARALLEL      │
│           🔍 Job Search │ 📝 Resume Tailor │ ✉️ Cover Letter│
├─────────────────────────────────────────────────────────┤
│  Layer 3: Skills (SKILL.md) — Analysis process defined   │
│           Monitor → Explore → Craft → Impact             │
├─────────────────────────────────────────────────────────┤
│  Layer 2: MCP — LinkedIn, Indeed, SQLite via JobSpy      │
├─────────────────────────────────────────────────────────┤
│  Layer 1: Tool Calling — File I/O, Python scripts, DB    │
└─────────────────────────────────────────────────────────┘
```

---

## ⚙️ How It Works — Daily Pipeline

```
STEP 1          STEP 2              STEP 3            STEP 4
🔍 Job Search   📝 Resume Tailor    ✉️ Cover Letter   📊 HTML Digest
─────────────   ────────────────    ───────────────   ──────────────
LinkedIn &      Claude AI matches   Personalized      Report with
Indeed scrape   your keywords to    letter per        Apply Now
Last 24 hours   each job posting    company using     buttons opens
NL + NS +       Reorders skills     your real         in browser
Remote jobs     by match score      achievements
                Highlights best     References
                projects            specific role
                Saves as .txt       Professional
                                    tone, .txt saved
```

**⏱ Total runtime: ~7 minutes | 🤖 Human involvement: Zero | 📅 Schedule: Every day at 8:00 AM**

---

## 🧠 Sub-Agents Running in Parallel

The Manager Agent orchestrates 3 specialized sub-agents simultaneously — not sequentially:

| Sub-Agent | What It Does |
|-----------|-------------|
| 🔍 **Job Search Agent** | Scrapes LinkedIn & Indeed, filters by NL/NS/Remote, scores by relevance, saves to SQLite with duplicate prevention |
| 📝 **Resume Tailor Agent** | Reads job description, rewrites Summary section, reorders skills by match, highlights most relevant projects |
| ✉️ **Cover Letter Agent** | Personalizes per company, references real achievements, mentions specific role details, professional tone |

All results are combined by the Manager Agent into one HTML report.

---

## 📊 Live Results — First Run (March 24, 2026)

*Real data, not a demo.*

| Metric | Result |
|--------|--------|
| Jobs Scraped | **79** (LinkedIn + Indeed) |
| NL + NS Jobs | **16** after location filter |
| AI-Tailored Resumes | **10** (one per company) |
| Personalized Cover Letters | **10** (one per role) |
| Total Runtime | **~7 minutes** |

**Companies Found:** Scotiabank, RBC, EY, City of St. John's, EfficiencyOne

**Locations Covered:** St. John's NL · Halifax NS · Dartmouth NS · Remote (Canada)

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Core Logic | Python, Pandas, requests, json | Agent orchestration & data handling |
| AI Engine | Claude AI (Anthropic SDK) | Resume tailoring, cover letter generation |
| Job Scraping | JobSpy | LinkedIn & Indeed real-time scraping |
| Database | SQLite | Job tracker, application history, duplicate prevention |
| Scheduling | Agent SDK (cron-style) | Automated 8 AM daily trigger |
| Output | HTML Report | Daily digest with Apply Now buttons |
| Shell | Bash (run_job_agent.sh) | One-command launcher |

*Fully open-source stack — reproducible and deployable anywhere.*

---

## 📁 Project Structure

```
ai-job-application-agent/
├── agents/
│   ├── manager_agent.py        # Orchestrates all sub-agents
│   ├── job_search_agent.py     # LinkedIn & Indeed scraping
│   ├── resume_tailor_agent.py  # Claude AI resume customization
│   └── cover_letter_agent.py  # Claude AI cover letter generation
├── data/
│   ├── jobs.db                 # SQLite job tracker database
│   ├── resumes/                # AI-tailored resumes (per company)
│   └── cover_letters/          # Personalized cover letters (per role)
├── logs/                       # Daily run logs
├── D1_Project_Overview.pdf     # Project documentation
├── D2_STAKEHOLDER REGISTER.pdf # Stakeholder analysis
├── D3_AsIs_Job_Search_Process.png # Current state process diagram
├── run_job_agent.sh            # One-command launcher
└── SKILL.md                    # Agent analysis process definition
```

---

## 🚀 Getting Started

### Prerequisites

```bash
Python 3.10+
pip install anthropic jobspy pandas sqlite3
export ANTHROPIC_API_KEY=your_key_here
```

### Run

```bash
git clone https://github.com/Cheema2000/ai-job-application-agent.git
cd ai-job-application-agent
bash run_job_agent.sh
```

### Schedule Daily (Optional)

Add to crontab to run automatically at 8 AM:

```bash
0 8 * * * /path/to/run_job_agent.sh
```

---

## 📈 Bonus Project: BI Intelligence Agent

Included in this repo is a second agent — a **Business Intelligence Agent** that runs every Monday morning:

- Scrapes 2,000 rows of sales data from SQLite
- Runs **4 sub-agents in parallel**: Revenue · Products · Regions · Anomalies
- Detects anomalies, underperformers, and revenue trends automatically
- Generates an executive report with zero manual work

**Real Results from First Run:**
- Revenue: $396K this month (+10.1% MoM)
- Anomalies: 16 detected (9 Critical)
- Top Region: South ($153K)

---

## 🔮 Planned Improvements

1. **📧 Email Delivery** — Auto-send HTML digest to inbox every morning
2. **🔔 Slack Alerts** — Instant notification for high-match jobs (>80% score)
3. **📈 Application Tracker Dashboard** — Track response rates and interview callbacks
4. **🌍 More Locations** — Expand to Toronto, Vancouver, and all Remote Canada roles

---

## 🎓 Course Concepts Applied

Built as the capstone project for the **AI for Data Science & Analytics** program by [techNL](https://technl.ca) / Get Building (2026):

| Layer | Concept | Applied |
|-------|---------|---------|
| Layer 1 | Tool Calling | Python scripts read files, query SQLite, write JSON results |
| Layer 2 | MCP | Connected to LinkedIn, Indeed, SQLite via JobSpy & Anthropic SDK |
| Layer 3 | Skills | SKILL.md defines Monitor → Explore → Craft → Impact process |
| Layer 4 | Sub-Agents | 3 agents run in parallel, Manager combines results |
| Layer 5 | Agent SDK | Scheduled task runs every day at 8:00 AM, zero human input |

---

## 👤 Author

**Muhammad Hamza**
M.A.Sc. Computer Engineering — Memorial University of Newfoundland

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat-square&logo=linkedin)](https://linkedin.com/in/muhammad-hamza-74035518a)
[![GitHub](https://img.shields.io/badge/GitHub-Cheema2000-black?style=flat-square&logo=github)](https://github.com/Cheema2000)
[![Email](https://img.shields.io/badge/Email-Contact-red?style=flat-square&logo=gmail)](mailto:muhammadhamzacheema786@gmail.com)

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

<<<<<<< HEAD
*Built with Claude AI · Agent SDK · Python · JobSpy · techNL AI Program*
=======
*Built with Claude AI · Agent SDK · Python · JobSpy · techNL AI Program*
>>>>>>> 004b8383cadf764791c0bbff5bbb951e36db38f3
