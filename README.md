# University Recommend

Hệ thống web gợi ý trường đại học và ngành học cho học sinh THPT, kèm chatbot tư vấn (mục tiêu: **Ollama local**). Dữ liệu điểm chuẩn chủ yếu lấy từ [Tuyensinh247](https://diemthi.tuyensinh247.com/diem-chuan.html), chuẩn hóa qua Excel rồi import vào **PostgreSQL**.

## Stack

| Thành phần | Công nghệ | Trạng thái |
|------------|-----------|------------|
| Frontend | Next.js 16 (App Router) + Tailwind 4 | MVP: home, universities, majors (phân trang), recommend, auth, profile, chatbot, **admin CRUD** (`/admin`) |
| Backend | NestJS + TypeORM | Đã có |
| Database | PostgreSQL | Đã có |
| Chatbot | Ollama local + fallback rule-based | Mặc định `OLLAMA_ENABLED=true`: Ollama vừa **classify intent** vừa **rewrite câu trả lời**. Tắt bằng `OLLAMA_ENABLED=false` khi chưa cài Ollama. |
| Dữ liệu | Excel + Python scrape | Đã có |

## Cấu trúc thư mục

```text
UniversityRecommend/
├── backend/                              # API NestJS
├── frontend/                             # Next.js App Router
├── .cursor/rules/                        # Quy tắc cho Cursor AI
├── mau_du_lieu_truong_dai_hoc_5_sheets.xlsx
├── scrape_and_fill_excel.py              # Scrape TS247 → Excel
├── README.md
└── UNIVERSITY_RECOMMEND_CURSOR_CONTEXT.md
```

## Yêu cầu hệ thống

- **Node.js** 18+ (khuyến nghị 20+)
- **npm**
- **PostgreSQL** 14+ 
- **Python** 3.10+ (cho scrape Excel)
- **Ollama** (khi làm chatbot LLM): [https://ollama.com](https://ollama.com)

---

## Cài đặt lần đầu

### 1. PostgreSQL

1. Cài PostgreSQL và tạo database:

```sql
CREATE DATABASE university_recommend;
```

2. Ghi nhớ user/password (mặc định thường `postgres`).

### 2. Backend

```powershell
cd d:\UniversityRecommend\backend
npm install
```

Tạo file `backend/.env` (copy và sửa giá trị):

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=university_recommend

JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d

ADMIN_SEED_ENABLED=true
ADMIN_USERNAME=Admin
ADMIN_EMAIL=admin@system.local
ADMIN_PASSWORD=your_strong_admin_password

PORT=3001

# Chatbot Ollama (mặc định bật — xem mục Chatbot ở dưới)
# Nếu chưa cài Ollama, đổi OLLAMA_ENABLED=false để tránh timeout 20s mỗi câu.
OLLAMA_ENABLED=true
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:3b
OLLAMA_TIMEOUT_MS=20000
```

Tham khảo `backend/.env.example`.

**Schema (migration, không dùng `synchronize` mặc định):**

- `DB_SYNCHRONIZE=false` — TypeORM **không** tự sửa bảng khi đổi entity (tránh mất cột/dữ liệu lúc deploy).
- `DB_MIGRATIONS_RUN=true` — khi `npm run start:dev` / `start:prod`, chạy migration chưa áp dụng.

```powershell
cd d:\UniversityRecommend\backend
npm run migration:run    # chạy tay nếu cần
npm run migration:show   # xem migration đã chạy chưa
```

DB **trống hoàn toàn** (chưa từng có bảng): bật tạm `DB_SYNCHRONIZE=true`, khởi động backend **một lần** để tạo 8 bảng master, tắt lại `false`, rồi `npm run migration:run` (tạo chat + import Excel).

### 3. Python (scrape dữ liệu)

```powershell
cd d:\UniversityRecommend
pip install pandas openpyxl requests beautifulsoup4 lxml
```

### 4. Frontend

```powershell
cd d:\UniversityRecommend\frontend
npm install
```

Tạo `frontend/.env.local` (copy từ `.env.local.example`):

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Cấu trúc hiện tại:

```text
frontend/
├── app/                        # /, /universities, /majors, /login, /profile, /chatbot, /admin, …
├── components/                 # Navbar, CutoffMethodFilter, admin/AdminShell
├── lib/                        # api.ts, auth.tsx
├── services/                   # universities, majors, admin, chatbot, …
└── types/index.ts
```

### Admin (quản trị dữ liệu)

Cấu hình trong `backend/.env` (xem `.env.example`):

```env
ADMIN_SEED_ENABLED=true
ADMIN_USERNAME=Admin
ADMIN_EMAIL=admin@system.local
ADMIN_PASSWORD=your_strong_admin_password
```

Khi backend khởi động, tự tạo/đồng bộ tài khoản admin từ các biến trên (bỏ qua nếu `ADMIN_PASSWORD` trống). Đăng nhập: [http://localhost:3000/admin/login](http://localhost:3000/admin/login) — dùng **username** hoặc **email** admin (không cần xác minh email).

Trang admin:

- `/admin` — dashboard (số trường, ngành, điểm chuẩn, user)
- `/admin/universities`, `/admin/majors`, `/admin/university-majors`, `/admin/cutoff-scores`, `/admin/admission-methods` — CRUD

API ghi (POST/PUT/PATCH/DELETE) trên master data yêu cầu JWT role `admin` (`RolesGuard`). Swagger vẫn dùng được với cookie/token admin.

---

## Chạy ứng dụng

### Thứ tự khuyến nghị

1. Bật PostgreSQL  
2. Chạy backend  
3. Chạy frontend (`npm run dev` trong `frontend/`)  
4. Bật Ollama nếu dùng chatbot LLM (`OLLAMA_ENABLED=true`)  

### Backend — development

```powershell
cd d:\UniversityRecommend\backend
npm run start:dev
```

- API: [http://localhost:3001/api](http://localhost:3001/api)  
- Swagger: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)  

### Backend — production build

```powershell
cd d:\UniversityRecommend\backend
npm run build
npm run start:prod
```

### Frontend — development

```powershell
cd d:\UniversityRecommend\frontend
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000). Backend phải đang chạy ở `:3001` để trang `/universities` lấy được data.

### Frontend — build / lint

```powershell
cd d:\UniversityRecommend\frontend
npm run lint
npm run build
npm run start
```

### Ollama (bắt buộc nếu để `OLLAMA_ENABLED=true`)

1. Cài Ollama Desktop cho Windows: [https://ollama.com/download](https://ollama.com/download). Sau khi cài, Ollama tự chạy nền ở `:11434`.
2. Pull model mặc định (1.9 GB, vừa GPU 6 GB VRAM, tiếng Việt khá):

```powershell
ollama pull qwen2.5:3b
```

> Model thay thế: `llama3.1` (4.9 GB, chậm hơn, tiếng Việt khá), `llama3.2:3b` (2.0 GB), `gemma3:1b` (815 MB, nhanh nhất nhưng yếu). Sau khi đổi model nhớ chỉnh `OLLAMA_MODEL` trong `backend/.env`.

3. Kiểm tra Ollama đang chạy:

```powershell
curl http://localhost:11434/api/tags
# Expected: JSON liệt kê các model đã pull, ví dụ {"models":[{"name":"qwen2.5:3b", ...}]}
```

4. Khởi động lại backend (`npm run start:dev`). Log đầu tiên khi gọi `/api/chatbot/chat` sẽ in `intent=... source=ollama`. Nếu vẫn `source=rule` mặc dù `OLLAMA_ENABLED=true`, kiểm tra log Nest cho dòng `Ollama call failed` hoặc `Ollama call timed out`.

> **Không cài Ollama?** Đặt `OLLAMA_ENABLED=false` trong `backend/.env` để bot chạy thuần rule-based, tránh độ trễ 20s/câu chờ timeout.

---

## Dữ liệu: Excel → Database

### Luồng tổng quát

```text
tuyensinh247 API  →  scrape_and_fill_excel.py  →  .xlsx  →  npm run import:excel  →  PostgreSQL
```

### File Excel

`mau_du_lieu_truong_dai_hoc_5_sheets.xlsx`

| Sheet | Nội dung |
|-------|----------|
| `universities_hanoi` | Danh sách trường (Hà Nội) |
| `admission_methods` | Phương thức xét tuyển |
| `majors` | Ngành |
| `university_majors` | Chương trình theo trường |
| `cutoff_scores(ĐTN)` | Điểm chuẩn THPT / học bạ |
| `cutoff_scores(ĐGNL)` | Điểm chuẩn ĐGNL / ĐGTD |

Sheet `universities_hanoi` có cột **`Phường`** (phường/xã sau sáp nhập 2025). Import ưu tiên file `mau_du_lieu_truong_dai_hoc_5_sheets_bo_sung_phuong.xlsx` nếu có trong thư mục gốc; hoặc đặt đường dẫn tùy chỉnh: `IMPORT_EXCEL_PATH=... npm run import:excel`.

API: `GET /api/universities/wards` — danh sách phường có trường (dropdown gợi ý / hồ sơ).

```powershell
cd d:\UniversityRecommend
$env:PYTHONIOENCODING = "utf-8"
python scrape_and_fill_excel.py
```

- API dùng nội bộ: `https://diemthi.tuyensinh247.com/api/common/cutoff-score`  
- Sau khi chạy, script tự ghi `_scrape_log.json` (log lần scrape gần nhất; có thể xóa, sẽ tạo lại)

**Lưu ý:** Một số trường (quân sự, chính trị…) có thể không có trên TS247.

### Import vào PostgreSQL

PostgreSQL phải đang chạy và `backend/.env` đúng.

```powershell
cd d:\UniversityRecommend\backend
npm run import:excel
```

**Mặc định:** **xóa và nạp lại** dữ liệu master (`universities`, `majors`, `university_majors`, `cutoff_scores`, `admission_methods`). **Không xóa** `users`, `recommendations`, `chat_sessions` / `chat_messages`.

**Cập nhật không xóa toàn bộ (merge):**

```powershell
npm run import:excel:merge
# hoặc: IMPORT_MERGE=true npm run import:excel
```

Merge upsert trường/ngành/phương thức; điểm chuẩn trùng khóa `(university_major_id, year, tổ hợp, phương thức)` được cập nhật thay vì nhân bản.

### Import học phí từ file batch (đã điền tay)

File mẫu: `danh_sach_truong_thieu_hoc_phi_final_batch05.xlsx` (sheet `thieu_hoc_phi`, cột `tuition_fee_min_vnd` / `tuition_fee_max_vnd`).

```powershell
cd d:\UniversityRecommend\backend
npm run import:tuition
```

Script sẽ:

- Cập nhật `universities.tuition_fee_min` / `tuition_fee_max` (VND/năm) theo `short_name`
- Cập nhật `tuition_per_credit_note` từ `hoc_phi_tin_chi_text` (chỉ hiển thị trang chi tiết trường)
- Ghi `source_url` nếu cột `nguon_hoc_phi` có và trường chưa có nguồn
- Ghi đồng bộ vào sheet `universities_hanoi` trong `mau_du_lieu_truong_dai_hoc_5_sheets.xlsx` (để `import:excel` không mất học phí)

Tùy chọn:

```powershell
npm run import:tuition -- --file=../danh_sach_truong_thieu_hoc_phi.xlsx
# Chỉ DB, không sửa master Excel:
npx ts-node -r tsconfig-paths/register src/import-tuition-excel.ts
```

Dòng **N/A** (không có học phí ĐH chính quy rõ ràng, ví dụ APRI, HCMA) được bỏ qua; trường miễn phí (min=0, max=N/A) được lưu `0`–`0`.

### Thêm dữ liệu lẻ (không scrape lại)

| Việc cần làm | Cách |
|--------------|------|
| Nhiều trường / điểm chuẩn | Sửa Excel → `npm run import:excel` |
| Một dòng điểm chuẩn (đã có liên kết trường–ngành) | Swagger: `POST/PATCH/DELETE /api/cutoff-scores` (JWT) |
| Liên kết trường–ngành mới | Swagger: `POST /api/university-majors` (JWT admin) hoặc Excel |

---

## Kiểm tra dữ liệu & API

### PowerShell

```powershell
# Danh sách trường
Invoke-RestMethod "http://localhost:3001/api/universities?page=1&limit=5"

# Chi tiết trường (đổi id)
Invoke-RestMethod "http://localhost:3001/api/universities/1"

# Điểm chuẩn theo trường, năm 2024
Invoke-RestMethod "http://localhost:3001/api/cutoff-scores/university/1?year=2024"

# Liên kết trường–ngành (filter)
Invoke-RestMethod "http://localhost:3001/api/university-majors?university_id=1&limit=5"

# Tạo liên kết trường–ngành mới (cần JWT admin)
$body = @{ university_id = 1; major_id = 1; training_program = "Chuẩn"; duration = 4; tuition_fee = 24000000 } | ConvertTo-Json
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Method POST -Uri "http://localhost:3001/api/university-majors" -Body $body -ContentType "application/json" -Headers $headers
```

### SQL (pgAdmin / psql / DBeaver)

```sql
SELECT COUNT(*) FROM universities;
SELECT COUNT(*) FROM majors;
SELECT COUNT(*) FROM university_majors;
SELECT COUNT(*) FROM cutoff_scores;

SELECT u.short_name, m.name, cs.year, cs.score, cs.subject_combination
FROM cutoff_scores cs
JOIN university_majors um ON um.id = cs.university_major_id
JOIN universities u ON u.id = um.university_id
JOIN majors m ON m.id = um.major_id
WHERE u.short_name = 'HUST' AND cs.year = 2024
LIMIT 20;
```

### Đăng ký / đăng nhập / email

1. **Đăng ký** — gửi mã 6 số qua email (dev: xem log backend nếu chưa cấu hình SMTP).
2. **Xác nhận** — `POST /auth/verify-email` → nhận JWT.
3. **Đăng nhập** — chỉ khi `email_verified = true`.
4. **Quên mật khẩu** — `POST /auth/forgot-password` → `POST /auth/reset-password`.

```powershell
$body = @{ email = "test@example.com"; password = "Test1234!"; name = "Test User" } | ConvertTo-Json
Invoke-RestMethod -Method POST -Uri "http://localhost:3001/api/auth/register" -Body $body -ContentType "application/json"
# → { message, email } — mã in console nếu SMTP_HOST trống

$verify = @{ email = "test@example.com"; code = "123456" } | ConvertTo-Json
$res = Invoke-RestMethod -Method POST -Uri "http://localhost:3001/api/auth/verify-email" -Body $verify -ContentType "application/json"
$token = $res.access_token

$login = @{ email = "test@example.com"; password = "Test1234!" } | ConvertTo-Json
$res = Invoke-RestMethod -Method POST -Uri "http://localhost:3001/api/auth/login" -Body $login -ContentType "application/json"

# Gọi API có bảo vệ
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:3001/api/recommendations/my" -Headers $headers
```

Cấu hình SMTP: `backend/.env.example` (mục Email).

### Gợi ý trường

```powershell
$rec = @{
  expected_score = 26.5
  subject_combination = "A00"
  interests = "CNTT, lập trình"
  preferred_location = "Hà Nội"
  budget_range = "medium"
  career_goal = "kỹ sư phần mềm"
} | ConvertTo-Json

Invoke-RestMethod -Method POST -Uri "http://localhost:3001/api/recommendations" -Body $rec -ContentType "application/json"
```

### Chatbot

Mặc định `OLLAMA_ENABLED=true`. Mỗi câu hỏi đi qua 3 bước:

1. **Intent classify**: Ollama đọc câu hỏi (few-shot + mô tả intent) → JSON `{intent, confidence}`. Intent lạ (`ask_major`, …) được map alias → enum hợp lệ. Câu có điểm thi + “nên chọn trường” được hiệu chỉnh về `recommendation_by_score` nếu LLM nhầm `search_major`. Nếu Ollama down hoặc `confidence < 0.5` → fallback keyword (ưu tiên gợi ý theo điểm trước tra ngành).
2. **Truy vấn DB**: dựa vào intent, gọi đúng `handle*` để truy vấn PostgreSQL (universities / majors / cutoff_scores / `RecommendationsService`). **Mọi số liệu trường / điểm / học phí đều từ DB, không từ LLM.**
3. **Rewrite**: gửi câu hỏi gốc + kết quả DB cho Ollama `/api/generate` để diễn đạt lại tự nhiên. **Bỏ qua rewrite** khi câu trả lời có số/list từ DB (điểm chuẩn, gợi ý top trường, danh sách ngành, học phí) — xem `INTENT_HANDLER_MATRIX` trong `backend/src/chatbot/intent-corpus.ts`. Nếu Ollama down/timeout → trả luôn output rule-based.

**Corpus intent (`intent.txt`, 160 câu JSONL, id 1–160):**

- Nguồn: `intent.txt` ở thư mục gốc repo.
- Sinh TypeScript: `cd backend && npm run generate:intent-corpus` → `src/chatbot/intent-corpus.generated.ts` (`INTENT_EXAMPLES`, `ENTITY_EXAMPLES`, `COMBINED_EXAMPLES` đủ 160 dòng).
- Runtime gửi Ollama **~2 ví dụ/intent** (`selectPromptExamples`) để prompt vừa với `qwen2.5:3b`; sau khi sửa `intent.txt` chạy lại lệnh generate.

**Quan trọng:**

- Intent "tư vấn theo điểm" gọi thẳng `RecommendationsService` (cùng thuật toán với `POST /recommendations`) — không hard-code danh sách trường. Bot tự trích `score / subject_combination / location / interest` từ câu hỏi.
- LLM chỉ làm **classify + rewrite**, không bao giờ là nguồn sự thật cho số liệu.

#### Test bằng PowerShell

```powershell
# Gợi ý theo điểm (phải trả top trường + % phù hợp, không chỉ mô tả ngành)
$chat = @{ message = "Em được 26 điểm khối A00 muốn học CNTT ở Hà Nội thì nên chọn trường nào?" } | ConvertTo-Json -Compress
Invoke-RestMethod -Method POST -Uri "http://localhost:3001/api/chatbot/chat" -Body $chat -ContentType "application/json; charset=utf-8"

# Tra ngành (không nhầm với gợi ý điểm)
$chat2 = @{ message = "Ngành Công nghệ thông tin có những trường nào ở Hà Nội?" } | ConvertTo-Json -Compress
Invoke-RestMethod -Method POST -Uri "http://localhost:3001/api/chatbot/chat" -Body $chat2 -ContentType "application/json; charset=utf-8"

# Điểm chuẩn
$chat3 = @{ message = "Điểm chuẩn Bách Khoa Hà Nội năm 2024 ngành điện tử là bao nhiêu?" } | ConvertTo-Json -Compress
Invoke-RestMethod -Method POST -Uri "http://localhost:3001/api/chatbot/chat" -Body $chat3 -ContentType "application/json; charset=utf-8"
```

Sau khi sửa code chatbot, **khởi động lại** `npm run start:dev` để nạp thay đổi. Xem log Nest: `intent=... source=ollama|rule` và dòng `intent corrected` nếu heuristic sửa nhầm LLM.

Trường `engine` cho biết câu trả lời đến từ đâu (`rule` hoặc `ollama`).

#### Test qua UI

1. Backend chạy ở `:3001` + frontend chạy ở `:3000` (`npm run dev`).
2. Mở [http://localhost:3000/chatbot](http://localhost:3000/chatbot).
3. Hỏi: *"Điểm chuẩn Bách Khoa Hà Nội năm 2024"* hoặc *"Em được 24 điểm khối A00 muốn học CNTT"*.
4. Mỗi câu trả lời từ bot có badge `🦙 Ollama` (xanh) hoặc `⚙️ Rule-based` (xám).
5. Lịch sử + `session_id` được lưu localStorage; nút **Cuộc trò chuyện mới** để reset.

---

## Lệnh npm / script tổng hợp

### Backend (`backend/`)

| Lệnh | Mô tả |
|------|--------|
| `npm install` | Cài dependency |
| `npm run start:dev` | Chạy API + hot reload |
| `npm run start` | Chạy không watch |
| `npm run start:debug` | Debug mode |
| `npm run build` | Build production |
| `npm run start:prod` | Chạy bản build |
| `npm run lint` | ESLint |
| `npm run test` | Unit tests (Jest) |
| `npm run test:regression` | **Bắt buộc** khi đổi chatbot pipeline, trọng số gợi ý, entity/session, hoặc corpus — 11 suite Jest (~140 tests): intent corpus, follow-up E2E, recommendations canonical 25/B01/CNTT, interest synonyms, score trend, … |
| `npm run benchmark:ollama-e2e` | Benchmark 18 câu cố định **+** 10 follow-up đổi trường/ngành (cần Ollama + `OLLAMA_ENABLED=true`) |
| `npm run test:e2e` | E2E tests |
| `npm run import:excel` | Import Excel → PostgreSQL |
| `npm run import:tuition` | Học phí từ file batch → DB + sheet `universities_hanoi` |
| `npm run generate:intent-corpus` | Đồng bộ `intent.txt` → `intent-corpus.generated.ts` |
| `npm run export:uncategorized-majors` | Export CSV/JSON ngành còn nhóm **Khác** → `data/majors-khac-*.csv` |
| `npm run benchmark:ollama-intent` | So sánh Ollama vs rule trên corpus (`BENCHMARK_LIMIT`, `BENCHMARK_TIMEOUT_MS`) |
| `npm run report:data-gaps` | Báo cáo trường thiếu học phí / ngành chưa phân loại |
| `npm run cleanup:majors` | Preview cleanup major trùng canonical + duplicate `university_majors` |

Áp dụng cleanup thật vào DB:

```powershell
cd d:\UniversityRecommend\backend
npm run cleanup:majors -- --apply
```

### Frontend (`frontend/`)

| Lệnh | Mô tả |
|------|--------|
| `npm install` | Cài dependency |
| `npm run dev` | Dev server port 3000 (Turbopack) |
| `npm run build` | Build production |
| `npm run start` | Chạy bản build |
| `npm run lint` | ESLint |

### Python (thư mục gốc)

| Lệnh | Mô tả |
|------|--------|
| `python scrape_and_fill_excel.py` | Scrape TS247 → cập nhật Excel |

### Regression (chạy trước khi merge)

```powershell
cd d:\UniversityRecommend\backend
npm run test:regression
```

**Chạy khi:** sửa `chatbot-intent-rules`, `chat-session-context`, `recommendations.service` (trọng số), `intent.txt`, guardrails, hoặc entity extract.

**Bao gồm:** corpus 425 câu (rule-only), 10 follow-up đổi trường/ngành, case cố định 25đ/B01/CNTT, đồng nghĩa sở thích, xu hướng điểm 2023–2025.

**Ollama (tùy chọn, cần model chạy):** `npm run benchmark:ollama-e2e` — 18 câu single-turn + 10 follow-up với session carry-over.

Sau khi sửa `intent.txt`: `npm run generate:intent-corpus` rồi `npm run test:regression`.

---

## API chính (tóm tắt)

Base: `http://localhost:3001/api`

| Nhóm | Endpoint | Ghi chú |
|------|----------|---------|
| Auth | `register`, `verify-email`, `resend-verification`, `login`, `forgot-password`, `reset-password` | JWT sau verify |
| Users | `GET /users/me`, `PUT /users/me/profile` | Cần JWT |
| Universities | `GET /universities`, `GET /universities/:id` | Có search, phân trang |
| Majors | `GET /majors`, `GET /majors/:id` | Phân trang `?page=&limit=`; tìm `?search=` |
| Admission methods | `GET /admission-methods` | Danh mục PT xét tuyển (THPT, Học bạ, ĐGNL…) — tra cứu công khai |
| University–Majors | `GET /university-majors`, `GET /university-majors/:id`, `POST/PATCH/DELETE` (JWT) | Quản lý liên kết ngành-trường |
| Cutoff | `GET /cutoff-scores/university/:id`, `GET /cutoff-scores/major/:id` | Query `?year=`, `?method_code=`, `?admission_method=`; `POST/PATCH/DELETE` (JWT) |
| Recommend | `POST /recommendations`, `GET /recommendations/my` | Lưu lịch sử nếu đã login |
| Chatbot | `POST /chatbot/chat`, `GET /chatbot/history` | History cần JWT |

Chi tiết đầy đủ: Swagger UI.

---

## Schema database (hiện tại)

| Bảng | Mô tả ngắn |
|------|------------|
| `universities` | Trường (`short_name`: HUST, NEU, …) |
| `majors` | Ngành |
| `university_majors` | Ngành tại từng trường |
| `cutoff_scores` | Điểm chuẩn theo năm, tổ hợp, phương thức |
| `admission_methods` | Mã phương thức (THPT, HOC_BA, …) |
| `users`, `student_profiles` | Tài khoản & hồ sơ |
| `recommendations` | Gợi ý đã lưu |
| `chat_sessions`, `chat_messages` | Hội thoại chatbot (thay `chat_history`) |

**Hai loại ID:** `school_id` trên Tuyensinh247 ≠ `universities.id` trong PostgreSQL. Luôn map qua `short_name` / Excel.

---

## Cursor AI rules

Thư mục `.cursor/rules/`:

| File | Mục đích |
|------|----------|
| `global working rules.mdc` | Quy tắc chung, stack, phạm vi |
| `Project Overview.mdc` | Bối cảnh dự án |
| `frontend Nextjs.mdc` | Quy ước Next.js |
| `backend Nestjs.mdc` | Quy ước NestJS |
| `database_postgreSQL.mdc` | Schema & import |
| `chatbot_Ollama.mdc` | Chatbot + Ollama |
| `testing and reporting.mdc` | Kiểm tra sau khi sửa code |

---

## Roadmap (ngắn)

- [x] Frontend MVP: `majors`, `recommend`, `login`, `register`, `profile`, chi tiết trường/ngành, `chatbot`
- [x] `GET /admission-methods` — danh mục phương thức xét tuyển; lọc điểm chuẩn theo `method_code`
- [x] `PATCH`/`DELETE` cutoff-scores; import merge (`npm run import:excel:merge`)
- [x] Phân trang `GET /majors`; UI lọc PT xét tuyển trên trang chi tiết trường
- [x] Tích hợp Ollama (classify + extract + rewrite, fallback rule)
- [x] API `university-majors` CRUD
- [ ] Chatbot: gộp classify+extract (giảm latency)
- [ ] Conversation memory / `chat_sessions`
- [x] Admin dashboard + CRUD master data (`/admin`)
- [ ] Favorites, so sánh trường (nâng cao chatbot)
- [ ] Tắt `synchronize: true`, migrations; JWT httpOnly cookie

---

## Tài liệu thêm

- `UNIVERSITY_RECOMMEND_CURSOR_CONTEXT.md` — mô tả đích đến (có thể khác code hiện tại)
- `Yêu cầu.txt` — yêu cầu đồ án (nếu có)

## Xử lý lỗi thường gặp

| Lỗi | Gợi ý |
|-----|--------|
| `import:excel` connection refused | Kiểm tra PostgreSQL đang chạy và `.env` |
| Import 0 cutoff | Kiểm tra tên sheet trong Excel khớp script |
| CORS từ frontend | Backend chỉ cho `localhost:3000` và `3001` |
| Scrape thiếu trường | Xem map `SHORT_TO_CODE` trong `scrape_and_fill_excel.py` |

---

**Liên hệ / phát triển:** Đọc rules trong `.cursor/rules/` trước khi nhờ AI sửa code để giữ đúng stack và phạm vi dự án.
