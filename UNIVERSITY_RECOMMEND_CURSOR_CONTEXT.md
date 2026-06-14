# University Recommend - Project Context for Cursor

> Purpose: This file gives Cursor the full project context. Before generating code, editing files, or explaining implementation, Cursor should read and follow this document.

---

## 1. Project Name

**University Recommend**

Full name: **University Recommendation System with Local AI Chatbot**

The system helps high school students choose suitable universities and majors based on their score, subject group, preferred major, location, tuition budget, university type, and historical cutoff scores.

---

## 2. Main Goal

Build a web application that allows students to:

1. Search universities.
2. Search majors.
3. View university and major details.
4. Enter their academic profile.
5. Receive recommended university-major programs.
6. Compare suitable options.
7. Chat with a local AI chatbot for admission guidance.

The chatbot must be built locally using **Ollama**. Do not use OpenAI API, Gemini API, Claude API, or any external AI API.

---

## 3. Technology Stack

### Frontend

- Framework: **Next.js**
- Language: **TypeScript**
- UI: React components
- Styling: Tailwind CSS is preferred
- Responsibilities:
  - Render user pages
  - Render admin pages
  - Call backend REST APIs
  - Display recommendation results
  - Display chatbot UI

### Backend

- Framework: **NestJS**
- Language: **TypeScript**
- API style: REST API
- ORM: TypeORM is preferred unless the project already uses another ORM
- Responsibilities:
  - Authentication and authorization
  - CRUD APIs for universities, majors, programs, cutoff scores
  - Recommendation engine
  - Chatbot service
  - Ollama integration
  - Database access

### Database

- Database: **PostgreSQL**
- Primary key strategy: use `BIGSERIAL` for simple student-project implementation
- Foreign keys: use `BIGINT` columns referencing parent table `id`
- Data must be normalized. Do not store all university/major/cutoff data in one large table.

### Local AI Chatbot

- Runtime: **Ollama** running locally
- Example local model names:
  - `llama3.1`
  - `mistral`
  - `qwen2.5`
- Embedding model, if using vector search:
  - `nomic-embed-text`
- The chatbot must answer using local database and local knowledge base only.
- External AI APIs are not allowed.

---

## 4. High-Level Architecture

```text
User Browser
   |
   v
Next.js Frontend
   |
   v
NestJS Backend REST API
   |
   +--> PostgreSQL Database
   |
   +--> Recommendation Engine
   |
   +--> Chatbot Service
           |
           v
        Ollama Local LLM
```

---

## 5. Recommended Repository Structure

```text
university-recommend/
|
├── frontend/                         # Next.js app
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── types/
│   └── package.json
|
├── backend/                          # NestJS app
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── student-profiles/
│   │   ├── universities/
│   │   ├── majors/
│   │   ├── subject-groups/
│   │   ├── admission-methods/
│   │   ├── university-programs/
│   │   ├── cutoff-scores/
│   │   ├── recommendations/
│   │   ├── chatbot/
│   │   ├── ollama/
│   │   └── common/
│   ├── test/
│   └── package.json
|
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   └── sample-data/
|
├── docs/
│   ├── PROJECT_CONTEXT.md
│   ├── API_SPEC.md
│   └── TEST_CASES.md
|
├── docker-compose.yml                # optional: PostgreSQL + backend + frontend
└── README.md
```

---

## 6. Main User Roles

### 6.1. Student

Students can:

- Register and login
- Create or update their academic profile
- Search universities and majors
- Ask for university recommendations
- Save favorite programs
- Chat with the local chatbot

### 6.2. Admin

Admins can:

- Manage universities
- Manage majors
- Manage university-major programs
- Manage subject groups
- Manage admission methods
- Manage cutoff scores
- Manage tuition data
- Manage chatbot knowledge base

---

## 7. Main Functional Modules

### 7.1. Authentication Module

Features:

- Register
- Login
- JWT authentication
- Role-based access control: `student`, `admin`

### 7.2. University Module

Features:

- List universities
- Search universities by name, short name, location, type
- View university detail
- Admin CRUD

### 7.3. Major Module

Features:

- List majors
- Search majors by name, major code, field group
- View major detail
- Admin CRUD

### 7.4. University Program Module

A program means one university offers one major/program.

Example:

- Hanoi University of Science and Technology offers Computer Science
- National Economics University offers Marketing

Features:

- List programs
- View program detail
- Filter by university, major, location, tuition, subject group
- Admin CRUD

### 7.5. Cutoff Score Module

Features:

- Store cutoff scores by year
- Store cutoff scores by university program
- Store cutoff scores by subject group
- Store cutoff scores by admission method
- Used by recommendation engine

### 7.6. Recommendation Module

Features:

- Student enters score, subject group, preferred major, location, tuition budget, university type
- Backend filters suitable programs
- Backend calculates match score
- Backend returns grouped results:
  - Safe
  - Suitable
  - Challenge
  - High risk

### 7.7. Chatbot Module

Features:

- Chat UI on frontend
- Backend receives user question
- Backend retrieves relevant data from PostgreSQL
- Backend builds prompt for Ollama
- Ollama returns answer
- Backend stores chat history
- Chatbot must not call external AI APIs

---

## 8. Database Design Principles

The database must be organized by clear entities:

1. `users`: login accounts
2. `student_profiles`: student preference and score profile
3. `universities`: university master data
4. `majors`: major master data
5. `subject_groups`: exam subject groups such as A00, A01, D01
6. `admission_methods`: admission methods
7. `university_programs`: relationship between universities and majors
8. `program_subject_groups`: subject groups accepted by each university program
9. `cutoff_scores`: historical cutoff scores
10. `tuition_fees`: tuition by university or by program
11. `recommendation_sessions`: each recommendation request
12. `recommendation_results`: recommended programs for each session
13. `favorite_programs`: saved programs by student
14. `chat_sessions`: chatbot conversations
15. `chat_messages`: chatbot messages
16. `knowledge_sources`: chatbot knowledge source documents or records
17. `knowledge_chunks`: smaller text chunks used by chatbot retrieval

Do not duplicate university and major names inside recommendation or cutoff tables. Use foreign keys instead.

---

## 9. Database Schema with Primary Keys and Foreign Keys

### 9.1. users

Purpose: stores login accounts.

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'student',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Primary key:

- `users.id`

Unique key:

- `users.email`

Referenced by:

- `student_profiles.user_id`
- `recommendation_sessions.user_id`
- `favorite_programs.user_id`
- `chat_sessions.user_id`

---

### 9.2. student_profiles

Purpose: stores student score and preferences.

```sql
CREATE TABLE student_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    expected_score NUMERIC(4,2),
    subject_group_code VARCHAR(20),
    preferred_major_keyword VARCHAR(255),
    preferred_location VARCHAR(255),
    max_tuition_fee NUMERIC(15,2),
    preferred_university_type VARCHAR(100),
    career_interest TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_profiles_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);
```

Primary key:

- `student_profiles.id`

Foreign key:

- `student_profiles.user_id` → `users.id`

Business rule:

- One user has one student profile, so `user_id` is unique.

---

### 9.3. universities

Purpose: stores university master data.

```sql
CREATE TABLE universities (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(100),
    university_code VARCHAR(50) UNIQUE,
    type VARCHAR(100),
    location VARCHAR(255),
    address TEXT,
    website VARCHAR(500),
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Primary key:

- `universities.id`

Unique key:

- `universities.university_code`

Referenced by:

- `university_programs.university_id`
- `tuition_fees.university_id`

---

### 9.4. majors

Purpose: stores major master data.

```sql
CREATE TABLE majors (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    major_code VARCHAR(50),
    field_group VARCHAR(255),
    description TEXT,
    career_orientation TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_majors_code_name UNIQUE (major_code, name)
);
```

Primary key:

- `majors.id`

Unique key:

- `(major_code, name)`

Referenced by:

- `university_programs.major_id`

---

### 9.5. subject_groups

Purpose: stores exam subject groups.

Examples: A00, A01, B00, C00, D01.

```sql
CREATE TABLE subject_groups (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255),
    subjects TEXT,
    description TEXT
);
```

Primary key:

- `subject_groups.id`

Unique key:

- `subject_groups.code`

Referenced by:

- `program_subject_groups.subject_group_id`
- `cutoff_scores.subject_group_id`
- `recommendation_sessions.subject_group_id`

---

### 9.6. admission_methods

Purpose: stores admission methods.

Examples:

- National high school exam score
- Academic transcript review
- Competency assessment exam
- Direct admission

```sql
CREATE TABLE admission_methods (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT
);
```

Primary key:

- `admission_methods.id`

Unique key:

- `admission_methods.code`

Referenced by:

- `cutoff_scores.admission_method_id`
- `recommendation_sessions.admission_method_id`

---

### 9.7. university_programs

Purpose: links universities and majors. One university can have many majors. One major can be offered by many universities.

```sql
CREATE TABLE university_programs (
    id BIGSERIAL PRIMARY KEY,
    university_id BIGINT NOT NULL,
    major_id BIGINT NOT NULL,
    program_name VARCHAR(255),
    duration_years NUMERIC(3,1),
    degree_level VARCHAR(100) DEFAULT 'Bachelor',
    language VARCHAR(100) DEFAULT 'Vietnamese',
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_program_university
        FOREIGN KEY (university_id) REFERENCES universities(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_program_major
        FOREIGN KEY (major_id) REFERENCES majors(id)
        ON DELETE CASCADE,
    CONSTRAINT uq_university_major_program
        UNIQUE (university_id, major_id, program_name)
);
```

Primary key:

- `university_programs.id`

Foreign keys:

- `university_programs.university_id` → `universities.id`
- `university_programs.major_id` → `majors.id`

Referenced by:

- `program_subject_groups.university_program_id`
- `cutoff_scores.university_program_id`
- `tuition_fees.university_program_id`
- `recommendation_results.university_program_id`
- `favorite_programs.university_program_id`

---

### 9.8. program_subject_groups

Purpose: stores which subject groups are accepted by each university program.

```sql
CREATE TABLE program_subject_groups (
    id BIGSERIAL PRIMARY KEY,
    university_program_id BIGINT NOT NULL,
    subject_group_id BIGINT NOT NULL,
    CONSTRAINT fk_psg_program
        FOREIGN KEY (university_program_id) REFERENCES university_programs(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_psg_subject_group
        FOREIGN KEY (subject_group_id) REFERENCES subject_groups(id)
        ON DELETE CASCADE,
    CONSTRAINT uq_program_subject_group
        UNIQUE (university_program_id, subject_group_id)
);
```

Primary key:

- `program_subject_groups.id`

Foreign keys:

- `program_subject_groups.university_program_id` → `university_programs.id`
- `program_subject_groups.subject_group_id` → `subject_groups.id`

---

### 9.9. cutoff_scores

Purpose: stores historical cutoff scores by program, year, subject group, and admission method.

```sql
CREATE TABLE cutoff_scores (
    id BIGSERIAL PRIMARY KEY,
    university_program_id BIGINT NOT NULL,
    subject_group_id BIGINT NOT NULL,
    admission_method_id BIGINT NOT NULL,
    year INT NOT NULL,
    score NUMERIC(4,2) NOT NULL,
    note TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cutoff_program
        FOREIGN KEY (university_program_id) REFERENCES university_programs(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_cutoff_subject_group
        FOREIGN KEY (subject_group_id) REFERENCES subject_groups(id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_cutoff_admission_method
        FOREIGN KEY (admission_method_id) REFERENCES admission_methods(id)
        ON DELETE RESTRICT,
    CONSTRAINT uq_cutoff_unique_record
        UNIQUE (university_program_id, subject_group_id, admission_method_id, year)
);
```

Primary key:

- `cutoff_scores.id`

Foreign keys:

- `cutoff_scores.university_program_id` → `university_programs.id`
- `cutoff_scores.subject_group_id` → `subject_groups.id`
- `cutoff_scores.admission_method_id` → `admission_methods.id`

Business rule:

- One program should have only one cutoff score for the same year + subject group + admission method.

---

### 9.10. tuition_fees

Purpose: stores tuition information. Tuition can be stored at university level or program level.

```sql
CREATE TABLE tuition_fees (
    id BIGSERIAL PRIMARY KEY,
    university_id BIGINT NOT NULL,
    university_program_id BIGINT,
    academic_year VARCHAR(20),
    min_fee NUMERIC(15,2),
    max_fee NUMERIC(15,2),
    currency VARCHAR(20) NOT NULL DEFAULT 'VND',
    note TEXT,
    CONSTRAINT fk_tuition_university
        FOREIGN KEY (university_id) REFERENCES universities(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_tuition_program
        FOREIGN KEY (university_program_id) REFERENCES university_programs(id)
        ON DELETE CASCADE
);
```

Primary key:

- `tuition_fees.id`

Foreign keys:

- `tuition_fees.university_id` → `universities.id`
- `tuition_fees.university_program_id` → `university_programs.id`, nullable

Business rule:

- If tuition is general for the university, set `university_program_id = NULL`.
- If tuition is specific to a program, set `university_program_id`.

---

### 9.11. recommendation_sessions

Purpose: stores each recommendation request from a student.

```sql
CREATE TABLE recommendation_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    input_score NUMERIC(4,2) NOT NULL,
    subject_group_id BIGINT,
    admission_method_id BIGINT,
    preferred_major_keyword VARCHAR(255),
    preferred_location VARCHAR(255),
    max_tuition_fee NUMERIC(15,2),
    preferred_university_type VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_recommendation_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_recommendation_subject_group
        FOREIGN KEY (subject_group_id) REFERENCES subject_groups(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_recommendation_admission_method
        FOREIGN KEY (admission_method_id) REFERENCES admission_methods(id)
        ON DELETE SET NULL
);
```

Primary key:

- `recommendation_sessions.id`

Foreign keys:

- `recommendation_sessions.user_id` → `users.id`
- `recommendation_sessions.subject_group_id` → `subject_groups.id`
- `recommendation_sessions.admission_method_id` → `admission_methods.id`

---

### 9.12. recommendation_results

Purpose: stores recommended programs for each recommendation session.

```sql
CREATE TABLE recommendation_results (
    id BIGSERIAL PRIMARY KEY,
    recommendation_session_id BIGINT NOT NULL,
    university_program_id BIGINT NOT NULL,
    latest_cutoff_score NUMERIC(4,2),
    score_difference NUMERIC(4,2),
    match_score NUMERIC(5,2),
    level VARCHAR(50),
    reason TEXT,
    rank_order INT,
    CONSTRAINT fk_result_session
        FOREIGN KEY (recommendation_session_id) REFERENCES recommendation_sessions(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_result_program
        FOREIGN KEY (university_program_id) REFERENCES university_programs(id)
        ON DELETE CASCADE,
    CONSTRAINT uq_recommendation_program
        UNIQUE (recommendation_session_id, university_program_id)
);
```

Primary key:

- `recommendation_results.id`

Foreign keys:

- `recommendation_results.recommendation_session_id` → `recommendation_sessions.id`
- `recommendation_results.university_program_id` → `university_programs.id`

---

### 9.13. favorite_programs

Purpose: stores programs saved by students.

```sql
CREATE TABLE favorite_programs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    university_program_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_favorite_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_favorite_program
        FOREIGN KEY (university_program_id) REFERENCES university_programs(id)
        ON DELETE CASCADE,
    CONSTRAINT uq_user_favorite_program
        UNIQUE (user_id, university_program_id)
);
```

Primary key:

- `favorite_programs.id`

Foreign keys:

- `favorite_programs.user_id` → `users.id`
- `favorite_programs.university_program_id` → `university_programs.id`

---

### 9.14. chat_sessions

Purpose: stores chatbot conversation sessions.

```sql
CREATE TABLE chat_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    title VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_chat_session_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE SET NULL
);
```

Primary key:

- `chat_sessions.id`

Foreign key:

- `chat_sessions.user_id` → `users.id`

---

### 9.15. chat_messages

Purpose: stores messages between user and chatbot.

```sql
CREATE TABLE chat_messages (
    id BIGSERIAL PRIMARY KEY,
    chat_session_id BIGINT NOT NULL,
    sender VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_chat_message_session
        FOREIGN KEY (chat_session_id) REFERENCES chat_sessions(id)
        ON DELETE CASCADE
);
```

Primary key:

- `chat_messages.id`

Foreign key:

- `chat_messages.chat_session_id` → `chat_sessions.id`

Business rule:

- `sender` should be `user` or `bot`.

---

### 9.16. knowledge_sources

Purpose: stores chatbot source documents or data sources.

Examples:

- University admission guide
- Major description document
- FAQ list
- Manually entered admin notes

```sql
CREATE TABLE knowledge_sources (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    source_type VARCHAR(100),
    source_url VARCHAR(500),
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Primary key:

- `knowledge_sources.id`

Referenced by:

- `knowledge_chunks.knowledge_source_id`

---

### 9.17. knowledge_chunks

Purpose: stores smaller text chunks for chatbot retrieval.

If using `pgvector`, add an embedding column later. For the first version, keyword search is acceptable.

```sql
CREATE TABLE knowledge_chunks (
    id BIGSERIAL PRIMARY KEY,
    knowledge_source_id BIGINT NOT NULL,
    title VARCHAR(255),
    content TEXT NOT NULL,
    tags TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_chunk_source
        FOREIGN KEY (knowledge_source_id) REFERENCES knowledge_sources(id)
        ON DELETE CASCADE
);
```

Primary key:

- `knowledge_chunks.id`

Foreign key:

- `knowledge_chunks.knowledge_source_id` → `knowledge_sources.id`

Optional future enhancement:

```sql
-- Optional only if using pgvector
-- CREATE EXTENSION IF NOT EXISTS vector;
-- ALTER TABLE knowledge_chunks ADD COLUMN embedding vector(768);
```

---

## 10. Entity Relationship Summary

```text
users 1---1 student_profiles
users 1---N recommendation_sessions
users 1---N favorite_programs
users 1---N chat_sessions

universities 1---N university_programs
majors 1---N university_programs
university_programs 1---N cutoff_scores
university_programs 1---N tuition_fees
university_programs 1---N recommendation_results
university_programs 1---N favorite_programs

subject_groups 1---N program_subject_groups
subject_groups 1---N cutoff_scores
admission_methods 1---N cutoff_scores

recommendation_sessions 1---N recommendation_results
chat_sessions 1---N chat_messages
knowledge_sources 1---N knowledge_chunks
```

---

## 11. Data Organization Rules

### 11.1. universities table

Store stable university-level information only.

Good examples:

- University name
- Short name
- Location
- Address
- Website
- Type

Do not store major-specific tuition or cutoff score here.

### 11.2. majors table

Store general major information only.

Good examples:

- Major name
- Major code
- Field group
- Description
- Career orientation

Do not store university-specific data here.

### 11.3. university_programs table

Use this table to represent a major opened by a university.

Example:

- University: HUST
- Major: Computer Science
- Program name: Computer Science
- Degree level: Bachelor

This table is the central table for recommendation.

### 11.4. cutoff_scores table

Store historical cutoff score by:

- Program
- Year
- Subject group
- Admission method

This table must not store university name or major name directly.

### 11.5. tuition_fees table

Store tuition by:

- University only, if tuition is general
- University program, if tuition differs by major/program

### 11.6. chatbot knowledge tables

Use `knowledge_sources` for document metadata.
Use `knowledge_chunks` for searchable content.

The chatbot should retrieve relevant chunks, then send them to Ollama as context.

---

## 12. Recommendation Logic

### 12.1. Input

The student provides:

- `input_score`
- `subject_group_id`
- `admission_method_id`
- `preferred_major_keyword`
- `preferred_location`
- `max_tuition_fee`
- `preferred_university_type`

### 12.2. Filtering steps

1. Find majors matching the preferred major keyword.
2. Find active university programs for those majors.
3. Filter programs by subject group.
4. Get latest cutoff score for each program.
5. Filter or score by location.
6. Filter or score by tuition fee.
7. Filter or score by university type.

### 12.3. Score difference

```text
score_difference = input_score - latest_cutoff_score
```

### 12.4. Admission risk level

```text
if score_difference >= 1.5:
    level = 'Safe'
elif score_difference >= -0.5:
    level = 'Suitable'
elif score_difference >= -1.5:
    level = 'Challenge'
else:
    level = 'High Risk'
```

### 12.5. Match score

Suggested weight:

```text
match_score =
  score_fit * 0.40 +
  major_fit * 0.25 +
  location_fit * 0.15 +
  tuition_fit * 0.10 +
  university_type_fit * 0.10
```

Where each component is from 0 to 100.

### 12.6. Output

Return a list sorted by:

1. Match score descending
2. Admission level priority
3. Score difference descending
4. Latest cutoff score descending

Each result should include:

- University name
- Major name
- Program name
- Location
- University type
- Latest cutoff score
- Score difference
- Match score
- Level
- Reason

---

## 13. Chatbot Logic with Ollama

### 13.1. Chatbot must be local-first

Rules:

- Do not call external AI APIs.
- Use Ollama running on local machine.
- Use PostgreSQL data as the main source of truth.
- If the answer is not in the database or knowledge base, the bot should say it does not have enough data.

### 13.2. Chatbot processing flow

```text
User question
   |
   v
NestJS ChatbotController
   |
   v
ChatbotService
   |
   +--> Detect intent
   +--> Query PostgreSQL structured data
   +--> Retrieve knowledge chunks
   +--> Build prompt
   |
   v
OllamaService
   |
   v
Local Ollama model
   |
   v
Bot answer
   |
   v
Save chat_messages
```

### 13.3. Chatbot supported question groups

The chatbot should support:

1. Recommendation by score
2. University search
3. Major search
4. Cutoff score lookup
5. Tuition lookup
6. Admission method explanation
7. General career/major explanation based on local knowledge base

### 13.4. Suggested prompt rule for Ollama

The backend should send a strict prompt similar to this:

```text
You are a university admission advisor for Vietnamese high school students.
Answer only based on the provided database context and knowledge context.
If the information is missing, say that the system does not have enough data.
Do not invent university names, cutoff scores, tuition fees, or admission rules.
Use simple Vietnamese.

Database context:
{{structuredData}}

Knowledge context:
{{knowledgeChunks}}

User question:
{{userQuestion}}
```

---

## 14. Backend NestJS Modules

Recommended modules:

```text
src/
├── auth/
├── users/
├── student-profiles/
├── universities/
├── majors/
├── subject-groups/
├── admission-methods/
├── university-programs/
├── cutoff-scores/
├── tuition-fees/
├── recommendations/
├── chatbot/
├── ollama/
└── common/
```

### 14.1. AuthModule

Responsibilities:

- Register
- Login
- JWT strategy
- Role guard

### 14.2. UniversitiesModule

Responsibilities:

- University CRUD
- Search/filter universities

### 14.3. UniversityProgramsModule

Responsibilities:

- Manage university-major relationship
- Search programs
- Return program detail with university, major, cutoff, tuition

### 14.4. RecommendationsModule

Responsibilities:

- Receive recommendation input
- Run recommendation algorithm
- Save recommendation session
- Save recommendation results
- Return ranked programs

### 14.5. ChatbotModule

Responsibilities:

- Receive user question
- Retrieve structured data
- Retrieve knowledge chunks
- Call OllamaService
- Save chat history

### 14.6. OllamaModule

Responsibilities:

- Call local Ollama API
- Hide Ollama connection details from other modules
- Handle timeout and errors

Default local Ollama endpoint:

```text
http://localhost:11434/api/generate
```

---

## 15. REST API Specification

### 15.1. Auth

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### 15.2. Universities

```text
GET    /api/universities
GET    /api/universities/:id
POST   /api/universities
PATCH  /api/universities/:id
DELETE /api/universities/:id
```

### 15.3. Majors

```text
GET    /api/majors
GET    /api/majors/:id
POST   /api/majors
PATCH  /api/majors/:id
DELETE /api/majors/:id
```

### 15.4. University Programs

```text
GET    /api/university-programs
GET    /api/university-programs/:id
POST   /api/university-programs
PATCH  /api/university-programs/:id
DELETE /api/university-programs/:id
```

### 15.5. Cutoff Scores

```text
GET    /api/cutoff-scores
POST   /api/cutoff-scores
PATCH  /api/cutoff-scores/:id
DELETE /api/cutoff-scores/:id
```

### 15.6. Recommendations

```text
POST /api/recommendations
GET  /api/recommendations/history
GET  /api/recommendations/:id
```

### 15.7. Chatbot

```text
POST /api/chatbot/sessions
GET  /api/chatbot/sessions
GET  /api/chatbot/sessions/:id/messages
POST /api/chatbot/ask
```

---

## 16. Frontend Next.js Pages

Recommended pages:

```text
app/
├── page.tsx                              # Home page
├── login/page.tsx
├── register/page.tsx
├── universities/page.tsx
├── universities/[id]/page.tsx
├── majors/page.tsx
├── majors/[id]/page.tsx
├── recommend/page.tsx
├── recommend/results/page.tsx
├── chatbot/page.tsx
├── profile/page.tsx
└── admin/
    ├── page.tsx
    ├── universities/page.tsx
    ├── majors/page.tsx
    ├── programs/page.tsx
    └── cutoff-scores/page.tsx
```

---

## 17. Environment Variables

### 17.1. Backend `.env`

```text
PORT=3001
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=university_recommend
JWT_SECRET=change_this_secret
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1
```

### 17.2. Frontend `.env.local`

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

---

## 18. Development Priorities

### Phase 1 - Core database and backend

1. Create PostgreSQL schema
2. Seed sample universities, majors, subject groups, admission methods, cutoff scores
3. Build NestJS modules for universities and majors
4. Build university-program and cutoff-score APIs

### Phase 2 - Frontend core pages

1. Home page
2. University list and detail
3. Major list and detail
4. Recommendation form
5. Recommendation result page

### Phase 3 - Recommendation engine

1. Implement filtering
2. Implement match score
3. Implement admission risk level
4. Save recommendation session and results

### Phase 4 - Chatbot

1. Setup Ollama locally
2. Build OllamaService in NestJS
3. Build ChatbotService
4. Build chatbot UI in Next.js
5. Store chat history

### Phase 5 - Admin and polish

1. Admin CRUD pages
2. Import seed data
3. Validate forms
4. Improve UI
5. Add test cases

---

## 19. Minimum Viable Product Scope

If time is short, build these first:

1. PostgreSQL database with sample data
2. University list/detail
3. Major list/detail
4. Recommendation form/result
5. Basic chatbot using Ollama
6. Admin CRUD for universities, majors, cutoff scores

Optional later:

1. Favorite programs
2. Compare universities
3. Advanced chatbot retrieval with pgvector
4. Charts for cutoff trends
5. Import Excel/CSV data

---

## 20. Coding Rules for Cursor

When Cursor edits or generates code for this project, follow these rules:

1. Use **Next.js** for frontend.
2. Use **NestJS** for backend.
3. Use **PostgreSQL** for database.
4. Use TypeScript in both frontend and backend.
5. Do not use external AI APIs.
6. Chatbot must use local Ollama only.
7. Do not hardcode university data in frontend components.
8. University, major, cutoff, and tuition data must come from backend APIs.
9. Keep database normalized.
10. Use DTOs in NestJS for request validation.
11. Use services for business logic.
12. Controllers should be thin.
13. Recommendation logic should be in `RecommendationsService`.
14. Ollama call logic should be in `OllamaService`.
15. Chatbot prompt construction should be in `ChatbotService`.
16. Never invent data that is not in the database.
17. Use clear Vietnamese UI labels because the target users are Vietnamese students.

---

## 21. Example Seed Data Scope

Start with this sample size:

```text
Universities: 10-20
Majors: 10-15
Subject groups: A00, A01, B00, C00, D01, D07
Admission methods: 3-5
University programs: 30-50
Cutoff scores: latest 3 years
Knowledge chunks: 30-50 FAQ/admission/major explanation records
```

---

## 22. Expected Final Deliverables

The final project should include:

1. Next.js frontend source code
2. NestJS backend source code
3. PostgreSQL schema SQL
4. PostgreSQL seed data SQL
5. Local Ollama chatbot integration
6. Recommendation engine
7. Admin CRUD pages
8. User guide
9. API documentation
10. Demo script

---

## 23. Project Summary for AI Assistant

This project is not a generic school search website. It is a structured university recommendation system.

The most important features are:

1. Data model quality
2. Correct university-major-cutoff relationships
3. Recommendation scoring
4. Local chatbot using Ollama
5. Clean separation between Next.js frontend, NestJS backend, and PostgreSQL database

Cursor should always respect this architecture when generating or editing code.
