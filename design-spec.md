# Technical Design Specification: Showphan (Version 1)

This document formalizes the system architecture, database schema, API contracts, deep module interfaces, and infrastructure blueprints for Showphan Version 1, adhering strictly to `SE-Workflow/5)Design(Architect).md` and `CODING_STANDARDS.md`.

---

## 1. Architecture Pattern

### Pattern: Modular Monolith on Serverless Next.js App Router
Showphan uses a **Modular Monolith** deployed on Vercel's serverless edge and Node.js runtimes. 
- **Rationale:** Built and maintained by a solo developer. Avoids the operational overhead, distributed transaction failures, and deployment complexity of microservices.
- **Enforcement:** Clear, deep module boundaries inside `src/lib/` (`auth`, `projects`, `storage`, `catalog`, `seo`). Modules do not reach into each other's private internals; they communicate exclusively through explicit public seams.
- **Read/Write Segregation:**
  - **Public Reads:** Served through Next.js Server Components with Edge ISR (`revalidate = 60`) to bypass database compute-sleep cold starts.
  - **Authenticated Writes:** Executed via Server Actions and Route Handlers utilizing Neon pooled PostgreSQL connections (`@prisma/adapter-pg`).

---

## 2. Technology Stack & Versions

| Layer | Technology | Version | Architectural Role |
| :--- | :--- | :--- | :--- |
| **Runtime** | Node.js | `>= 20.x` | Server runtime environment |
| **Framework** | Next.js | `16.4.0` | App Router, Server Components, Route Handlers, ISR |
| **Language** | TypeScript | `^5.x` | Strict end-to-end type safety |
| **Styling** | Tailwind CSS | `^4.x` | Zero-runtime CSS with modern OKLCH & custom tokens |
| **ORM / Data** | Prisma ORM | `7.10.0` | Type-safe query builder with `@prisma/adapter-pg` |
| **Database** | Neon Serverless Postgres | PostgreSQL 16 | Relational storage with connection pooling |
| **Authentication** | Better Auth | `^1.7.7` | GitHub OAuth session management & secure cookies |
| **Object Storage** | Cloudflare R2 | S3 API v4 | 16:9 WebP cover image direct presigned storage |
| **Icon System** | Iconify | Offline utils | Build-time bundled SVG extraction (`@iconify/utils`) |
| **Markdown** | `react-markdown` | `^10.x` | Safe AST rendering with `rehype-sanitize` & `remark-gfm` |
| **Validation** | Zod | `^4.x` | Shared client & server schema validation |

---

## 3. Deep Module Design

### 3.1 Module: Auth (`src/lib/auth/`)
* **Interface (Public Seam):**
  - `auth`: Better Auth server instance.
  - `authClient`: React client hooks (`useSession`, `signIn`, `signOut`).
  - `getSession(request)`: Server helper returning authenticated user profile or null.
* **Implementation:** Encapsulates GitHub OAuth handshake, state tokens, cookie signing, user table upsert, and slug assignment.
* **Depth:** High (hides OAuth 2.0 PKCE exchange, session rotation, and DB session linking behind simple authentication calls).

### 3.2 Module: Projects (`src/lib/projects/`)
* **Interface (Public Seam):**
  - `getPublicProfileBySlug(slug: string)`: Returns public developer bio + published projects.
  - `getPublicProject(userSlug: string, projectSlug: string)`: Returns published project details.
  - `upsertDraftProject(userId: string, input: ProjectDraftInput)`: Creates or autosaves draft.
  - `publishProject(userId: string, projectId: string)`: Quality Gate check + publish transition.
  - `unpublishProject(userId: string, projectId: string)`: Reverts project to DRAFT status.
  - `reorderProjects(userId: string, orderedIds: string[])`: Updates relative positions.
  - `deleteProject(userId: string, projectId: string)`: Deletes project and triggers image purge.
* **Implementation:** Encapsulates Quality Gate validation logic, optimistic concurrency checks (`updated_at`), position reindexing, 30-project/6-featured limits, and markdown sanitization.
* **Depth:** High (hides complex multi-table joins, relational cascades, and business rule enforcement).

### 3.3 Module: Storage (`src/lib/storage/`)
* **Interface (Public Seam):**
  - `createPresignedUploadUrl(userId: string, mimeType: string, fileSize: number)`: Returns signed PUT URL + R2 object key.
  - `deleteImageObject(key: string)`: Deletes object from Cloudflare R2.
* **Implementation:** Encapsulates AWS SDK S3 client, AWS Signature Version 4 calculation, content-length-range policies, and R2 bucket credentials.
* **Depth:** High (consumers see simple URL generator and delete functions; all S3 mechanics are sealed).

### 3.4 Module: Catalog (`src/lib/catalog/`)
* **Interface (Public Seam):**
  - `getAllTechnologies()`: Returns array of cached technology objects with icon keys.
  - `TechBadge`: React component rendering color/mono icon + label offline.
* **Implementation:** Encapsulates build-time generated `icons.json` collection, offline icon registration via `addCollection`, and fuzzy search filtering.
* **Depth:** High (callers render icons with `<TechBadge slug="react" />` without worrying about SVGs or Iconify JSON structures).

### 3.5 Module: Showcase & SEO (`src/lib/seo/`)
* **Interface (Public Seam):**
  - `generatePageMetadata(type, params)`: Next.js metadata generator.
  - `generateJsonLd(type, data)`: Schema.org JSON-LD output (`ProfilePage`, `CreativeWork`).
* **Implementation:** Encapsulates canonical URL normalization, fallback OpenGraph image selection, Twitter card tags, and `noindex` conditions.
* **Depth:** High (hides crawler parsing quirks, OpenGraph tag specifications, and Schema.org compliance).

---

## 4. Database Schema Design (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
}

generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

// ----------------------------------------------------
// Better Auth Core Tables
// ----------------------------------------------------

model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Showphan Profile Extensions
  githubId      String    @unique
  slug          String    @unique
  displayName   String?
  bio           String?   @db.VarChar(160)
  avatarUrl     String?
  searchVisible Boolean   @default(true)

  // Relations
  sessions      Session[]
  accounts      Account[]
  projects      Project[]

  @@index([slug])
  @@index([githubId])
  @@map("users")
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("sessions")
}

model Account {
  id                    String    @id @default(cuid())
  userId                String
  accountId             String
  providerId            String
  accessToken           String?
  refreshToken          String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  idToken               String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([providerId, accountId])
  @@index([userId])
  @@map("accounts")
}

model Verification {
  id         String   @id @default(cuid())
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([identifier])
  @@map("verifications")
}

// ----------------------------------------------------
// Showphan Core Portfolio Entities
// ----------------------------------------------------

enum ProjectStatus {
  DRAFT
  PUBLISHED
}

model Project {
  id            String        @id @default(cuid())
  userId        String
  slug          String
  title         String
  summary       String        @db.VarChar(140)
  description   String        @default("") @db.Text
  coverImageKey String?
  liveUrl       String?
  repoUrl       String?
  role          String?
  learnings     String?
  tags          String[]      @default([])
  status        ProjectStatus @default(DRAFT)
  isFeatured    Boolean       @default(false)
  position      Int           @default(0)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  // Relations
  user          User                 @relation(fields: [userId], references: [id], onDelete: Cascade)
  technologies  ProjectTechnology[]

  @@unique([userId, slug])
  @@index([userId, status, position])
  @@index([userId, isFeatured])
  @@map("projects")
}

model Technology {
  id         String              @id @default(cuid())
  name       String              @unique
  slug       String              @unique
  iconColor  String
  iconMono   String

  projects   ProjectTechnology[]

  @@index([slug])
  @@map("technologies")
}

model ProjectTechnology {
  projectId    String
  technologyId String

  project      Project    @relation(fields: [projectId], references: [id], onDelete: Cascade)
  technology   Technology @relation(fields: [technologyId], references: [id], onDelete: Restrict)

  @@id([projectId, technologyId])
  @@index([technologyId])
  @@map("project_technologies")
}
```

---

## 5. API Contracts (Following the 8 API Laws)

All API responses follow consistent camelCase formatting and error schema:
```json
{
  "error": {
    "code": "ERROR_CODE_STRING",
    "message": "Human-readable explanation of error."
  }
}
```

### 5.1 Project Endpoints

#### `POST /api/projects`
Creates a new project draft.
* **Auth:** Required (Session)
* **Request:**
  ```json
  {
    "title": "My Awesome Project"
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "project": {
      "id": "clxyz...",
      "slug": "my-awesome-project",
      "title": "My Awesome Project",
      "summary": "",
      "status": "DRAFT",
      "updatedAt": "2026-10-09T11:00:00.000Z"
    }
  }
  ```
* **Errors:**
  - `400 BAD_REQUEST`: Title missing or invalid.
  - `403 PROJECT_LIMIT_REACHED`: User already has 30 projects.
  - `401 UNAUTHORIZED`: Session invalid.

#### `PATCH /api/projects/:id`
Autosaves or edits a project draft.
* **Auth:** Required (Session & Ownership)
* **Request:**
  ```json
  {
    "title": "Updated Title",
    "summary": "Short 140 character summary",
    "description": "Markdown description",
    "coverImageKey": "covers/clxyz...webp",
    "liveUrl": "https://example.com",
    "repoUrl": "https://github.com/...",
    "technologyIds": ["tech_1", "tech_2"],
    "tags": ["frontend", "open-source"],
    "role": "Lead Architect",
    "learnings": "Mastered Next.js App Router",
    "clientUpdatedAt": "2026-10-09T11:00:00.000Z"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "project": {
      "id": "clxyz...",
      "updatedAt": "2026-10-09T11:05:00.000Z"
    }
  }
  ```
* **Errors:**
  - `409 STALE_UPDATE`: Incoming `clientUpdatedAt` does not match server `updatedAt`.
  - `400 VALIDATION_FAILED`: Fields exceed length limits (summary > 140 chars, technologies > 15).
  - `404 NOT_FOUND`: Project does not exist or user is not owner.

#### `POST /api/projects/:id/publish`
Validates Quality Gate and transitions draft to published.
* **Auth:** Required (Session & Ownership)
* **Request:** `{}`
* **Response (200 OK):**
  ```json
  {
    "project": {
      "id": "clxyz...",
      "status": "PUBLISHED",
      "publicUrl": "https://showphan.vercel.app/username/project-slug"
    }
  }
  ```
* **Errors:**
  - `422 QUALITY_GATE_FAILED`: Missing one or more of the 5 required publish rules.
    ```json
    {
      "error": {
        "code": "QUALITY_GATE_FAILED",
        "message": "Project cannot be published: missing cover image and live or repository URL.",
        "missingRules": ["coverImage", "url"]
      }
    }
    ```

#### `POST /api/projects/:id/unpublish`
Reverts published project back to DRAFT.
* **Auth:** Required (Session & Ownership)
* **Response (200 OK):**
  ```json
  {
    "project": {
      "id": "clxyz...",
      "status": "DRAFT"
    }
  }
  ```

#### `DELETE /api/projects/:id`
Deletes project record and purges its cover image from R2.
* **Auth:** Required (Session & Ownership)
* **Response (204 No Content)**
* **Errors:**
  - `404 NOT_FOUND`: Project not found.

#### `PATCH /api/projects/reorder`
Updates the display positions of multiple projects.
* **Auth:** Required
* **Request:**
  ```json
  {
    "projectIds": ["clxyz_1", "clxyz_2", "clxyz_3"]
  }
  ```
* **Response (200 OK):** `{ "success": true }`

---

### 5.2 Upload Endpoints

#### `POST /api/uploads/cover`
Issues a signed PUT URL for direct browser-to-R2 upload.
* **Auth:** Required
* **Request:**
  ```json
  {
    "mimeType": "image/webp",
    "fileSize": 450120
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "uploadUrl": "https://<account>.r2.cloudflarestorage.com/showphan-images/...",
    "key": "covers/user_123/proj_456_1728472900.webp"
  }
  ```
* **Errors:**
  - `400 INVALID_FILE_TYPE`: MIME type is not `image/jpeg`, `image/png`, or `image/webp`.
  - `400 FILE_TOO_LARGE`: `fileSize` exceeds 1,048,576 bytes (1MB).

---

### 5.3 GitHub & User Endpoints

#### `GET /api/github/repos`
Fetches authenticated user's public repositories for form prefill.
* **Auth:** Required
* **Query Params:** `?page=1&search=query`
* **Response (200 OK):**
  ```json
  {
    "repositories": [
      {
        "id": 12345,
        "name": "my-repo",
        "description": "A great project",
        "htmlUrl": "https://github.com/...",
        "homepage": "https://my-repo.com",
        "primaryLanguage": "TypeScript",
        "topics": ["nextjs", "react"]
      }
    ]
  }
  ```

#### `PATCH /api/me`
Updates user profile settings.
* **Auth:** Required
* **Request:**
  ```json
  {
    "displayName": "Raja Irfan",
    "bio": "Full-stack developer building Showphan.",
    "searchVisible": true
  }
  ```
* **Response (200 OK):** `{ "success": true }`

---

## 6. Infrastructure Blueprint

```
                      Internet / Visitors / Developers
                                    │
                                    ▼
                     ┌──────────────────────────────┐
                     │         Vercel Edge          │
                     │  (SSL, DNS, ISR CDN Cache)   │
                     └──────────────┬───────────────┘
                                    │
                                    ▼
                     ┌──────────────────────────────┐
                     │   Next.js 16 Serverless      │
                     │   (App Router, API Handlers) │
                     └───────┬──────────────┬───────┘
                             │              │
             ┌───────────────┘              └────────────────┐
             ▼                                               ▼
┌───────────────────────────┐                 ┌───────────────────────────┐
│   Neon PostgreSQL Pool    │                 │   Cloudflare R2 Bucket    │
│  (Database, Prisma pg)    │                 │    (Public Image CDN)     │
└───────────────────────────┘                 └───────────────────────────┘
```

1. **Vercel:** Hosts application code, manages domain routing, SSL termination, and Edge ISR caching.
2. **Neon Database:** Serverless PostgreSQL cluster. Database URL points to pooled connection (`-pooler`) with `pg.Pool` connection management.
3. **Cloudflare R2:** S3-compatible bucket storing WebP 16:9 images. Public domain attached for low-latency image delivery.
4. **GitHub OAuth:** Authenticates developers via GitHub App, requesting minimal read-only public profile scope (`read:user`).

---

## 7. ADR References
- [ADR 0001: Stack and Architecture Selection](file:///d:/Showphan/docs/adr/0001-stack-and-architecture.md)
- [ADR 0002: Data Flow and Module Boundaries](file:///d:/Showphan/docs/adr/0002-data-flow-and-module-boundaries.md)
