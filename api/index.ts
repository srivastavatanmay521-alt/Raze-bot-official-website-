/**
 * Vercel serverless function entry point.
 * Wraps the Express app so all /api/* routes work as a single serverless function.
 *
 * Required environment variables on Vercel:
 *   DATABASE_URL  — PostgreSQL connection string (Vercel Postgres, Neon, Railway, etc.)
 *   ADMIN_EMAIL   — Admin login email (default: void@razebot.site)
 *   ADMIN_PASSWORD — Admin login password
 *   ADMIN_TOKEN   — Bearer token issued on login
 */
import app from "../artifacts/api-server/src/app";

export default app;
