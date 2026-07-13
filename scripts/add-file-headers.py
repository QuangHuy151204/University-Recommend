#!/usr/bin/env python3
"""Add a short English purpose comment at the top of TS/TSX source files."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MARKER = "// @file:"
FRONTEND = ROOT / "frontend"
BACKEND_SRC = ROOT / "backend" / "src"

SKIP_DIRS = {"node_modules", "dist", ".next", ".git"}

# Human-readable domain label per backend/frontend folder
MODULE_LABELS: dict[str, str] = {
    "admin": "admin dashboard and system statistics",
    "admission-methods": "admission method catalog (THPT, HOC_BA, DGNL, etc.)",
    "auth": "user registration, login, JWT cookies, and password reset",
    "chatbot": "chatbot sessions, intents, and database-grounded answers",
    "common": "shared backend helpers used across modules",
    "cutoff-scores": "historical admission cutoff scores",
    "data": "offline data enrichment for majors and careers",
    "database": "database migrations",
    "favorites": "student favorite universities and programs",
    "mail": "email verification and password-reset delivery",
    "majors": "major catalog, groups, and university-program links",
    "ollama": "local Ollama LLM client for chatbot NLU and rewrite",
    "recommendations": "weighted university-major recommendation engine",
    "universities": "university catalog, search, and filters",
    "university-majors": "university–major program links",
    "users": "user accounts and student profiles",
    "scripts": "CLI scripts for import and data maintenance",
    "components": "reusable React UI components",
    "hooks": "reusable React hooks",
    "lib": "frontend utilities and shared client logic",
    "services": "typed HTTP clients for the NestJS API",
    "types": "TypeScript types mirroring API responses",
    "app": "Next.js App Router pages and layouts",
}

# Exact overrides for files that need a clearer one-line description
PURPOSE_OVERRIDES: dict[str, str] = {
  # App bootstrap
  "backend/src/main.ts": "Bootstraps the NestJS API server, global pipes, CORS, and Swagger.",
  "backend/src/app.module.ts": "Root NestJS module that wires all feature modules together.",
  "backend/src/app.controller.ts": "Simple health/root endpoint for the API.",
  "backend/src/app.service.ts": "Minimal root service used by the health endpoint.",
  "backend/src/data-source.ts": "TypeORM DataSource configuration for migrations and CLI import scripts.",
  "backend/src/import-excel.ts": "Loads master Excel data (universities, majors, cutoffs) into PostgreSQL.",
  "backend/src/import-tuition-excel.ts": "Updates tuition fee fields in the database from an Excel batch file.",
  "backend/scripts/import-excel.ts": "CLI entry point that runs the Excel-to-PostgreSQL import.",
  "backend/scripts/enrich-career-orientation.ts": "CLI that enriches major career_orientation fields in Excel and optionally imports them.",
  "frontend/next.config.ts": "Next.js build and runtime configuration.",
  "frontend/types/index.ts": "Shared frontend TypeScript types aligned with NestJS API JSON shapes.",
  "frontend/lib/api.ts": "Central fetch wrapper with JWT cookies, error handling, and base API URL.",
  "frontend/lib/auth.tsx": "React auth context: login state, token cookie, and protected-route helpers.",
  "frontend/lib/i18n/translations.ts": "Vietnamese/English UI string catalog for the frontend.",
  "frontend/lib/i18n/locale.tsx": "React context that switches UI language at runtime.",
  # Chatbot internals
  "backend/src/chatbot/chatbot.service.ts": "Orchestrates chat turns: intent routing, DB queries, Ollama rewrite, and session history.",
  "backend/src/chatbot/chatbot-intent-rules.ts": "Rule-based intent classification and keyword guards before handlers run.",
  "backend/src/chatbot/chatbot-intent-pipeline.ts": "Merges Ollama intent scores with rule-based intent resolution.",
  "backend/src/chatbot/chatbot-guardrails.ts": "Anti-hallucination checks: prefer rules over bad LLM intents and validate entities.",
  "backend/src/chatbot/scope-guards.ts": "Early replies for out-of-scope or Hanoi-only boundary questions.",
  "backend/src/chatbot/major-search.ts": "Resolves major names and interest phrases from free-text chat messages.",
  "backend/src/chatbot/university-extract.ts": "Extracts university names and aliases from user messages.",
  "backend/src/chatbot/university-aliases.ts": "Normalizes common university abbreviations and alternate spellings.",
  "backend/src/chatbot/intent-corpus.ts": "Intent examples and handler metadata used by the chatbot classifier.",
  "backend/src/chatbot/intent-corpus.generated.ts": "Auto-generated intent corpus — do not edit by hand.",
  "backend/src/chatbot/chatbot-format.ts": "Formats chatbot answers as Markdown bullets and tables.",
  "backend/src/chatbot/chatbot-copy.ts": "Static disclaimer and scope copy shown in chatbot replies.",
  "backend/src/chatbot/chat-session-context.ts": "Builds session context hints from prior chat turns for follow-up questions.",
  "backend/src/chatbot/chat-session-policy.ts": "Session lifecycle rules: create, reuse, and expire chat sessions.",
  "backend/src/chatbot/chatbot-e2e-cases.ts": "Regression chat questions with expected intents for QA runs.",
  "backend/src/chatbot/chatbot-follow-up-e2e-cases.ts": "Follow-up chat regression cases that depend on session context.",
  "backend/src/chatbot/chatbot-recommendation-e2e-cases.ts": "Chat regression cases for score-based recommendation intents.",
  # Recommendations internals
  "backend/src/recommendations/recommendations.service.ts": "Scores and ranks university–major pairs using weighted criteria and saves results.",
  "backend/src/recommendations/recommendation-tier.ts": "Maps score gaps to Reach/Match/Safety tiers and caps result diversity.",
  "backend/src/recommendations/score-trend.ts": "Analyzes cutoff score trends across years for recommendation reasons.",
  "backend/src/recommendations/interest-synonyms.ts": "Expands student interest keywords to match major names and tags.",
  "backend/src/recommendations/recommendations-regression.fixture.ts": "Fixed inputs and expected ranks for recommendation regression tests.",
  # Majors / data
  "backend/src/majors/major-classification.ts": "Assigns majors to field groups and tags from classification rules.",
  "backend/src/majors/major-groups-catalog.ts": "Canonical list of major groups used during import and browsing.",
  "backend/src/majors/major-interest-match.ts": "Matches student interest phrases against major names, tags, and careers.",
  "backend/src/majors/major-name-match.ts": "Fuzzy matching helpers for major name search.",
  "backend/src/majors/duplicate-cleanup.ts": "Detects and merges duplicate major records during import.",
  "backend/src/data/career-orientation-enrichment.ts": "Rules that fill career_orientation text for IT, economics, and medical majors.",
  "backend/src/cutoff-scores/cutoff-scores.service.ts": "Queries and admin-updates cutoff scores by university, major, year, subject combination, and admission method.",
  "backend/src/cutoff-scores/cutoff-scores.controller.ts": "REST endpoints for students to browse cutoffs and admins to manage cutoff rows.",
  "backend/src/cutoff-scores/cutoff-score.entity.ts": "TypeORM entity for one admission cutoff score row linked to a university–major program.",
  "backend/src/cutoff-scores/cutoff-admin.dto.ts": "Validated DTOs for admin create/update of cutoff score records.",
  "backend/src/cutoff-scores/cutoff-scores.module.ts": "Registers cutoff score controllers, services, and TypeORM repositories.",
  "backend/src/universities/university-filter-evaluator.ts": "Evaluates whether a university matches search filters (tuition, ward, type).",
  "backend/src/universities/university-filtered-major-cutoff.ts": "Builds per-major cutoff summaries for a university detail view.",
  "backend/src/universities/university-cutoff-filter.ts": "Filters university majors by latest cutoff relative to a student score.",
  "backend/src/common/data-scope.ts": "Defines Hanoi-only data scope helpers used across search and recommendations.",
  "backend/src/common/subject-combination.ts": "Normalizes and validates THPT subject combination codes (A00, D01, …).",
  "backend/src/common/university-display-order.ts": "Sort order for pinning preferred universities in lists and chat answers.",
  "backend/src/common/ward.ts": "Ward (phường) normalization for Hanoi location filters.",
  "backend/src/common/scalar.ts": "Safe parsing of unknown JSON/Excel scalar values to strings and numbers.",
  "backend/src/common/typeorm-relations.ts": "Helpers for loading TypeORM relation graphs consistently.",
  # Ollama
  "backend/src/ollama/ollama.service.ts": "Calls local Ollama for intent classify, entity extract, answer rewrite, and warmup.",
  # Frontend pages
  "frontend/app/page.tsx": "Public landing page with product overview and links to auth.",
  "frontend/app/home/page.tsx": "Authenticated student dashboard with quick links and featured major groups.",
  "frontend/app/chatbot/page.tsx": "Chat UI: message list, session sidebar, suggested prompts, and compare cards.",
  "frontend/app/recommend/page.tsx": "Recommendation wizard page where students submit score and preferences.",
  "frontend/app/cutoff-scores/page.tsx": "Cutoff score explorer: filter schools and majors by year and admission method.",
  "frontend/app/favorites/page.tsx": "Lists universities and programs the student saved as favorites.",
  "frontend/app/profile/page.tsx": "Student profile editor for score, interests, budget, and career goals.",
  "frontend/app/login/page.tsx": "Login page with email/password form and post-auth redirect.",
  "frontend/app/register/page.tsx": "Student registration form that creates an account and triggers email verification.",
  "frontend/app/forgot-password/page.tsx": "Form to request a password-reset code by email.",
  "frontend/app/reset-password/page.tsx": "Form to set a new password using a reset token.",
  "frontend/app/verify-email/page.tsx": "Page where students confirm their email with a verification code.",
  "frontend/app/universities/page.tsx": "University search and filter page for logged-in students.",
  "frontend/app/universities/[id]/page.tsx": "University detail page with majors, cutoffs, tuition, and favorite actions.",
  "frontend/app/majors/page.tsx": "Major catalog page with search and major group navigation.",
  "frontend/app/majors/[id]/page.tsx": "Major detail page listing universities that offer the program.",
  "frontend/app/majors/groups/[slug]/page.tsx": "Lists majors belonging to one major group slug.",
  "frontend/app/admin/page.tsx": "Admin dashboard shell with tabbed management panels.",
  # Frontend key components
  "frontend/components/RecommendWizard.tsx": "Multi-step form that collects preferences and calls the recommendation API.",
  "frontend/components/RecommendResults.tsx": "Renders ranked recommendation results with tiers and reasons.",
  "frontend/components/AuthGate.tsx": "Redirects guests to login before protected student features.",
  "frontend/components/admin/AdminGate.tsx": "Restricts admin routes to authenticated admin users.",
  "frontend/lib/university-compare.ts": "Client-side storage and URL helpers for the university compare feature.",
  "frontend/lib/favorites.tsx": "React context for loading and mutating the user's favorites list.",
}

COMPONENT_OVERRIDES: dict[str, str] = {
    "CutoffScoresPanel": "Admin table to create, edit, and filter cutoff score rows.",
    "UniversitiesPanel": "Admin CRUD UI for university records including tuition and ward.",
    "MajorsPanel": "Admin CRUD UI for majors and field groups.",
    "UniversityMajorsPanel": "Admin UI for university–major program links and program tuition.",
    "AdmissionMethodsPanel": "Admin CRUD UI for admission method codes and labels.",
    "DashboardPanel": "Admin overview cards with database counts and quick links.",
    "CutoffScoresExplorer": "Student UI to browse and filter cutoff scores across schools.",
    "UniversitiesExplorer": "Student UI to search and filter universities.",
    "RecommendWizard": "Step-by-step recommendation input form.",
    "RecommendResults": "Displays API recommendation results with match scores.",
    "ChatbotPromptHelper": "Suggested question chips shown above the chat input.",
    "ChatCompareCard": "Inline university comparison card rendered inside chat replies.",
    "FavoriteButton": "Toggle favorite state for a university.",
    "FavoriteProgramButton": "Toggle favorite state for a specific university–major program.",
    "CompareUniversityButton": "Adds or removes a university from the compare list.",
    "UniversityCompareView": "Renders the comparison table for multiple universities.",
    "HomeDashboard": "Logged-in home hub with shortcuts to search, recommend, and chatbot.",
    "LandingPage": "Marketing-style landing content for anonymous visitors.",
    "Navbar": "Top navigation with auth state, language switcher, and main links.",
    "Footer": "Site footer with project links and attribution.",
    "AppShell": "Shared page chrome wrapping navbar, footer, and auth gate.",
    "AdminShell": "Admin layout with sidebar tabs and content area.",
    "WardPicker": "Autocomplete picker for Hanoi ward filters.",
    "SubjectCombinationPicker": "Dropdown for THPT subject combination codes.",
    "MajorSearchPicker": "Searchable major picker used in forms and filters.",
    "CutoffMethodFilter": "Filter control for admission method when viewing cutoffs.",
    "ChatMarkdown": "Renders assistant chat messages as Markdown with GFM tables.",
    "ChatbotAvatar": "Chatbot character avatar shown in the chat header.",
    "FavoritesSection": "Profile section listing saved universities and programs.",
    "FeaturedMajorGroups": "Home grid of popular major groups with links.",
    "MajorGroupGrid": "Grid of major group cards with counts.",
    "MajorProgramsSection": "Lists programs offering a major at various universities.",
    "MajorProgramCard": "Card showing one university program for a major.",
    "LanguageSwitcher": "Toggles UI language between Vietnamese and English.",
    "PasswordInput": "Password field with show/hide toggle.",
    "SearchField": "Reusable debounced search input.",
    "PageLayout": "Consistent page title, breadcrumb, and content width wrapper.",
    "Stepper": "Visual step indicator for multi-step flows.",
    "RecommendFilterSummary": "Shows which filters were applied to recommendation results.",
    "RecommendEmptyState": "Empty state when no recommendations match the criteria.",
    "CompareIdsFromStorage": "Hydrates compare page URL from localStorage on first load.",
    "AdminSortableTh": "Sortable table header used in admin panels.",
}

SERVICE_OVERRIDES: dict[str, str] = {
    "auth": "API client for register, login, logout, email verification, and password reset.",
    "chatbot": "API client for chat messages, sessions, and history.",
    "cutoff-scores": "API client for cutoff score queries and subject-combination options.",
    "favorites": "API client for listing and updating user favorites.",
    "majors": "API client for major list, detail, and major group endpoints.",
    "recommendations": "API client that posts recommendation requests to the backend.",
    "universities": "API client for university search, detail, and compare data.",
    "admission-methods": "API client for the admission method catalog.",
    "admin": "API client for admin CRUD operations on master data.",
}


def should_process(path: Path) -> bool:
    if path.suffix not in {".ts", ".tsx"}:
        return False
    if set(path.parts) & SKIP_DIRS:
        return False
    rel = path.relative_to(ROOT).as_posix()
    if rel.startswith("backend/dist/"):
        return False
    return rel.startswith(("backend/src/", "backend/scripts/", "frontend/"))


def rel_key(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def module_folder(path: Path) -> str | None:
    rel = rel_key(path)
    parts = Path(rel).parts
    if rel.startswith("backend/src/") and len(parts) >= 3:
        return parts[2]
    if rel.startswith("backend/scripts/"):
        return "scripts"
    if rel.startswith("frontend/"):
        if "components" in parts:
            return "components"
        if "lib" in parts:
            return "lib"
        if "services" in parts:
            return "services"
        if "hooks" in parts:
            return "hooks"
        if "types" in parts:
            return "types"
        if "app" in parts:
            return "app"
    return None


def humanize(name: str) -> str:
    s = re.sub(r"([a-z0-9])([A-Z])", r"\1 \2", name)
    return s.replace("_", " ").replace("-", " ").strip().lower()


def migration_purpose(stem: str) -> str:
    slug = re.sub(r"^\d+-", "", stem)
    slug = slug.replace("-", " ").strip()
    return f"Database migration: {slug}."


def _in_path(key: str, segment: str) -> bool:
    return segment in key.replace("\\", "/")


def infer_purpose(path: Path) -> str:
    key = rel_key(path)
    if key in PURPOSE_OVERRIDES:
        return PURPOSE_OVERRIDES[key]

    name = path.name
    mod = module_folder(path) or ""
    label = MODULE_LABELS.get(mod, humanize(mod) or "application")

    if name.endswith(".spec.ts"):
        target = name[: -len(".spec.ts")]
        return f"Automated tests for {humanize(target)}."

    if name.endswith(".fixture.ts"):
        target = name[: -len(".fixture.ts")]
        return f"Test fixture data for {humanize(target)}."

    if name.endswith(".cases.ts"):
        target = name[: -len(".cases.ts")]
        return f"Structured test cases for {humanize(target)}."

    if "/migrations/" in key:
        return migration_purpose(path.stem)

    if name.endswith(".controller.ts"):
        return f"REST API endpoints exposing {label}."

    if name.endswith(".service.ts"):
        return f"Business logic for {label}."

    if name.endswith(".module.ts"):
        return f"NestJS module that registers {label} controllers, services, and entities."

    if name.endswith(".entity.ts"):
        stem = path.stem.replace(".entity", "")
        return f"TypeORM entity mapping the {humanize(stem)} table in PostgreSQL."

    if name.endswith(".dto.ts"):
        return f"Validated request/response DTOs for {label}."

    if name.endswith(".guard.ts"):
        return f"Route guard that enforces access rules for {label}."

    if name.endswith(".strategy.ts"):
        return f"Passport strategy that validates JWT tokens for authenticated routes."

    if name.endswith(".decorator.ts"):
        return f"Custom decorator used by the auth/roles system."

    if name.endswith(".types.ts"):
        return f"Shared TypeScript types for {label}."

    if name == "page.tsx" and _in_path(key, "frontend/app/"):
        route = path.parent.relative_to(FRONTEND / "app").as_posix()
        route_label = "/" if route == "." else f"/{route}"
        return f"Next.js page route for {route_label}."

    if name == "layout.tsx" and _in_path(key, "frontend/app/"):
        route = path.parent.relative_to(FRONTEND / "app").as_posix()
        route_label = "/" if route == "." else f"/{route}"
        return f"Next.js layout wrapper shared by pages under {route_label}."

    if name.endswith(".tsx") and _in_path(key, "frontend/components/"):
        stem = path.stem
        if stem in COMPONENT_OVERRIDES:
            return COMPONENT_OVERRIDES[stem]
        return f"React UI component: {humanize(stem)}."

    if _in_path(key, "frontend/services/") and name.endswith(".ts"):
        stem = path.stem
        if stem in SERVICE_OVERRIDES:
            return SERVICE_OVERRIDES[stem]
        return f"HTTP client for the {humanize(stem)} API."

    if _in_path(key, "frontend/hooks/"):
        return f"React hook encapsulating {humanize(path.stem)} state and side effects."

    if _in_path(key, "frontend/lib/"):
        if key in PURPOSE_OVERRIDES:
            return PURPOSE_OVERRIDES[key]
        return f"Frontend helper module for {humanize(path.stem)}."

    if _in_path(key, "scripts/"):
        return f"CLI script: {humanize(path.stem)}."

    if mod == "common":
        return f"Shared utility: {humanize(path.stem)}."

    return f"Source file for {label}: {humanize(path.stem)}."


def remove_file_headers(content: str) -> str:
    lines = content.splitlines(keepends=True)
    return "".join(line for line in lines if "// @file:" not in line)


def insert_header(content: str, header: str) -> str:
    base = remove_file_headers(content)
    lines = base.splitlines(keepends=True)
    insert_at = 0
    if lines and lines[0].startswith("#!"):
        insert_at = 1
    while insert_at < len(lines):
        stripped = lines[insert_at].strip()
        if stripped in {"'use client';", '"use client";', "'use server';", '"use server";'}:
            insert_at += 1
            break
        if stripped == "":
            insert_at += 1
            continue
        break
    return "".join(lines[:insert_at]) + header + "".join(lines[insert_at:])


def build_header(path: Path) -> str:
    return f"// @file: {infer_purpose(path)}\n"


def process_file(path: Path, force: bool = False) -> bool:
    try:
        content = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return False

    if not force and any("// @file:" in line for line in content.splitlines()[:12]):
        return False

    new_content = insert_header(content, build_header(path))
    if new_content == content:
        return False

    path.write_text(new_content, encoding="utf-8", newline="\n")
    return True


def main() -> int:
    force = "--force" in sys.argv
    changed = 0
    skipped = 0

    targets: list[Path] = []
    for base in [BACKEND_SRC, ROOT / "backend" / "scripts", FRONTEND]:
        if base.exists():
            targets.extend(p for p in base.rglob("*") if p.is_file() and should_process(p))

    for path in sorted({p.resolve() for p in targets}):
        if process_file(path, force=force):
            changed += 1
        else:
            skipped += 1

    print(f"Updated: {changed}, skipped: {skipped}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
