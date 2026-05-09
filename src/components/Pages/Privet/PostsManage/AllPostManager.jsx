import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // בשביל לינקים ותמיכה מורחבת
import remarkBreaks from 'remark-breaks'; // בשביל ירידות שורה (Enter)
import rehypeRaw from 'rehype-raw';
import { toastSuccess, toastError } from "../../../../../UI/Toast/Toast.jsx";




function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onChange(!checked); }}
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
// מטפל בהצגה המעוצבת של הטקסט
function MarkdownText({ content }) {
  console.log(content)
  const safeContent = typeof content === 'string' ? content : "";
  return (
    <div className="markdown-cell-container" style={{ direction: 'rtl', textAlign: 'right' }}>
      <ReactMarkdown
        // כאן אתה "מזריק" את שני התוספים יחד
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw]} // הוספת התמיכה ב-HTML (קו תחתון)
      >
        {safeContent}
      </ReactMarkdown>
    </div>
  );
}
function PreviewModal({ ad, onClose }) {

  console.log("the preview add", { ad })

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm mb-17" onClick={onClose}>
      <div className="w-full max-w-[470px] bg-[#1a1a2e] border border-white/10 rounded-t-3xl p-5 pb-8 max-h-[85vh] overflow-y-auto mb-20"
      // onClick={e => e.stopPropagation()}
      >
        {/* Media preview */}
        {ad?.messages_media && (
          <div className="relative rounded-2xl overflow-hidden mb-4 h-36">
            {getFileType(ad?.messages_media) === "video" ? (
              <div className="relative w-full h-full">
                <video src={ad?.messages_media} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="text-white text-3xl">▶</span>
                </div>
              </div>
            ) : (
              <img src={ad?.messages_media} alt="מדיה" className="w-full h-full object-cover" />
            )}
          </div>
        )}
        {/* {text section} */}
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-3 mb-4 text-right">
          {/* <div className="text-[10px] text-gray-600 mb-1.5">טקסט המודעה</div> */}
          <div className="text-sm text-gray-200 leading-relaxed">
            <MarkdownText content={ad.messages_text} />

          </div>
        </div>
        {/* {linksection} */}
        {ad.messages_links.some(row => row.some(l => l.text)) && (
          <div className="mt-3 pt-3 border-t border-white/[0.06]">
            {ad.messages_links.map((row, ri) => (
              <div key={ri} className="flex gap-1.5 mb-1.5">
                {row.map((link, li) => link.text && (
                  <a
                    key={li}
                    href={link.url} // הכתובת שאליה הלינק מוביל
                    target="_blank"  // פתיחה בטאב חדש
                    rel="noopener noreferrer" // אבטחה בסיסית
                    className="flex-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[12px] font-medium rounded-xl px-3 py-1.5 text-center transition-all hover:bg-indigo-500/20 active:scale-95 no-underline block"
                  >
                    {link.text}
                  </a>
                ))}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )


}

// function AdDetailModal({ ad, onClose, onEdit, onDuplicate }) {
function AdDetailModal({ ad, onClose, onEdit, SetPreviewAdd }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm mb-17" onClick={onClose}>
      <div className="w-full max-w-[470px] bg-[#1a1a2e] border border-white/10 rounded-t-3xl p-5 pb-8 max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>

        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-start justify-between mb-4 mt-0">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${ad.isactive ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-white/[0.06] border-white/10 text-gray-500"}`}>
            {ad.isactive ? "פעיל" : "מושבת"}
          </span>
          <div className="text-center w-full max-w-[100%]">
            <div className="text-base  font-bold text-white">{ad.messagesname}</div>
            <div className="text-[11px] text-gray-500 mt-0.5">#{ad.id}</div>
          </div>
        </div>

        {/* Media preview */}
        {ad.messages_media && (
          <div className="relative rounded-2xl overflow-hidden mb-4 h-36">
            {getFileType(ad.messages_media) === "video" ? (
              <div className="relative w-full h-full">
                <video src={ad.messages_media} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="text-white text-3xl">▶</span>
                </div>
              </div>
            ) : (
              <img src={ad.messages_media} alt="מדיה" className="w-full h-full object-cover" />
            )}
          </div>
        )}

        {/* Text */}
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-3 mb-4 text-right">
          <div className="text-[10px] text-gray-600 mb-1.5">טקסט המודעה</div>
          <div className="text-sm text-gray-200 leading-relaxed">{ad.messages_text}</div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          {[
            { label: "קבוצות", value: `${ad.groups} קבוצות` },
            { label: "תדירות", value: `כל ${ad.repetition} דק׳` },
            {
              label: "תאריך התחלה",
              value: ad.datestart
                ? new Date(ad.datestart).toLocaleDateString("he-IL", { year: "numeric", month: "short", day: "numeric" })
                : "לא קיים"
            },
            { label: "שעת התחלה", value: ad.firsttimestart ? ad.firsttimestart.slice(0, 5) : "לא קיים" },
            {
              label: "תאריך  סיום", value: ad.dateend
                ? new Date(ad.dateend).toLocaleDateString("he-IL", { year: "numeric", month: "short", day: "numeric" })
                : "לא קיים"
            },
            { label: "שעת סיום", value: ad.endtime ? ad.endtime.slice(0, 5) : "לא קיים" },
            { label: "מחיקת הודעה אחרונה", value: ad.deletelaste ? "כן" : "לא קיים" },
            { label: "נעיצת המודעה", value: ad.pin_message ? "כן" : "לא קיים" },

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
          <button onClick={(e) => {
            // console.log("צפיה מקדימה")
            e.stopPropagation()
            SetPreviewAdd(ad)
          }} className="flex items-center justify-center gap-1.5 bg-white/[0.06] border border-white/10 text-gray-300 text-[13px] font-semibold rounded-xl py-3 cursor-pointer hover:bg-white/10 transition-all">
            📋 תצוגה מקדימה
          </button>
        </div>
      </div>
    </div>
  );
}

const getFileType = (key) => {
  if (!key) return "";
  const ext = key.split(".").pop().toLowerCase();
  const imageExts = ["jpg", "jpeg", "png", "webp", "avif", "gif"];
  const videoExts = ["mp4", "webm", "mov", "mpeg"];
  if (imageExts.includes(ext)) return "image";
  if (videoExts.includes(ext)) return "video";
  return "";
};



export default function AllPostManager() {
  const [ads, setAds] = useState([]);
  const [filterQuery, setFilterQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedAd, setSelectedAd] = useState(null);
  const [confirmAd, setConfirmAd] = useState(null);
  const [PreviewAdd, SetPreviewAdd] = useState(null)
  const [postNow, setpostNow] = useState(false)
  const [selectedGroups, setselectedGroups] = useState([])

  // שליפות
  const {
    data: AllPostsData,
    isLoading: AllPostsisLoading,
    error: AllPostsError,
    isError: isAllPostsError,
  } = useQuery({
    queryKey: ["get_AllPostsData"],
    queryFn: async () => {
      const response = await axios.get(`/Messages/GetAllMessages`);
      console.log("Fetched posts data:", response.data.data);
      return response.data.data;
    },
    select: (data) => data?.data || data,
    staleTime: 1000 * 60,
  });



  // כל הקבוצות שלי 
  const {
    data: AllExistGroupsData,
    isFetching: AllExistGroupsisFetching,
    // refetch: fetchGroups
  } = useQuery({
    queryKey: ["get_AllExistGroupsData"],
    queryFn: async () => {
      const response = await axios.get(`/GroupList/AllExistGroupsList`);
      // console.log(response.data," מתוך המודל")
      return response.data;
    },
    select: (data) => data?.data || data,
    staleTime: 1000 * 60,
    // enabled: false, 
  });



  // טעינת המודעות
  useEffect(() => {
    if (AllPostsData) {
      setAds(AllPostsData);
    } else if (isAllPostsError) {
      console.error("Error fetching posts:", AllPostsError);
    } else if (AllPostsisLoading) {
      console.log("Loading posts...");
    } else {
      console.log("No posts data available.");
    }
  }, [AllPostsData, isAllPostsError, AllPostsisLoading, AllPostsError]);

  // משתנה שמפעיל סינון על כמות המודעות הפעילות

  const toggleActive = (id) =>
    setAds(prev => prev.map(a => a.id === id ? { ...a, isactive: !a.isactive } : a));

  // מחיקת הודעה- טרם מומש
  const deleteAd = () => {
    setAds(prev => prev.filter(a => a.id !== confirmAd.id));
    setConfirmAd(null);
    setSelectedAd(null);
  };

  // משפיע על החיפוש
  const filtered = ads.filter(a => {
    const matchText =
      a.messagesname?.includes(filterQuery) || a.messages_text?.includes(filterQuery);
    const matchStatus =
      filterStatus === "all" || (filterStatus === "active" ? a.isactive : !a.isactive);
    return matchText && matchStatus;
  });


  // משתנים שעושים בדיקה האם הקבוצה כבר מסומנת לפרסום של המודעה או לא
  const activeCount = ads.filter(a => a.isactive).length;
  const inactiveCount = ads.filter(a => !a.isactive).length;


  // בחירת הקבוצות מודל
  function ChoosGroupsModal({ ad, onConfirm, onCancel, onClose }) {
    const toggleGroup = (id) => {
      const stringId = String(id);
      setSelectedGroups(prev =>
        prev.includes(stringId)
          ? prev.filter(g => g !== stringId)
          : [...prev, stringId]
      );
    };

    // useEffect(() => {
    //     if (ad && ad.groupids) {
    //       // המרה לסטרינג כדי להתאים ל-ID שיוצא מה-map
    //       const idsAsStrings = Array.isArray(ad.groupids) 
    //         ? ad.groupids.map(String) 
    //         : [];
    //       setSelectedGroups(idsAsStrings);
    //     }
    //   }, [ad]); // ירוץ בכל פעם שהאובייקט ad משתנה



    // שליפת הקבוצות מהשרת
    // console.log(AllExistGroupsData, " עכשיו מתוך המודל")
    // טוען את הקבוצות שכבר סומנו 
    const [selectedGroups, setSelectedGroups] = useState(
      Array.isArray(ad.groupids) ? ad.groupids.map(String) : []
    );

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6" onClick={onClose}>
        <div className="w-full max-w-[340px] bg-[#1a1a2e] border border-white/10 rounded-2xl p-5"
          onClick={e => e.stopPropagation()}>
          <div className="text-center mb-4">

            <div className="text-sm text-gray-400">
              <span className="text-white font-semibold">בחר קבוצות לפרסום</span>
            </div>
          </div>
          {AllExistGroupsData.map(group => { // FIX: שימוש בנתונים מהשרת
            const selected = selectedGroups.includes(group.telegramgroupid);
            const groupIdStr = String(group.telegramgroupid);

            // בדיקה מול מערך שגם האיברים בו הפכו לסטרינג
            const isSelected = selectedGroups.map(String).includes(groupIdStr);
            // console.log(`Group: ${group.groupname} | ID: ${groupIdStr} | In Selected: ${isSelected}`, selectedGroups);

            return (
              <div key={groupIdStr}
                className={`flex items-center justify-between px-4 py-3 border-b border-white/[0.04] last:border-none transition-colors ${isSelected ? "bg-indigo-500/[0.07]" : ""}`}>
                <div className="flex items-center gap-3 flex-1" onClick={() => toggleGroup(groupIdStr)}>
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all shrink-0 ${isSelected ? "bg-indigo-500 border-indigo-500" : "border-white/20 bg-transparent"}`}>
                    {isSelected && <span className="text-white text-[11px] font-bold">✓</span>}
                  </div>
                  <div className="text-right cursor-pointer">
                    <div className="text-sm text-gray-200 font-medium">{group.groupname}</div>

                  </div>
                </div>
              </div>
            )
          })}
          <div className="flex items-center justify-center w-full mt-5">
            <button
              onClick={() => {
                handelSendOneMessage(selectedGroups, ad);
                {onClose()}
                // console.log("אני רוצה לפרסם בקבוצות" , selectedGroups)
              }}
              className="w-40 h-10 rounded-lg bg-blue-600 border-red-500/20 text-white text-[15px] font-bold  cursor-pointer hover:bg-blue-950 transition-all flex items-center justify-center">
              פרסום עכשיו
            </button>
          </div>

        </div>
      </div>
    );
  }

const handelSendOneMessage = async (selectedGroups, ad) => {
  try {
    const response = await axios({
      url: '/Messages/SendSingelMessage',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // ב-axios משתמשים ב-data במקום body, ואין צורך ב-JSON.stringify
      data: {
        
        messeageId: ad.id,
        groupIds: selectedGroups,
        adData: { 
          messages_text: ad.messages_text, 
          messages_media: ad.messages_media, 
          messages_links: ad.messages_links,
          // deletelaste: ad.deletelaste,
          // last_ad_messageid: ad.last_ad_messageid,
          pin_message: ad.pin_message
        }
      }
    });
    
    console.log("Response from sending message:", response.data.summary); 
   
    // פה יכול להיות יותר מתשובה אחת - כי אני שולח למספר קבוצות , אני צריך לואה שתבדוק איפה זה נשלח ואיפה נכשל
    // if (response.data === "success") {
    //   console.log("Message sent successfully:", response.data);
    //   toastSuccess("ההודעה נשלחה בהצלחה!");
    // } 
    // else {
    //   console.error("Failed to send message:", response.data);
    //   toastError("שליחת ההודעה נכשלה. נסה שוב."); 
    // } 
  } 
  catch (error) {
    console.error("Error sending message:", error);
    toastError("אירעה שגיאה בשליחת ההודעה. נסה שוב.");
  }
};








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
            { label: "סה״כ", value: ads.length, color: "text-white" },
            { label: "פעילות", value: activeCount, color: "text-green-400" },
            { label: "מושבתות", value: inactiveCount, color: "text-gray-500" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl px-3 py-2.5 text-center">
              <div className={`text-xl font-extrabold ${color}`}>{value}</div>
              <div className="text-[11px] text-gray-600 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="חיפוש לפי שם או טקסט..."
              value={filterQuery}
              onChange={e => setFilterQuery(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
            {filterQuery && (
              <button
                onClick={() => setFilterQuery("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 bg-transparent border-none cursor-pointer text-sm">
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Status tabs */}
        <div className="flex gap-1.5 mb-4">
          {[["all", "הכל"], ["active", "פעילות"], ["inactive", "מושבתות"]].map(([v, l]) => (
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

              {/* Media thumb */}
              <div className="w-22 h-22 rounded-xl overflow-hidden shrink-0 bg-white/[0.06] flex items-center justify-center">
                {ad.messages_media ? (
                  getFileType(ad.messages_media) === "video" ? (
                    <video src={ad.messages_media} className="w-full h-full object-cover pointer-events-none" />
                  ) : (
                    <img src={ad.messages_media} alt={ad.messagesname} className="w-full h-full object-cover pointer-events-none" />
                  )
                ) : (
                  <span className="text-xl pointer-events-none">📝</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 text-center">
                <div className="text-sm font-semibold text-gray-100 truncate">{ad.messagesname}</div>
                <div className="text-[12px] text-gray-500 truncate mt-0.5">{ad.messages_text}</div>
                <div className="flex items-center gap-2 justify-end mt-1">
                  {/* <span className="text-[10px] text-gray-600">👥 כפתור הצגת קבוצה</span> */}
                  <span className="text-[10px] text-gray-600">⏱ {ad.repetition} דק׳</span>
                  <span className="text-[10px] text-gray-600">
                    📅 {ad?.datestart
                      ? new Date(ad.datestart).toLocaleDateString("he-IL", { year: "numeric", month: "short", day: "numeric" })
                      : "תאריך לא זמין"}
                  </span>
                </div>
              </div>

              {/* Toggle + actions */}
              <div className="flex flex-col items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                <Toggle className="w-25 h-7" checked={ad.isactive} onChange={() => toggleActive(ad.id)} />
                <button
                  onClick={(e) => {
                    console.log("צפיה מקדימה")
                    e.stopPropagation()
                    SetPreviewAdd(ad)
                  }}
                  className="w-25 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] cursor-pointer hover:bg-blue-500/20 transition-all flex items-center justify-center">
                  📋 תצוגה מקדימה
                </button>
                <button
                  onClick={() => setConfirmAd(ad)}
                  className="w-25 h-7 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] cursor-pointer hover:bg-red-500/20 transition-all flex items-center justify-center">
                  🗑 מחק מודעה
                </button>
                <button

                  onClick={() => {
                    setpostNow(true)
                    SetPreviewAdd(ad)
                  }}
                  className="w-25 h-7 rounded-lg bg-emerald-500 border border-red-500/20 text-black text-[11px] cursor-pointer hover:bg-emerald-800 transition-all flex items-center justify-center">
                  פרסום עכשיו
                </button>
              </div>

            </div>
          ))}
          <div className="h-20 w-full flex-shrink-0" aria-hidden="true">
          </div>
        </div>
        {/* ✅ סגירת flex flex-col gap-2 */}

        {/* Detail Modal */}
        {selectedAd && (
          <AdDetailModal
            ad={selectedAd}
            onClose={() => setSelectedAd(null)}
            onEdit={() => setSelectedAd(null)}
            SetPreviewAdd={SetPreviewAdd}
          // onDuplicate={() => {}}
          />
        )}

        {/* Confirm Delete */}
        {confirmAd && (
          <ConfirmModal
            adName={confirmAd.messagesname}
            onConfirm={deleteAd}
            onCancel={() => setConfirmAd(null)}
          />
        )}
        {/* {previewModal} */}
        {PreviewAdd && (
          <PreviewModal
            ad={PreviewAdd}
            onClose={() => {
              SetPreviewAdd(null)
            }}
          />
        )
        }
        {/* {choose group modal} */}
        {
          postNow && (
            <ChoosGroupsModal
              ad={PreviewAdd}
              onClose={() => {
                SetPreviewAdd(null)
                setpostNow(false)
              }
              }
            />
          )
        }

      </div>
      {/* ✅ סגירת px-5 pb-6 */}

    </div>
    // ✅ סגירת root div
  );
}