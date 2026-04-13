"""
agent_job_search.py — Sub-Agent 1: Job Search
Searches LinkedIn, Indeed, and Glassdoor for relevant jobs
posted in the last 24 hours. Saves new jobs to the database.
"""

import sqlite3
import json
from datetime import datetime

DB = "data/applications.db"

# Jobs to search for based on Hamza's profile
SEARCH_QUERIES = [
    # AI / LLM / Agentic roles — Remote-first (strongest match for job description)
    {"title": "AI Engineer",                  "location": "Remote"},
    {"title": "LLM Engineer",                 "location": "Remote"},
    {"title": "Full Stack Developer AI",      "location": "Remote"},
    {"title": "Full Stack Engineer",          "location": "Remote"},
    {"title": "Software Engineer LLM",        "location": "Remote"},
    # Local roles in NL / NS
    {"title": "Full Stack Developer",         "location": "Newfoundland, Canada"},
    {"title": "Software Engineer",            "location": "Newfoundland, Canada"},
    {"title": "Data Analyst",                 "location": "Newfoundland, Canada"},
    {"title": "Business Intelligence Analyst","location": "Newfoundland, Canada"},
    {"title": "Full Stack Developer",         "location": "Nova Scotia, Canada"},
    {"title": "Software Engineer",            "location": "Nova Scotia, Canada"},
    {"title": "Data Analyst",                 "location": "Nova Scotia, Canada"},
    {"title": "Analytics Engineer",           "location": "Nova Scotia, Canada"},
    {"title": "Data Analyst",                 "location": "Remote"},
]

# Only show jobs posted within last 24 hours
HOURS_OLD = 24

def init_db(conn):
    """Create tables if they don't exist."""
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS jobs (
            job_id          TEXT PRIMARY KEY,
            title           TEXT,
            company         TEXT,
            location        TEXT,
            job_url         TEXT,
            description     TEXT,
            date_posted     TEXT,
            date_found      TEXT,
            source          TEXT,
            relevance_score INTEGER DEFAULT 0,
            status          TEXT DEFAULT 'new'
        );

        CREATE TABLE IF NOT EXISTS applications (
            app_id          INTEGER PRIMARY KEY AUTOINCREMENT,
            job_id          TEXT,
            resume_path     TEXT,
            cover_letter_path TEXT,
            date_applied    TEXT,
            status          TEXT DEFAULT 'ready_to_apply',
            notes           TEXT,
            FOREIGN KEY (job_id) REFERENCES jobs(job_id)
        );
    """)
    conn.commit()

def score_job(title, description):
    """Score job relevance based on Hamza's skills. Higher = better match."""
    score = 0
    text = (title + " " + description).lower()

    # High-value keywords for Hamza
    high_value = [
        # AI / LLM / Agentic
        "llm", "agent", "agentic", "claude", "openai", "anthropic",
        "prompt engineering", "rag", "retrieval augmented", "tool use",
        "langchain", "langgraph", "ai engineer", "llm engineer",
        # Full-stack
        "react", "typescript", "node.js", "nodejs", "full stack", "fullstack",
        "full-stack", "aws",
        # Data
        "python", "sql", "power bi", "tableau", "etl",
        "data analyst", "bi analyst", "data pipeline",
        "streamlit", "pandas", "dashboard", "reporting"
    ]
    medium_value = [
        "javascript", "rest api", "api", "backend", "frontend",
        "excel", "visualization", "analytics", "mysql",
        "data cleaning", "kpi", "insights", "data engineer",
        "machine learning", "ml", "ai", "automation"
    ]

    for kw in high_value:
        if kw in text:
            score += 3
    for kw in medium_value:
        if kw in text:
            score += 1

    return score

def search_jobs_jobspy():
    """Use jobspy to scrape real jobs from LinkedIn and Indeed — last 24 hours only."""
    try:
        from jobspy import scrape_jobs
        import pandas as pd
        all_jobs = []

        # Location keywords to validate results
        valid_locations = ["newfoundland", "nova scotia", "nl", "ns",
                           "st. john's", "st john", "halifax", "remote"]

        for query in SEARCH_QUERIES:
            try:
                jobs = scrape_jobs(
                    site_name=["linkedin", "indeed"],
                    search_term=query["title"],
                    location=query["location"],
                    results_wanted=15,
                    hours_old=HOURS_OLD,          # ← last 24 hours only
                    country_indeed="Canada",
                    verbose=0
                )

                if jobs is not None and not jobs.empty:
                    # Filter: only keep jobs actually in NL, NS, or Remote
                    if "Remote" not in query["location"]:
                        mask = jobs["location"].str.lower().apply(
                            lambda loc: any(kw in str(loc).lower() for kw in valid_locations)
                        )
                        jobs = jobs[mask]

                    if not jobs.empty:
                        all_jobs.append(jobs)
                        print(f"  Found {len(jobs)} jobs: {query['title']} in {query['location']}")
                    else:
                        print(f"  No matching jobs: {query['title']} in {query['location']}")

            except Exception as e:
                print(f"  ⚠️  Search failed for {query['title']}: {e}")

        if all_jobs:
            combined = pd.concat(all_jobs, ignore_index=True)
            # Drop duplicates by job URL
            combined = combined.drop_duplicates(subset=["job_url"], keep="first")
            return combined
        return None

    except ImportError:
        print("  ⚠️  jobspy not installed — using sample data mode")
        return None

def get_sample_jobs():
    """Fallback: sample jobs for testing when jobspy isn't available."""
    return [
        {
            "job_id": "sample_001",
            "title": "Data Analyst",
            "company": "RBC Royal Bank",
            "location": "St. John's, Newfoundland, Canada",
            "job_url": "https://linkedin.com/jobs/sample1",
            "description": "We are looking for a Data Analyst skilled in Python, SQL, Power BI, and ETL pipelines. Experience with Pandas, data visualization, and dashboard development required. Will build automated reporting tools and KPI dashboards.",
            "date_posted": datetime.now().strftime("%Y-%m-%d"),
            "source": "sample"
        },
        {
            "job_id": "sample_002",
            "title": "BI Developer",
            "company": "Shopify",
            "location": "Halifax, Nova Scotia, Canada",
            "job_url": "https://linkedin.com/jobs/sample2",
            "description": "BI Developer to build Tableau and Power BI dashboards. Python scripting for ETL pipelines. SQL query optimization. Experience with data cleaning, data validation, and automated reporting workflows.",
            "date_posted": datetime.now().strftime("%Y-%m-%d"),
            "source": "sample"
        },
        {
            "job_id": "sample_003",
            "title": "Analytics Engineer",
            "company": "Telus",
            "location": "Vancouver, Canada",
            "job_url": "https://linkedin.com/jobs/sample3",
            "description": "Analytics Engineer to design and maintain data pipelines. Strong Python and SQL skills required. Experience with Streamlit, dashboard development, and ETL pipeline design. MySQL and SQLite experience a plus.",
            "date_posted": datetime.now().strftime("%Y-%m-%d"),
            "source": "sample"
        },
        {
            "job_id": "sample_004",
            "title": "Business Intelligence Analyst",
            "company": "TD Bank",
            "location": "Toronto, Canada",
            "job_url": "https://linkedin.com/jobs/sample4",
            "description": "BI Analyst to create Power BI reports and dashboards for executive team. Python scripting, SQL, Excel (Pivot Tables, VBA), and data storytelling skills required. ETL pipeline experience preferred.",
            "date_posted": datetime.now().strftime("%Y-%m-%d"),
            "source": "sample"
        },
        {
            "job_id": "sample_005",
            "title": "Data Analyst – Reporting",
            "company": "Bell Canada",
            "location": "Montreal, Canada",
            "job_url": "https://linkedin.com/jobs/sample5",
            "description": "Seeking a Data Analyst to build automated reporting pipelines, clean and validate datasets, and create Tableau dashboards. Pandas, SQL, data validation experience required. Streamlit or similar tool a plus.",
            "date_posted": datetime.now().strftime("%Y-%m-%d"),
            "source": "sample"
        }
    ]

def save_jobs(conn, jobs_data, use_dataframe=False):
    """Save new jobs to database, skip duplicates."""
    new_count = 0
    cur = conn.cursor()

    if use_dataframe and jobs_data is not None:
        for _, row in jobs_data.iterrows():
            try:
                job_id = str(row.get("id", ""))[:100] or f"job_{datetime.now().timestamp()}"
                description = str(row.get("description", "") or "")
                title = str(row.get("title", "") or "")
                score = score_job(title, description)

                cur.execute("""
                    INSERT OR IGNORE INTO jobs
                    (job_id, title, company, location, job_url, description,
                     date_posted, date_found, source, relevance_score)
                    VALUES (?,?,?,?,?,?,?,?,?,?)
                """, (
                    job_id,
                    title,
                    str(row.get("company", "") or ""),
                    str(row.get("location", "") or ""),
                    str(row.get("job_url", "") or ""),
                    description[:3000],
                    str(row.get("date_posted", "") or ""),
                    datetime.now().strftime("%Y-%m-%d"),
                    str(row.get("site", "unknown")),
                    score
                ))
                if cur.rowcount > 0:
                    new_count += 1
            except Exception as e:
                print(f"  ⚠️  Skipping job row: {e}")
    else:
        for job in jobs_data:
            score = score_job(job["title"], job["description"])
            cur.execute("""
                INSERT OR IGNORE INTO jobs
                (job_id, title, company, location, job_url, description,
                 date_posted, date_found, source, relevance_score)
                VALUES (?,?,?,?,?,?,?,?,?,?)
            """, (
                job["job_id"], job["title"], job["company"],
                job["location"], job["job_url"], job["description"],
                job["date_posted"], datetime.now().strftime("%Y-%m-%d"),
                job.get("source", "web"), score
            ))
            if cur.rowcount > 0:
                new_count += 1

    conn.commit()
    return new_count

def run():
    conn = sqlite3.connect(DB)
    init_db(conn)

    print("  🔍 Searching for jobs...")
    df = search_jobs_jobspy()

    if df is not None and not df.empty:
        new_jobs = save_jobs(conn, df, use_dataframe=True)
        print(f"  ✅ Real jobs found: {len(df)} scraped, {new_jobs} new saved")
    else:
        print("  📋 Using sample jobs for demonstration...")
        sample = get_sample_jobs()
        new_jobs = save_jobs(conn, sample)
        print(f"  ✅ Sample jobs: {new_jobs} new saved")

    # Return today's new high-relevance jobs
    cur = conn.cursor()
    cur.execute("""
        SELECT job_id, title, company, location, job_url, relevance_score
        FROM jobs
        WHERE date_found = ? AND status = 'new'
        ORDER BY relevance_score DESC
        LIMIT 20
    """, (datetime.now().strftime("%Y-%m-%d"),))
    todays_jobs = [
        {"job_id": r[0], "title": r[1], "company": r[2],
         "location": r[3], "url": r[4], "score": r[5]}
        for r in cur.fetchall()
    ]
    conn.close()

    result = {
        "agent": "Job Search",
        "new_jobs_found": new_jobs,
        "todays_jobs": todays_jobs,
        "generated_at": datetime.now().isoformat()
    }
    with open("reports/job_search_result.json", "w") as f:
        json.dump(result, f, indent=2)

    print(f"  ✅ Job Search Agent done → {new_jobs} new jobs found")
    return result

if __name__ == "__main__":
    import os
    os.makedirs("reports", exist_ok=True)
    run()
