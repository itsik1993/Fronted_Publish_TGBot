import { useState } from "react";

const ROLES = [
  { id: "admin",   label: "Admin",   color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { id: "manager", label: "Manager", color: "text-indigo-300", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
];

const MOCK_ADMINS = [
  { id: "123456789", username: "@david_cohen",  name: "דוד כהן",    nickname: "דוד המנהל", role: "admin",   photo: "https://picsum.photos/seed/u1/80/80" },
  { id: "987654321", username: "@sara_levi",    name: "שרה לוי",    nickname: "שרה עורכת", role: "admin",  photo: "https://picsum.photos/seed/u2/80/80" },
  { id: "111222333", username: "@moshe_israel", name: "משה ישראל",  nickname: "",           role: "manager",  photo: "https://picsum.photos/seed/u3/80/80" },
  { id: "444555666", username: "@yael_k",       name: "יעל קורן",   nickname: "תמיכה",     role: "manager", photo: "https://picsum.photos/seed/u4/80/80" },
];

const MOCK_SEARCH = [
  { id: "777888999", username: "@nir_bar",     name: "ניר בר",      photo: "https://picsum.photos/seed/u5/80/80" },
  { id: "222333444", username: "@hila_mizr",   name: "הילה מזרחי",  photo: "https://picsum.photos/seed/u6/80/80" },
];

function RoleBadge({ roleId }) {
  const role = ROLES.find(r => r.id === roleId);
  if (!role) return null;
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${role.color} ${role.bg} ${role.border}`}>
      {role.label}
    </span>
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

function ConfirmModal({ adminName, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6" onClick={onCancel}>
      <div className="w-full max-w-[340px] bg-[#1a1a2e] border border-white/10 rounded-2xl p-5"
        onClick={e => e.stopPropagation()}>
        <div className="text-center mb-4">
          <div className="text-3xl mb-2">🗑️</div>
          <div className="text-base font-bold text-white mb-1">הסרת מנהל</div>
          <div className="text-sm text-gray-400">
            האם להסיר את <span className="text-white font-semibold">"{adminName}"</span>?
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

function AddAdminModal({ admin, onSave, onClose }) {
  const [form, setForm] = useState({
    nickname: "",
    role: "editor",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-[430px] bg-[#1a1a2e] border border-white/10 rounded-t-3xl p-5 pb-8"
        onClick={e => e.stopPropagation()}>

        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />

        {/* User preview */}
        <div className="flex items-center gap-3 mb-5 bg-white/[0.04] border border-white/[0.06] rounded-2xl px-4 py-3">
          <div className="w-11 h-11 rounded-full overflow-hidden shrink-0">
            <img src={admin.photo} alt={admin.name} className="w-full h-full object-cover" />
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-white">{admin.name}</div>
            <div className="text-[12px] text-indigo-300 font-mono">{admin.username}</div>
            <div className="text-[11px] text-gray-600 mt-0.5">ID: {admin.id}</div>
          </div>
        </div>

        {/* Nickname */}
        <div className="mb-4">
          <div className="text-[11px] text-gray-500 mb-1.5 text-right">כינוי / תיאור <span className="text-gray-600">(אופציונלי)</span></div>
          <input
            type="text"
            placeholder="לדוגמה: מנהל ערוץ ראשי"
            value={form.nickname}
            onChange={e => setForm({ ...form, nickname: e.target.value })}
            className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>

        {/* Role */}
        <div className="mb-5">
          <div className="text-[11px] text-gray-500 mb-2 text-right">תפקיד</div>
          <div className="flex gap-2">
            {ROLES.map(role => (
              <button key={role.id} onClick={() => setForm({ ...form, role: role.id })}
                className={`flex items-center justify-center py-2.5 rounded-xl border text-[13px] font-semibold cursor-pointer transition-all ${
                  form.role === role.id
                    ? `${role.bg} ${role.border} ${role.color}`
                    : "bg-white/[0.03] border-white/10 text-gray-500 hover:bg-white/[0.06]"
                }`}>
                {role.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => onSave({ ...admin, nickname: form.nickname, role: form.role })}
          className="w-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-[15px] rounded-2xl py-3.5 border-none cursor-pointer transition-all hover:-translate-y-0.5 active:scale-[0.98]">
          הוסף מנהל
        </button>
      </div>
    </div>
  );
}

export default function ManagersPage() {
  const [admins,       setAdmins]       = useState(MOCK_ADMINS);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching,  setIsSearching]  = useState(false);
  const [filterQuery,  setFilterQuery]  = useState("");
  const [addingAdmin,  setAddingAdmin]  = useState(null);
  const [confirmAdmin, setConfirmAdmin] = useState(null);
  const [addedIds,     setAddedIds]     = useState(new Set());

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setSearchResults(MOCK_SEARCH.filter(u => !admins.find(a => a.id === u.id)));
      setIsSearching(false);
    }, 800);
  };

  const handleSaveAdmin = (admin) => {
    setAdmins(prev => [...prev, { ...admin, photo: admin.photo || "" }]);
    setAddedIds(prev => new Set([...prev, admin.id]));
    setAddingAdmin(null);
  };

  const handleRemoveConfirmed = () => {
    setAdmins(prev => prev.filter(a => a.id !== confirmAdmin.id));
    setConfirmAdmin(null);
  };

  const filtered = admins.filter(a =>
    a.name.includes(filterQuery) ||
    a.username.includes(filterQuery) ||
    a.id.includes(filterQuery)
  );

  return (
    <div className="relative flex flex-col w-full bg-[#0f0f1a] font-sans" dir="rtl">

      <div className="fixed top-[-100px] left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.25)_0%,transparent_70%)] pointer-events-none z-0" />

      {/* Header */}
      <div className="relative z-10 px-5 pt-5 pb-4 text-center">
        <div className="inline-flex items-center gap-1.5 bg-indigo-500/15 border border-indigo-500/30 rounded-full px-3 py-1 text-[11px] text-indigo-300 mb-3 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          ניהול צוות
        </div>
        <h1 className="text-[22px] font-extrabold leading-tight bg-gradient-to-br from-white to-indigo-300 bg-clip-text text-transparent">
          מנהלים
        </h1>
      </div>

      <div className="relative z-10 px-5 pb-6">

        {/* ── הוספת מנהל ── */}
        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-2">
          הוספת מנהל חדש
        </div>

        <SectionCard icon="🔍" title="חיפוש משתמש">
          <div className="flex gap-2 mb-3">
            <button onClick={handleSearch}
              className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[13px] font-semibold rounded-xl px-4 py-2.5 cursor-pointer hover:bg-indigo-500/30 transition-all shrink-0">
              חפש
            </button>
            <input
              type="text"
              placeholder="@username או ID..."
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
              {searchResults.map(user => {
                const added = addedIds.has(user.id);
                return (
                  <div key={user.id}
                    className="flex items-center justify-between bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-indigo-500/20">
                        {user.photo
                          ? <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-indigo-300 font-bold text-sm">{user.name[0]}</div>
                        }
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-200 font-medium">{user.name}</div>
                        <div className="text-[11px] text-indigo-300 font-mono">{user.username}</div>
                        <div className="text-[10px] text-gray-600 font-mono">ID: {user.id}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => !added && setAddingAdmin(user)}
                      className={`text-[12px] font-semibold rounded-xl px-3 py-1.5 border transition-all cursor-pointer shrink-0 ${
                        added
                          ? "bg-green-500/10 border-green-500/20 text-green-400 cursor-default"
                          : "bg-indigo-500/20 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/30"
                      }`}>
                      {added ? "✓ נוסף" : "+ הוסף"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {!isSearching && searchResults.length === 0 && searchQuery && (
            <div className="text-center py-3 text-[12px] text-gray-600">
              לא נמצאו משתמשים — נסה username אחר
            </div>
          )}
        </SectionCard>

        {/* ── מנהלים קיימים ── */}
        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-2 mt-1">
          מנהלים קיימים ({admins.length})
        </div>

        <div className="relative mb-3">
          <input
            type="text"
            placeholder="סינון לפי שם, username או ID..."
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
          {filterQuery && (
            <button onClick={() => setFilterQuery("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 bg-transparent border-none cursor-pointer text-sm">✕</button>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {filtered.length === 0 && (
            <div className="text-center py-6 text-[13px] text-gray-600">לא נמצאו מנהלים</div>
          )}

          {filtered.map(admin => (
            <div key={admin.id}
              className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3 hover:bg-white/[0.06] transition-all">

              {/* Photo */}
              <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 bg-indigo-500/20">
                {admin.photo
                  ? <img src={admin.photo} alt={admin.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-indigo-300 font-bold">{admin.name[0]}</div>
                }
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 text-right">
                <div className="flex items-center gap-2 justify-end mb-0.5">
                  <span className="text-sm text-gray-200 font-semibold truncate">{admin.name}</span>
                  <RoleBadge roleId={admin.role} />
                </div>
                <div className="text-[12px] text-indigo-300 font-mono">{admin.username}</div>
                {admin.nickname && (
                  <div className="text-[11px] text-gray-500 mt-0.5">"{admin.nickname}"</div>
                )}
                <div className="text-[10px] text-gray-600 font-mono mt-0.5">ID: {admin.id}</div>
              </div>

              {/* Remove */}
              <button onClick={() => setConfirmAdmin(admin)}
                className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] cursor-pointer hover:bg-red-500/20 transition-all shrink-0 flex items-center justify-center">
                🗑
              </button>
            </div>
          ))}
        </div>

      </div>

      {/* Add Admin Modal */}
      {addingAdmin && (
        <AddAdminModal
          admin={addingAdmin}
          onSave={handleSaveAdmin}
          onClose={() => setAddingAdmin(null)}
        />
      )}

      {/* Confirm Remove Modal */}
      {confirmAdmin && (
        <ConfirmModal
          adminName={confirmAdmin.name}
          onConfirm={handleRemoveConfirmed}
          onCancel={() => setConfirmAdmin(null)}
        />
      )}

    </div>
  );
}