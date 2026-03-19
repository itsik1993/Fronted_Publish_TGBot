import { useState } from "react";

const MOCK_EXISTING = [
  { id: "-1001234567890", name: "קבוצת פרסום ראשית", members: 1240, active: true,  photo: "https://picsum.photos/seed/g1/80/80" },
  { id: "-1009876543210", name: "VIP לקוחות",        members: 320,  active: true,  photo: "https://picsum.photos/seed/g2/80/80" },
  { id: "-1005555555555", name: "מבצעים והנחות",     members: 870,  active: false, photo: "https://picsum.photos/seed/g3/80/80" },
  { id: "-1001111111111", name: "עדכונים שוטפים",    members: 560,  active: true,  photo: "https://picsum.photos/seed/g4/80/80" },
];

const MOCK_SEARCH_RESULTS = [
  { id: "-1002222222222", name: "קבוצת שיווק דיגיטלי", members: 430,  photo: "https://picsum.photos/seed/g5/80/80" },
  { id: "-1003333333333", name: "לקוחות פרימיום B",    members: 180,  photo: "https://picsum.photos/seed/g6/80/80" },
  { id: "-1004444444444", name: "ניוזלטר שבועי",       members: 2100, photo: "https://picsum.photos/seed/g7/80/80" },
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

function ConfirmModal({ groupName, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6" onClick={onCancel}>
      <div className="w-full max-w-[340px] bg-[#1a1a2e] border border-white/10 rounded-2xl p-5"
        onClick={e => e.stopPropagation()}>
        <div className="text-center mb-4">
          <div className="text-3xl mb-2">🗑️</div>
          <div className="text-base font-bold text-white mb-1">הסרת קבוצה</div>
          <div className="text-sm text-gray-400">
            האם להסיר את <span className="text-white font-semibold">"{groupName}"</span> מהרשימה?
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel}
            className="flex-1 bg-white/[0.06] border border-white/10 text-gray-300 text-sm font-semibold rounded-xl py-2.5 cursor-pointer hover:bg-white/10 transition-all">
            ביטול
          </button>
          <button onClick={onConfirm}
            className="flex-1 bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-semibold rounded-xl py-2.5 cursor-pointer hover:bg-red-500/30 transition-all">
            הסר
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ManageGroups() {
  const [groups,       setGroups]       = useState(MOCK_EXISTING);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching,  setIsSearching]  = useState(false);
  const [addedIds,     setAddedIds]     = useState(new Set());
  const [confirmGroup, setConfirmGroup] = useState(null);
  const [filterQuery,  setFilterQuery]  = useState("");

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setSearchResults(MOCK_SEARCH_RESULTS.filter(
        r => !groups.find(g => g.id === r.id)
      ));
      setIsSearching(false);
    }, 800);
  };

  const handleAdd = (group) => {
    setGroups(prev => [...prev, { ...group, active: true }]);
    setAddedIds(prev => new Set([...prev, group.id]));
  };

  const handleRemoveConfirmed = () => {
    setGroups(prev => prev.filter(g => g.id !== confirmGroup.id));
    setConfirmGroup(null);
  };

  const filtered = groups.filter(g =>
    g.name.includes(filterQuery) || g.id.includes(filterQuery)
  );

  return (
    <div className="relative flex flex-col w-full bg-[#0f0f1a] font-sans" dir="rtl">

      <div className="fixed top-[-100px] left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.25)_0%,transparent_70%)] pointer-events-none z-0" />

      {/* Header */}
      <div className="relative z-10 px-5 pt-5 pb-4 text-center">
        <div className="inline-flex items-center gap-1.5 bg-indigo-500/15 border border-indigo-500/30 rounded-full px-3 py-1 text-[11px] text-indigo-300 mb-3 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          ניהול קבוצות
        </div>
        <h1 className="text-[22px] font-extrabold leading-tight bg-gradient-to-br from-white to-indigo-300 bg-clip-text text-transparent">
          קבוצות פרסום
        </h1>
      </div>

      <div className="relative z-10 px-5 pb-6">

        {/* ── הוספת קבוצה חדשה ── */}
        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-2">
          הוספת קבוצה חדשה
        </div>

        <SectionCard icon="🔍" title="חיפוש קבוצה">
          <div className="flex gap-2 mb-3">
            <button onClick={handleSearch}
              className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[13px] font-semibold rounded-xl px-4 py-2.5 cursor-pointer hover:bg-indigo-500/30 transition-all shrink-0">
              חפש
            </button>
            <input
              type="text"
              placeholder="שם קבוצה או @username..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>

          {isSearching && (
            <div className="flex items-center justify-center py-4 gap-2">
              <div className="w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              <span className="text-[12px] text-gray-500">מחפש...</span>
            </div>
          )}

          {!isSearching && searchResults.length > 0 && (
            <div className="flex flex-col gap-2">
              {searchResults.map(group => {
                const added = addedIds.has(group.id);
                return (
                  <div key={group.id}
                    className="flex items-center justify-between bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-indigo-500/20">
                        {group.photo
                          ? <img src={group.photo} alt={group.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-indigo-300 font-bold text-sm">{group.name[0]}</div>
                        }
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-200 font-medium">{group.name}</div>
                        <div className="text-[11px] text-gray-600 mt-0.5 font-mono">{group.id}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-gray-500">{group.members.toLocaleString()} חברים</span>
                      <button
                        onClick={() => !added && handleAdd(group)}
                        className={`text-[12px] font-semibold rounded-xl px-3 py-1.5 border transition-all cursor-pointer ${
                          added
                            ? "bg-green-500/10 border-green-500/20 text-green-400 cursor-default"
                            : "bg-indigo-500/20 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/30"
                        }`}>
                        {added ? "✓ נוסף" : "+ הוסף"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!isSearching && searchResults.length === 0 && searchQuery && (
            <div className="text-center py-3 text-[12px] text-gray-600">
              לא נמצאו תוצאות — נסה שם אחר
            </div>
          )}
        </SectionCard>

        {/* ── קבוצות קיימות ── */}
        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-2 mt-1">
          קבוצות קיימות ({groups.length})
        </div>

        {/* Filter */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="סינון לפי שם או ID..."
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
          {filterQuery && (
            <button onClick={() => setFilterQuery("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 bg-transparent border-none cursor-pointer text-sm">
              ✕
            </button>
          )}
        </div>

        {/* Groups list */}
        <div className="flex flex-col gap-2">
          {filtered.length === 0 && (
            <div className="text-center py-6 text-[13px] text-gray-600">
              לא נמצאו קבוצות
            </div>
          )}

          {filtered.map(group => (
            <div key={group.id}
              className="flex items-center justify-between bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3 transition-all hover:bg-white/[0.06]">

              {/* Photo */}
              <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 bg-indigo-500/20 ml-3">
                {group.photo
                  ? <img src={group.photo} alt={group.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-indigo-300 font-bold">{group.name[0]}</div>
                }
                <span className={`absolute bottom-0 left-0 w-3 h-3 rounded-full border-2 border-[#0f0f1a] ${group.active ? "bg-green-400" : "bg-gray-600"}`} />
              </div>

              {/* Info */}
              <div className="text-right flex-1 min-w-0">
                <div className="text-sm text-gray-200 font-semibold truncate mb-0.5">{group.name}</div>
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-[11px] text-gray-600 font-mono truncate">{group.id}</span>
                  <span className="text-[10px] text-gray-500 shrink-0">{group.members.toLocaleString()} חברים</span>
                </div>
              </div>

              {/* Remove */}
              <button
                onClick={() => setConfirmGroup(group)}
                className="mr-3 w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] cursor-pointer hover:bg-red-500/20 transition-all shrink-0 flex items-center justify-center">
                🗑
              </button>
            </div>
          ))}
        </div>

      </div>

      {/* Confirm modal */}
      {confirmGroup && (
        <ConfirmModal
          groupName={confirmGroup.name}
          onConfirm={handleRemoveConfirmed}
          onCancel={() => setConfirmGroup(null)}
        />
      )}

    </div>
  );
}