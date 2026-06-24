# 🎓 CollegePATH — Engineering Admission Predictor & College Directory

CollegePATH is a premium, feature-rich web application designed to help engineering aspirants in India predict their college admission chances based on entrance exam ranks (JEE Main & JEE Advanced). It features a robust search directory, side-by-side college comparison, student reviews, detailed placement statistics, and bookmarking features.

---

## 🚀 Key Features

*   **🎯 Smart Admission Predictor:** Enter your rank (JEE Main/JEE Advanced), category, and exam type to receive immediate admission predictions. Results are graded into **High**, **Medium**, or **Unlikely** confidence brackets calculated using historic counselling round cutoffs.
*   **📊 College Comparison Engine:** Compare up to 3 colleges side-by-side across dimensions like representative annual fees, placement packages (average/highest), student ratings, and course duration.
*   **🔍 Comprehensive Search Directory:** Advanced filtering for colleges by location, exam type, average package, annual fees, and courses.
*   **🔐 Secure Authentication:** JWT-based user login and signup with passwords safely hashed via bcryptjs.
*   **📌 Saved Colleges (Dashboard):** Logged-in users can bookmark colleges to view them at any time in their personalized dashboard.
*   **🛡️ API Rate Limiting:** Implements robust Upstash Redis-based rate limiting on sensitive predictor and auth endpoints.

---

## 🛠️ Technology Stack

*   **Framework:** Next.js (App Router, React 19)
*   **Database ORM:** [Prisma](./prisma/schema.prisma)
*   **Database System:** PostgreSQL
*   **Styling:** Tailwind CSS (v4) & Lucide Icons
*   **Authentication:** JWT via [jose](https://github.com/panva/jose) & passwords hashed via [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
*   **Rate Limiting & Caching:** Upstash Redis & Upstash Ratelimit
*   **Language:** TypeScript

---

## 📁 Directory Structure

```text
collegePATH/
├── prisma/
│   ├── schema.prisma   # PostgreSQL Database schema definition
│   └── seed.ts         # High-fidelity mock seed data generator (15+ Colleges, 45+ Courses, 900+ Cutoffs)
├── src/
│   ├── app/            # Next.js App Router folders
│   │   ├── api/        # REST API endpoints (Auth, Predict, Saved, Compare)
│   │   ├── colleges/   # College directory and details page (dynamic router)
│   │   ├── compare/    # Side-by-side college comparison page
│   │   ├── dashboard/  # Logged-in user saved college dashboard
│   │   ├── login/      # User sign-in page
│   │   ├── predictor/  # Admission predictor page
│   │   ├── signup/     # User registration page
│   │   ├── layout.tsx  # Core root layout containing navigation & footer
│   │   └── page.tsx    # Interactive home / landing page
│   ├── components/     # Reusable React components (Logo, SearchBar, Card etc.)
│   └── lib/            # Utilities (db connection, auth helpers, etc.)
```

---

## ⚙️ Installation and Setup

### 1. Prerequisites
Make sure you have Node.js (v18+) and npm installed on your system.

### 2. Install Dependencies
Clone the repository, then install the packages:
```bash
npm install
```

### 3. Environment Variables Setup
Create a `.env` file in the root directory and configure the environment variables as shown in `.env.example`:
```ini
DATABASE_URL="postgresql://user:password@localhost:5432/collegepath?schema=public"
JWT_SECRET="your-super-secure-jwt-secret-key"

# Upstash Redis Credentials (for Rate Limiting)
UPSTASH_REDIS_REST_URL="https://your-upstash-redis-url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-upstash-redis-rest-token"
```

### 4. Database Setup & Seeding
Initialize the database, apply migrations, and run the high-fidelity database seeder:
```bash
# Generate Prisma client and push schema changes to DB
npx prisma db push

# Seed the database with colleges, courses, and cutoffs
npm run postinstall
npx prisma db seed
```
> The seeder [seed.ts](./prisma/seed.ts) generates 15 premier Indian colleges (IITs, NITs, BITS, VIT, MIT, DTU, NSUT) along with courses (CSE, ECE, ME), placement statistics for 2023, student reviews, and realistic category-wise cutoffs for rounds 1 and 6.

### 5. Running the Application
To run the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔍 Predictor Confidence Algorithm

The predictor API endpoint ([predict/route.ts](./src/app/api/predict/route.ts)) handles rank submissions and queries historic cutoffs in **Round 6** (the final threshold for seat allotments):

*   **`High` (Safe Match):** User rank is $\le 85\%$ of the historical closing rank (`maxRank`).
*   **`Medium` (Competitive Match):** User rank is between $85\%$ and $100\%$ of the historical closing rank.
*   **`Unlikely` (Borderline/Overshot):** User rank exceeds the closing rank but lies within $110\%$ of it (borderline criteria, since we query `maxRank >= rank * 0.90`).
