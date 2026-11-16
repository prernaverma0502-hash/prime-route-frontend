const path = require('path');
const dotenv = require('dotenv');
const { z } = require('zod');

// Load environment variables from .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  DB_HOST: z.string().min(1, 'DB_HOST is required').default('localhost'),
  DB_PORT: z.coerce.number().default(3306),
  DB_USER: z.string().min(1, 'DB_USER is required'),
  DB_PASSWORD: z.string().default(''),
  DB_NAME: z.string().min(1, 'DB_NAME is required').default('primeroute'),
  JWT_ACCESS_SECRET: z.string().min(10, 'JWT_ACCESS_SECRET must be at least 10 characters'),
  JWT_REFRESH_SECRET: z.string().min(10, 'JWT_REFRESH_SECRET must be at least 10 characters'),
  JWT_ACCESS_EXPIRES: z.string().default('15m'),
  JWT_REFRESH_EXPIRES: z.string().default('7d'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  SMTP_HOST: z.string().optional().default('smtp.example.com'),
  SMTP_PORT: z.coerce.number().optional().default(587),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),
  MAIL_FROM: z.string().default('no-reply@primeroute.io'),
  UPLOAD_DIR: z.string().default('uploads'),
  SEED_PASSWORD: z.string().optional().default('Password123!')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => ` - ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  console.error('\n========================================');
  console.error('FATAL ERROR: INVALID ENVIRONMENT CONFIGURATION');
  console.error('========================================');
  console.error(issues);
  console.error('========================================\n');
  process.exit(1);
}

module.exports = parsed.data;
