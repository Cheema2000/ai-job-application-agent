"use strict";
const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Muhammad Hamza";
pres.title = "AI-Powered Job Application Agent";

// Color palette
const C = {
  navy: "0D1B2A",
  white: "FFFFFF",
  teal: "00B4D8",
  lightCard: "1A2F45",
  slideBg: "F0F4F8",
  darkText: "1A1A2E",
  medText: "4A5568",
  lightBlue: "90C8E0",
  darkBlue: "0D4A6E",
  midBlue: "00607A",
  orange: "F97316",
};

const makeShadow = () => ({
  type: "outer",
  blur: 5,
  offset: 2,
  color: "000000",
  opacity: 0.12,
});

// ─────────────────────────────────────────────────────
// SLIDE 1 — TITLE (DARK)
// ─────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  // Top-left label
  s.addText("AI Agent SDK Project", {
    x: 0.5, y: 0.3, w: 4, h: 0.35,
    fontSize: 13, color: C.teal, bold: false, fontFace: "Calibri",
  });

  // Large title
  s.addText("AI-Powered Job\nApplication Agent", {
    x: 0.5, y: 1.1, w: 9, h: 1.8,
    fontSize: 40, color: C.white, bold: true, fontFace: "Calibri",
    align: "left",
  });

  // Subtitle
  s.addText("Automated Job Search  ·  Tailored Resumes  ·  Personalized Cover Letters", {
    x: 0.5, y: 3.05, w: 9, h: 0.45,
    fontSize: 16, color: C.lightBlue, italic: true, fontFace: "Calibri",
  });

  // Horizontal teal line
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 3.7, w: 9, h: 0.04,
    fill: { color: C.teal }, line: { color: C.teal },
  });

  // Left bottom: Name
  s.addText([
    { text: "Muhammad Hamza", options: { bold: true, color: C.white, fontSize: 14, breakLine: true } },
    { text: "Master of Computer Engineering", options: { color: C.lightBlue, fontSize: 12 } },
  ], {
    x: 0.5, y: 3.95, w: 4.5, h: 0.85, fontFace: "Calibri",
  });

  // Right bottom: Institution
  s.addText([
    { text: "Memorial University of Newfoundland", options: { color: C.lightBlue, fontSize: 12, breakLine: true } },
    { text: "March 2026", options: { color: C.lightBlue, fontSize: 12 } },
  ], {
    x: 5.2, y: 3.95, w: 4.3, h: 0.85, fontFace: "Calibri", align: "right",
  });

  // Decorative teal rectangles (visual interest)
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.12, h: 5.625,
    fill: { color: C.teal }, line: { color: C.teal },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 9.88, y: 0, w: 0.12, h: 5.625,
    fill: { color: "1A2F45" }, line: { color: "1A2F45" },
  });
}

// ─────────────────────────────────────────────────────
// SLIDE 2 — THE PROBLEM (LIGHT)
// ─────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.slideBg };

  s.addText("The Problem With Job Searching Today", {
    x: 0.5, y: 0.25, w: 7, h: 0.6,
    fontSize: 30, color: C.darkText, bold: true, fontFace: "Calibri", align: "left",
  });

  // Teal accent line under title
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 0.9, w: 4, h: 0.05,
    fill: { color: C.teal }, line: { color: C.teal },
  });

  // Pain point cards
  const cards = [
    {
      y: 1.1,
      title: "Hours Wasted Daily",
      body: "Manually searching 5+ job boards every morning takes 2-3 hours of valuable time",
      icon: "⏱",
    },
    {
      y: 2.25,
      title: "Generic Resumes",
      body: "Same resume sent to every job — no keyword matching, low ATS scores, fewer callbacks",
      icon: "📄",
    },
    {
      y: 3.4,
      title: "Repetitive Work",
      body: "Rewriting cover letters from scratch for every single application — tedious and inconsistent",
      icon: "🔁",
    },
  ];

  cards.forEach(({ y, title, body, icon }) => {
    // White card
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 4.3, h: 0.95,
      fill: { color: C.white }, line: { color: "E2E8F0", width: 1 },
      shadow: makeShadow(),
    });
    // Teal left accent
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 0.07, h: 0.95,
      fill: { color: C.teal }, line: { color: C.teal },
    });
    // Title
    s.addText(`${icon} ${title}`, {
      x: 0.7, y: y + 0.07, w: 4, h: 0.3,
      fontSize: 13, color: C.darkText, bold: true, fontFace: "Calibri",
    });
    // Body
    s.addText(body, {
      x: 0.7, y: y + 0.38, w: 4, h: 0.5,
      fontSize: 11, color: C.medText, fontFace: "Calibri",
    });
  });

  // Right stat callout box
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.0, w: 4.3, h: 4.0,
    fill: { color: C.navy }, line: { color: C.navy },
    shadow: makeShadow(),
  });

  s.addText("76%", {
    x: 5.2, y: 1.25, w: 4.3, h: 1.1,
    fontSize: 72, color: C.teal, bold: true, fontFace: "Calibri", align: "center",
  });
  s.addText("of resumes never reach\na human reviewer", {
    x: 5.2, y: 2.3, w: 4.3, h: 0.7,
    fontSize: 14, color: C.white, fontFace: "Calibri", align: "center",
  });

  // Separator
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.6, y: 3.1, w: 3.5, h: 0.03,
    fill: { color: "1A2F45" }, line: { color: "1A2F45" },
  });

  s.addText("3 Hours", {
    x: 5.2, y: 3.2, w: 4.3, h: 0.75,
    fontSize: 36, color: C.teal, bold: true, fontFace: "Calibri", align: "center",
  });
  s.addText("spent daily on manual\njob searching", {
    x: 5.2, y: 3.92, w: 4.3, h: 0.65,
    fontSize: 13, color: C.white, fontFace: "Calibri", align: "center",
  });
}

// ─────────────────────────────────────────────────────
// SLIDE 3 — THE SOLUTION (DARK)
// ─────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addText("Our Solution: AI Job Application Agent", {
    x: 0.5, y: 0.25, w: 9, h: 0.6,
    fontSize: 32, color: C.white, bold: true, fontFace: "Calibri",
  });
  s.addText("One command. Fully automated. Every morning at 8 AM.", {
    x: 0.5, y: 0.9, w: 9, h: 0.38,
    fontSize: 15, color: C.teal, italic: true, fontFace: "Calibri",
  });

  const featureCards = [
    {
      x: 0.4, y: 1.45,
      icon: "🔍", title: "Smart Job Search",
      body: "Finds jobs on LinkedIn & Indeed posted in last 24 hours — Newfoundland & Nova Scotia only",
    },
    {
      x: 5.1, y: 1.45,
      icon: "📝", title: "AI Resume Tailoring",
      body: "Claude AI rewrites your resume keywords to match each job description automatically",
    },
    {
      x: 0.4, y: 3.1,
      icon: "✉️", title: "Personalized Cover Letters",
      body: "Unique, role-specific cover letters written by AI for every single application",
    },
    {
      x: 5.1, y: 3.1,
      icon: "📊", title: "Daily HTML Digest",
      body: "Beautiful report with Apply Now buttons — everything ready, just click and submit",
    },
  ];

  featureCards.forEach(({ x, y, icon, title, body }) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.5, h: 1.5,
      fill: { color: C.slideBg }, line: { color: "E2E8F0", width: 1 },
      shadow: makeShadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.07, h: 1.5,
      fill: { color: C.teal }, line: { color: C.teal },
    });
    s.addText(`${icon} ${title}`, {
      x: x + 0.15, y: y + 0.12, w: 4.2, h: 0.35,
      fontSize: 15, color: C.darkText, bold: true, fontFace: "Calibri",
    });
    s.addText(body, {
      x: x + 0.15, y: y + 0.5, w: 4.2, h: 0.85,
      fontSize: 12, color: C.medText, fontFace: "Calibri",
    });
  });

  s.addText("Zero manual work after setup", {
    x: 0, y: 4.88, w: 10, h: 0.35,
    fontSize: 13, color: C.white, italic: true, fontFace: "Calibri", align: "center",
  });
}

// ─────────────────────────────────────────────────────
// SLIDE 4 — SYSTEM ARCHITECTURE (LIGHT)
// ─────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.slideBg };

  s.addText("System Architecture — 5 Layers", {
    x: 0.5, y: 0.2, w: 9, h: 0.55,
    fontSize: 30, color: C.darkText, bold: true, fontFace: "Calibri",
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 0.78, w: 4, h: 0.05,
    fill: { color: C.teal }, line: { color: C.teal },
  });

  const layers = [
    {
      y: 1.0, bg: C.navy, textColor: C.white,
      label: "5",
      text: "Layer 5: Agent SDK — Runs automatically every morning at 8am, zero human input",
    },
    {
      y: 1.82, bg: C.lightCard, textColor: C.white,
      label: "4",
      text: "Layer 4: Sub-Agents — 3 specialized agents run in parallel (Search + Resume + Cover Letter)",
    },
    {
      y: 2.64, bg: C.darkBlue, textColor: C.white,
      label: "3",
      text: "Layer 3: Skills (SKILL.md) — Hamza's analysis process written once, followed automatically",
    },
    {
      y: 3.46, bg: C.midBlue, textColor: C.white,
      label: "2",
      text: "Layer 2: MCP — Connects to LinkedIn, Indeed databases via Model Context Protocol",
    },
    {
      y: 4.28, bg: C.teal, textColor: C.navy,
      label: "1",
      text: "Layer 1: Tool Calling — Read files, run Python scripts, query SQLite database",
    },
  ];

  layers.forEach(({ y, bg, textColor, label, text }) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 9, h: 0.72,
      fill: { color: bg }, line: { color: bg },
    });
    // Layer number circle (just a small square for simplicity)
    s.addShape(pres.shapes.OVAL, {
      x: 0.55, y: y + 0.17, w: 0.38, h: 0.38,
      fill: { color: C.teal }, line: { color: C.teal },
    });
    s.addText(label, {
      x: 0.55, y: y + 0.17, w: 0.38, h: 0.38,
      fontSize: 11, color: C.navy, bold: true, fontFace: "Calibri", align: "center", valign: "middle",
    });
    s.addText(text, {
      x: 1.1, y: y + 0.15, w: 8.2, h: 0.42,
      fontSize: 12, color: textColor, fontFace: "Calibri", bold: textColor === C.navy,
    });
  });
}

// ─────────────────────────────────────────────────────
// SLIDE 5 — THE PIPELINE (LIGHT)
// ─────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.slideBg };

  s.addText("How It Works — Daily Pipeline", {
    x: 0.5, y: 0.2, w: 9, h: 0.55,
    fontSize: 30, color: C.darkText, bold: true, fontFace: "Calibri",
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 0.78, w: 4, h: 0.05,
    fill: { color: C.teal }, line: { color: C.teal },
  });

  const steps = [
    {
      x: 0.3,
      step: "STEP 1",
      icon: "🔍",
      title: "Job Search",
      lines: ["LinkedIn & Indeed", "Last 24 hours", "NL + NS + Remote"],
    },
    {
      x: 2.6,
      step: "STEP 2",
      icon: "📝",
      title: "Resume Tailor",
      lines: ["Claude AI matches", "your keywords to", "each job description"],
    },
    {
      x: 4.9,
      step: "STEP 3",
      icon: "✉️",
      title: "Cover Letter",
      lines: ["Personalized letter", "per company using", "your experience"],
    },
    {
      x: 7.2,
      step: "STEP 4",
      icon: "📊",
      title: "HTML Digest",
      lines: ["Report with Apply", "Now buttons opens", "in your browser"],
    },
  ];

  steps.forEach(({ x, step, icon, title, lines }) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.1, w: 2.2, h: 2.85,
      fill: { color: C.navy }, line: { color: "1A2F45", width: 1 },
      shadow: makeShadow(),
    });
    s.addText(step, {
      x: x + 0.1, y: 1.2, w: 2.0, h: 0.28,
      fontSize: 10, color: C.teal, bold: true, fontFace: "Calibri", align: "center",
      charSpacing: 2,
    });
    s.addText(`${icon} ${title}`, {
      x: x + 0.05, y: 1.52, w: 2.1, h: 0.38,
      fontSize: 14, color: C.white, bold: true, fontFace: "Calibri", align: "center",
    });
    s.addText(lines.join("\n"), {
      x: x + 0.1, y: 1.95, w: 2.0, h: 0.9,
      fontSize: 11, color: C.lightBlue, fontFace: "Calibri", align: "center",
    });
  });

  // Arrows between steps
  [2.3, 4.6, 6.9].forEach((ax) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: ax - 0.05, y: 2.48, w: 0.25, h: 0.08,
      fill: { color: C.teal }, line: { color: C.teal },
    });
    // Arrowhead triangle approximation
    s.addShape(pres.shapes.RECTANGLE, {
      x: ax + 0.14, y: 2.42, w: 0.1, h: 0.2,
      fill: { color: C.teal }, line: { color: C.teal },
      rotate: 45,
    });
  });

  // Bottom info card
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 4.25, w: 9.4, h: 0.72,
    fill: { color: C.lightCard }, line: { color: C.lightCard },
    shadow: makeShadow(),
  });
  s.addText("⏱ Total time: ~7 minutes  |  🤖 Human involvement: Zero  |  📅 Schedule: Every day at 8:00 AM", {
    x: 0.3, y: 4.25, w: 9.4, h: 0.72,
    fontSize: 13, color: C.white, bold: true, fontFace: "Calibri", align: "center", valign: "middle",
  });
}

// ─────────────────────────────────────────────────────
// SLIDE 6 — SUB-AGENTS DEEP DIVE (DARK)
// ─────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addText("Sub-Agents Running in Parallel", {
    x: 0.5, y: 0.2, w: 9, h: 0.55,
    fontSize: 30, color: C.white, bold: true, fontFace: "Calibri",
  });
  s.addText("Not sequential — all agents work simultaneously", {
    x: 0.5, y: 0.78, w: 9, h: 0.35,
    fontSize: 14, color: C.teal, italic: true, fontFace: "Calibri",
  });

  // Manager Agent box
  s.addShape(pres.shapes.RECTANGLE, {
    x: 3.75, y: 1.15, w: 2.5, h: 0.65,
    fill: { color: C.navy }, line: { color: C.teal, width: 2 },
    shadow: makeShadow(),
  });
  s.addText("🧠 Manager Agent", {
    x: 3.75, y: 1.15, w: 2.5, h: 0.65,
    fontSize: 13, color: C.white, bold: true, fontFace: "Calibri", align: "center", valign: "middle",
  });

  // Connector lines
  // Down-left
  s.addShape(pres.shapes.LINE, {
    x: 4.05, y: 1.8, w: 0.7, h: 0.45,
    line: { color: C.teal, width: 1.5 },
    flipH: true,
  });
  // Down center
  s.addShape(pres.shapes.LINE, {
    x: 5.0, y: 1.8, w: 0, h: 0.45,
    line: { color: C.teal, width: 1.5 },
  });
  // Down-right
  s.addShape(pres.shapes.LINE, {
    x: 5.95, y: 1.8, w: 0.7, h: 0.45,
    line: { color: C.teal, width: 1.5 },
  });

  const agents = [
    {
      x: 0.3,
      label: "Sub-Agent 1",
      icon: "🔍",
      title: "Job Search",
      bullets: [
        "Searches LinkedIn & Indeed",
        "Filters: NL + NS + Remote",
        "Last 24 hours only",
        "Saves to SQLite DB",
        "Scores by relevance",
      ],
    },
    {
      x: 3.55,
      label: "Sub-Agent 2",
      icon: "📝",
      title: "Resume Tailor",
      bullets: [
        "Reads job description",
        "Rewrites Summary section",
        "Reorders skills by match",
        "Highlights best projects",
        "Saves as .txt file",
      ],
    },
    {
      x: 6.8,
      label: "Sub-Agent 3",
      icon: "✉️",
      title: "Cover Letter",
      bullets: [
        "Personalizes per company",
        "References real achievements",
        "Mentions specific role",
        "Professional tone",
        "Saves as .txt file",
      ],
    },
  ];

  agents.forEach(({ x, label, icon, title, bullets }) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 2.2, w: 2.9, h: 2.65,
      fill: { color: C.lightCard }, line: { color: "243B55", width: 1 },
      shadow: makeShadow(),
    });
    s.addText(label, {
      x: x + 0.1, y: 2.28, w: 2.7, h: 0.28,
      fontSize: 10, color: C.teal, bold: true, fontFace: "Calibri", charSpacing: 1,
    });
    s.addText(`${icon} ${title}`, {
      x: x + 0.1, y: 2.56, w: 2.7, h: 0.35,
      fontSize: 15, color: C.white, bold: true, fontFace: "Calibri",
    });
    // Bullets
    const bulletItems = bullets.map((b, i) => ({
      text: b,
      options: { bullet: true, color: C.lightBlue, fontSize: 11, breakLine: i < bullets.length - 1 },
    }));
    s.addText(bulletItems, {
      x: x + 0.1, y: 2.95, w: 2.7, h: 1.8, fontFace: "Calibri",
    });
  });

  // Bottom line + text
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 5.1, w: 9, h: 0.03,
    fill: { color: C.teal }, line: { color: C.teal },
  });
  s.addText("All results combined by Manager Agent into one HTML report", {
    x: 0, y: 5.18, w: 10, h: 0.3,
    fontSize: 13, color: C.white, fontFace: "Calibri", align: "center",
  });
}

// ─────────────────────────────────────────────────────
// SLIDE 7 — TECHNOLOGY STACK (LIGHT)
// ─────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.slideBg };

  s.addText("Technology Stack", {
    x: 0.5, y: 0.2, w: 9, h: 0.55,
    fontSize: 30, color: C.darkText, bold: true, fontFace: "Calibri",
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 0.78, w: 4, h: 0.05,
    fill: { color: C.teal }, line: { color: C.teal },
  });

  const techCards = [
    { x: 0.4, y: 1.05, icon: "🐍", title: "Python", lines: ["Core agent logic", "Pandas · SQLite", "requests · json"] },
    { x: 3.55, y: 1.05, icon: "🤖", title: "Claude AI", lines: ["Resume tailoring", "Cover letter writing", "anthropic SDK"] },
    { x: 6.7, y: 1.05, icon: "🔍", title: "JobSpy", lines: ["LinkedIn scraping", "Indeed scraping", "Real-time jobs"] },
    { x: 0.4, y: 2.85, icon: "🗄️", title: "SQLite", lines: ["Job tracker DB", "Application history", "Duplicate prevention"] },
    { x: 3.55, y: 2.85, icon: "📅", title: "Agent SDK", lines: ["Scheduled tasks", "Runs every 8 AM", "Zero manual trigger"] },
    { x: 6.7, y: 2.85, icon: "🌐", title: "HTML Report", lines: ["Daily digest", "Apply Now buttons", "Beautiful UI"] },
  ];

  techCards.forEach(({ x, y, icon, title, lines }) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 2.9, h: 1.6,
      fill: { color: C.navy }, line: { color: C.navy },
      shadow: makeShadow(),
    });
    s.addText(`${icon} ${title}`, {
      x: x + 0.15, y: y + 0.15, w: 2.6, h: 0.42,
      fontSize: 16, color: C.white, bold: true, fontFace: "Calibri",
    });
    s.addText(lines.join("\n"), {
      x: x + 0.15, y: y + 0.62, w: 2.6, h: 0.85,
      fontSize: 12, color: C.teal, fontFace: "Calibri",
    });
  });

  s.addText("Fully open-source stack — reproducible and deployable anywhere", {
    x: 0, y: 4.8, w: 10, h: 0.38,
    fontSize: 12, color: C.medText, italic: true, fontFace: "Calibri", align: "center",
  });
}

// ─────────────────────────────────────────────────────
// SLIDE 8 — LIVE RESULTS (DARK)
// ─────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addText("Live Results — First Run", {
    x: 0.5, y: 0.2, w: 9, h: 0.55,
    fontSize: 30, color: C.white, bold: true, fontFace: "Calibri",
  });
  s.addText("March 24, 2026 — Real data, not a demo", {
    x: 0.5, y: 0.78, w: 9, h: 0.35,
    fontSize: 14, color: C.teal, italic: true, fontFace: "Calibri",
  });

  const stats = [
    { x: 0.35, num: "79", label: "Jobs Scraped", sub: "from LinkedIn & Indeed" },
    { x: 2.65, num: "16", label: "NL + NS Jobs", sub: "after location filter" },
    { x: 4.95, num: "10", label: "Resumes Made", sub: "AI-tailored per company" },
    { x: 7.25, num: "10", label: "Cover Letters", sub: "personalized per role" },
  ];

  stats.forEach(({ x, num, label, sub }) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.25, w: 2.2, h: 1.6,
      fill: { color: C.lightCard }, line: { color: "243B55", width: 1 },
      shadow: makeShadow(),
    });
    s.addText(num, {
      x, y: 1.3, w: 2.2, h: 0.8,
      fontSize: 52, color: C.teal, bold: true, fontFace: "Calibri", align: "center",
    });
    s.addText(label, {
      x, y: 2.1, w: 2.2, h: 0.3,
      fontSize: 12, color: C.white, fontFace: "Calibri", align: "center",
    });
    s.addText(sub, {
      x, y: 2.42, w: 2.2, h: 0.3,
      fontSize: 10, color: C.lightBlue, fontFace: "Calibri", align: "center",
    });
  });

  // Companies / Locations
  s.addText("Companies Found:", {
    x: 0.5, y: 3.05, w: 4, h: 0.32,
    fontSize: 14, color: C.teal, bold: true, fontFace: "Calibri",
  });
  const companyItems = [
    "Scotiabank",
    "RBC",
    "EY",
    "City of St. John's",
    "EfficiencyOne",
  ].map((c, i) => ({
    text: c,
    options: { bullet: true, color: C.white, fontSize: 12, breakLine: i < 4 },
  }));
  s.addText(companyItems, {
    x: 0.5, y: 3.38, w: 4, h: 1.45, fontFace: "Calibri",
  });

  s.addText("Locations Covered:", {
    x: 5.1, y: 3.05, w: 4.5, h: 0.32,
    fontSize: 14, color: C.teal, bold: true, fontFace: "Calibri",
  });
  const locItems = [
    "St. John's, NL",
    "Halifax, NS",
    "Dartmouth, NS",
    "Remote (Canada)",
  ].map((c, i) => ({
    text: c,
    options: { bullet: true, color: C.white, fontSize: 12, breakLine: i < 3 },
  }));
  s.addText(locItems, {
    x: 5.1, y: 3.38, w: 4.5, h: 1.45, fontFace: "Calibri",
  });

  // Bottom teal card
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 5.0, w: 9.4, h: 0.45,
    fill: { color: C.teal }, line: { color: C.teal },
  });
  s.addText("⏱ Runtime: ~7 minutes from start to HTML report — fully automated", {
    x: 0.3, y: 5.0, w: 9.4, h: 0.45,
    fontSize: 13, color: C.navy, bold: true, fontFace: "Calibri", align: "center", valign: "middle",
  });
}

// ─────────────────────────────────────────────────────
// SLIDE 9 — BI AGENT PROJECT (LIGHT)
// ─────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.slideBg };

  s.addText("Bonus Project: BI Intelligence Agent", {
    x: 0.5, y: 0.2, w: 9, h: 0.55,
    fontSize: 30, color: C.darkText, bold: true, fontFace: "Calibri",
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 0.78, w: 4, h: 0.05,
    fill: { color: C.teal }, line: { color: C.teal },
  });

  // Left column
  s.addText("What It Does", {
    x: 0.4, y: 1.0, w: 4.4, h: 0.35,
    fontSize: 14, color: C.teal, bold: true, fontFace: "Calibri",
  });

  const features = [
    "Scrapes 2,000 rows of sales data from SQLite",
    "4 sub-agents analyze in parallel: Revenue · Products · Regions · Anomalies",
    "Detects anomalies, underperformers, revenue trends",
    "Generates executive report automatically every Monday",
  ];
  const featItems = features.map((f, i) => ({
    text: f,
    options: { bullet: true, color: C.darkText, fontSize: 12, breakLine: i < features.length - 1 },
  }));
  s.addText(featItems, {
    x: 0.4, y: 1.42, w: 4.5, h: 1.5, fontFace: "Calibri",
  });

  // Result card
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 3.05, w: 4.5, h: 1.7,
    fill: { color: C.white }, line: { color: "E2E8F0", width: 1 },
    shadow: makeShadow(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 3.05, w: 0.07, h: 1.7,
    fill: { color: C.teal }, line: { color: C.teal },
  });
  s.addText("Real Results:", {
    x: 0.6, y: 3.15, w: 4.1, h: 0.3,
    fontSize: 13, color: C.darkText, bold: true, fontFace: "Calibri",
  });
  s.addText([
    { text: "Revenue: $396K this month (+10.1% MoM)", options: { color: C.darkText, fontSize: 12, breakLine: true } },
    { text: "Anomalies: 16 detected (9 Critical)", options: { color: C.darkText, fontSize: 12, breakLine: true } },
    { text: "Top Region: South ($153K)", options: { color: C.darkText, fontSize: 12 } },
  ], { x: 0.6, y: 3.5, w: 4.1, h: 1.1, fontFace: "Calibri" });

  // Right column — Bar chart
  s.addChart(pres.charts.BAR, [
    {
      name: "Revenue",
      labels: ["South", "North", "East", "Central", "West"],
      values: [153000, 83000, 82000, 48000, 31000],
    },
  ], {
    x: 5.1, y: 0.95, w: 4.5, h: 3.8,
    barDir: "col",
    showTitle: true,
    title: "Revenue by Region ($)",
    chartColors: ["00B4D8", "00B4D8", "00B4D8", "F97316", "F97316"],
    chartArea: { fill: { color: "F0F4F8" }, roundedCorners: false },
    catAxisLabelColor: "4A5568",
    valAxisLabelColor: "4A5568",
    valGridLine: { color: "E2E8F0", size: 0.5 },
    catGridLine: { style: "none" },
    showValue: true,
    dataLabelColor: "1A1A2E",
    dataLabelFontSize: 10,
    showLegend: false,
  });

  s.addText("Orange = underperforming regions requiring attention", {
    x: 5.1, y: 4.8, w: 4.5, h: 0.3,
    fontSize: 10, color: C.medText, italic: true, fontFace: "Calibri", align: "center",
  });
}

// ─────────────────────────────────────────────────────
// SLIDE 10 — CONCEPTS APPLIED (DARK)
// ─────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addText("Course Concepts Applied", {
    x: 0.5, y: 0.2, w: 9, h: 0.55,
    fontSize: 30, color: C.white, bold: true, fontFace: "Calibri",
  });
  s.addText("Every layer of the AI Agent SDK used in production", {
    x: 0.5, y: 0.78, w: 9, h: 0.35,
    fontSize: 14, color: C.teal, italic: true, fontFace: "Calibri",
  });

  const rows = [
    {
      y: 1.25, bg: C.lightCard, textColor: C.white,
      layer: "Layer 1: Tool Calling",
      desc: "Python scripts read files, query SQLite, write JSON results",
    },
    {
      y: 2.1, bg: C.lightCard, textColor: C.white,
      layer: "Layer 2: MCP",
      desc: "Connected to LinkedIn, Indeed, SQLite database via jobspy & anthropic SDK",
    },
    {
      y: 2.95, bg: C.lightCard, textColor: C.white,
      layer: "Layer 3: Skills",
      desc: "SKILL.md defines analysis process — Monitor → Explore → Craft → Impact",
    },
    {
      y: 3.8, bg: C.lightCard, textColor: C.white,
      layer: "Layer 4: Sub-Agents",
      desc: "3 agents (Search, Resume, Cover Letter) run in parallel, manager combines results",
    },
    {
      y: 4.65, bg: C.teal, textColor: C.navy,
      layer: "Layer 5: Agent SDK",
      desc: "Scheduled task runs every day at 8:00 AM with zero human involvement",
    },
  ];

  rows.forEach(({ y, bg, textColor, layer, desc }) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 9, h: 0.72,
      fill: { color: bg }, line: { color: bg },
    });
    // Teal accent bar (only for dark rows)
    if (bg === C.lightCard) {
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0.5, y, w: 0.07, h: 0.72,
        fill: { color: C.teal }, line: { color: C.teal },
      });
    }
    s.addText(layer, {
      x: 0.72, y: y + 0.18, w: 2.7, h: 0.36,
      fontSize: 13, color: textColor === C.navy ? C.navy : C.teal, bold: true, fontFace: "Calibri",
    });
    s.addText("→", {
      x: 3.5, y: y + 0.18, w: 0.4, h: 0.36,
      fontSize: 14, color: textColor, fontFace: "Calibri", align: "center",
    });
    s.addText(desc, {
      x: 3.95, y: y + 0.15, w: 5.1, h: 0.42,
      fontSize: 12, color: textColor, fontFace: "Calibri",
    });
    // Checkmark
    s.addText("✅", {
      x: 9.1, y: y + 0.18, w: 0.35, h: 0.36,
      fontSize: 14, fontFace: "Calibri",
    });
  });
}

// ─────────────────────────────────────────────────────
// SLIDE 11 — IMPACT & NEXT STEPS (LIGHT)
// ─────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.slideBg };

  s.addText("Impact & What's Next", {
    x: 0.5, y: 0.2, w: 9, h: 0.55,
    fontSize: 30, color: C.darkText, bold: true, fontFace: "Calibri",
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 0.78, w: 4, h: 0.05,
    fill: { color: C.teal }, line: { color: C.teal },
  });

  // Left: Impact
  const impacts = [
    { num: "3 Hours Saved", sub: "per day vs manual searching" },
    { num: "10 Applications", sub: "ready to submit in 7 minutes" },
    { num: "100% Tailored", sub: "resume + cover letter per job" },
  ];

  impacts.forEach(({ num, sub }, i) => {
    const y = 1.05 + i * 1.42;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.4, y, w: 4.3, h: 1.22,
      fill: { color: C.white }, line: { color: "E2E8F0", width: 1 },
      shadow: makeShadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.4, y, w: 0.07, h: 1.22,
      fill: { color: C.teal }, line: { color: C.teal },
    });
    s.addText(num, {
      x: 0.6, y: y + 0.12, w: 3.9, h: 0.5,
      fontSize: 26, color: C.teal, bold: true, fontFace: "Calibri",
    });
    s.addText(sub, {
      x: 0.6, y: y + 0.65, w: 3.9, h: 0.42,
      fontSize: 13, color: C.darkText, fontFace: "Calibri",
    });
  });

  // Right: Next Steps
  s.addText("Planned Improvements", {
    x: 5.1, y: 1.0, w: 4.5, h: 0.38,
    fontSize: 16, color: C.darkText, bold: true, fontFace: "Calibri",
  });

  const nextSteps = [
    { num: "1", icon: "📧", title: "Email Delivery", body: "Auto-send digest to inbox every morning" },
    { num: "2", icon: "🔔", title: "Slack Alerts", body: "Instant notification for high-match jobs" },
    { num: "3", icon: "📈", title: "Application Tracker", body: "Dashboard to track response rates" },
    { num: "4", icon: "🌍", title: "More Locations", body: "Expand to Toronto, Vancouver, Remote" },
  ];

  nextSteps.forEach(({ num, icon, title, body }, i) => {
    const y = 1.5 + i * 0.97;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.1, y, w: 4.5, h: 0.82,
      fill: { color: C.white }, line: { color: "E2E8F0", width: 1 },
      shadow: makeShadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.1, y, w: 0.07, h: 0.82,
      fill: { color: C.teal }, line: { color: C.teal },
    });
    // Number circle
    s.addShape(pres.shapes.OVAL, {
      x: 5.22, y: y + 0.2, w: 0.38, h: 0.38,
      fill: { color: C.navy }, line: { color: C.navy },
    });
    s.addText(num, {
      x: 5.22, y: y + 0.2, w: 0.38, h: 0.38,
      fontSize: 11, color: C.teal, bold: true, fontFace: "Calibri", align: "center", valign: "middle",
    });
    s.addText(`${icon} ${title}`, {
      x: 5.7, y: y + 0.07, w: 3.7, h: 0.3,
      fontSize: 13, color: C.darkText, bold: true, fontFace: "Calibri",
    });
    s.addText(body, {
      x: 5.7, y: y + 0.4, w: 3.7, h: 0.32,
      fontSize: 11, color: C.medText, fontFace: "Calibri",
    });
  });
}

// ─────────────────────────────────────────────────────
// SLIDE 12 — THANK YOU (DARK)
// ─────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  // Decorative side bars
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.12, h: 5.625,
    fill: { color: C.teal }, line: { color: C.teal },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 9.88, y: 0, w: 0.12, h: 5.625,
    fill: { color: C.teal }, line: { color: C.teal },
  });

  s.addText("Thank You", {
    x: 0, y: 1.0, w: 10, h: 1.1,
    fontSize: 52, color: C.white, bold: true, fontFace: "Calibri", align: "center",
  });
  s.addText("Questions & Discussion", {
    x: 0, y: 2.1, w: 10, h: 0.55,
    fontSize: 22, color: C.teal, fontFace: "Calibri", align: "center",
  });

  // Divider line
  s.addShape(pres.shapes.RECTANGLE, {
    x: 2, y: 2.8, w: 6, h: 0.04,
    fill: { color: C.teal }, line: { color: C.teal },
  });

  // Contact info
  s.addText("Muhammad Hamza", {
    x: 0, y: 3.0, w: 10, h: 0.38,
    fontSize: 18, color: C.white, bold: true, fontFace: "Calibri", align: "center",
  });
  s.addText("muhammadhamzacheema786@gmail.com", {
    x: 0, y: 3.42, w: 10, h: 0.32,
    fontSize: 14, color: C.lightBlue, fontFace: "Calibri", align: "center",
  });
  s.addText("github.com/Cheema2000  |  linkedin.com/in/muhammad-hamza", {
    x: 0, y: 3.78, w: 10, h: 0.3,
    fontSize: 13, color: C.lightBlue, fontFace: "Calibri", align: "center",
  });

  // Project tags
  s.addShape(pres.shapes.RECTANGLE, {
    x: 1.7, y: 4.3, w: 2.9, h: 0.52,
    fill: { color: C.navy }, line: { color: C.teal, width: 1.5 },
    shadow: makeShadow(),
  });
  s.addText("🤖 Job Application Agent", {
    x: 1.7, y: 4.3, w: 2.9, h: 0.52,
    fontSize: 12, color: C.white, fontFace: "Calibri", align: "center", valign: "middle",
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.4, y: 4.3, w: 2.9, h: 0.52,
    fill: { color: C.navy }, line: { color: C.teal, width: 1.5 },
    shadow: makeShadow(),
  });
  s.addText("📊 BI Intelligence Agent", {
    x: 5.4, y: 4.3, w: 2.9, h: 0.52,
    fontSize: 12, color: C.white, fontFace: "Calibri", align: "center", valign: "middle",
  });

  s.addText("Built with Claude AI  ·  Agent SDK  ·  Python  ·  JobSpy", {
    x: 0, y: 5.12, w: 10, h: 0.3,
    fontSize: 11, color: C.teal, fontFace: "Calibri", align: "center",
  });
}

// ─────────────────────────────────────────────────────
// SAVE
// ─────────────────────────────────────────────────────
pres.writeFile({ fileName: "/Users/hamza/Documents/Job-Agent/Hamza_Job_Agent_Project.pptx" })
  .then(() => console.log("✅ Saved: Hamza_Job_Agent_Project.pptx"))
  .catch((err) => { console.error("❌ Error:", err); process.exit(1); });
