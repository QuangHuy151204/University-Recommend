# University Recommend

Web gợi ý trường–ngành THPT (Hà Nội), tra cứu điểm chuẩn, chatbot. Dữ liệu: Excel → PostgreSQL.

## Tech stack

| Layer | Công nghệ |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind 4, TypeScript |
| Backend | NestJS, TypeORM, JWT (httpOnly cookie) |
| Database | PostgreSQL |
| Chatbot | Ollama local + rule fallback (`OLLAMA_ENABLED`) |
| Data | Excel (nhập tay) → `npm run import:excel` → PostgreSQL |

Yêu cầu: Node.js 18+, npm, PostgreSQL 14+. Tuỳ chọn: Ollama (chatbot LLM).

## Chạy local (lần đầu)

### 1. Database

```sql
CREATE DATABASE university_recommend;
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # Windows: copy .env.example .env
```

Sửa `backend/.env`: `DB_PASSWORD`, `JWT_SECRET`, `ADMIN_PASSWORD`.  
Nếu chưa cài Ollama: `OLLAMA_ENABLED=false`.

```bash
npm run migration:run
npm run import:excel
npm run start:dev
```

- API: http://localhost:3001/api  
- Swagger: http://localhost:3001/api/docs  
- Admin login: http://localhost:3000/admin/login (user/email + `ADMIN_PASSWORD` trong `.env`)

### 3. Frontend

```bash
cd frontend
npm install
```

Tạo `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

```bash
npm run dev
```

- App: http://localhost:3000  

Thứ tự chạy: PostgreSQL → backend (`:3001`) → frontend (`:3000`).

### 4. Ollama (tuỳ chọn)

Chỉ khi `OLLAMA_ENABLED=true` trong `backend/.env`:

```bash
ollama pull qwen2.5:3b
```

## Lệnh quan trọng

### Backend (`backend/`)

| Lệnh | Mô tả |
|------|--------|
| `npm run start:dev` | Chạy API (dev) |
| `npm run build` | Build production |
| `npm run start:prod` | Chạy bản build |
| `npm run lint` | ESLint |
| `npm run test` | Unit tests |
| `npm run test:regression` | Regression (chatbot + gợi ý) |
| `npm run migration:run` | Chạy migration |
| `npm run migration:show` | Xem trạng thái migration |
| `npm run import:excel` | Import Excel → DB (truncate master) |
| `npm run import:excel:merge` | Import merge (không truncate) |
| `npm run import:tuition` | Cập nhật học phí từ file batch |

### Frontend (`frontend/`)

| Lệnh | Mô tả |
|------|--------|
| `npm run dev` | Dev server `:3000` |
| `npm run build` | Build production |
| `npm run start` | Chạy bản build |
| `npm run lint` | ESLint |

## Dữ liệu (Excel → PostgreSQL)

Dữ liệu master (trường, ngành, điểm chuẩn, …) được nhập và chỉnh sửa trực tiếp trong file Excel, sau đó import vào PostgreSQL:

```bash
cd backend
npm run import:excel        # nạp lại toàn bộ master
npm run import:excel:merge  # cập nhật merge, không truncate
```

File master: `mau_du_lieu_truong_dai_hoc_5_sheets_bo_sung_phuong.xlsx` (thư mục gốc repo). Có thể override bằng `IMPORT_EXCEL_PATH` trong `backend/.env`.

## Ghi chú nhanh

- `import:excel` xóa và nạp lại bảng master; không xóa `users`, chat, recommendations.
- Dev không cấu hình SMTP: mã xác minh email in ra console backend.
- Tra cứu / gợi ý / chatbot trên web yêu cầu đăng nhập học sinh (trừ landing và trang auth).
