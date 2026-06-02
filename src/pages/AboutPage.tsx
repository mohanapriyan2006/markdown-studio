import React from 'react'
import { ArrowLeft, FileText, Palette, Download, Zap, Globe, Mail, User, ExternalLink } from 'lucide-react'
import logoImg from '../assets/logo.png'

interface AboutPageProps {
  onBack: () => void
}

const links = [
  { label: 'Email', href: 'mailto:mohanapriyan.m2006@gmail.com', icon: Mail },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/mohanapriyan-m2006', icon: ExternalLink },
  { label: 'GitHub', href: 'https://github.com/mohanapriyan2006', icon: ExternalLink },
  { label: 'Portfolio', href: 'https://mohanapriyan.netlify.app/', icon: ExternalLink },
  { label: 'Website', href: 'https://mohanapriyan.dev/', icon: ExternalLink },
]

export function AboutPage({ onBack }: AboutPageProps) {
  return (
    <div className="about-page">
      <div className="about-container">
        {/* Back button */}
        <button className="about-back-btn" onClick={onBack}>
          <ArrowLeft size={14} />
          Back to Editor
        </button>

        {/* Hero */}
        <div className="about-hero">
          <div className="about-hero-icon">
            <img src={logoImg} alt="Markdown Studio" className="about-hero-logo" />
          </div>
          <h1 className="about-title">Markdown Studio</h1>
          <p className="about-subtitle">
            Create beautiful documents from Markdown with real-time preview, custom styling, and seamless export.
          </p>
        </div>

        {/* Features */}
        <div className="about-section">
          <h2 className="about-section-title">What You Can Do</h2>
          <div className="about-features">
            <div className="about-feature-card">
              <div className="about-feature-icon">
                <FileText size={18} />
              </div>
              <h3>Live Markdown Editor</h3>
              <p>Write Markdown with syntax highlighting, auto-completion, and a split-pane editor powered by CodeMirror.</p>
            </div>
            <div className="about-feature-card">
              <div className="about-feature-icon">
                <Palette size={18} />
              </div>
              <h3>Custom Styling</h3>
              <p>Inject your own CSS to completely customize how your document looks in the live preview.</p>
            </div>
            <div className="about-feature-card">
              <div className="about-feature-icon">
                <Download size={18} />
              </div>
              <h3>Export Anywhere</h3>
              <p>Export to PDF, DOCX, or plain Markdown with one click. Perfect for sharing and publishing.</p>
            </div>
            <div className="about-feature-card">
              <div className="about-feature-icon">
                <Zap size={18} />
              </div>
              <h3>AI Copilot</h3>
              <p>Connect your own AI provider (OpenAI, Anthropic, Gemini, etc.) to generate, edit, and improve content.</p>
            </div>
          </div>
        </div>

        {/* Tech stack */}
        <div className="about-section">
          <h2 className="about-section-title">Built With</h2>
          <div className="about-tags">
            <span className="about-tag">React 19</span>
            <span className="about-tag">TypeScript</span>
            <span className="about-tag">Tailwind CSS</span>
            <span className="about-tag">Vite</span>
            <span className="about-tag">CodeMirror</span>
            <span className="about-tag">Zustand</span>
          </div>
        </div>

        {/* Developer info */}
        <div className="about-section">
          <h2 className="about-section-title">Developer & Founder</h2>
          <div className="about-dev-card">
            <div className="about-dev-avatar">
              <User size={28} />
            </div>
            <div className="about-dev-info">
              <h3 className="about-dev-name">Mohanapriyan M</h3>
              <span className="about-dev-role">Full Stack Developer</span>
              <div className="about-dev-links">
                {links.map((link) => {
                  const Icon = link.icon
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.href.startsWith('mailto') ? undefined : '_blank'}
                      rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                      className="about-dev-link"
                    >
                      <Icon size={13} />
                      {link.label}
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <p className="about-footer">Built with care. No data leaves your browser unless you choose to connect an AI provider.</p>
      </div>
    </div>
  )
}
