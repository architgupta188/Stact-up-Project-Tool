# VentureIQ — AI Startup Validation Platform

VentureIQ is a completely autonomous next-generation AI pipeline that provides YC-style feedback and validations on Startup Ideas, evaluates trending markets for Investors, and creates a tailored curriculum roadmap for Students. 

## 🚀 Setup & Requirements

Because we chose to build a **fully customized, self-hosted scalable API backend** instead of relying on vendor-locked frontend SDKs, you need to provide a few core environment variables to complete the system setup.

### 1. Database Password (Supabase)
We use your Supabase instance purely as a **PostgreSQL Database** linked directly via Drizzle ORM.
* Go to your **Supabase Dashboard** -> Project Settings -> Database.
* If you don't remember the password you set up when generating the project, you must click **"Reset Database Password"**.
* Once reset, open `backend/.env` and replace `YOUR_DATABASE_PASSWORD_HERE` with your new password on the `DATABASE_URL` line.

### 2. Run Database Migrations
Once the password is in place, you must generate the tables in the database before the backend can function:
```bash
# Push schema to Supabase Postgres
npm run db:push
```

### 3. API Keys inside Backend
GEMINI_API_KEY=your_gemini_api_key
NEWS_API_KEY=your_news_api_key
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret

---

## 💻 Running the Application

To make local development seamless, an automated command script is available to launch both the Vite React Frontend and the Node.js API Backend simultaneously.

1. Install root dependencies if you haven't already:
```bash
npm install
```

2. Start the suite:
```bash
npm run dev
```

This will automatically launch:
- **Backend API**: `http://localhost:3000`
- **Frontend App**: `http://localhost:5173`

*(The frontend will proxy all API calls over to port 3000 natively).*

## 🏗️ Technologies Used
- **Frontend**: React 19, Vite V8, Tailwind CSS v3, Framer Motion, Recharts, Zustand, Shadcn UI, React Query.
- **Backend**: Node.js (Express V5), Drizzle ORM, Zod, bcrypt, JSON Web Tokens.
- **Database**: PostgreSQL (Supabase)
- **AI Core**: Google Gemini 1.5 Pro 
