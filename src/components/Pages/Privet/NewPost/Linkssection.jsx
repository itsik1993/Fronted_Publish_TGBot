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

export default function LinksSection({ form, setForm }) {
  return (
    <SectionCard icon="🔗" title="לינקים">

      <div className="flex flex-col gap-1 mb-2">
        {form.messages_links.map((row, rowIdx) => (
          <div key={rowIdx}>

            {row.map((link, linkIdx) => (
              <div key={linkIdx} className={`flex items-start gap-2 mb-1 ${linkIdx > 0 ? "mr-5" : ""}`}>
                {linkIdx === 0 && <span className="text-gray-600 text-[13px] shrink-0 cursor-grab mt-2">⠿</span>}
                {linkIdx > 0  && <span className="w-4 shrink-0" />}

                <button
                  onClick={() => {
                    const updated = form.messages_links
                      .map((r, ri) => ri === rowIdx ? r.filter((_, li) => li !== linkIdx) : r)
                      .filter(r => r.length > 0);
                    setForm({ ...form, messages_links: updated.length ? updated : [[{ name: "", url: "" }]] });
                  }}
                  className="w-5 h-5 mt-2 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] cursor-pointer hover:bg-red-500/20 transition-all shrink-0 flex items-center justify-center"
                >✕</button>

                <div className="flex-1 flex flex-col gap-1 min-w-0">
                  <input
                    type="text"
                    placeholder="שם הכפתור"
                    value={link.name}
                    onChange={e => {
                      const updated = form.messages_links.map((r, ri) =>
                        ri === rowIdx ? r.map((l, li) => li === linkIdx ? { ...l, name: e.target.value } : l) : r
                      );
                      setForm({ ...form, messages_links: updated });
                    }}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-2 py-1.5 text-white text-[12px] placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="https://..."
                    value={link.url}
                    onChange={e => {
                      const updated = form.messages_links.map((r, ri) =>
                        ri === rowIdx ? r.map((l, li) => li === linkIdx ? { ...l, url: e.target.value } : l) : r
                      );
                      setForm({ ...form, messages_links: updated });
                    }}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-2 py-1.5 text-white text-[12px] placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>

                {row.length === 1 && (
                  <button
                    title="הוסף לידו (חצי שורה)"
                    onClick={() => {
                      const updated = form.messages_links.map((r, ri) =>
                        ri === rowIdx ? [...r, { name: "", url: "" }] : r
                      );
                      setForm({ ...form, messages_links: updated });
                    }}
                    className="w-6 h-6 mt-2 rounded-md bg-white/[0.06] border border-white/10 text-gray-400 text-[11px] cursor-pointer hover:bg-indigo-500/20 hover:border-indigo-500/40 hover:text-indigo-300 transition-all shrink-0 flex items-center justify-center"
                  >+</button>
                )}
              </div>
            ))}

            {rowIdx < form.messages_links.length - 1 && (
              <div className="flex items-center gap-2 my-2 mr-5">
                <div className="flex-1 border-t border-dashed border-white/15" />
                <span className="text-[10px] text-gray-600 bg-[#0f0f1a] px-1.5">↵ שורה חדשה</span>
                <div className="flex-1 border-t border-dashed border-white/15" />
              </div>
            )}

          </div>
        ))}
      </div>

      <button
        onClick={() => setForm({ ...form, messages_links: [...form.messages_links, [{ name: "", url: "" }]] })}
        className="w-full flex items-center justify-center gap-1 bg-white/[0.04] border border-dashed border-white/15 rounded-xl py-2 text-gray-500 text-[12px] cursor-pointer hover:border-indigo-500/40 hover:text-indigo-300 transition-all"
      >
        ↵ שורה חדשה
      </button>

      {form.messages_links.some(row => row.some(l => l.name)) && (
        <div className="mt-3 pt-3 border-t border-white/[0.06]">
          <div className="text-[10px] text-gray-600 mb-2 text-right">תצוגה מקדימה</div>
          {form.messages_links.map((row, ri) => (
            <div key={ri} className="flex gap-1.5 mb-1.5">
              {row.map((link, li) => link.name && (
                <div key={li} className="flex-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[12px] font-medium rounded-xl px-3 py-1.5 text-center">
                  {link.name}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

    </SectionCard>
  );
}