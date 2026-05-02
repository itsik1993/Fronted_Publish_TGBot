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

function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 border-none cursor-pointer shrink-0 ${checked ? "bg-indigo-500" : "bg-white/10"}`}>
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 ${checked ? "right-0.5" : "left-0.5"}`} />
    </button>
  );
}

function FieldRow({ label, required = true, children }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-1.5 shrink-0">{children}</div>
      <span className="text-sm text-gray-400 shrink-0">
        {label}
        {!required && <span className="text-[10px] text-gray-600 mr-1">(אופציונלי)</span>}
      </span>
    </div>
  );
}

export default function TimingSection({ form, setForm }) {
  return (
    <>
      <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-2 mt-1">
        תזמון ברירת מחדל
      </div>

      <SectionCard icon="⏰" title="זמנים">
        <div className="flex flex-col gap-3">

          <FieldRow label="תאריך התחלה">
            <input type="date" value={form.datestart}
              onChange={e => setForm({ ...form, datestart: e.target.value })}
              className="bg-white/[0.06] border border-white/10 rounded-xl px-2 py-2 text-white text-sm font-mono text-center focus:outline-none focus:border-indigo-500/50" />
          </FieldRow>

          <FieldRow label="שעת התחלה">
            <input type="time" value={form.firsttimestart}
              onChange={e => setForm({ ...form, firsttimestart: e.target.value })}
              className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-white text-sm font-mono w-28 text-center focus:outline-none focus:border-indigo-500/50" />
          </FieldRow>

          <FieldRow label="תדירות (דקות)">
            <input type="number" min="1" value={form.repetition}
              onChange={e => setForm({ ...form, repetition: e.target.value })}
              className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-white text-sm w-20 text-center focus:outline-none focus:border-indigo-500/50" />
          </FieldRow>

          <FieldRow label="תאריך סיום" required={false}>
            <input type="date" value={form.dateend}
              onChange={e => setForm({ ...form, dateend: e.target.value })}
              className="bg-white/[0.06] border border-white/10 rounded-xl px-2 py-2 text-white text-sm font-mono text-center focus:outline-none focus:border-indigo-500/50" />
            {form.dateend && (
              <button onClick={() => setForm({ ...form, dateend: "" })}
                className="text-gray-600 text-[11px] hover:text-red-400 cursor-pointer bg-transparent border-none">✕</button>
            )}
          </FieldRow>

          <FieldRow label="שעת סיום" required={false}>
            <input type="time" value={form.endtime}
              onChange={e => setForm({ ...form, endtime: e.target.value })}
              className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-white text-sm font-mono w-28 text-center focus:outline-none focus:border-indigo-500/50" />
            {form.endtime && (
              <button onClick={() => setForm({ ...form, endtime: "" })}
                className="text-gray-600 text-[11px] hover:text-red-400 cursor-pointer bg-transparent border-none">✕</button>
            )}
          </FieldRow>

        </div>
      </SectionCard>

      <SectionCard icon="🔧" title="אפשרויות">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Toggle checked={form.pin_message} onChange={v => setForm({ ...form, pin_message: v })} />
            <span className="text-sm text-gray-300">הצמד הודעה</span>
          </div>
          <div className="flex items-center justify-between">
            <Toggle checked={form.deletelaste} onChange={v => setForm({ ...form, deletelaste: v })} />
            <span className="text-sm text-gray-300">מחק הודעה קודמת</span>
          </div>
          <div className="flex items-center justify-between">
            <Toggle checked={form.isactive} onChange={v => setForm({ ...form, isactive: v })} />
            <span className="text-sm text-gray-300">פעיל</span>
          </div>
        </div>
      </SectionCard>
    </>
  );
}