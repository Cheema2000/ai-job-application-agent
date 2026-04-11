"""
agent_cover_letter.py — Sub-Agent 3: Cover Letter Writer
Writes a personalized, compelling cover letter for each job.
Matches Hamza's real experience to each specific role.
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

def get_resume_ready_jobs(conn):
    """Get jobs that have a resume but no cover letter yet."""
    cur = conn.cursor()
    cur.execute("""
        SELECT j.job_id, j.title, j.company, j.location, j.description,
               j.job_url, a.resume_path, a.app_id
        FROM jobs j
        JOIN applications a ON j.job_id = a.job_id
        WHERE a.status = 'resume_ready'
          AND j.date_found = ?
        ORDER BY j.relevance_score DESC
        LIMIT 10
    """, (datetime.now().strftime("%Y-%m-%d"),))
    return cur.fetchall()

def write_cover_letter(profile, job_title, company, location, description):
    """Use Claude to write a personalized cover letter."""
    client = anthropic.Anthropic()

    prompt = f"""You are an expert career coach writing a compelling cover letter for a job applicant.

Write a professional, personalized cover letter that:
- Opens with a strong hook (not "I am applying for...")
- Connects candidate's REAL experience to THIS specific role
- References 2 specific projects/achievements with numbers
- Shows genuine interest in {company} specifically
- Closes with confidence and a call to action
- Length: 3 paragraphs, max 350 words
- Tone: Professional but warm, confident not arrogant

=== CANDIDATE ===
Name: {profile['personal']['name']}
Current: Masters in Computer Engineering, Memorial University of Newfoundland (2025)
Background: Data Analyst with Python, SQL, Power BI, ETL pipelines, Streamlit dashboards

Key Achievements:
- Built ETL pipeline processing 12 months of financial data across 4 departments (Python, Pandas, SQLite)
- Created Streamlit dashboard with KPI cards, MoM variance analysis, dynamic filters
- Cleaned and processed 1,030 employee payroll records with full automated reporting
- Improved database query speed by 30% through indexing at DigiCare
- Reduced manual data entry errors by 25% through automated validation scripts

=== TARGET JOB ===
Title: {job_title}
Company: {company}
Location: {location}
Description: {description[:1500]}

=== FORMAT ===
Start directly with the letter content.
No "Dear Hiring Manager" boilerplate — use "Dear {company} Team," or "Dear Hiring Team,"
End with: "Sincerely,\\nMuhammad Hamza\\n{profile['personal']['email']} | {profile['personal']['phone']}"

Write ONLY the cover letter. No explanations or notes."""

    client_obj = anthropic.Anthropic()
    message = client_obj.messages.create(
        model="claude-opus-4-5",
        max_tokens=800,
        messages=[{"role": "user", "content": prompt}]
    )
    return message.content[0].text

def save_cover_letter(job_id, company, title, content):
    """Save cover letter as a text file."""
    os.makedirs("cover_letters", exist_ok=True)
    safe_company = "".join(c for c in company if c.isalnum() or c in " _-")[:30]
    filename = f"cover_letters/CoverLetter_{safe_company.replace(' ','_')}_{job_id[:8]}.txt"
    with open(filename, "w") as f:
        f.write(f"COVER LETTER FOR: {title} at {company}\n")
        f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
        f.write("=" * 60 + "\n\n")
        f.write(content)
    return filename

def run():
    conn    = sqlite3.connect(DB)
    profile = load_profile()
    jobs    = get_resume_ready_jobs(conn)
    cur     = conn.cursor()

    results = []
    print(f"  ✉️  Writing cover letters for {len(jobs)} jobs...")

    for job in jobs:
        job_id, title, company, location, description, url, resume_path, app_id = job
        try:
            print(f"    → {title} at {company}...")
            letter = write_cover_letter(profile, title, company, location, description or "")
            cl_path = save_cover_letter(job_id, company, title, letter)

            # Update application record
            cur.execute("""
                UPDATE applications
                SET cover_letter_path = ?, status = 'ready_to_apply'
                WHERE app_id = ?
            """, (cl_path, app_id))
            cur.execute("UPDATE jobs SET status='ready_to_apply' WHERE job_id=?", (job_id,))

            results.append({
                "job_id":            job_id,
                "title":             title,
                "company":           company,
                "location":          location,
                "apply_url":         url,
                "resume":            resume_path,
                "cover_letter":      cl_path,
                "status":            "✅ Ready to apply"
            })
            print(f"    ✅ Cover letter saved → {cl_path}")

        except Exception as e:
            print(f"    ❌ Failed for {company}: {e}")
            results.append({
                "job_id": job_id, "title": title,
                "company": company, "status": f"❌ Failed: {e}"
            })

    conn.commit()
    conn.close()

    result = {
        "agent": "Cover Letter Writer",
        "letters_created": len([r for r in results if "✅" in r.get("status","")]),
        "ready_to_apply": results,
        "generated_at": datetime.now().isoformat()
    }
    with open("reports/cover_letter_result.json", "w") as f:
        json.dump(result, f, indent=2)

    print(f"  ✅ Cover Letter Agent done → {result['letters_created']} letters created")
    return result

if __name__ == "__main__":
    os.makedirs("reports", exist_ok=True)
    run()
