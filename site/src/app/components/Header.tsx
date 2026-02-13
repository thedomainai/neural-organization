"use client";

import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
}

interface HeaderProps {
  navItems: NavItem[];
  ctaLabel: string;
  ctaHref: string;
}

export default function Header({ navItems, ctaLabel, ctaHref }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="liquid-glass-deep"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 var(--space-6)",
      }}
    >
      <span
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: "var(--text-primary)",
          display: "flex",
          alignItems: "center",
          gap: "var(--space-3)",
        }}
      >
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: "var(--radius-md)",
            background:
              "linear-gradient(135deg, var(--primary-500), var(--glow-400))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 700,
            color: "#fff",
          }}
        >
          N
        </span>
        Neural Organization
      </span>

      {/* Desktop nav */}
      <nav
        style={{ display: "flex", gap: "var(--space-5)", alignItems: "center" }}
        className="desktop-nav"
      >
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "var(--text-secondary)",
              textDecoration: "none",
              transition: "color var(--duration-fast) var(--ease-default)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--text-primary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-secondary)")
            }
          >
            {item.label}
          </a>
        ))}
        <a href={ctaHref} className="btn btn-primary btn-md">
          {ctaLabel}
        </a>
      </nav>

      {/* Mobile menu button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
        style={{
          display: "none",
          background: "none",
          border: "none",
          color: "var(--text-primary)",
          cursor: "pointer",
          padding: "var(--space-3)",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          {mobileOpen ? (
            <path d="M6 6l12 12M6 18L18 6" />
          ) : (
            <path d="M4 8h16M4 16h16" />
          )}
        </svg>
      </button>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav
          className="glass-frosted"
          style={{
            position: "absolute",
            top: 64,
            left: 0,
            right: 0,
            padding: "var(--space-5) var(--space-6)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
          }}
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: "var(--text-secondary)",
                textDecoration: "none",
                padding: "var(--space-3) 0",
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </header>
  );
}
