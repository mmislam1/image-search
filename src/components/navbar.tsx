import { useState } from "react";

const GlobeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

const StarIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L13.8 9.2L21 12L13.8 14.8L12 22L10.2 14.8L3 12L10.2 9.2L12 2Z" />
    </svg>
);

export default function Navbar() {
    const [active, setActive] = useState(null);

    const navLinks = ["소개", "기능", "가격", "비즈니스"];

    return (
        <div style={{ fontFamily: "'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif", background: "#fff", minHeight: "100vh" }}>
            <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          height: 64px;
          background: #ffffff;
          border-bottom: 1px solid #f0f0f0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 17px;
          font-weight: 700;
          color: #111;
          letter-spacing: -0.3px;
          cursor: pointer;
          text-decoration: none;
        }

        .logo-icon {
          color: #111;
          display: flex;
          align-items: center;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 36px;
          list-style: none;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        .nav-link {
          font-size: 14px;
          font-weight: 450;
          color: #444;
          cursor: pointer;
          transition: color 0.15s ease;
          letter-spacing: -0.1px;
          position: relative;
          padding-bottom: 2px;
        }

        .nav-link:hover {
          color: #111;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1.5px;
          background: #111;
          transition: width 0.2s ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .lang-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13.5px;
          font-weight: 450;
          color: #555;
          background: none;
          border: none;
          cursor: pointer;
          padding: 7px 12px;
          border-radius: 8px;
          transition: background 0.15s ease, color 0.15s ease;
          letter-spacing: -0.1px;
        }

        .lang-btn:hover {
          background: #f5f5f5;
          color: #111;
        }

        .btn-outline {
          font-size: 13.5px;
          font-weight: 500;
          color: #222;
          background: none;
          border: 1.5px solid #ddd;
          border-radius: 9px;
          padding: 7px 16px;
          cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease;
          letter-spacing: -0.1px;
          font-family: inherit;
        }

        .btn-outline:hover {
          border-color: #aaa;
          background: #fafafa;
        }

        .btn-primary {
          font-size: 13.5px;
          font-weight: 600;
          color: #fff;
          background: #111;
          border: none;
          border-radius: 9px;
          padding: 8px 18px;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.1s ease;
          letter-spacing: -0.2px;
          font-family: inherit;
        }

        .btn-primary:hover {
          background: #333;
        }

        .btn-primary:active {
          transform: scale(0.97);
        }
      `}</style>

            <nav className="navbar">
                {/* Logo */}
                <a className="logo" href="#">
                    <span className="logo-icon"><StarIcon /></span>
                    Toostar
                </a>

                {/* Center Nav Links */}
                <ul className="nav-links">
                    {navLinks.map((link) => (
                        <li key={link}>
                            <span
                                className="nav-link"
                                onClick={() => setActive(link)}
                                style={active === link ? { color: "#111" } : {}}
                            >
                                {link}
                            </span>
                        </li>
                    ))}
                </ul>

                {/* Right Actions */}
                <div className="nav-right">
                    <button className="lang-btn">
                        <GlobeIcon />
                        한국어
                    </button>
                    <button className="btn-outline">문의하기</button>
                    <button className="btn-primary">무료로 시작 &gt;</button>
                </div>
            </nav>

            {/* Page preview */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 64px)", color: "#ccc", fontSize: "14px", fontFamily: "inherit" }}>
                페이지 콘텐츠
            </div>
        </div>
    );
}