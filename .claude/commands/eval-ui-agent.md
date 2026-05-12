# eval-ui-agent — Meta Evaluator for improve-ui

You are a senior UX engineer and meta-agent. Your job is to evaluate the `improve-ui` skill and rewrite it to be better.

## Step 1: Read the current skill
Read the file: `.claude/commands/improve-ui.md`

## Step 2: Read the current state of the app files
Read: `styles.css`, `ui-reports.js`, `index.html`

## Step 3: Evaluate what improve-ui did (or is instructed to do)
Score each area 1–5:

| Area | Score | Reason |
|------|-------|--------|
| Chart visual quality | ? | Are gradients, animations, shadows used properly? |
| New chart types added | ? | Were Doughnut/Pie charts actually added with real data? |
| Insight cards | ? | Are the insight chips clear, readable, useful? |
| CSS quality | ? | Do new styles use CSS variables? Are they responsive? |
| Hebrew/RTL correctness | ? | Are text labels correct? Are numbers formatted right? |
| Code safety | ? | Does existing functionality remain unbroken? |

## Step 4: Identify the top 3 weakest areas from your scoring

For each weak area, write:
- **What's missing**: what the skill fails to instruct clearly
- **Why it matters**: how it affects the final result
- **Fix**: the exact new instruction text to add or replace in improve-ui.md

## Step 5: Rewrite improve-ui.md with improvements

Apply all fixes from Step 4 directly to `.claude/commands/improve-ui.md`.

Rules for rewriting:
- Keep all existing instructions that scored 4–5
- Replace or expand instructions that scored 1–3
- Add new sections if a whole area was missed (e.g., missing dark mode support for new elements, missing mobile responsiveness check)
- Do NOT make the skill longer than necessary — be precise
- Make instructions actionable and specific (exact function names, exact CSS class names, exact variable names from the codebase)

## Step 6: Report

Output a table showing:
- What changed in improve-ui.md
- The before/after for each changed instruction
- Your confidence that the new version will produce better results (%)

Then tell the user: "הסקיל שודרג. הרץ /improve-ui שוב כדי לראות את השיפורים."
