# ✨ Markdown Studio

**Write smarter. Style faster. Export anywhere.**

Markdown Studio is a modern, browser-based Markdown editor with live preview, custom CSS styling, AI-assisted writing, and one-click export to **PDF**, **DOCX**, or **.md**.

🔗 **Live App:** https://markdownstudio-ai.vercel.app/

---

## 🚀 Why Markdown Studio?

- ⚡ **Real-time split editor + preview** powered by CodeMirror
- 🎨 **Custom CSS panel** to make documents truly yours
- 🧠 **AI Copilot** (OpenAI-compatible, Anthropic, Gemini, Groq, OpenRouter, custom endpoints)
- 📦 **Export in one click** to Markdown, PDF, or DOCX
- �� **Ready-made templates** for README, resume, notes, specs, reports, and more
- 🌗 **Dark mode + responsive UI** for desktop and mobile workflows
- 🔒 **Privacy-first by design**: your content stays in-browser unless you connect an AI provider

---

## 🛠️ Tech Stack

- **Frontend:** React 19 + TypeScript
- **Build Tool:** Vite
- **Editor:** CodeMirror
- **State:** Zustand
- **Styling:** Tailwind CSS + custom CSS pipeline
- **Exports:** html2pdf.js, docx, file-saver

---

## 📦 Local Development

```bash
# 1) Install dependencies
npm install

# 2) Start dev server
npm run dev

# 3) Build for production
npm run build

# 4) Preview production build
npm run preview
```

---

## 🤖 Optional: Demo AI Key

If you want demo AI mode available by default, add this to your `.env` file:

```bash
VITE_API_KEY=your_api_key_here
```

Without it, users can still configure their own AI provider directly in the app.

---

## 💡 Built for creators, developers, and teams

From quick notes to polished docs, Markdown Studio helps you go from idea → beautifully formatted output in minutes.

If you find it useful, star the repo and share the app. ⭐
