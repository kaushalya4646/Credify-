# Credify
Skill verification / career readiness platform. SRS in Group 22 srs.docx.

## Stack
- Backend: Node/Express + Prisma + PostgreSQL, in server/
- Frontend: React + Vite + Tailwind, in client/

## Key facts
- Auth middleware sets req.user as { userId, role } — NOT { id }.
- Run backend: cd server && npm run dev
- Run frontend: cd client && npm run dev
- Migrations: cd server && npx prisma migrate dev --name <name>
- Test accounts: candidate@test.com / recruiter@test.com / admin@test.com, password test1234
- Route ordering matters: static paths (/me/...) must be registered before /:id routes.

## Git commits
- Do not add any Co-Authored-By: Claude or Generated with Claude Code trailers to commit messages. Commit messages should contain only the actual change description.
