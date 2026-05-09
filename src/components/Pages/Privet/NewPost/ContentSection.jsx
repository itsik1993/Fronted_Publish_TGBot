import { useRef } from "react";

function TextToolbar({ textareaRef, value, onChange }) {
  const applyFormat = (prefix, suffix) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);
    const newText = value.slice(0, start) + prefix + selected + suffix + value.slice(end);
    onChange(newText);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const tools = [
    { label: "B",   title: "הדגשה",    style: "font-bold",             action: () => applyFormat("<b>", "</b>") },
    { label: "I",   title: "נטוי",     style: "italic",                action: () => applyFormat("<i>", "</i>") },
    { label: "U",   title: "קו תחתון", style: "underline",             action: () => applyFormat("<u>", "</u>") },
    { label: "S",   title: "קו חוצה",  style: "line-through",          action: () => applyFormat("<s>", "</s>") },
    { label: "</>", title: "קוד",      style: "font-mono text-[11px]", action: () => applyFormat("<code>", "</code>") },
    { label: "❝",  title: "ציטוט",    style: "",                      action: () => applyFormat("<blockquote>", "</blockquote> ") },
  ];

  return (
    <div className="flex items-center gap-1 mb-1.5 flex-wrap">
      {tools.map((t) => (
        <button
          key={t.label}
          title={t.title}
          onClick={t.action}
          className={`w-7 h-7 rounded-lg bg-white/[0.06] border border-white/10 text-gray-300 text-[12px] cursor-pointer hover:bg-indigo-500/20 hover:border-indigo-500/40 hover:text-indigo-300 transition-all flex items-center justify-center ${t.style}`}
        >
          {t.label}
        </button>
      ))}
      <span className="text-[10px] text-gray-600 mr-1">Markdown</span>
    </div>
  );
}

function SectionCard({ icon, title, children }) {
  return (
    <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden mb-3">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-semibold text-gray-200">{title}</span>
      </div>
      <div className="px-4 py-3">{children}</div>
    </div>
  );
}

export default function ContentSection({ form, setForm }) {
  const textareaRef = useRef(null);

  return (
    <>
      <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-2">
        תוכן המודעה
      </div>

      <SectionCard icon="✏️" title="שם ותוכן">
        <div className="flex flex-col gap-3">

          <div>
            <div className="text-[11px] text-gray-500 mb-1.5">שם המודעה</div>
            <input
              type="text"
              placeholder="לדוגמה: מבצע סוף שבוע"
              value={form.messagesname}
              onChange={e => setForm({ ...form, messagesname: e.target.value })}
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>

          <div>
            <div className="text-[11px] text-gray-500 mb-1.5">טקסט המודעה</div>
            <TextToolbar
              textareaRef={textareaRef}
              value={form.messages_text}
              onChange={v => setForm({ ...form, messages_text: v })}
            />
            <textarea
              ref={textareaRef}
              placeholder="כתוב את תוכן ההודעה שתפורסם..."
              value={form.messages_text}
              onChange={e => setForm({ ...form, messages_text: e.target.value })}
              rows={4}
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none font-mono"
            />
          </div>

        </div>
      </SectionCard>
    </>
  );
}