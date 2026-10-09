# 🤝 Contributing to Showphan

Thank you for your interest in contributing to **Showphan**! 🌟

Showphan was created by [**Raja Irfan Ahmed**](https://rajairfanahmed.vercel.app) to give software developers a single high-fidelity showcase link with 16:9 visual proof and an enforced quality gate. We welcome contributions from developers worldwide to help build the next-generation developer proof-of-work platform.

---

## 📜 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Workflow](#development-workflow)
  - [Prerequisites](#prerequisites)
  - [Initial Setup](#initial-setup)
  - [Running Locally](#running-locally)
  - [Running Checks & Tests](#running-checks--tests)
- [Coding Standards & Conventions](#coding-standards--conventions)
- [Pull Request Process](#pull-request-process)
- [Recognition & Community](#recognition--community)

---

## 🛡️ Code of Conduct

All contributors and participants are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please report any unacceptable behavior to [Raja Irfan Ahmed](https://rajairfanahmed.vercel.app).

---

## 💡 How Can I Contribute?

1. **Star the Repository**: Show your support by starring the [Showphan repo](https://github.com/rajairfanahmed/showphan)!
2. **Reporting Bugs**: Check existing issues before opening a new one. Include your OS, browser, reproducible steps, and expected vs. actual behavior.
3. **Suggesting Features**: Propose ideas that enhance developer proof-of-work, UI/UX aesthetics, SEO, or verification speed.
4. **Submitting Pull Requests**: Pick an issue labeled `good first issue` or `help wanted`, or propose an improvement.

---

## 💻 Development Workflow

### Prerequisites

- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **npm**: `v10.x` or later
- **PostgreSQL**: Local instance or free [Neon Serverless Postgres](https://neon.tech)
- **Cloudflare R2**: Free Cloudflare account for S3-compatible image uploads

### Initial Setup

1. **Fork and clone** the repository:
   ```bash
   git clone https://github.com/<your-username>/showphan.git
   cd showphan
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   Fill in your PostgreSQL URL, GitHub OAuth credentials, and Cloudflare R2 credentials.

4. **Initialize database schema**:
   ```bash
   npx prisma db push
   ```

### Running Locally

Start the Next.js development server with Turbopack:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Checks & Tests

Before submitting a pull request, ensure all linters, type checks, and automated test suites pass:

```bash
# Type check TypeScript code
npm run typecheck

# Run linter
npm run lint

# Run backend, e2e, and quality-gate test suites
npm test
```

---

## 🎨 Coding Standards & Conventions

- **Framework**: Next.js 16 App Router (React Server Components by default; `"use client"` only when interactive state is required).
- **Styling**: Tailwind CSS 4 with existing theme variables (`var(--background)`, `var(--foreground)`, `var(--border)`, amber accents).
- **Icons**: Utilize the offline Iconify bundle in `src/generated/icons.json` (do NOT add runtime external CDNs).
- **Branch Naming**:
  - `feat/feature-name`
  - `fix/bug-description`
  - `docs/documentation-update`
  - `refactor/component-name`
- **Commit Messages**: Follow [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat: add live sandpack embed preview`
  - `fix: resolve github oauth slug collision`
  - `docs: update setup instructions in readme`
  - `test: add unit tests for dynamic badge generator`

---

## 🚀 Pull Request Process

1. Create a descriptive branch from `main`.
2. Keep pull requests focused on a single change or feature.
3. Verify that `npm run typecheck` and `npm test` pass with zero failures.
4. Open a Pull Request referencing the related issue (`Fixes #123`).
5. Include screenshots or screen recordings for any UI changes.

---

## 🌟 Creator & Acknowledgments

Showphan is maintained by [**Raja Irfan Ahmed**](https://rajairfanahmed.vercel.app). Contributors who submit merged pull requests will be featured on the contributors wall and in release notes!
