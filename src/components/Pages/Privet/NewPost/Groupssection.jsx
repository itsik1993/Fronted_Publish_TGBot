import { useState } from "react";

const MOCK_GROUPS = [
  { id: "1", name: "קבוצת פרסום ראשית" },
  { id: "2", name: "VIP לקוחות" },
  { id: "3", name: "מבצעים והנחות" },
  { id: "4", name: "עדכונים שוטפים" },
  { id: "5", name: "קהל יעד B" },
];

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

function GroupSettingsModal({ group, settings, onSave, onClose }) {
  const [local, setLocal] = useState(settings);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-[430px] bg-[#1a1a2e] border border-white/10 rounded-t-3xl p-5 pb-8 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>

        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
        <div className="text-base font-bold text-white mb-4 text-right">⚙️ הגדרות — {group.name}</div>

        <div className="flex flex-col gap-3">

          <FieldRow label="תאריך התחלה">
            <input type="date" value={local.startDate}
              onChange={e => setLocal({ ...local, startDate: e.target.value })}
              className="bg-white/[0.06] border border-white/10 rounded-xl px-2 py-2 text-white text-sm font-mono text-center focus:outline-none focus:border-indigo-500/50" />
          </FieldRow>

          <FieldRow label="שעת התחלה">
            <input type="time" value={local.startTime}
              onChange={e => setLocal({ ...local, startTime: e.target.value })}
              className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-white text-sm font-mono w-28 text-center focus:outline-none focus:border-indigo-500/50" />
          </FieldRow>

          <FieldRow label="תדירות (דקות)">
            <input type="number" min="1" value={local.repetition}
              onChange={e => setLocal({ ...local, repetition: e.target.value })}
              className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-white text-sm w-20 text-center focus:outline-none focus:border-indigo-500/50" />
          </FieldRow>

          <FieldRow label="תאריך סיום" required={false}>
            <input type="date" value={local.endDate}
              onChange={e => setLocal({ ...local, endDate: e.target.value })}
              className="bg-white/[0.06] border border-white/10 rounded-xl px-2 py-2 text-white text-sm font-mono text-center focus:outline-none focus:border-indigo-500/50" />
            {local.endDate && (
              <button onClick={() => setLocal({ ...local, endDate: "" })}
                className="text-gray-600 text-[11px] hover:text-red-400 cursor-pointer bg-transparent border-none">✕</button>
            )}
          </FieldRow>

          <FieldRow label="שעת סיום" required={false}>
            <input type="time" value={local.endTime}
              onChange={e => setLocal({ ...local, endTime: e.target.value })}
              className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-white text-sm font-mono w-28 text-center focus:outline-none focus:border-indigo-500/50" />
            {local.endTime && (
              <button onClick={() => setLocal({ ...local, endTime: "" })}
                className="text-gray-600 text-[11px] hover:text-red-400 cursor-pointer bg-transparent border-none">✕</button>
            )}
          </FieldRow>

          <div className="pt-2 border-t border-white/[0.06] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Toggle checked={local.pinMessage} onChange={v => setLocal({ ...local, pinMessage: v })} />
              <span className="text-sm text-gray-400">הצמד הודעה</span>
            </div>
            <div className="flex items-center justify-between">
              <Toggle checked={local.deleteLast} onChange={v => setLocal({ ...local, deleteLast: v })} />
              <span className="text-sm text-gray-400">מחק הודעה קודמת</span>
            </div>
            <div className="flex items-center justify-between">
              <Toggle checked={local.isActive} onChange={v => setLocal({ ...local, isActive: v })} />
              <span className="text-sm text-gray-400">פעיל בקבוצה זו</span>
            </div>
          </div>

        </div>

        <button onClick={() => { onSave(local); onClose(); }}
          className="mt-5 w-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-[15px] rounded-2xl py-3.5 border-none cursor-pointer transition-all hover:-translate-y-0.5 active:scale-[0.98]">
          שמור הגדרות
        </button>
      </div>
    </div>
  );
}

export default function GroupsSection({ form }) {
  const [groupsOpen,     setGroupsOpen]     = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [groupSettings,  setGroupSettings]  = useState({});
  const [editingGroup,   setEditingGroup]   = useState(null);

  const toggleGroup = id =>
    setSelectedGroups(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);

  const getGroupSettings = id => groupSettings[id] || {
    startDate: form.startDate, startTime: form.startTime,
    endDate: "", endTime: "",
    repetition: form.repetition,
    pinMessage: form.pinMessage, deleteLast: form.deleteLast, isActive: true,
  };

  return (
    <>
      <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-2 mt-1">
        קבוצות פרסום
      </div>

      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden mb-3">
        <button onClick={() => setGroupsOpen(!groupsOpen)}
          className="w-full flex items-center justify-between px-4 py-3 border-none bg-transparent cursor-pointer">
          <div className="flex items-center gap-2">
            <span className={`text-xs text-indigo-300 transition-transform duration-200 ${groupsOpen ? "rotate-90" : ""}`}>▶</span>
            <span className="text-sm font-semibold text-gray-200">
              {selectedGroups.length > 0 ? `${selectedGroups.length} קבוצות נבחרו` : "בחר קבוצות"}
            </span>
          </div>
          <span className="text-lg">👥</span>
        </button>

        {groupsOpen && (
          <div className="border-t border-white/[0.06]">
            {MOCK_GROUPS.map(group => {
              const selected = selectedGroups.includes(group.id);
              const custom   = !!groupSettings[group.id];
              return (
                <div key={group.id}
                  className={`flex items-center justify-between px-4 py-3 border-b border-white/[0.04] last:border-none transition-colors ${selected ? "bg-indigo-500/[0.07]" : ""}`}>
                  <div className="flex items-center gap-3 flex-1" onClick={() => toggleGroup(group.id)}>
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all shrink-0 ${selected ? "bg-indigo-500 border-indigo-500" : "border-white/20 bg-transparent"}`}>
                      {selected && <span className="text-white text-[11px] font-bold">✓</span>}
                    </div>
                    <div className="text-right cursor-pointer">
                      <div className="text-sm text-gray-200 font-medium">{group.name}</div>
                      {custom && <div className="text-[10px] text-amber-400 mt-0.5">⚙ הגדרות מותאמות</div>}
                    </div>
                  </div>
                  {selected && (
                    <button onClick={() => setEditingGroup(group)}
                      className="mr-2 flex items-center gap-1 bg-white/[0.06] border border-white/10 text-gray-400 text-[11px] font-semibold rounded-lg px-2.5 py-1.5 cursor-pointer hover:bg-white/10 hover:text-indigo-300 transition-all shrink-0">
                      <span>⚙️</span> עדכן
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {editingGroup && (
        <GroupSettingsModal
          group={editingGroup}
          settings={getGroupSettings(editingGroup.id)}
          onSave={s => setGroupSettings({ ...groupSettings, [editingGroup.id]: s })}
          onClose={() => setEditingGroup(null)}
        />
      )}
    </>
  );
}