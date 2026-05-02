
// import { useState } from "react";
import { useState ,useEffect ,useContext } from 'react'

import {useNavigate} from 'react-router-dom'
// import Nav from "../../../../UI/Nav.jsx";
import { AuthContext } from '../../../Context/AuthGlobalContxt.jsx'

export default function App() {
   const{ User } = useContext(AuthContext)
  const navigate = useNavigate();
  const [toast, setToast] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2200);
  };

  // const navItems = [
  //   { icon: "🏠", label: "ראשי" },
  //   // { icon: "📊", label: "סטטיסטיקה" },
  //   { icon: "📝", label: "פוסטים" },
  //   { icon: "⚙️", label: "הגדרות" },
  // ];

  return (
    <div className="relative flex flex-col min-h-screen w-full max-w-[430px] mx-auto mt-0 bg-[#0f0f1a] font-sans overflow-hidden" dir="rtl">

      {/* BG Glow */}
      <div className="fixed top-[-100px] left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.25)_0%,transparent_70%)] pointer-events-none z-0" />

      {/* Header */}
      <div className="relative z-10 px-5 pt-3 pb-2 text-center ">

        <h1 className="text-[26px] font-extrabold leading-tight mt-0 mb-1 bg-gradient-to-br from-white to-indigo-300 bg-clip-text text-transparent">
          בוט פרסום הבוס הגדול
        </h1>
        <p className="text-[13px] text-gray-500">נהל את הפרסומים שלך בקלות ובמהירות</p>
      </div>

      {/* User Card */}
      <div className="relative z-10 flex items-center gap-2 mx-5 mb-4 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg shrink-0">
          👑
        </div>
        <div className="flex-1 text-right">
          <div className="text-sm font-semibold text-gray-100"> {User?.managernick_name}</div>
          <div className="text-[11px] text-gray-500 mt-0.5">
           {User?.managersrole==="Admin"? ` מנהל מערכת · פרימיום`:`משתמש צפייה` }
            {/* מנהל מערכת · פרימיום */}
            </div>
        </div>
        <span className="text-xl">🔥</span>
      </div>

      {/* Section Title */}
      <div className="relative z-10 mx-5 mb-3 text-[13px] font-semibold text-gray-500 uppercase tracking-widest">
        פעולות
      </div>

      {/* Buttons Grid */}
      <div className="relative z-10 grid grid-cols-2 gap-2.5 mx-5 mb-5">

        {/* New Post — full width */}
        <button
          onClick={() => { showToast("✍️ יוצר פוסט חדש...")
            navigate("/CreateNewPublish")
           }}
          className="col-span-2 flex flex-row items-center justify-center gap-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-[15px] rounded-2xl px-4 py-4 shadow-[0_4px_20px_rgba(99,102,241,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(99,102,241,0.5)] active:scale-[0.98] cursor-pointer border-none"
        >
          <span className="text-[22px]">✍️</span>
          צור פוסט חדש
        </button>

        {/* Manage Ads — full width */}
        <button
          onClick={() => {

            showToast("📋 פותח ניהול מודעות...")
            navigate("/AllPosts")
            
          }}
          className="col-span-2 flex flex-row items-center justify-between gap-2 bg-indigo-500/[0.08] border border-indigo-500/20 text-indigo-300 font-semibold text-[15px] rounded-2xl px-5 py-4 transition-all duration-200 hover:bg-indigo-500/[0.15] hover:border-indigo-500/40 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="text-[22px]">📝</span>
            ניהול מודעות
          </div>
          <div className="flex items-center gap-1.5 bg-indigo-500/20 rounded-xl px-3 py-1">
            <span className="text-white font-extrabold text-[18px]">47</span>
            <span className="text-[11px] text-indigo-300">פעילות</span>
          </div>
        </button>

        {/* Add Group */}
        <button
          onClick={() => {

            showToast("➕ ניהול קבוצות")
          
            navigate("/GroupsManager")
          } }
          className="flex flex-col items-center gap-1.5 bg-white/[0.06] border border-white/10 text-gray-200 font-semibold text-[13px] rounded-2xl px-3 py-3.5 transition-all duration-200 hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5 active:scale-[0.97] cursor-pointer font-sans"
        >
          <span className="text-[22px]">👥</span>
         ניהול קבוצות
        </button>

        {/* Add Manager */}
        <button
          onClick={() =>
          {
            showToast("🙋 הוספת מנהל")
            navigate("/Managers")

          }
          
          }
          className="flex flex-col items-center gap-1.5 bg-white/[0.06] border border-white/10 text-gray-200 font-semibold text-[13px] rounded-2xl px-3 py-3.5 transition-all duration-200 hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5 active:scale-[0.97] cursor-pointer font-sans"
        >
          <span className="text-[22px]">🙋</span>
          הוסף מנהל
        </button>

        {/* Schedule */}
        <button
          onClick={() => showToast("📅 פותח תזמון...")}
          className="flex flex-col items-center gap-1.5 bg-amber-400/[0.12] border border-amber-400/25 text-amber-400 font-semibold text-[13px] rounded-2xl px-3 py-3.5 transition-all duration-200 hover:bg-amber-400/20 hover:-translate-y-0.5 active:scale-[0.97] cursor-pointer font-sans"
        >
          <span className="text-[22px]">📅</span>
          תזמן פרסום
        </button>

        {/* Settings */}
        <button
          onClick={() => showToast("⚙️ פותח הגדרות...")}
          className="flex flex-col items-center gap-1.5 bg-gray-500/[0.12] border border-gray-500/25 text-gray-400 font-semibold text-[13px] rounded-2xl px-3 py-3.5 transition-all duration-200 hover:bg-gray-500/20 hover:-translate-y-0.5 active:scale-[0.97] cursor-pointer font-sans"
        >
          <span className="text-[22px]">⚙️</span>
          הגדרות
        </button>

      </div>

      {/* Bottom Nav
      <div className="sticky bottom-0 z-10 flex justify-around bg-[rgba(15,15,26,0.95)] backdrop-blur-xl border-t border-white/[0.08] py-2.5 mt-auto">
        {navItems.map((n, i) => (
          <button
            key={i}
            onClick={() => { setActiveNav(i); showToast(`עברת ל${n.label}`); }}
            className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl border-none cursor-pointer transition-all duration-200 font-sans bg-transparent ${activeNav === i ? "bg-indigo-500/15" : ""}`}
          >
            <span className="text-xl">{n.icon}</span>
            <span className={`text-[10px] font-medium ${activeNav === i ? "text-indigo-300" : "text-gray-500"}`}>
              {n.label}
            </span>
          </button>
        ))}
      </div> */}
      {/* <Nav /> */}

      {/* Toast */}
      <div className={`fixed bottom-20 left-1/2 bg-indigo-500 text-white px-5 py-2.5 rounded-full text-[13px] font-semibold z-50 whitespace-nowrap pointer-events-none transition-all duration-300 ${toastVisible ? "opacity-100 -translate-x-1/2 translate-y-0" : "opacity-0 -translate-x-1/2 translate-y-5"}`}>
        {toast}
      </div>

    </div>
  );
}




