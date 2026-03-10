import { useState } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }



  .app {
    width: 100%;
    max-width: 430px;
    min-height: 100vh;
    margin: 0 auto;
    background: #0f0f1a;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  .bg-glow {
    position: fixed;
    top: -100px;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .header {
    padding: 20px 20px 16px;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  .header-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(99,102,241,0.15);
    border: 1px solid rgba(99,102,241,0.3);
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 11px;
    color: #a5b4fc;
    margin-bottom: 12px;
    letter-spacing: 0.5px;
  }

  .dot {
    width: 6px;
    height: 6px;
    background: #6366f1;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.3); }
  }

  .header h1 {
    font-size: 26px;
    font-weight: 800;
    color: #ffffff;
    line-height: 1.2;
    margin-bottom: 6px;
    background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .header p {
    font-size: 13px;
    color: #6b7280;
    font-weight: 400;
  }

  .avatar-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 16px 20px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 12px 16px;
    position: relative;
    z-index: 1;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .avatar-info {
    text-align: right;
    flex: 1;
  }

  .avatar-name {
    font-size: 14px;
    font-weight: 600;
    color: #f3f4f6;
  }

  .avatar-sub {
    font-size: 11px;
    color: #6b7280;
    margin-top: 1px;
  }

  .crown {
    font-size: 20px;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin: 0 20px 20px;
    position: relative;
    z-index: 1;
  }

  .stat-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    padding: 14px 10px;
    text-align: center;
    transition: all 0.2s;
    cursor: default;
  }

  .stat-card:hover {
    background: rgba(99,102,241,0.1);
    border-color: rgba(99,102,241,0.3);
    transform: translateY(-2px);
  }

  .stat-icon { font-size: 20px; margin-bottom: 6px; }
  .stat-value { font-size: 18px; font-weight: 700; color: #f3f4f6; }
  .stat-label { font-size: 10px; color: #6b7280; margin-top: 2px; }

  .section-title {
    font-size: 13px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin: 0 20px 12px;
    position: relative;
    z-index: 1;
  }

  .action-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin: 0 20px 20px;
    position: relative;
    z-index: 1;
  }

  .btn {
    border: none;
    border-radius: 14px;
    padding: 14px 12px;
    font-family: 'Rubik', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    direction: rtl;
  }

  .btn-icon { font-size: 22px; }

  .btn-primary {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    grid-column: span 2;
    flex-direction: row;
    justify-content: center;
    padding: 16px;
    font-size: 15px;
    box-shadow: 0 4px 20px rgba(99,102,241,0.35);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(99,102,241,0.5);
  }

  .btn-primary:active { transform: scale(0.98); }

  .btn-secondary {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    color: #e5e7eb;
  }

  .btn-secondary:hover {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.2);
    transform: translateY(-2px);
  }

  .btn-secondary:active { transform: scale(0.97); }

  .btn-accent {
    background: rgba(251,191,36,0.12);
    border: 1px solid rgba(251,191,36,0.25);
    color: #fbbf24;
  }

  .btn-accent:hover {
    background: rgba(251,191,36,0.2);
    transform: translateY(-2px);
  }

  .post-feed {
    margin: 0 20px 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;
    z-index: 1;
  }

  .post-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    padding: 14px;
    transition: all 0.2s;
  }

  .post-card:hover {
    background: rgba(255,255,255,0.07);
    border-color: rgba(99,102,241,0.25);
  }

  .post-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .post-channel {
    font-size: 12px;
    font-weight: 600;
    color: #a5b4fc;
  }

  .post-time {
    font-size: 11px;
    color: #4b5563;
  }

  .post-text {
    font-size: 13px;
    color: #d1d5db;
    line-height: 1.5;
    margin-bottom: 10px;
  }

  .post-footer {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .post-stat {
    font-size: 11px;
    color: #6b7280;
    display: flex;
    align-items: center;
    gap: 3px;
  }

  .status-pill {
    margin-right: auto;
    background: rgba(34,197,94,0.12);
    border: 1px solid rgba(34,197,94,0.25);
    color: #86efac;
    font-size: 10px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 10px;
  }

  .bottom-nav {
    position: sticky;
    bottom: 0;
    background: rgba(15,15,26,0.95);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255,255,255,0.08);
    display: flex;
    justify-content: space-around;
    padding: 10px 0 max(10px, env(safe-area-inset-bottom));
    z-index: 10;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: 6px 16px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    background: none;
    font-family: 'Rubik', sans-serif;
  }

  .nav-item.active { background: rgba(99,102,241,0.15); }
  .nav-icon { font-size: 20px; }
  .nav-label { font-size: 10px; font-weight: 500; color: #6b7280; }
  .nav-item.active .nav-label { color: #a5b4fc; }

  .toast {
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: #6366f1;
    color: white;
    padding: 10px 20px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    z-index: 100;
    opacity: 0;
    transition: all 0.3s;
    white-space: nowrap;
    pointer-events: none;
  }

  .toast.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
`;

const posts = [
  {
    channel: "📢 ערוץ פרסום ראשי",
    time: "לפני 5 דק׳",
    text: "מבצע מיוחד! 50% הנחה על כל המוצרים עד סוף השבוע. אל תפספסו!",
    views: "1.2K",
    clicks: "234",
    status: "פעיל",
  },
  {
    channel: "🎯 קמפיין VIP",
    time: "לפני שעה",
    text: "חברי ה-VIP מקבלים גישה מוקדמת למוצרים החדשים שלנו. הצטרפו עכשיו!",
    views: "890",
    clicks: "167",
    status: "פעיל",
  },
];

export default function App() {
  const [activeNav, setActiveNav] = useState(0);
  const [toast, setToast] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2200);
  };

  const navItems = [
    { icon: "🏠", label: "ראשי" },
    { icon: "📊", label: "סטטיסטיקה" },
    { icon: "📝", label: "פוסטים" },
    { icon: "⚙️", label: "הגדרות" },
  ];

  return (
    <>
      <style>{style}</style>
      <div className="app">
        <div className="bg-glow" />

        {/* Header */}
        <div className="header">
          <div className="header-badge">
            <div className="dot" />
            פעיל עכשיו
          </div>
          <h1>בוט פרסום הבוס הגדול</h1>
          <p>נהל את הפרסומים שלך בקלות ובמהירות</p>
        </div>

        {/* User Card */}
        <div className="avatar-row">
          <div className="avatar">👑</div>
          <div className="avatar-info">
            <div className="avatar-name">הבוס הגדול</div>
            <div className="avatar-sub">מנהל מערכת · פרימיום</div>
          </div>
          <div className="crown">🔥</div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📣</div>
            <div className="stat-value">47</div>
            <div className="stat-label">פוסטים</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👁️</div>
            <div className="stat-value">12K</div>
            <div className="stat-label">צפיות</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💎</div>
            <div className="stat-value">98%</div>
            <div className="stat-label">אפקט</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="section-title">פעולות מהירות</div>
        <div className="action-buttons">
          <button
            className="btn btn-primary"
            onClick={() => showToast("✨ פוסט חדש נוצר!")}
          >
            <span className="btn-icon">✍️</span>
            צור פוסט חדש
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => showToast("📅 מתזמן נפתח")}
          >
            <span className="btn-icon">📅</span>
            תזמן
          </button>
          <button
            className="btn btn-accent"
            onClick={() => showToast("📊 טוען דוח...")}
          >
            <span className="btn-icon">📊</span>
            דוחות
          </button>
        </div>

        {/* Post Feed */}
        <div className="section-title">פוסטים אחרונים</div>
        <div className="post-feed">
          {posts.map((p, i) => (
            <div
              className="post-card"
              key={i}
              onClick={() => showToast("📋 פוסט נפתח")}
            >
              <div className="post-header">
                <div className="post-channel">{p.channel}</div>
                <div className="post-time">{p.time}</div>
              </div>
              <div className="post-text">{p.text}</div>
              <div className="post-footer">
                <span className="post-stat">👁️ {p.views}</span>
                <span className="post-stat">🖱️ {p.clicks}</span>
                <span className="status-pill">{p.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Nav */}
        <div className="bottom-nav">
          {navItems.map((n, i) => (
            <button
              key={i}
              className={`nav-item ${activeNav === i ? "active" : ""}`}
              onClick={() => {
                setActiveNav(i);
                showToast(`עברת ל${n.label}`);
              }}
            >
              <span className="nav-icon">{n.icon}</span>
              <span className="nav-label">{n.label}</span>
            </button>
          ))}
        </div>

        {/* Toast */}
        <div className={`toast ${toastVisible ? "show" : ""}`}>{toast}</div>
      </div>
    </>
  );
}