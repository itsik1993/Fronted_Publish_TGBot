import React, { useState, useEffect, useContext } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from 'axios';
import { toastSuccess, toastError } from "../../../../../UI/Toast/Toast.jsx";


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

// מודל

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

function AddGroupModal({ Group, onSave, onClose }) {

  return (
    // שנה את השורה הראשונה לזה:
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>      <div className="w-full max-w-[430px] bg-[#1a1a2e] border border-white/10 rounded-t-3xl p-5 pb-8"
      onClick={e => e.stopPropagation()}>
      האם אתה בטוח שברצונך להוסיף את הקבוצה הזו ? <br />
      <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />

      {/* Group preview */}
      <div className="flex items-center gap-3 mb-5 bg-white/[0.04] border border-white/[0.06] rounded-2xl px-4 py-3">
        <div className="w-11 h-11 rounded-full overflow-hidden shrink-0">
          <img src={Group.photo} alt={Group.GroupUserName} className="w-full h-full object-cover" />
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-white">{Group.GroupName}</div>
          <div className="text-[12px] text-indigo-300 font-mono">{Group.GroupUserName}</div>
          <div className="text-[11px] text-gray-600 mt-0.5">ID: {Group.TelegramGroupId}</div>
        </div>
      </div>



      <button onClick={() => onSave({ ...Group })}
        className="w-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-[15px] rounded-2xl py-3.5 border-none cursor-pointer transition-all hover:-translate-y-0.5 active:scale-[0.98]">
        הוסף קבוצה
      </button>
    </div>
    </div>
  );
}


// ראשי

export default function ManageGroups() {
  const queryClient = useQueryClient();

  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addedIds, setAddedIds] = useState(new Set());
  const [confirmGroup, setConfirmGroup] = useState(null);
  const [filterQuery, setFilterQuery] = useState("");
  const [addingGroup, setAddingGroup] = useState(null);
  // שליפות


  // שליפת הקבוצות הקיימות מהשרת
  const {
    data: AllExistGroupsData,
    isLoading: AllExistGroupsisLoading,
    error: AllExistGroupsError,
    isError: isAllExistGroupsError
  } = useQuery({
    queryKey: ["get_AllExistGroupsData"],
    queryFn: async () => {
      const response = await axios.get(`/GroupList/AllExistGroupsList`);
      return response.data;
    },
    select: (data) => data?.data || data, // טיפול גמיש בנתונים
    staleTime: 1000 * 60,
  });



  // שליפה לפי צורך חיפוש
  const {
    mutate: fetchAllGroups, // הפונקציה שתפעיל את השאילתה
    data: GetAllGroupsData,
    isPending: GetAllGroupsisLoading, // בגרסאות חדשות זה isPending במקום isLoading
    error: GetAllGroupsError,
    isError: isGetAllGroupsError
  } = useMutation({
    mutationFn: async () => {
      // כאן אנחנו שולחים את ה-Body שמתקבל מהקריאה לפונקציה
      const response = await axios.post(`/GroupList/SerchAddNewGroupToManager`, { groupname: searchQuery });
      return response.data;
    },
    // אפשר לעבד את הנתונים כאן או ב-onSuccess
    onSuccess: (data) => {
      // console.log("Data received:", data);
      setSearchResults(data); // עדכון תוצאות החיפוש עם הנתונים מהשרת

      setIsSearching(false); // עדכון מצב החיפוש
    }
  });


  // עדכון קבוצה בDB 
  const {
    mutate: UpdateNewGroup, // הפונקציה שתפעיל את השאילתה
    data: SetNewGroupData,
    isPending: SetNewGroupisLoading, // בגרסאות חדשות זה isPending במקום isLoading
    error: SetNewGroupError,
    isError: isSetNewGroupError
  } = useMutation({
    mutationFn: async (newGroup) => {
      console.log("Sending new group data to server8888:", newGroup);
      // כאן אנחנו שולחים את ה-Body שמתקבל מהקריאה לפונקציה
      const response = await axios.post(`/GroupList/AddNewGroup`, { group: newGroup });
      return response.data;
    },
    // אפשר לעבד את הנתונים כאן או ב-onSuccess
    onSuccess: (data) => {
      console.log("onSuccess רץ!"); // ← הוסף

      setSearchResults([]); 
      setAddingGroup(null)
      toastSuccess("הקבוצה נוספה בהצלחה!");
      queryClient.invalidateQueries({ queryKey: ["get_AllExistGroupsData"] });

      setIsSearching(false); // עדכון מצב החיפוש
    },
    onError: (error) => {
      console.error("Error adding group6666:", error.response);
      toastError(error.response?.data?.details);
       setSearchResults([]); 
      setAddingGroup(null)
    }
  });




  useEffect(() => {
    if (AllExistGroupsData) {
      console.log("Fetched groups data:", AllExistGroupsData);
      setGroups(AllExistGroupsData); // עדכון הקבוצות עם הנתונים מהשרת
    }
  }, [AllExistGroupsData]);


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

    const searchResults = fetchAllGroups(searchQuery);
    GetAllGroupsisLoading ? setIsSearching(true) : setIsSearching(false);
    setSearchResults(searchResults || []); // עדכון תוצאות החיפוש
    // setIsSearching(false);

  };

  const handelAddGroup = (group) => {

    UpdateNewGroup(group);
    // setGroups(prev => [...prev, { ...group, active: true }]);
    // setAddedIds(prev => new Set([...prev, group.id]));
  };

  const handleRemoveConfirmed = () => {
    setGroups(prev => prev.filter(g => g.id !== confirmGroup.id));
    setConfirmGroup(null);
  };

  const filtered = groups.filter(g =>
    (g.GroupName?.includes(filterQuery)) ||
    (g.GroupUserName?.includes(filterQuery)) ||
    (g.TelegramGroupId?.toString().includes(filterQuery))
  );

  // useEffect(() => {

  //     console.error("all filters  :", filtered);

  // }, [filtered]);


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
                          ? <img src={group.photo} alt={group.GroupName} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-indigo-300 font-bold">
                            {group.GroupName?.slice(0, 3)}
                          </div>
                        }
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-200 font-medium">{group.GroupName}</div>
                        <div className="text-[12px] text-indigo-300/80 font-medium truncate">
                          {group.GroupUserName}
                        </div>
                        <div className="text-[11px] text-gray-600 mt-0.5 font-mono">{group.TelegramGroupId}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-gray-500">{group.members?.toLocaleString()} חברים</span>
                      <button
                        onClick={() => !added && setAddingGroup(group)}
                        className={`text-[12px] font-semibold rounded-xl px-3 py-1.5 border transition-all cursor-pointer ${added
                          ? "bg-green-500/10 border-green-500/20 text-green-400 cursor-default"
                          : "bg-indigo-500/20 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/30"
                          }`}>
                        {/* {added ? "✓ נוסף" : "+ הוסף"} */}

                        הוסף
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {addingGroup && (
            <AddGroupModal
              Group={addingGroup}
              onSave={handelAddGroup}
              onClose={() => setAddingGroup(null)}
            />
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
                  ? <img src={group.photo} alt={group.GroupUserName} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-indigo-300 font-bold">
                    {group.GroupName?.slice(0, 3)}
                  </div>
                }
                <span className={`absolute bottom-0 left-0 w-3 h-3 rounded-full border-2 border-[#0f0f1a] ${group.active ? "bg-green-400" : "bg-gray-600"}`} />
              </div>

              {/* Info */}
              <div className="text-right flex-1 min-w-0">
                {/* 1. שם הקבוצה - בולט ולבן */}
                <div className="text-sm text-gray-100 font-bold truncate mb-0.5">
                  {group.GroupName}
                </div>

                {/* 2. שורת מידע משנית - שם משתמש ו-ID */}
                <div className="flex flex-col gap-0.5">
                  {/* שם המשתמש (למשל @aajmc.bot) */}
                  <div className="text-[12px] text-indigo-300/80 font-medium truncate">
                    {group.GroupUserName}
                  </div>

                  {/* ה-ID וכמות החברים בשורה אחת תחתונה */}
                  <div className="flex items-center gap-2 justify-end mt-0.5">
                    <span className="text-[10px] text-gray-600 font-mono truncate">
                      {group.TelegramGroupId}
                    </span>
                    <span className="text-[10px] text-gray-500 shrink-0">
                      • {group.members?.toLocaleString() || 0} חברים
                    </span>
                  </div>
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
          groupName={confirmGroup.GroupName}
          onConfirm={handleRemoveConfirmed}
          onCancel={() => setConfirmGroup(null)}
        />
      )}

    </div>
  );
}