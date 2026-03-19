import { useState } from "react";

const MOCK_ADS = [
  {
    id: 1, name: "מבצע סוף שבוע", isActive: true,
    text: "מבצע מיוחד! 50% הנחה על כל המוצרים עד סוף השבוע. אל תפספסו את ההזדמנות הזו!",
    groups: 4, startDate: "2024-03-01", startTime: "09:00", repetition: 60,
    media: { type: "image", thumb: "https://picsum.photos/seed/ad1/120/90" },
  },
  {
    id: 2, name: "קמפיין VIP", isActive: true,
    text: "חברי ה-VIP מקבלים גישה מוקדמת למוצרים החדשים שלנו. הצטרפו עכשיו!",
    groups: 2, startDate: "2024-03-05", startTime: "10:00", repetition: 120,
    media: null,
  },
  {
    id: 3, name: "ניוזלטר שבועי", isActive: false,
    text: "עדכון שבועי עם כל החדשות, המבצעים והתכנים המעניינים ביותר עבורכם.",
    groups: 6, startDate: "2024-02-15", startTime: "08:00", repetition: 10080,
    media: { type: "video", thumb: "https://picsum.photos/seed/ad3/120/90" },
  },
  {
    id: 4, name: "פרסום בוקר", isActive: true,
    text: "בוקר טוב! התחילו את היום עם ההצעות הטובות ביותר שלנו.",
    groups: 3, startDate: "2024-03-10", startTime: "07:30", repetition: 1440,
    media: null,
  },
  {
    id: 5, name: "הנחת לקוחות חדשים", isActive: false,
    text: "ברוכים הבאים! לקוחות חדשים מקבלים 20% הנחה על הרכישה הראשונה.",
    groups: 1, startDate: "2024-01-01", startTime: "12:00", repetition: 30,
    media: { type: "image", thumb: "https://picsum.photos/seed/ad5/120/90" },
  },
];

function Toggle({ checked, onChange }) {
  return (
    <button onClick={e => { e.stopPropagation(); onChange(!checked); }}
      className={`relative w-10 h-5 rounded-full transition-all duration-300 border-none cursor-pointer shrink-0 ${checked ? "bg-indigo-500" : "bg-white/10"}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 ${checked ? "right-0.5" : "left-0.5"}`} />
    </button>
  );
}

function ConfirmModal({ adName, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6" onClick={onCancel}>
      <div className="w-full max-w-[340px] bg-[#1a1a2e] border border-white/10 rounded-2xl p-5"
        onClick={e => e.stopPropagation()}>
        <div className="text-center mb-4">
          <div className="text-3xl mb-2">🗑️</div>
          <div className="text-base font-bold text-white mb-1">מחיקת מודעה</div>
          <div className="text-sm text-gray-400">
            האם למחוק את <span className="text-white font-semibold">"{adName}"</span>? לא ניתן לשחזר.
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel}
            className="flex-1 bg-white/[0.06] border border-white/10 text-gray-300 text-sm font-semibold rounded-xl py-2.5 cursor-pointer hover:bg-white/10 transition-all">
            ביטול
          </button>
          <button onClick={onConfirm}
            className="flex-1 bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-semibold rounded-xl py-2.5 cursor-pointer hover:bg-red-500/30 transition-all">
            מחק
          </button>
        </div>
      </div>
    </div>
  );
}

function AdDetailModal({ ad, onClose, onEdit, onDuplicate }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-[430px] bg-[#1a1a2e] border border-white/10 rounded-t-3xl p-5 pb-8 max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>

        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${ad.isActive ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-white/[0.06] border-white/10 text-gray-500"}`}>
            {ad.isActive ? "פעיל" : "מושבת"}
          </span>
          <div className="text-right">
            <div className="text-base font-bold text-white">{ad.name}</div>
            <div className="text-[11px] text-gray-500 mt-0.5">#{ad.id}</div>
          </div>
        </div>

        {/* Media preview */}
        {ad.media && (
          <div className="relative rounded-2xl overflow-hidden mb-4 h-36">
            <img src={ad.media.thumb} alt="מדיה" className="w-full h-full object-cover" />
            {ad.media.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="text-white text-3xl">▶</span>
              </div>
            )}
          </div>
        )}

        {/* Text */}
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-3 mb-4 text-right">
          <div className="text-[10px] text-gray-600 mb-1.5">טקסט המודעה</div>
          <div className="text-sm text-gray-200 leading-relaxed">{ad.text}</div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          {[
            { label: "קבוצות", value: `${ad.groups} קבוצות` },
            { label: "תדירות", value: `כל ${ad.repetition} דק׳` },
            { label: "תאריך התחלה", value: ad.startDate },
            { label: "שעת התחלה", value: ad.startTime },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2.5 text-right">
              <div className="text-[10px] text-gray-600 mb-0.5">{label}</div>
              <div className="text-sm text-gray-200 font-semibold">{value}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button onClick={onEdit}
            className="flex items-center justify-center gap-1.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[13px] font-semibold rounded-xl py-3 cursor-pointer hover:bg-indigo-500/30 transition-all">
            ✏️ ערוך
          </button>
          <button onClick={onDuplicate}
            className="flex items-center justify-center gap-1.5 bg-white/[0.06] border border-white/10 text-gray-300 text-[13px] font-semibold rounded-xl py-3 cursor-pointer hover:bg-white/10 transition-all">
            📋 שכפל
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AllPostManager() {
  const [ads,          setAds]          = useState(MOCK_ADS);
  const [filterQuery,  setFilterQuery]  = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedAd,   setSelectedAd]   = useState(null);
  const [confirmAd,    setConfirmAd]    = useState(null);

  const toggleActive = (id) =>
    setAds(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));

  const duplicateAd = (ad) => {
    const newAd = { ...ad, id: Date.now(), name: `${ad.name} (עותק)`, isActive: false };
    setAds(prev => [newAd, ...prev]);
    setSelectedAd(null);
  };

  const deleteAd = () => {
    setAds(prev => prev.filter(a => a.id !== confirmAd.id));
    setConfirmAd(null);
    setSelectedAd(null);
  };

  const filtered = ads.filter(a => {
    const matchText   = a.name.includes(filterQuery) || a.text.includes(filterQuery);
    const matchStatus = filterStatus === "all" || (filterStatus === "active" ? a.isActive : !a.isActive);
    return matchText && matchStatus;
  });

  const activeCount   = ads.filter(a => a.isActive).length;
  const inactiveCount = ads.filter(a => !a.isActive).length;

  return (
    <div className="relative flex flex-col w-full bg-[#0f0f1a] font-sans" dir="rtl">

      <div className="fixed top-[-100px] left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.25)_0%,transparent_70%)] pointer-events-none z-0" />

      {/* Header */}
      <div className="relative z-10 px-5 pt-5 pb-4 text-center">
        <div className="inline-flex items-center gap-1.5 bg-indigo-500/15 border border-indigo-500/30 rounded-full px-3 py-1 text-[11px] text-indigo-300 mb-3 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          ניהול מודעות
        </div>
        <h1 className="text-[22px] font-extrabold leading-tight bg-gradient-to-br from-white to-indigo-300 bg-clip-text text-transparent">
          המודעות שלי
        </h1>
      </div>

      <div className="relative z-10 px-5 pb-6">

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: "סה״כ",    value: ads.length,    color: "text-white" },
            { label: "פעילות",  value: activeCount,   color: "text-green-400" },
            { label: "מושבתות", value: inactiveCount, color: "text-gray-500" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl px-3 py-2.5 text-center">
              <div className={`text-xl font-extrabold ${color}`}>{value}</div>
              <div className="text-[11px] text-gray-600 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Search + filter */}
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <input type="text" placeholder="חיפוש לפי שם או טקסט..."
              value={filterQuery}
              onChange={e => setFilterQuery(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors" />
            {filterQuery && (
              <button onClick={() => setFilterQuery("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 bg-transparent border-none cursor-pointer text-sm">✕</button>
            )}
          </div>
        </div>

        {/* Status tabs */}
        <div className="flex gap-1.5 mb-4">
          {[["all","הכל"],["active","פעילות"],["inactive","מושבתות"]].map(([v,l]) => (
            <button key={v} onClick={() => setFilterStatus(v)}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold border transition-all cursor-pointer ${filterStatus === v ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300" : "bg-white/[0.04] border-white/10 text-gray-500 hover:text-gray-300"}`}>
              {l}
            </button>
          ))}
        </div>

        {/* Ads list */}
        <div className="flex flex-col gap-2">
          {filtered.length === 0 && (
            <div className="text-center py-10 text-[13px] text-gray-600">לא נמצאו מודעות</div>
          )}

          {filtered.map(ad => (
            <div key={ad.id}
              onClick={() => setSelectedAd(ad)}
              className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3 cursor-pointer hover:bg-white/[0.07] hover:border-indigo-500/20 transition-all active:scale-[0.99]">

              {/* Media thumb or placeholder */}
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-white/[0.06] flex items-center justify-center">
                {ad.media
                  ? <div className="relative w-full h-full">
                      <img src={ad.media.thumb} alt={ad.name} className="w-full h-full object-cover pointer-events-none" />
                      {ad.media.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
                          <span className="text-white text-[10px]">▶</span>
                        </div>
                      )}
                    </div>
                  : <span className="text-xl pointer-events-none">📝</span>
                }
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 text-right">
                <div className="text-sm font-semibold text-gray-100 truncate">{ad.name}</div>
                <div className="text-[12px] text-gray-500 truncate mt-0.5">{ad.text}</div>
                <div className="flex items-center gap-2 justify-end mt-1">
                  <span className="text-[10px] text-gray-600">👥 {ad.groups}</span>
                  <span className="text-[10px] text-gray-600">⏱ {ad.repetition} דק׳</span>
                  <span className="text-[10px] text-gray-600">📅 {ad.startDate}</span>
                </div>
              </div>

              {/* Toggle + actions */}
              <div className="flex flex-col items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                <Toggle checked={ad.isActive} onChange={() => toggleActive(ad.id)} />
                <button
                  onClick={() => duplicateAd(ad)}
                  className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/10 text-gray-400 text-[11px] cursor-pointer hover:bg-white/10 transition-all flex items-center justify-center">
                  📋
                </button>
                <button
                  onClick={() => setConfirmAd(ad)}
                  className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] cursor-pointer hover:bg-red-500/20 transition-all flex items-center justify-center">
                  🗑
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Detail Modal */}
      {selectedAd && (
        <AdDetailModal
          ad={selectedAd}
          onClose={() => setSelectedAd(null)}
          onEdit={() => { setSelectedAd(null); /* navigate to edit */ }}
          onDuplicate={() => duplicateAd(selectedAd)}
        />
      )}

      {/* Confirm Delete */}
      {confirmAd && (
        <ConfirmModal
          adName={confirmAd.name}
          onConfirm={deleteAd}
          onCancel={() => setConfirmAd(null)}
        />
      )}

    </div>
  );
}