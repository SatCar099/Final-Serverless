Build a full-stack Mental Health Awareness web application following a 3-tier architecture:
Architecture:

Frontend (Vercel): React app (Vite or Next.js) deployed on Vercel
API (ECS/Fargate): Express.js REST API server
Database (NeonDB): PostgreSQL via Neon serverless database

The Frontend communicates with the API, and the API communicates with the Database. The frontend never talks directly to the database.

Features to build:

Home / Landing Page — Overview of mental health awareness, calming UI with soft colors and illustrations
Resource Library — Browse articles/resources on topics like anxiety, depression, stress management, mindfulness (stored in DB, fetched via API)
Daily Mood Tracker — Users can log their mood each day (happy, sad, anxious, calm, angry) with an optional journal note. Show a simple mood history chart.
Self-Assessment Quiz — A short screening questionnaire (e.g. PHQ-9 or a simplified version) that gives a general wellness score with a disclaimer that it's not a medical diagnosis
Crisis Helpline Directory — A searchable list of mental health helplines by country/region
Anonymous Community Wall — Users can post anonymous encouraging messages or share experiences (no auth required, just a nickname)

what was wrong with backend and what got fixed

  Root cause: Node.js v24's built-in fetch (undici) has a Happy Eyeballs bug — when a hostname resolves to both IPv4 and IPv6 addresses and IPv6 is unreachable,
  all connections fail (ETIMEDOUT). Your Neon database hostname resolves to 3 IPv4 + 3 IPv6 addresses. Since this machine has no IPv6 connectivity, every database
  query was crashing with "Internal server error."

  Two changes made:

  1. src/db.js — Switched from @neondatabase/serverless (HTTP/fetch-based, designed for serverless edge runtimes) to postgres (TCP-based, appropriate for an
  Express server). Also added a dns.lookup patch that forces IPv4-only resolution, which fixes the Happy Eyeballs bug for all outbound connections.
  2. server/package.json — Replaced @neondatabase/serverless with postgres.
  3. src/routes/quiz.js — Changed ${JSON.stringify(answers)} to ${sql.json(answers)} so the JSONB column is properly typed with postgres.js.

  All 6 endpoints (/health, /api/resources, /api/mood, /api/quiz, /api/community, /api/helplines) are now returning correct data.