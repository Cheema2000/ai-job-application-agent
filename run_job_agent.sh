#!/bin/bash
# Daily Job Agent Runner
# Runs every morning at 8:00 AM automatically — even when Claude Code is closed

export ANTHROPIC_API_KEY="your api key"
export PATH="/opt/anaconda3/bin:/usr/local/bin:/usr/bin:/bin"

cd /Users/hamza/Documents/Job-Agent

LOG_FILE="logs/run_$(date +%Y-%m-%d).log"
mkdir -p logs

echo "==============================" >> "$LOG_FILE"
echo "Job Agent Started: $(date)" >> "$LOG_FILE"
echo "==============================" >> "$LOG_FILE"

python3 agents/manager_agent.py >> "$LOG_FILE" 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Completed successfully: $(date)" >> "$LOG_FILE"
else
    echo "❌ Failed with error: $(date)" >> "$LOG_FILE"
fi
