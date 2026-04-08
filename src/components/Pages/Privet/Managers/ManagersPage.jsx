import React, { useState, useEffect, useContext } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from 'axios';

const ROLES = [
  { id: "Admin", label: "Admin", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { id: "Manager", label: "Manager", color: "text-indigo-300", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
];



// מתאים את התג לפי התפקיד
function RoleBadge({ roleId }) {
  const role = ROLES.find(r => r.id === roleId);
  if (!role) return null;
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${role.color} ${role.bg} ${role.border}`}>
      {role.label}
    </span>
  );
}

// המטרה של הפונקציה היא להציג תגית צבעונית ליד שם המנהל שמציינת את התפקיד שלו (Admin או Manager) עם עיצוב שונה לכל תפקיד. היא מקבלת את מזהה התפקיד (roleId) ומחפשת אותו במערך ROLES כדי למצוא את הפרטים המתאימים לעיצוב. אם נמצא תפקיד מתאים, היא מחזירה אלמנט <span> עם הטקסט של התפקיד והעיצוב המתאים לו. אם לא נמצא תפקיד מתאים, היא מחזירה null ולא מציגה כלום.
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


// מודלים

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
            <img src={admin.photo} alt={admin.NameOfUser} className="w-full h-full object-cover" />
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-white">{admin.NameOfUser}</div>
            <div className="text-[12px] text-indigo-300 font-mono">{admin.TelegramUserName}</div>
            <div className="text-[11px] text-gray-600 mt-0.5">ID: {admin.TelegramUserId}</div>
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
                className={`flex items-center justify-center py-2.5 rounded-xl border text-[13px] font-semibold cursor-pointer transition-all ${form.role === role.id
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

function EditNicknameModal({ admin, onSave, onClose }) {
  const [nickname, setNickname] = useState(admin.ManagerNick_Name || "");

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-[430px] bg-[#1a1a2e] border border-white/10 rounded-t-3xl p-5 pb-8"
        onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 bg-indigo-500/20">
            {admin.photo
              ? <img src={admin.photo} alt={admin.ManagerName} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-indigo-300 font-bold">{admin.ManagerName[0]}</div>
            }
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-white">{admin.ManagerName}</div>
            <div className="text-[12px] text-indigo-300 font-mono">{admin.ManagersUserName}</div>
          </div>
        </div>

        <div className="mb-5">
          <div className="text-[11px] text-gray-500 mb-1.5 text-right">כינוי / תיאור <span className="text-gray-600">(אופציונלי)</span></div>
          <input
            type="text"
            placeholder="לדוגמה: מנהל ערוץ ראשי"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            autoFocus
            className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>

        <button onClick={() => { onSave(nickname); onClose(); }}
          className="w-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-[15px] rounded-2xl py-3.5 border-none cursor-pointer transition-all hover:-translate-y-0.5 active:scale-[0.98]">
          שמור
        </button>
      </div>
    </div>
  );
}



// שירות ראשי
export default function ManagersPage() {
  const queryClient = useQueryClient();
  const allUsersAndGroups = [];
  const [admins, setAdmins] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const [addingAdmin, setAddingAdmin] = useState(null);
  const [confirmAdmin, setConfirmAdmin] = useState(null);
  const [addedIds, setAddedIds] = useState(new Set());
  const [editingAdmin, setEditingAdmin] = useState(null);


  // שליפת מנהלים קיימים מהשרת
  const {
    data: AllManagersData,
    isLoading: AllManagersisLoading,
    error: AllManagersError,
    isError: isAllManagersError
  } = useQuery({
    queryKey: ["get_AllManagersData"],
    queryFn: async () => {
      const response = await axios.get(`/Managers/GetAllManagers`);
      return response.data;
    },
    select: (data) => data?.data || data, // טיפול גמיש בנתונים
    staleTime: 1000 * 60,
  });



  // שליפה לפי צורך חיפוש
  const {
    mutate: fetchAllUsers, // הפונקציה שתפעיל את השאילתה
    data: GetAllUsersData,
    isPending: GetAllUsersisLoading, // בגרסאות חדשות זה isPending במקום isLoading
    error: GetAllUsersError,
    isError: isGetAllUsersError
  } = useMutation({
    mutationFn: async () => {
      // כאן אנחנו שולחים את ה-Body שמתקבל מהקריאה לפונקציה
      const response = await axios.post(`/Managers/SerchAddNewUsersToManager`, { username: searchQuery });
      return response.data;
    },
    // אפשר לעבד את הנתונים כאן או ב-onSuccess
    onSuccess: (data) => {
      // console.log("Data received:", data);
      setSearchResults(data); // עדכון תוצאות החיפוש עם הנתונים מהשרת

      setIsSearching(false); // עדכון מצב החיפוש
    }
  });


    // עדכון מנהל בDB 
  const {
    mutate: UpdateNewManger, // הפונקציה שתפעיל את השאילתה
    data: SetNewManagerData,
    isPending: SetNewManagerisLoading, // בגרסאות חדשות זה isPending במקום isLoading
    error: SetNewManagerError,
    isError: isSetNewManagerError
  } = useMutation({
    mutationFn: async (newAdmin) => {
      console.log("Sending new manager data to server8888:", newAdmin);
      // כאן אנחנו שולחים את ה-Body שמתקבל מהקריאה לפונקציה
      const response = await axios.post(`/Managers/AddAdmins`, { manager: newAdmin });
      return response.data;
    },
    // אפשר לעבד את הנתונים כאן או ב-onSuccess
    onSuccess: (data) => {
      console.log("Data received:", data);
      setSearchResults([]); // עדכון תוצאות החיפוש עם הנתונים מהשרת
      setAddingAdmin(null);
queryClient.invalidateQueries({ queryKey: ["get_AllManagersData"] });

      setIsSearching(false); // עדכון מצב החיפוש
    }
  });


  // --- איך מפעילים את זה? ---
  // const handleButtonClick = () => {
  //   // const myBody = { department: "IT", region: "North" };
  //   fetchManagers(reqBody); // כאן קורה הקסם
  // };


  // אחרי השליפה הוא מעדכן את הרשימת מנהלים 
  useEffect(() => {
    if (AllManagersData) {
      console.log("Fetched users data:", AllManagersData);
      setAdmins(AllManagersData); // עדכון המנהלים עם הנתונים מהשרת
    }
  }, [AllManagersData]);

  // const [filteredResults, setFilteredResults] = useState([]);
  // useEffect(() => {

  //   if (isSearching.length>0   ) { 

  //     const filtered = isSearching.filter(item => 
  //        item.telegramuserid[0] === -1
  //     );
  //     setFilteredResults(...filtered);
  // allUsersAndGroups.push(...AllUsersAndGroupsData); // עדכון המנהלים עם הנתונים מהשרת
  //   }
  // }, [isSearching]);
  // useEffect(() => {console.log("filteredResults", filteredResults); }, [filteredResults]);

  // מאפס את החיפוש ברגע שמחקתי את הנתונים
  useEffect(() => {
    // console.log("Search query changed:", searchQuery);
  }, [searchQuery]);
  useEffect(() => {
    if (!isSearching && searchQuery.length === 0) {
      setSearchResults([]);
    }
  }, [isSearching, searchQuery]);


  // מטפל בחיפוש ומפעיל את הפונקציה
  const handleSearch = async () => {
    console.log("Initiating search with query:", searchQuery);
    if (!searchQuery.trim()) return;

    const searchResults = fetchAllUsers(searchQuery);
    GetAllUsersisLoading ? setIsSearching(true) : setIsSearching(false);
    setSearchResults(searchResults || []); // עדכון תוצאות החיפוש
    // setIsSearching(false);

  };


  // שמירת מנהל
const handleSaveAdmin = (admin) => {
  const newAdmin = {
    ...admin,
    // התאמת שמות השדות שהרשימה מצפה להם
    ManagerName: admin.NameOfUser,
    ManagersUserName: admin.TelegramUserName,
    ManagersRole: admin.role, // התפקיד שנבחר במודל
    ManagerNick_Name: admin.nickname, // הכינוי שנבחר במודל
    photo: admin.UserPicture || admin.photo || ""
  };
  // console.log("Saving new manager with data:", newAdmin);
  UpdateNewManger(newAdmin); // שליחת הנתונים לשרת
  // setAdmins(prev => [...prev, newAdmin]);
  // setAddedIds(prev => new Set([...prev, admin.TelegramUserId]));
  // setAddingAdmin(null);
};


  const handleSaveNickname = (nickname) => {
    setAdmins(prev => prev.map(a => a.TelegramUserId === editingAdmin.TelegramUserId ? { ...a, nickname } : a));
    setEditingAdmin(null);
  };

  const handleRemoveConfirmed = () => {
    setAdmins(prev => prev.filter(a => a.TelegramUserId !== confirmAdmin.TelegramUserId));
    setConfirmAdmin(null);
  };

  // פילטור המנהלים הקיימים
  const filtered = admins.filter(a =>
    a.ManagerName?.includes(filterQuery) ||
    a.ManagersUserName?.includes(filterQuery) ||
    a.TelegramUserId?.includes(filterQuery)
  );
  // const filtered = admins.filter(a =>
  //   a.NameOfUser.includes(filterQuery) ||
  //   a.TelegramUserName.includes(filterQuery) ||
  //   a.TelegramUserId.includes(filterQuery)
  // );

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
                const added = addedIds.has(user.TelegramUserId);
                return (
                  <div key={user.TelegramUserId}
                    className="flex items-center justify-between bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-indigo-500/20">
                        {user.UserPicture
                          ? <img src={user.UserPicture} alt={user.NameOfUser} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-indigo-300 font-bold text-sm">{user?.NameOfUser[0]}</div>
                        }
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-200 font-medium">{user.NameOfUser}</div>
                        <div className="text-[11px] text-indigo-300 font-mono">{user.TelegramUserName}</div>
                        <div className="text-[10px] text-gray-600 font-mono">ID: {user.TelegramUserId}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => !added && setAddingAdmin(user)}
                      className={`text-[12px] font-semibold rounded-xl px-3 py-1.5 border transition-all cursor-pointer shrink-0 ${added
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
          {/* {!isSearching && searchQuery.length === 0 (setSearchResults([]))} */}
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
            <div key={admin.TelegramUserId}
              className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3 hover:bg-white/[0.06] transition-all">

              {/* Photo */}
              <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 bg-indigo-500/20">
                {admin.photo
                  ? <img src={admin.photo} alt={admin.ManagerName} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-indigo-300 font-bold">{admin.ManagersUserName[0]}{admin.ManagersUserName[1]}{admin.ManagersUserName[2]}</div>
                }
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 text-right">
                <div className="flex items-center gap-2 mb-0.5" dir="rtl">
                  {/* השם יופיע ראשון מימין */}
                  <span className="text-sm text-gray-200 font-semibold truncate">
                    {admin.ManagerName}
                  </span>

                  {/* התגית תופיע משמאלו */}
                  <RoleBadge roleId={admin.ManagersRole} />
                </div>
                <div className="text-[12px] text-indigo-300 font-mono">{admin.ManagersUserName}</div>
                {admin.ManagerNick_Name && (
                  <div className="text-[11px] text-gray-500 mt-0.5">"{admin.ManagerNick_Name}"</div>
                )}
                <div className="text-[10px] text-gray-600 font-mono mt-0.5">ID: {admin.TelegramUserId}</div>
              </div>



              {/* Actions */}
              <div className="flex flex-col gap-1.5">
                <button onClick={() => setEditingAdmin(admin)}
                  className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[13px] cursor-pointer hover:bg-indigo-500/20 transition-all shrink-0 flex items-center justify-center">
                  ✏️
                </button>
                <button onClick={() => setConfirmAdmin(admin)}
                  className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] cursor-pointer hover:bg-red-500/20 transition-all shrink-0 flex items-center justify-center">
                  🗑
                </button>
              </div>
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

      {/* Edit Nickname Modal */}
      {editingAdmin && (
        <EditNicknameModal
          admin={editingAdmin}
          onSave={handleSaveNickname}
          onClose={() => setEditingAdmin(null)}
        />
      )}

      {/* Confirm Remove Modal */}
      {confirmAdmin && (
        <ConfirmModal
          adminName={confirmAdmin.ManagerName}
          onConfirm={handleRemoveConfirmed}
          onCancel={() => setConfirmAdmin(null)}
        />
      )}

    </div>
  );
}
