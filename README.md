# 🎓 Class Catch

> Never miss a class again. Catch up on recorded classes, share handwritten notes with classmates, and let AI summarize everything.

Class Catch is a full-stack web app built for students and teachers. Teachers and students can upload class videos and share notes (typed or handwritten). An AI assistant reads the notes and answers questions about them — including 4-mark answers, explanations, and key points.

---

## ✨ Features

### 📚 Core
- **Authentication** — Email/password login with role-based accounts (Student or Teacher)
- **Role-agnostic permissions** — Both students and teachers can upload videos and add notes
- **Recorded class videos** — Upload, browse, filter by subject, watch in-app (up to 50 MB per file)
- **Shared class notes** — Add text notes, attach PDFs/images/docs, upvote the best ones
- **Video-tagged notes** — Attach a note to a specific video, or leave it standalone
- **File attachments** — PDFs, images, Word docs, plain text — all supported

### 🤖 AI-Powered
- **AI Summarizer** — One-click summary of any note or video description (3–5 key takeaways)
- **AI Assistant Chat** — ChatGPT-style full-page assistant that reads all class notes as context
- **Chat history** — Every conversation is saved; revisit or continue past chats anytime
- **PDF text extraction** — Typed PDFs are read instantly
- **OCR for handwritten notes** — Scanned/handwritten PDFs and images are processed via OCR.space (Engine 3, best for handwriting)

### 🎨 Design & UX
- **Deep teal theme** with full dark mode toggle
- **Mobile responsive** — Sidebar collapses to a drawer on phones
- **Consistent spacing & typography** — Inter font, tight tracking, professional SaaS layout
- **Loading skeletons & empty states** everywhere
- **Real-time feedback** — File size hints, extraction badges, upload progress

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| **Frontend** | React 18, Vite, React Router, React Hook Form, Tailwind CSS |
| **Backend** | Appwrite (Auth, Database, Storage, Functions) |
| **AI / LLM** | Groq (`openai/gpt-oss-120b`) via Vercel AI SDK |
| **OCR** | OCR.space (Engine 3 for handwriting) |
| **PDF parsing** | `pdf-parse`, `mammoth` (DOCX) |
| **Deploy** | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Appwrite account ([cloud.appwrite.io](https://cloud.appwrite.io))
- Groq API key ([console.groq.com/keys](https://console.groq.com/keys))
- OCR.space API key ([ocr.space/ocrapi/freekey](https://ocr.space/ocrapi/freekey))

### Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/class-catch.git
cd class-catch
npm install