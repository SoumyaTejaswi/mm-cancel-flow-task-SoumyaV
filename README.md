# Migrate Mate - Subscription Cancellation Flow Challenge

## Overview

Convert an existing Figma design into a fully-functional subscription-cancellation flow for Migrate Mate. This challenge tests your ability to implement pixel-perfect UI, handle complex business logic, and maintain security best practices.

## Objective

Implement the Figma-designed cancellation journey exactly on mobile + desktop, persist outcomes securely, and instrument the A/B downsell logic.

## What's Provided

This repository contains:
- ✅ Next.js + TypeScript + Tailwind scaffold
- ✅ `seed.sql` with users table (25/29 USD plans) and empty cancellations table
- ✅ Local Supabase configuration for development
- ✅ Basic Supabase client setup in `src/lib/supabase.ts`

## Tech Stack (Preferred)

- **Next.js** with App Router
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Supabase** (Postgres + Row-Level Security)

> **Alternative stacks allowed** if your solution:
> 1. Runs with `npm install && npm run dev`
> 2. Persists to a Postgres-compatible database
> 3. Enforces table-level security

## How to Run This Application

### Prerequisites

Before running the application, ensure you have the following installed:

1. **Node.js** (v18 or higher)
2. **npm** (comes with Node.js)
3. **Docker Desktop** (required for local Supabase)
4. **Supabase CLI**

### Installation Steps

#### 1. Install Supabase CLI
```bash
# On macOS with Homebrew
brew install supabase/tap/supabase

# On other systems, visit: https://supabase.com/docs/guides/cli
```

#### 2. Install Docker Desktop
```bash
# On macOS
brew install --cask docker

# On other systems, visit: https://www.docker.com/products/docker-desktop
```

#### 3. Clone and Setup Project
```bash
# Navigate to the project directory
cd cancel-flow-task-main

# Install dependencies
npm install
```

#### 4. Environment Configuration
Create a `.env.local` file in the project root:
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_local_service_role_key
```

### Running the Application

#### Option 1: Quick Start (Recommended)
```bash
# This command will start Supabase and setup the database automatically
npm run db:setup

# Start the development server
npm run dev
```

#### Option 2: Manual Setup
```bash
# 1. Start Supabase locally
supabase start

# 2. Setup database schema and seed data
PGPASSWORD=postgres psql -h localhost -p 54322 -U postgres -d postgres -f seed.sql

# 3. Start the development server
npm run dev
```

### Accessing the Application

- **Next.js Development Server**: http://localhost:3000
- **Supabase Local Database**: http://localhost:54322
- **Supabase Studio**: http://localhost:54323

### Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:setup     # Start Supabase and setup database
npm run db:reset     # Reset database to initial state
npm run db:setup:remote  # Setup remote database
```

### Troubleshooting

#### Common Issues

1. **Port conflicts**: If ports 3000, 54321, 54322, or 54323 are in use, stop other services using these ports.

2. **Docker not running**: Ensure Docker Desktop is running before starting Supabase.

3. **Database connection issues**: 
   ```bash
   # Reset Supabase if needed
   supabase stop
   supabase start
   ```

4. **Permission issues**: On macOS/Linux, you might need to run with sudo for database operations.

#### Reset Everything
```bash
# Stop all services
supabase stop

# Remove all data
supabase db reset

# Start fresh
npm run db:setup
```

### Development Workflow

1. **Start development**: `npm run dev`
2. **Access the app**: Open http://localhost:3000
3. **Test cancellation flow**: Navigate to `/cancel` route
4. **Monitor database**: Use Supabase Studio at http://localhost:54323
5. **View logs**: Check terminal for Next.js and Supabase logs

### Production Deployment

For production deployment:

1. **Build the application**:
   ```bash
   npm run build
   npm run start
   ```

2. **Setup production database**:
   ```bash
   npm run db:setup:remote
   ```

3. **Configure environment variables** for your production Supabase instance.

## Must-Have Features

### 1. Progressive Flow (Figma Design)
- Implement the exact cancellation journey from provided Figma
- Ensure pixel-perfect fidelity on both mobile and desktop
- Handle all user interactions and state transitions

### 2. Deterministic A/B Testing (50/50 Split)
- **On first entry**: Assign variant via cryptographically secure RNG
- **Persist** variant to `cancellations.downsell_variant` field
- **Reuse** variant on repeat visits (never re-randomize)

**Variant A**: No downsell screen
**Variant B**: Show "$10 off" offer
- Price $25 → $15, Price $29 → $19
- **Accept** → Log action, take user back to profile page (NO ACTUAL PAYMENT PROCESSING REQUIRED)
- **Decline** → Continue to reason selection in flow

### 3. Data Persistence
- Mark subscription as `pending_cancellation` in database
- Create cancellation record with:
  - `user_id`
  - `downsell_variant` (A or B)
  - `reason` (from user selection)
  - `accepted_downsell` (boolean)
  - `created_at` (timestamp)

### 4. Security Requirements
- **Row-Level Security (RLS)** policies
- **Input validation** on all user inputs
- **CSRF/XSS protection**
- Secure handling of sensitive data

### 5. Reproducible Setup
- `npm run db:setup` creates schema and seed data (local development)
- Clear documentation for environment setup

## Out of Scope

- **Payment processing** - Stub with comments only
- **User authentication** - Use mock user data
- **Email notifications** - Not required
- **Analytics tracking** - Focus on core functionality

## Database Schema

The `seed.sql` file provides a **starting point** with:
- `users` table with sample users
- `subscriptions` table with $25 and $29 plans
- `cancellations` table (minimal structure - **you'll need to expand this**)
- Basic RLS policies (enhance as needed)

### Important: Schema Design Required

The current `cancellations` table is intentionally minimal. You'll need to:
- **Analyze the cancellation flow requirements** from the Figma design
- **Design appropriate table structure(s)** to capture all necessary data
- **Consider data validation, constraints, and relationships**
- **Ensure the schema supports the A/B testing requirements**

## Evaluation Criteria

- **Functionality (40%)**: Feature completeness and correctness
- **Code Quality (25%)**: Clean, maintainable, well-structured code
- **Pixel/UX Fidelity (15%)**: Accuracy to Figma design
- **Security (10%)**: Proper RLS, validation, and protection
- **Documentation (10%)**: Clear README and code comments

## Deliverables

1. **Working implementation** in this repository
2. **NEW One-page README.md (replace this)** (≤600 words) explaining:
   - Architecture decisions
   - Security implementation
   - A/B testing approach
3. **Clean commit history** with meaningful messages

## Timeline

Submit your solution within **72 hours** of receiving this repository.

## AI Tooling

Using Cursor, ChatGPT, Copilot, etc. is **encouraged**. Use whatever accelerates your development—just ensure you understand the code and it runs correctly.

## Questions?

Review the challenge requirements carefully. If you have questions about specific implementation details, make reasonable assumptions and document them in your README.

---

**Good luck!** We're excited to see your implementation.
