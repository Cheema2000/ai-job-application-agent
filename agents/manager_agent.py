"""
manager_agent.py — Manager Agent
Orchestrates the full job application pipeline:
1. Search jobs (parallel)
2. Tailor resumes (after search)
3. Write cover letters (after resumes)
4. Generate daily digest report
"""

import json
import os
import sqlite3
from datetime import datetime

# Auto-load API key from .env file
def load_env():
    env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, val = line.split('=', 1)
                    os.environ.setdefault(key.strip(), val.strip())

load_env()

DB = "data/applications.db"

def run_job_search():
    """Step 1: Find today's jobs."""
    import sys
    sys.path.insert(0, os.path.dirname(__file__))
    from agent_job_search import run
    return run()

def run_resume_tailor():
    """Step 2: Tailor resumes for found jobs."""
    from agent_resume_tailor import run
    return run()

def run_cover_letters():
    """Step 3: Write cover letters for tailored resumes."""
    from agent_cover_letter import run
    return run()

def generate_daily_digest(search_result, resume_result, cover_result):
    """Generate the daily HTML digest — what Hamza sees each morning."""
    now    = datetime.now().strftime("%B %d, %Y")
    today  = datetime.now().strftime("%Y-%m-%d")

    # Collect all ready-to-apply jobs
    ready_jobs = cover_result.get("ready_to_apply", [])
    ready_count = cover_result.get("letters_created", 0)

    # Build job cards HTML
    job_cards = ""
    for job in ready_jobs:
        if "✅" not in job.get("status", ""):
            continue
        resume_preview = ""
        if job.get("resume"):
            try:
                with open(job["resume"]) as f:
                    lines = f.readlines()
                    resume_preview = "".join(lines[3:8]).strip()[:300]
            except:
                resume_preview = "Resume file ready"

        job_cards += f"""
        <div class="job-card">
            <div class="job-header">
                <div>
                    <div class="job-title">{job['title']}</div>
                    <div class="job-company">🏢 {job['company']} &nbsp;|&nbsp; 📍 {job['location']}</div>
                </div>
                <a href="{job.get('apply_url','#')}" target="_blank" class="apply-btn">Apply Now →</a>
            </div>
            <div class="file-paths">
                <span>📄 Resume: <code>{job.get('resume','N/A')}</code></span><br>
                <span>✉️ Cover Letter: <code>{job.get('cover_letter','N/A')}</code></span>
            </div>
            <div class="resume-preview">
                <strong>Resume Preview:</strong><br>
                <pre>{resume_preview}...</pre>
            </div>
        </div>
        """

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Job Application Digest — {now}</title>
    <style>
        * {{ box-sizing: border-box; margin: 0; padding: 0; }}
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                background: #f0f2f5; color: #1a1a2e; padding: 30px; }}
        .header {{ background: linear-gradient(135deg, #0077b5, #00a0dc);
                   color: white; padding: 30px; border-radius: 12px;
                   margin-bottom: 25px; }}
        .header h1 {{ font-size: 28px; margin-bottom: 8px; }}
        .header p  {{ opacity: 0.85; font-size: 15px; }}
        .stats {{ display: grid; grid-template-columns: repeat(4, 1fr);
                  gap: 15px; margin-bottom: 25px; }}
        .stat {{ background: white; padding: 20px; border-radius: 10px;
                 text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }}
        .stat-number {{ font-size: 36px; font-weight: 700; color: #0077b5; }}
        .stat-label  {{ font-size: 13px; color: #666; margin-top: 5px; }}
        .section-title {{ font-size: 20px; font-weight: 600;
                          margin-bottom: 15px; color: #1a1a2e; }}
        .job-card {{ background: white; border-radius: 10px; padding: 20px;
                     margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                     border-left: 4px solid #0077b5; }}
        .job-header {{ display: flex; justify-content: space-between;
                       align-items: flex-start; margin-bottom: 12px; }}
        .job-title   {{ font-size: 18px; font-weight: 600; color: #1a1a2e; }}
        .job-company {{ font-size: 14px; color: #555; margin-top: 4px; }}
        .apply-btn   {{ background: #0077b5; color: white; padding: 10px 20px;
                        border-radius: 6px; text-decoration: none; font-weight: 600;
                        white-space: nowrap; font-size: 14px; }}
        .apply-btn:hover {{ background: #005885; }}
        .file-paths  {{ background: #f8f9fa; padding: 10px 12px; border-radius: 6px;
                        font-size: 13px; color: #444; margin-bottom: 10px; }}
        .resume-preview {{ background: #f0f7ff; padding: 12px; border-radius: 6px;
                           font-size: 12px; color: #555; }}
        .resume-preview pre {{ white-space: pre-wrap; font-family: inherit; }}
        .footer {{ text-align: center; color: #999; font-size: 13px;
                   margin-top: 30px; padding-top: 20px;
                   border-top: 1px solid #e0e0e0; }}
        .no-jobs {{ background: white; padding: 40px; border-radius: 10px;
                    text-align: center; color: #666; }}
    </style>
</head>
<body>
    <div class="header">
        <h1>🎯 Daily Job Application Report</h1>
        <p>Muhammad Hamza &nbsp;|&nbsp; {now} &nbsp;|&nbsp;
           Generated automatically by Job Agent</p>
    </div>

    <div class="stats">
        <div class="stat">
            <div class="stat-number">{search_result.get('new_jobs_found', 0)}</div>
            <div class="stat-label">Jobs Found Today</div>
        </div>
        <div class="stat">
            <div class="stat-number">{resume_result.get('resumes_created', 0)}</div>
            <div class="stat-label">Resumes Tailored</div>
        </div>
        <div class="stat">
            <div class="stat-number">{ready_count}</div>
            <div class="stat-label">Cover Letters Written</div>
        </div>
        <div class="stat">
            <div class="stat-number">{ready_count}</div>
            <div class="stat-label">Ready to Apply</div>
        </div>
    </div>

    <div class="section-title">✅ Ready to Apply — Click "Apply Now" for each</div>

    {''.join([job_cards]) if job_cards else
     '<div class="no-jobs">No new jobs found today. Check back tomorrow! 🔄</div>'}

    <div class="footer">
        🤖 Generated automatically by Job Application Agent &nbsp;|&nbsp;
        Runs every morning at 8:00 AM &nbsp;|&nbsp;
        Resume & Cover Letter tailored per job using Claude AI
    </div>
</body>
</html>"""

    filename = f"reports/JobDigest_{today}.html"
    with open(filename, "w") as f:
        f.write(html)
    return filename

def print_summary(search_result, resume_result, cover_result, report_path):
    """Print clean terminal summary."""
    ready = cover_result.get("ready_to_apply", [])
    print(f"""
╔══════════════════════════════════════════════════════════════╗
║           DAILY JOB APPLICATION DIGEST                       ║
║           {datetime.now().strftime('%B %d, %Y'):<50}║
╚══════════════════════════════════════════════════════════════╝

  📊 TODAY'S SUMMARY
  ─────────────────────────────────────────────────────────────
  Jobs found:        {search_result.get('new_jobs_found', 0)}
  Resumes tailored:  {resume_result.get('resumes_created', 0)}
  Cover letters:     {cover_result.get('letters_created', 0)}
  Ready to apply:    {cover_result.get('letters_created', 0)}

  🎯 JOBS READY FOR YOU TO APPLY
  ─────────────────────────────────────────────────────────────""")

    for job in ready:
        if "✅" in job.get("status", ""):
            print(f"  ✅ {job['title']:<35} @ {job['company']}")
            print(f"     📍 {job['location']}")
            print(f"     🔗 {job.get('apply_url','N/A')}")
            print(f"     📄 {job.get('resume','N/A')}")
            print(f"     ✉️  {job.get('cover_letter','N/A')}")
            print()

    print(f"""
  ─────────────────────────────────────────────────────────────
  📂 Open your digest: {report_path}
  ─────────────────────────────────────────────────────────────
  All you need to do: Click "Apply Now" for each job.
  Your tailored resume + cover letter are already ready. ✓
╚══════════════════════════════════════════════════════════════╝
""")

def main():
    os.makedirs("reports", exist_ok=True)
    os.makedirs("resumes", exist_ok=True)
    os.makedirs("cover_letters", exist_ok=True)

    print("\n🚀 Job Application Agent Starting...\n")

    # Step 1: Search for jobs
    print("📍 Step 1: Searching for jobs...")
    search_result = run_job_search()

    # Step 2: Tailor resumes (needs jobs first)
    print("\n📝 Step 2: Tailoring resumes with Claude AI...")
    resume_result = run_resume_tailor()

    # Step 3: Write cover letters (needs resumes first)
    print("\n✉️  Step 3: Writing personalized cover letters...")
    cover_result = run_cover_letters()

    # Step 4: Generate HTML digest
    print("\n📊 Step 4: Generating daily digest report...")
    report_path = generate_daily_digest(search_result, resume_result, cover_result)

    # Step 5: Print summary
    print_summary(search_result, resume_result, cover_result, report_path)
    print(f"💾 HTML Report saved → {report_path}")
    print(f"   Open it in your browser to see all jobs with Apply buttons!\n")

if __name__ == "__main__":
    main()
