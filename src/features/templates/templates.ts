export interface Template {
  id: string
  name: string
  description: string
  icon: string
  content: string
}

export const DEFAULT_MARKDOWN = `# Welcome to Markdown Studio ✨

> Create beautiful documents from Markdown with **custom styling** and export to PDF, DOCX, or Markdown.

## Getting Started

1. **Write** your Markdown in the editor on the left
2. **Style** it with custom CSS using the CSS tab
3. **Export** to PDF, DOCX, or Markdown from the header

---

## Features

| Feature | Status |
|---------|--------|
| Live Preview | ✅ |
| Syntax Highlighting | ✅ |
| Custom CSS | ✅ |
| Export PDF | ✅ |
| Export DOCX | ✅ |
| Dark Mode | ✅ |
| Auto-save | ✅ |

## Code Example

\`\`\`javascript
// Hello from Markdown Studio
const greet = (name) => {
  return \`Hello, \${name}! Welcome to Markdown Studio.\`;
};

console.log(greet("World"));
\`\`\`

## Task List

- [x] Set up the project
- [x] Write your first document
- [ ] Export to PDF
- [ ] Share with the team

## Blockquote

> "The best documentation is the one that actually gets written."
> — Every Developer Ever

---

*Start writing your masterpiece below!* 🚀
`

export const TEMPLATES: Template[] = [
  {
    id: 'readme',
    name: 'README',
    description: 'Open source project README',
    icon: '📦',
    content: `# My Project

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://semver.org)

> A brief, compelling description of what your project does and why it matters.

## ✨ Features

- 🚀 **Fast** — Optimized for performance
- 🎨 **Beautiful** — Clean, modern interface
- 🔒 **Secure** — Built with security in mind
- 📦 **Easy Install** — One command setup

## 📦 Installation

\`\`\`bash
npm install my-project
\`\`\`

## 🚀 Quick Start

\`\`\`javascript
import MyProject from 'my-project';

const app = new MyProject({
  option: 'value'
});

app.start();
\`\`\`

## 📖 Documentation

Full documentation is available at [docs.example.com](https://docs.example.com).

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [Your Name](https://github.com/username)
`,
  },
  {
    id: 'resume',
    name: 'Resume',
    description: 'Professional developer resume',
    icon: '👤',
    content: `# John Doe
**Full Stack Developer** · john@example.com · [LinkedIn](https://linkedin.com) · [GitHub](https://github.com)
San Francisco, CA · +1 (555) 000-0000

---

## Summary

Passionate full-stack developer with 5+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud infrastructure. Strong focus on code quality, performance, and developer experience.

---

## Experience

### Senior Software Engineer — TechCorp Inc.
*January 2022 – Present · San Francisco, CA*

- Led development of a real-time collaboration platform serving 50K+ users
- Reduced API response time by 40% through Redis caching and query optimization
- Mentored a team of 4 junior developers; established code review best practices
- Migrated monolith to microservices architecture using Docker & Kubernetes

### Software Engineer — StartupXYZ
*June 2019 – December 2021 · Remote*

- Built React dashboard with real-time data visualization (D3.js)
- Developed REST API using Node.js + PostgreSQL handling 1M+ requests/day
- Implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes

---

## Skills

| Category | Technologies |
|----------|-------------|
| Frontend | React, TypeScript, Next.js, Tailwind CSS |
| Backend | Node.js, Python, Go, REST, GraphQL |
| Database | PostgreSQL, MongoDB, Redis, Elasticsearch |
| DevOps | Docker, Kubernetes, AWS, GitHub Actions |

---

## Education

**B.S. Computer Science** — Stanford University · *2019*

---

## Projects

### **Markdown Studio** — [github.com/johndoe/md-studio](https://github.com)
React-based Markdown editor with custom CSS and PDF export

### **OpenMetrics** — [github.com/johndoe/openmetrics](https://github.com)
Open-source analytics dashboard with real-time charts

---

*References available upon request*
`,
  },
  {
    id: 'meeting-notes',
    name: 'Meeting Notes',
    description: 'Sprint / team meeting notes',
    icon: '📋',
    content: `# Sprint Planning Meeting
**Date:** ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
**Time:** 10:00 AM – 11:30 AM
**Location:** Conference Room A / Zoom

---

## Attendees

- [x] Alice Johnson (Product Manager)
- [x] Bob Smith (Lead Engineer)
- [x] Carol White (Designer)
- [ ] Dave Brown (DevOps — absent)

---

## Agenda

1. Review last sprint retrospective
2. Discuss upcoming sprint goals
3. Story point estimation
4. Assign tasks

---

## Discussion Notes

### Sprint Review Summary

Last sprint velocity: **34 points** (goal was 30 ✅)

Key achievements:
- Shipped user authentication module
- Fixed 12 critical bugs from QA
- Deployed to staging environment

### Upcoming Sprint Goals

**Sprint 24 (June 3 – June 17)**

> Focus: Export features and performance improvements

**Priority items:**
- PDF export functionality
- DOCX export support
- Performance audit on dashboard
- Mobile responsive fixes

---

## Action Items

| Task | Owner | Due Date | Status |
|------|-------|----------|--------|
| Design mockups for export UI | Carol | June 5 | 🟡 In Progress |
| Implement html2pdf integration | Bob | June 10 | ⚪ Not Started |
| Write unit tests for export | Bob | June 14 | ⚪ Not Started |
| Update sprint board | Alice | June 3 | ✅ Done |

---

## Decisions Made

1. We will use **html2pdf.js** for PDF export (approved ✅)
2. DOCX export will use the **docx** library
3. Mobile responsiveness is **P1** for this sprint

---

## Next Meeting

**Date:** June 17, 2025 — Sprint Review & Retrospective
**Time:** 10:00 AM

---

*Notes taken by: Alice Johnson*
`,
  },
  {
    id: 'project-docs',
    name: 'Project Docs',
    description: 'Technical API documentation',
    icon: '📚',
    content: `# API Documentation

**Version:** 2.1.0 · **Last Updated:** ${new Date().toLocaleDateString()} · **Status:** Stable

---

## Overview

The Markdown Studio API provides programmatic access to document creation, export, and management features.

**Base URL:** \`https://api.markdownstudio.io/v2\`

**Authentication:** Bearer token (see [Authentication](#authentication))

---

## Authentication

All API requests require an API key passed as a Bearer token:

\`\`\`bash
curl -X GET https://api.markdownstudio.io/v2/documents \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"
\`\`\`

---

## Endpoints

### Documents

#### \`GET /documents\`

Returns a list of all documents.

**Response:**
\`\`\`json
{
  "data": [
    {
      "id": "doc_abc123",
      "title": "My Document",
      "created_at": "2025-06-01T10:00:00Z",
      "word_count": 1250
    }
  ],
  "total": 42,
  "page": 1
}
\`\`\`

---

#### \`POST /documents\`

Create a new document.

**Request Body:**
\`\`\`json
{
  "title": "My Document",
  "content": "# Hello World\\n\\nThis is my document.",
  "custom_css": "h1 { color: #6366f1; }"
}
\`\`\`

**Response:** \`201 Created\`

---

#### \`POST /documents/{id}/export\`

Export a document to PDF, DOCX, or Markdown.

**Request Body:**
\`\`\`json
{
  "format": "pdf",
  "options": {
    "margin": 10,
    "page_size": "A4"
  }
}
\`\`\`

**Response:** Binary file stream

---

## Error Codes

| Code | Meaning |
|------|---------|
| \`400\` | Bad Request — Invalid parameters |
| \`401\` | Unauthorized — Invalid API key |
| \`404\` | Not Found — Document doesn't exist |
| \`429\` | Rate Limited — Too many requests |
| \`500\` | Server Error — Contact support |

---

## Rate Limits

- **Free tier:** 100 requests/hour
- **Pro tier:** 1,000 requests/hour  
- **Enterprise:** Unlimited

---

## SDKs

\`\`\`bash
# JavaScript
npm install @markdownstudio/sdk

# Python  
pip install markdownstudio

# Go
go get github.com/markdownstudio/go-sdk
\`\`\`

---

## Changelog

### v2.1.0
- Added DOCX export endpoint
- Improved PDF rendering quality

### v2.0.0  
- Breaking: Renamed \`/docs\` to \`/documents\`
- Added custom CSS support

---

*Questions? Contact [support@markdownstudio.io](mailto:support@markdownstudio.io)*
`,
  },
]
