export interface Template {
  id: string
  name: string
  description: string
  icon: string
  content: string
}

export const DEFAULT_MARKDOWN = `# Welcome to Markdown Studio

> Create beautiful documents from Markdown with **custom styling** and export to PDF, DOCX, or Markdown.

## Getting Started

1. **Write** your Markdown in the editor on the left
2. **Style** it with custom CSS using the CSS tab
3. **Export** to PDF, DOCX, or Markdown from the header

---

## Features

| Feature | Status |
|---------|--------|
| Live Preview | Yes |
| Syntax Highlighting | Yes |
| Custom CSS | Yes |
| Export PDF | Yes |
| Export DOCX | Yes |
| Dark Mode | Yes |
| Auto-save | Yes |

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

*Start writing your masterpiece below!*
`

export const TEMPLATES: Template[] = [
  {
    id: 'readme',
    name: 'README',
    description: 'Open source project README',
    icon: 'Package',
    content: `# My Project

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://semver.org)

> A brief, compelling description of what your project does and why it matters.

## Features

- **Fast** — Optimized for performance
- **Beautiful** — Clean, modern interface
- **Secure** — Built with security in mind
- **Easy Install** — One command setup

## Installation

\`\`\`bash
npm install my-project
\`\`\`

## Quick Start

\`\`\`javascript
import MyProject from 'my-project';

const app = new MyProject({
  option: 'value'
});

app.start();
\`\`\`

## Documentation

Full documentation is available at [docs.example.com](https://docs.example.com).

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

Made with care by [Your Name](https://github.com/username)
`,
  },
  {
    id: 'resume',
    name: 'Resume',
    description: 'Professional developer resume',
    icon: 'User',
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
    icon: 'ClipboardList',
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

Last sprint velocity: **34 points** (goal was 30)

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
| Design mockups for export UI | Carol | June 5 | In Progress |
| Implement html2pdf integration | Bob | June 10 | Not Started |
| Write unit tests for export | Bob | June 14 | Not Started |
| Update sprint board | Alice | June 3 | Done |

---

## Decisions Made

1. We will use **html2pdf.js** for PDF export (approved)
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
    icon: 'BookText',
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
  {
    id: 'blog-post',
    name: 'Blog Post',
    description: 'Clean article layout for publishing',
    icon: 'Newspaper',
    content: `# Building Scalable APIs with Node.js

**Published:** ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} · **Author:** Alex Chen · **Reading time:** 8 min

---

## Introduction

Designing APIs that scale is both an art and a science. In this post, we will explore proven patterns for building Node.js services that handle millions of requests without breaking a sweat.

---

## The Problem

Most Node.js applications start simple. A single Express server, a MongoDB connection, and a handful of routes. But as traffic grows, that simplicity becomes a bottleneck.

---

## Key Principles

### 1. Stateless Design

Keep your application layer stateless. Session data belongs in Redis, not in memory.

### 2. Caching Strategy

Use Redis or Memcached for hot data. Cache at every layer:

- Database query results
- API responses
- Rendered views

### 3. Horizontal Scaling

Design your service so you can spin up multiple instances behind a load balancer.

\`\`\`javascript
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});
\`\`\`

---

## Conclusion

Scalability is not about premature optimization. It is about choosing the right architecture from day one and evolving it as your needs grow.

*Thanks for reading. Follow for more engineering deep dives.*
`,
  },
  {
    id: 'weekly-report',
    name: 'Weekly Report',
    description: 'Team progress and metrics summary',
    icon: 'BarChart3',
    content: `# Weekly Report — Week of ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}

**Team:** Engineering · **Reporter:** Lead · **Status:** On Track

---

## Overview

This week the team focused on performance improvements and bug fixes ahead of the v2.0 release.

---

## Key Metrics

| Metric | Target | Actual | Variance |
|--------|--------|--------|----------|
| Sprint Velocity | 30 pts | 34 pts | +13% |
| Bug Resolution | 10 | 12 | +20% |
| Code Coverage | 80% | 83% | +3% |
| Deployments | 5 | 7 | +40% |

---

## Completed Work

- Improved database query performance by 25%
- Fixed 12 UI bugs reported by QA
- Completed OAuth2 integration for SSO
- Updated CI pipeline to run in under 10 minutes

---

## In Progress

- PDF export engine migration
- Mobile responsive redesign (60% complete)
- Performance audit on search endpoints

---

## Blockers

| Issue | Impact | Owner | ETA |
|-------|--------|-------|-----|
| Third-party API latency | Medium | DevOps | June 10 |
| Design system migration | Low | Design | June 15 |

---

## Next Week Goals

1. Complete PDF export v2
2. Begin beta testing with 5 internal users
3. Publish updated API documentation

---

*Report generated automatically from Jira and GitHub data.*
`,
  },
  {
    id: 'technical-spec',
    name: 'Technical Spec',
    description: 'RFC-style architecture document',
    icon: 'FileCog',
    content: `# RFC: Real-Time Collaboration Engine

**Status:** Draft · **Author:** Engineering Team · **Date:** ${new Date().toLocaleDateString()}

---

## Summary

This document proposes a real-time collaboration engine for Markdown Studio, enabling multiple users to edit the same document simultaneously with sub-100ms latency.

---

## Motivation

Current editing is single-user only. Teams need to collaborate on documents in real time without version conflicts.

---

## Goals

- Enable multi-user concurrent editing
- Guarantee eventual consistency
- Maintain sub-100ms sync latency
- Support offline-first editing

---

## Non-Goals

- Video or voice chat integration
- Real-time cursors (phase 2)
- Comment threads (separate RFC)

---

## Proposed Architecture

### Operational Transformation (OT)

Use OT algorithms to merge concurrent edits without conflicts.

\`\`\`
Client A: Insert "hello" at position 0
Client B: Insert "world" at position 5
Server: Transform and apply both
Result: "hello world"
\`\`\`

### WebSocket Layer

- Socket.io for transport
- Redis pub/sub for multi-server broadcast
- JWT authentication on connection

---

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Conflicts in rich text | Medium | Limit to plain Markdown first |
| Server load | Low | Rate limiting + horizontal scaling |
| Data loss | Low | Persistent operation log |

---

## Timeline

| Milestone | Date |
|-----------|------|
| Design review | June 10 |
| Proof of concept | June 24 |
| Internal alpha | July 8 |
| Public beta | July 22 |

---

## Appendix

- [Operational Transformation](https://en.wikipedia.org/wiki/Operational_transformation)
- [CRDT Survey](https://crdt.tech/)
`,
  },
  {
    id: 'project-proposal',
    name: 'Project Proposal',
    description: 'Executive project pitch document',
    icon: 'Briefcase',
    content: `# Project Proposal: AI Content Assistant

**Prepared for:** Executive Leadership · **Date:** ${new Date().toLocaleDateString()} · **Author:** Product Team

---

## Executive Summary

We propose building an AI-powered content assistant into Markdown Studio to help users generate, edit, and refine documents. Expected ROI: 40% reduction in document drafting time.

---

## Problem Statement

Users spend an average of 3 hours drafting a single technical document. 60% of that time is spent on structure and formatting rather than content.

---

## Proposed Solution

Integrate a context-aware AI assistant that:

1. Generates document outlines from bullet points
2. Rewrites sections for clarity and tone
3. Suggests formatting improvements
4. Auto-generates summaries and abstracts

---

## Scope

### In Scope

- AI chat interface in the editor sidebar
- Quick action buttons (generate, improve, summarize)
- Support for OpenAI, Anthropic, and Gemini
- Custom prompt templates

### Out of Scope

- Auto-publish to external platforms
- Multi-language translation (phase 2)
- Voice input (future consideration)

---

## Budget

| Item | Cost |
|------|------|
| Engineering (3 devs x 3 months) | $90,000 |
| AI API credits (annual) | $12,000 |
| Design & QA | $20,000 |
| **Total** | **$122,000** |

---

## Success Metrics

| Metric | Baseline | Target |
|--------|----------|--------|
| Avg. draft time | 3 hours | 1.8 hours |
| User satisfaction | 3.8/5 | 4.5/5 |
| Feature adoption | 0% | 60% |

---

## Timeline

**Phase 1:** MVP (6 weeks) — Chat + quick actions
**Phase 2:** Polish (4 weeks) — Custom prompts + history
**Phase 3:** Scale (4 weeks) — Enterprise features

---

*Questions? Contact the Product Team.*
`,
  },
  {
    id: 'changelog',
    name: 'Changelog',
    description: 'Version history and release notes',
    icon: 'GitBranch',
    content: `# Changelog

All notable changes to this project will be documented in this file.

---

## [2.1.0] — ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

### Added

- Real-time collaboration with WebSocket sync
- Dark mode support for the editor
- PDF export with custom page margins
- DOCX export for Microsoft Word compatibility

### Changed

- Improved markdown parsing performance by 30%
- Redesigned the preview panel layout
- Updated default syntax highlighting theme

### Fixed

- Resolved cursor jumping issue on large documents
- Fixed table rendering in exported PDFs
- Corrected line break handling in code blocks

---

## [2.0.0] — May 15, 2025

### Added

- AI Copilot integration (OpenAI, Anthropic, Gemini)
- Custom CSS styling for preview
- Template library with 9 presets
- Auto-save with local storage persistence

### Breaking Changes

- Renamed \`/docs\` route to \`/documents\`
- Updated configuration file format to YAML

---

## [1.5.0] — March 1, 2025

### Added

- Keyboard shortcuts for common actions
- Drag-and-drop file upload
- Mobile responsive layout
- Export to Markdown file

### Fixed

- Fixed scrolling sync between editor and preview
- Corrected ordered list indentation

---

## [1.0.0] — January 10, 2025

- Initial release of Markdown Studio
- Live preview with split-pane editor
- Syntax highlighting for code blocks
- Basic export to HTML
`,
  },
]
