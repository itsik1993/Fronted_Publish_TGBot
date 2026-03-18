import { useState, useRef } from "react";

const MOCK_MEDIA = [
  { id: "1", type: "image", name: "באנר מבצע.jpg",   thumb: "https://picsum.photos/seed/a1/120/90" },
  { id: "2", type: "image", name: "לוגו חברה.png",   thumb: "https://picsum.photos/seed/a2/120/90" },
  { id: "3", type: "image", name: "פוסטר קיץ.jpg",   thumb: "https://picsum.photos/seed/a3/120/90" },
  { id: "4", type: "video", name: "סרטון פרסום.mp4", thumb: "https://picsum.photos/seed/a4/120/90" },
  { id: "5", type: "image", name: "תמונת רקע.jpg",   thumb: "https://picsum.photos/seed/a5/120/90" },
  { id: "6", type: "video", name: "קליפ קצר.mp4",    thumb: "https://picsum.photos/seed/a6/120/90" },
];

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

function MediaModal({ selected, onSelect, onClose }) {
  const [library, setLibrary]   = useState(MOCK_MEDIA);
  const [filter, setFilter]     = useState("all");
  const [localSel, setLocalSel] = useState(selected);
  const fileRef                 = useRef(null);

  const filtered = filter === "all" ? library : library.filter(m => m.type === filter);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const newItem = {
      id: String(Date.now()),
      type: file.type.startsWith("video") ? "video" : "image",
      name: file.name,
      thumb: URL.createObjectURL(file),
    };
    setLibrary(prev => [newItem, ...prev]);
    setLocalSel(newItem);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-[430px] bg-[#1a1a2e] border border-white/10 rounded-t-3xl p-5 pb-8 max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}>

        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4 shrink-0" />

        <div className="flex items-center justify-between mb-3 shrink-0">
          <button onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[12px] font-semibold rounded-xl px-3 py-1.5 cursor-pointer hover:bg-indigo-500/30 transition-all">
            + העלה חדש
          </button>
          <span className="text-base font-bold text-white">ספריית מדיה</span>
          <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleUpload} />
        </div>

        <div className="flex gap-1.5 mb-3 shrink-0">
          {[["all","הכל"],["image","תמונות"],["video","סרטונים"]].map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)}
              className={`px-3 py-1 rounded-lg text-[12px] font-semibold border transition-all cursor-pointer ${filter === v ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300" : "bg-white/[0.04] border-white/10 text-gray-500"}`}>
              {l}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 overflow-y-auto flex-1 pb-1">
          {filtered.map(item => (
            <div key={item.id} onClick={() => setLocalSel(item)}
              className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${localSel?.id === item.id ? "border-indigo-500 scale-[0.97]" : "border-transparent"}`}>
              <img src={item.thumb} alt={item.name} className="w-full h-20 object-cover" />
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="text-white text-xl">▶</span>
                </div>
              )}
              {localSel?.id === item.id && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">✓</span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1.5 py-0.5">
                <p className="text-[9px] text-white truncate">{item.name}</p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => { onSelect(localSel); onClose(); }}
          className="mt-4 w-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-[15px] rounded-2xl py-3.5 border-none cursor-pointer transition-all hover:-translate-y-0.5 active:scale-[0.98] shrink-0">
          {localSel ? `בחר — ${localSel.name}` : "בחר קובץ"}
        </button>
      </div>
    </div>
  );
}

export default function MediaSection({ form, setForm }) {
  const [mediaOpen, setMediaOpen] = useState(false);

  return (
    <>
      <SectionCard icon="🖼️" title="מדיה">
        {form.media ? (
          <div className="flex items-center gap-3">
            <div className="relative w-20 h-16 rounded-xl overflow-hidden shrink-0">
              <img src={form.media.thumb} alt={form.media.name} className="w-full h-full object-cover" />
              {form.media.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="text-white text-lg">▶</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-200 font-medium truncate">{form.media.name}</div>
              <div className="text-[11px] text-gray-500 mt-0.5">{form.media.type === "video" ? "סרטון" : "תמונה"}</div>
            </div>
            <div className="flex flex-col gap-1.5">
              <button onClick={() => setMediaOpen(true)}
                className="text-[11px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-2.5 py-1 cursor-pointer hover:bg-indigo-500/20 transition-all">
                החלף
              </button>
              <button onClick={() => setForm({ ...form, media: null })}
                className="text-[11px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-2.5 py-1 cursor-pointer hover:bg-red-500/20 transition-all">
                הסר
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setMediaOpen(true)}
            className="w-full flex flex-col items-center gap-2 bg-white/[0.04] border border-dashed border-white/15 rounded-xl py-5 text-gray-500 cursor-pointer hover:border-indigo-500/40 hover:text-indigo-300 transition-all">
            <span className="text-3xl">🖼️</span>
            <span className="text-[13px]">בחר מדיה מהספרייה</span>
            <span className="text-[11px] text-gray-600">תמונה או סרטון</span>
          </button>
        )}
      </SectionCard>

      {mediaOpen && (
        <MediaModal
          selected={form.media}
          onSelect={m => setForm({ ...form, media: m })}
          onClose={() => setMediaOpen(false)}
        />
      )}
    </>
  );
}