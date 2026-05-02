import { useState ,useEffect} from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from 'axios';


function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 border-none cursor-pointer shrink-0 ${checked ? "bg-indigo-500" : "bg-white/10"}`}
      >
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



function GroupSettingsModal({ group, settings, onSave, onClose ,setForm }) {
  const [local, setLocal] = useState(settings);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm mb-15" onClick={onClose}>
      <div className="w-full max-w-[430px] bg-[#1a1a2e] border border-white/10 rounded-t-3xl p-5 pb-8 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>

        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
        <div className="text-base font-bold text-white mb-4 text-right">⚙️ הגדרות — {group.groupname}</div>

        <div className="flex flex-col gap-3">

          <FieldRow label="תאריך התחלה">
            <input type="date" value={local.datestart}
              onChange={e => setLocal({ ...local, datestart: e.target.value })}
              className="bg-white/[0.06] border border-white/10 rounded-xl px-2 py-2 text-white text-sm font-mono text-center focus:outline-none focus:border-indigo-500/50" />
          </FieldRow>

          <FieldRow label="שעת התחלה">
            <input type="time" value={local.firsttimestart}
              onChange={e => setLocal({ ...local, firsttimestart: e.target.value })}
              className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-white text-sm font-mono w-28 text-center focus:outline-none focus:border-indigo-500/50" />
          </FieldRow>

          <FieldRow label="תדירות (דקות)">
            <input type="number" min="1" value={local.repetition}
              onChange={e => setLocal({ ...local, repetition: e.target.value })}
              className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-white text-sm w-20 text-center focus:outline-none focus:border-indigo-500/50" />
          </FieldRow>

          <FieldRow label="תאריך סיום" required={false}>
            <input type="date" value={local.dateend}
              onChange={e => setLocal({ ...local, dateend: e.target.value })}
              className="bg-white/[0.06] border border-white/10 rounded-xl px-2 py-2 text-white text-sm font-mono text-center focus:outline-none focus:border-indigo-500/50" />
            {local.dateend && (
              <button onClick={() => setLocal({ ...local, dateend: "" })}
                className="text-gray-600 text-[11px] hover:text-red-400 cursor-pointer bg-transparent border-none">✕</button>
            )}
          </FieldRow>

          <FieldRow label="שעת סיום" required={false}>
            <input type="time" value={local.endtime}
              onChange={e => setLocal({ ...local, endtime: e.target.value })}
              className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-white text-sm font-mono w-28 text-center focus:outline-none focus:border-indigo-500/50" />
            {local.endtime && (
              <button onClick={() => setLocal({ ...local, endtime: "" })}
                className="text-gray-600 text-[11px] hover:text-red-400 cursor-pointer bg-transparent border-none">✕</button>
            )}
          </FieldRow>

          <div className="pt-2 border-t border-white/[0.06] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Toggle checked={local.pin_message} onChange={v => setLocal({ ...local, pin_message: v })} />
              <span className="text-sm text-gray-400">הצמד הודעה</span>
            </div>
            <div className="flex items-center justify-between">
              <Toggle checked={local.deletelaste} onChange={v => setLocal({ ...local, deletelaste: v })} />
              <span className="text-sm text-gray-400">מחק הודעה קודמת</span>
            </div>
            <div className="flex items-center justify-between">
              <Toggle checked={local.isactive} onChange={v => setLocal({ ...local, isactive: v })} />
              <span className="text-sm text-gray-400">פעיל בקבוצה זו</span>
            </div>
          </div>

        </div>

        <button onClick={() => { 
          onSave(local); onClose(); 
  //         setForm(prev => ({ 
  //   ...prev, 
  //   // אנחנו יוצרים אובייקט חדש עבור groupsSettings
  //   groupsSettings: {
  //     ...prev.groupsSettings, // שומרים את כל הקבוצות הקודמות שהיו שם
  //     [group.telegramgroupid]: local // מוסיפים/מעדכנים רק את הקבוצה הנוכחית
  //   }
  // }));
        }}
          className="mt-5 w-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-[15px] rounded-2xl py-3.5 border-none cursor-pointer transition-all hover:-translate-y-0.5 active:scale-[0.98]">
          שמור הגדרות
        </button>
      </div>
    </div>
  );  
}


export default function GroupsSection({ form, setForm }) {
  const [groupsOpen, setGroupsOpen] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [groupSettings, setGroupSettings] = useState({});
  const [editingGroup, setEditingGroup] = useState(null);

  // שליפת הקבוצות מהשרת
  const {
    data: AllExistGroupsData,
    isFetching: AllExistGroupsisFetching,
    refetch: fetchGroups
  } = useQuery({
    queryKey: ["get_AllExistGroupsData"],
    queryFn: async () => {
      const response = await axios.get(`/GroupList/AllExistGroupsList`);
      return response.data;
    },
    select: (data) => data?.data || data,
    staleTime: 1000 * 60,
    enabled: false, 
  });

  // --- הסרתי את existingGroups כי הוא יוצר כפילות ובאגים ---

  const toggleGroup = id =>
    setSelectedGroups(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);

  const getGroupSettings = id => groupSettings[id] || {
    datestart: form.datestart,
    firsttimestart: form.firsttimestart,
    dateend: form.dateend,
    endtime: form.endtime,
    repetition: form.repetition,
    pin_message: form.pin_message, 
    deletelaste: form.deletelaste,
    isactive: true,
  };

  useEffect(() => {
    setForm(prev => ({ ...prev, groupids: selectedGroups }));
  }, [selectedGroups]);

  useEffect(() => {
    setForm(prev => ({ ...prev, groupsSettings: groupSettings }));
  }, [groupSettings]);

  return (
    <>
      <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-2 mt-1">
        קבוצות פרסום
      </div>

      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden mb-3">
        <button 
          onClick={() => {
            if (!AllExistGroupsData) fetchGroups(); // טוען רק אם אין נתונים
            setGroupsOpen(!groupsOpen);
          }} 
          disabled={AllExistGroupsisFetching}
          className="w-full flex items-center justify-between px-4 py-3 border-none bg-transparent cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className={`text-xs text-indigo-300 transition-transform duration-200 ${groupsOpen ? "rotate-90" : ""}`}>▶</span>
            <span className="text-sm font-semibold text-gray-200">
              {AllExistGroupsisFetching ? "טוען קבוצות..." : 
               selectedGroups.length > 0 ? `${selectedGroups.length} קבוצות נבחרו` : "בחר קבוצות"}
            </span>
          </div>
          <span className="text-lg">👥</span>
        </button>

        {groupsOpen && AllExistGroupsData && ( // FIX: מרנדר ישירות מה-Data של השאילתה
          <div className="border-t border-white/[0.06]">
            {AllExistGroupsData.map(group => { // FIX: שימוש בנתונים מהשרת
              const selected = selectedGroups.includes(group.telegramgroupid);
              const custom = !!groupSettings[group.telegramgroupid];
              return (
                <div key={group.telegramgroupid}
                  className={`flex items-center justify-between px-4 py-3 border-b border-white/[0.04] last:border-none transition-colors ${selected ? "bg-indigo-500/[0.07]" : ""}`}>
                  <div className="flex items-center gap-3 flex-1" onClick={() => toggleGroup(group.telegramgroupid)}>
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all shrink-0 ${selected ? "bg-indigo-500 border-indigo-500" : "border-white/20 bg-transparent"}`}>
                      {selected && <span className="text-white text-[11px] font-bold">✓</span>}
                    </div>
                    <div className="text-right cursor-pointer">
                      <div className="text-sm text-gray-200 font-medium">{group.groupname}</div>
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
        {groupsOpen && !AllExistGroupsData && !AllExistGroupsisFetching && (
          <div className="px-4 py-3 text-sm text-gray-500">
            לא נמצאו קבוצות זמינות. אנא הוסף קבוצות דרך הטלגרם.
          </div>
        )}
      </div>

      {editingGroup && (
        <GroupSettingsModal
          group={editingGroup}
          settings={getGroupSettings(editingGroup.telegramgroupid)}
          onSave={s => setGroupSettings({ ...groupSettings, [editingGroup.telegramgroupid]: s })}
          onClose={() => setEditingGroup(null)}
          setForm={setForm}
        />
      )}
    </>
  );
}