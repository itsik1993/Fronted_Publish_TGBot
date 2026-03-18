import { useState } from "react";
import ContentSection from "./ContentSection.jsx";
import LinksSection   from "./Linkssection.jsx";
import MediaSection   from "./Mediasection.jsx";
import TimingSection  from "./Timingsection.jsx";
import GroupsSection  from "./Groupssection.jsx";

export default function CreateAd() {
  const [form, setForm] = useState({
    name: "", text: "",
    links: [[{ name: "", url: "" }]],
    media: null,
    startDate: "", startTime: "09:00",
    endDate: "",   endTime: "",
    repetition: 60,
    isActive: true, pinMessage: false, deleteLast: false,
  });

  return (
    <div className="relative flex flex-col w-full bg-[#0f0f1a] font-sans" dir="rtl">

      <div className="fixed top-[-100px] left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.25)_0%,transparent_70%)] pointer-events-none z-0" />

      <div className="relative z-10 px-5 pt-5 pb-4 text-center">
        <div className="inline-flex items-center gap-1.5 bg-indigo-500/15 border border-indigo-500/30 rounded-full px-3 py-1 text-[11px] text-indigo-300 mb-3 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          יצירת מודעה חדשה
        </div>
        <h1 className="text-[22px] font-extrabold leading-tight bg-gradient-to-br from-white to-indigo-300 bg-clip-text text-transparent">
          בניית מודעה
        </h1>
      </div>

      <div className="relative z-10 px-5 pb-6">
        <ContentSection form={form} setForm={setForm} />
        <LinksSection   form={form} setForm={setForm} />
        <MediaSection   form={form} setForm={setForm} />
        <TimingSection  form={form} setForm={setForm} />
        <GroupsSection  form={form} />

        <button className="w-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-[15px] rounded-2xl py-4 border-none cursor-pointer shadow-[0_4px_20px_rgba(99,102,241,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(99,102,241,0.5)] active:scale-[0.98] mt-1">
          ✅ שמור מודעה
        </button>
      </div>

    </div>
  );
}