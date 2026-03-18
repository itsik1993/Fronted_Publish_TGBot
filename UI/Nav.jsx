  
  
import { useState } from "react";
import {
 
  useNavigate
} from 'react-router-dom'


     export default function Nav() {
        const navigate = useNavigate();
      const [activeNav, setActiveNav] = useState(0);
          const navItems = [
    { icon: "🏠", label: "ראשי", navigateTo: "/" },
    { icon: "📝", label: "מודעות" },
    { icon: "⚙️", label: "הגדרות" },
  ];
       return (
      <div className="sticky bottom-0 z-10 flex justify-around bg-[rgba(15,15,26,0.95)] backdrop-blur-xl border-t border-white/[0.08] py-1 mt-auto">
  {navItems.map((n, i) => (
    <button
      key={i}
      onClick={() => { setActiveNav(i);navigate(n.navigateTo) }}
    //   onClick={() => { setActiveNav(i); showToast(`עברת ל${n.label}`);navigate(n.navigateTo) }}
      className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl border-none cursor-pointer transition-all duration-200 font-sans bg-transparent ${activeNav === i ? "bg-indigo-500/15" : ""}`}
    >
      <span className="text-base">{n.icon}</span>
      <span className={`text-[10px] font-medium ${activeNav === i ? "text-indigo-300" : "text-gray-500"}`}>
        {n.label}
      </span>
    </button>
  ))}
</div>
       )
     }
     
