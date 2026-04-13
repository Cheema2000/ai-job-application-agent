"""
agent_resume_tailor.py — Sub-Agent 2: Resume Tailor
For each new job, creates a tailored resume that matches
the job description keywords — FAANG-level formatting.
"""

import sqlite3
import json
import os
from datetime import datetime
import anthropic

DB      = "data/applications.db"
PROFILE = "data/hamza_profile.json"

def load_profile():
    with open(PROFILE) as f:
        return json.load(f)

def get_new_jobs(conn):
    """Get jobs that don't have a resume tailored yet."""
    cur = conn.cursor()
    cur.execute("""
        SELECT j.job_id, j.title, j.company, j.location, j.description, j.job_url
        FROM jobs j
        LEFT JOIN applications a ON j.job_id = a.job_id
        WHERE j.status = 'new'
          AND j.date_found = ?
          AND a.job_id IS NULL
        ORDER BY j.relevance_score DESC
        LIMIT 10
    """, (datetime.now().strftime("%Y-%m-%d"),))
    return cur.fetchall()

def tailor_resume_with_claude(profile, job_title, company, description):
    """Use Claude API to tailor resume for a specific job."""
    client = anthropic.Anthropic()

    prompt = f"""You are an expert resume writer specializing in FAANG-level resumes.

Tailor this candidate's resume for the specific job below.
Match keywords from the job description. Keep it ATS-friendly.
Use strong action verbs and quantified achievements.
Output a clean, professional plain-text resume.

=== CANDIDATE PROFILE ===
Name: {profile['personal']['name']}
Email: {profile['personal']['email']}
Phone: {profile['personal']['phone']}
LinkedIn: {profile['personal']['linkedin']}
GitHub: {profile['personal']['github']}

Summary: {profile['summary']}

Skills:
- AI/LLM: {', '.join(profile['skills'].get('ai_ml', []))}
- Languages: {', '.join(profile['skills']['languages'])}
- Frontend: {', '.join(profile['skills'].get('frontend', []))}
- Backend: {', '.join(profile['skills'].get('backend', []))}
- Python Libraries: {', '.join(profile['skills']['python_libraries'])}
- BI Tools: {', '.join(profile['skills']['bi_tools'])}
- Data Engineering: {', '.join(profile['skills']['data_engineering'])}

Projects:
{json.dumps(profile['projects'], indent=2)}

Experience:
{json.dumps(profile['experience'], indent=2)}

Education:
{json.dumps(profile['education'], indent=2)}

=== JOB TO TAILOR FOR ===
Title: {job_title}
Company: {company}
Description: {description[:2000]}

=== INSTRUCTIONS ===
1. Rewrite the Summary (3 sentences) to match this specific role at {company}
2. Reorder skills to put most relevant ones first based on the job description
3. Highlight the most relevant project bullets that match job requirements
4. Keep all experience and education exactly as-is
5. Add any matching keywords from job description naturally into the text
6. Format: Clean plain text, ready to copy into any application form

Output ONLY the tailored resume. No explanations."""

    message = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=1500,
        messages=[{"role": "user", "content": prompt}]
    )
    return message.content[0].text

def save_resume(job_id, company, title, content):
    """Save tailored resume as a text file."""
    os.makedirs("resumes", exist_ok=True)
    safe_company = "".join(c for c in company if c.isalnum() or c in " _-")[:30]
    filename = f"resumes/Resume_{safe_company.replace(' ','_')}_{job_id[:8]}.txt"
    with open(filename, "w") as f:
        f.write(f"TAILORED FOR: {title} at {company}\n")
        f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
        f.write("=" * 60 + "\n\n")
        f.write(content)
    return filename

def run():
    conn   = sqlite3.connect(DB)
    profile = load_profile()
    jobs   = get_new_jobs(conn)
    cur    = conn.cursor()

    results = []
    print(f"  📝 Tailoring resumes for {len(jobs)} jobs...")

    for job in jobs:
        job_id, title, company, location, description, url = job
        try:
            print(f"    → {title} at {company}...")
            tailored = tailor_resume_with_claude(profile, title, company, description or "")
            resume_path = save_resume(job_id, company, title, tailored)

            # Save application record
            cur.execute("""
                INSERT OR IGNORE INTO applications
                (job_id, resume_path, date_applied, status)
                VALUES (?, ?, ?, 'resume_ready')
            """, (job_id, resume_path, datetime.now().strftime("%Y-%m-%d")))

            # Mark job as in progress
            cur.execute("UPDATE jobs SET status='resume_done' WHERE job_id=?", (job_id,))

            results.append({
                "job_id":      job_id,
                "title":       title,
                "company":     company,
                "location":    location,
                "url":         url,
                "resume_path": resume_path,
                "status":      "✅ Resume ready"
            })
            print(f"    ✅ Resume saved → {resume_path}")

        except Exception as e:
            print(f"    ❌ Failed for {company}: {e}")
            results.append({
                "job_id": job_id, "title": title,
                "company": company, "status": f"❌ Failed: {e}"
            })

    conn.commit()
    conn.close()

    result = {
        "agent": "Resume Tailor",
        "resumes_created": len([r for r in results if "✅" in r.get("status","")]),
        "jobs_processed": results,
        "generated_at": datetime.now().isoformat()
    }
    with open("reports/resume_result.json", "w") as f:
        json.dump(result, f, indent=2)

    print(f"  ✅ Resume Agent done → {result['resumes_created']} resumes created")
    return result

if __name__ == "__main__":
    os.makedirs("reports", exist_ok=True)
    run()
