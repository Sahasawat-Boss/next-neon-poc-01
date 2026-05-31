# Project Summary — Neon DB Todo POC

Next.js (App Router) + Prisma + Neon PostgreSQL POC ที่พัฒนาขึ้นเพื่อสำรวจการใช้ Serverless Postgres กับ Next.js แบบเต็มรูปแบบ

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Database | Neon (Serverless PostgreSQL) |
| ORM | Prisma |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Font | Geist (Vercel) |
| Language | TypeScript |

---

## Database Schema (Prisma)

### `Todo`
- `id`, `title`, `completed`, `description`, `status` (PASS/FAIL), `startDate`, `dueDate`, `createdAt`
- มี relation กับ `TodoImage` แบบ one-to-many

### `TodoImage`
- เก็บรูปภาพเป็น binary (`Bytes`) ใน database โดยตรง
- Fields: `id`, `todoId`, `data`, `mimeType`, `name`, `createdAt`

### `ActivityLog`
- บันทึกทุก action ที่เกิดขึ้นกับ Todo
- Fields: `id`, `todoTitle`, `action`, `createdAt`

### `PageContent`
- เก็บ content ของแต่ละ page (heading, description, image)
- ใช้ `page` เป็น unique key เช่น `"todos"`, `"dashboard"`

---

## Features ที่พัฒนา (ตามลำดับ commit)

### 1. Todo พื้นฐาน + Prisma + Neon
- CRUD Todo ด้วย Server Actions
- เชื่อมต่อ Neon PostgreSQL ผ่าน Prisma

### 2. เพิ่ม startDate / dueDate
- Todo มี field วันเริ่มต้นและ deadline
- แก้ไขได้ผ่าน detail panel

### 3. เพิ่ม Status (PASS / FAIL)
- Todo แต่ละรายการตั้ง status ได้: PASS, FAIL, หรือ clear
- แสดง badge สีบน UI

### 4. Image Upload
- อัปโหลดรูปภาพแนบกับ Todo
- เก็บเป็น binary ใน Neon database
- ดูรูปผ่าน `/api/images/[id]` route
- มี Lightbox สำหรับดูรูปขนาดเต็ม

### 5. Toast Notifications
- แสดง toast เมื่อ action สำเร็จ (add, delete, update)
- ใช้ `ToastContainer` component + `lib/toast.ts`

### 6. Dashboard + Charts + Sidebar Navigation
- Sidebar ซ้ายมือ navigate ระหว่าง pages
- Dashboard แสดง stat cards: Total, Done, Undone, Pass, Fail
- Pie charts 2 อัน (Completion, Pass/Fail) ด้วย Recharts

### 7. Activity Log
- Timeline log ทุก action (Created, Completed, Reopened, Deleted, Updated details, image actions, status changes)
- แสดง 200 รายการล่าสุด เรียงจากใหม่สุด
- แต่ละ action มี icon และสีต่างกัน

### 8. CMS (Content Management System)
- `/cms` page แก้ไข heading, description, และ banner image ของแต่ละ page
- รองรับ 2 pages: **My Todos (/)** และ **Dashboard (/dashboard)**
- อัปโหลด/ลบรูป banner ผ่าน `/api/page-image/[page]` route
- ใช้ `upsert` — สร้างใหม่ถ้ายังไม่มี, อัปเดตถ้ามีอยู่แล้ว

### 9. Sidebar Collapsible + Dynamic Headings
- Sidebar ยุบ/ขยายได้ด้วยปุ่ม toggle
- ชื่อ menu items ดึงจาก `PageContent` ใน database (ถ้า CMS เปลี่ยน heading → sidebar เปลี่ยนตาม)

---

## File Structure (หลัก)

```
app/
├── layout.tsx              # Root layout — Sidebar + ToastContainer
├── page.tsx                # My Todos page (/)
├── actions.ts              # Server Actions ทั้งหมด
├── activity/page.tsx       # Activity Log page
├── cms/page.tsx            # CMS page
├── dashboard/page.tsx      # Dashboard page
├── components/
│   ├── AddTodoForm.tsx     # Form เพิ่ม Todo
│   ├── CmsForm.tsx         # Form แก้ไข page content
│   ├── DashboardCharts.tsx # Recharts pie charts
│   ├── ImageLightbox.tsx   # Modal ดูรูปเต็ม
│   ├── Sidebar.tsx         # Collapsible sidebar nav
│   ├── ToastContainer.tsx  # Toast notification
│   ├── TodoItem.tsx        # รายการ Todo แต่ละอัน
│   └── TodoList.tsx        # รายการ Todo ทั้งหมด
└── api/
    ├── images/[id]/route.ts        # Serve Todo image
    └── page-image/[page]/route.ts  # Serve page banner image

lib/
├── prisma.ts               # Prisma client singleton
└── toast.ts                # Toast helper

prisma/
└── schema.prisma           # Database schema
```

---

## Pages

| URL | หน้า |
|---|---|
| `/` | My Todos — รายการ Todo ทั้งหมด |
| `/dashboard` | Dashboard — stats + charts |
| `/activity` | Activity Log — timeline ทุก action |
| `/cms` | CMS — แก้ไข content ของ pages |

---

## Deployment

- Deploy บน **Vercel**
- Database: **Neon Serverless PostgreSQL**
- Build script รัน `prisma generate` ก่อน build
