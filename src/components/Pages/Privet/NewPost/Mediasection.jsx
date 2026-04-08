import React, { useState, useEffect, useContext, useRef } from 'react';

import { useQueryClient } from "@tanstack/react-query";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from 'axios';
import Loading from "../../../../../UI/Loading.jsx";


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
  const queryClient = useQueryClient();

  const [library, setLibrary] = useState([]);
  const [filter, setFilter] = useState("all");
  const [localSel, setLocalSel] = useState(selected);
  const fileRef = useRef(null);

  const filtered = filter === "all" 
  ? library 
  : library.filter(m => m.type && m.type.includes(filter));


  // שליפה
  const {
    data: AllMediaData,
    isLoading: AllMediaisLoading,
    error: AllMediaError,
    isError: isAllMediaError
  } = useQuery({
    queryKey: ["get_AllMediaData"],
    queryFn: async () => {
      const response = await axios.get(`/Gallery/ShowAllMedia`);
      return response.data;
    },
    select: (data) => data?.files || data, // טיפול גמיש בנתונים
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (AllMediaData) {
      const filteredData = AllMediaData.filter(item => item.name !== ".emptyFolderPlaceholder");
      setLibrary(filteredData);
    }
    console.log("AllMediaData:", library);
  }, [AllMediaData]);

  // useEffect(() => { 
  //   setForm(prev => ({ ...prev, Messages_Media: localSel }));
  // }, [localSel]);


  // העלאה  
  const {
    mutate: UploadNweMedia, // הפונקציה שתפעיל את השאילתה
    data: UploadNweMediaData,
    isPending: UploadNweMediaisLoading, // בגרסאות חדשות זה isPending במקום isLoading
    error: UploadNweMediaError,
    isError: isUploadNweMediaError
  } = useMutation({
    mutationFn: async (formData) => {
      console.log("Sending new media file to server:", formData);
      // כאן אנחנו שולחים את ה-Body שמתקבל מהקריאה לפונקציה
      const response = await axios.post(`/Gallery/UploadNewMedia`, formData);
      return response.data;
    },
    // אפשר לעבד את הנתונים כאן או ב-onSuccess
    onSuccess: (data) => {
      console.log("Data received:", data);
      //   setLibrary(prev => [newItem, ...prev]);
      //  setLocalSel(newItem);
      queryClient.invalidateQueries({ queryKey: ["get_AllMediaData"] });

      setIsSearching(false); // עדכון מצב החיפוש
    }
  });




  const handleUpload = (e) => {
    // הקריאה לשרת להעלות את התמונה צריכה להיות פה 
    const file = e.target.files[0];
    if (!file) return;

    // 1. יצירת אובייקט FormData
    const formData = new FormData();

    // 2. הוספת הקובץ. 
    // שים לב: השם 'file' כאן חייב להתאים למה שכתוב בשרת ב-upload.single('file')
    formData.append('file', file);
    console.log("File inside FormData:", formData.get('file'));
    UploadNweMedia(formData);

    // const newItem = {
    //   id: String(Date.now()),
    //   type: file.type.startsWith("video") ? "video" : "image",
    //   name: file.name,
    //   thumb: URL.createObjectURL(file),
    // };




    // מציג את החדש בבספריה אחרי ההעלאה 
    // setLibrary(prev => [newItem, ...prev]);
    // setLocalSel(newItem);
  };

  return (
    AllMediaisLoading || UploadNweMediaisLoading ? <Loading /> : (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm mb-3" onClick={onClose}>
        <div
          className="w-full max-w-[430px] bg-[#1a1a2e] border border-white/10 rounded-t-3xl p-5 pb-8 flex flex-col"
          style={{ height: "85vh" }}
          onClick={e => e.stopPropagation()}
        >
          <span className="text-base font-bold text-white text-center mb-1">ספריית מדיה</span>
          <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4 shrink-0" />

          <div className="flex items-center justify-between mb-3 shrink-0">
            <button onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[12px] font-semibold rounded-xl px-3 py-1.5 cursor-pointer hover:bg-indigo-500/30 transition-all">
              + העלה חדש
            </button>
            <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleUpload} />
          </div>

          <div className="flex gap-1.5 mb-3 shrink-0">
            {[["all", "הכל"], ["image", "תמונות"], ["video", "סרטונים"]].map(([v, l]) => (
              <button key={v} onClick={() => setFilter(v)}
                className={`px-3 py-1 rounded-lg text-[12px] font-semibold border transition-all cursor-pointer ${filter === v ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300" : "bg-white/[0.04] border-white/10 text-gray-500"}`}>
                {l}
              </button>
            ))}
          </div>

          {/* scroll wrapper */}
          <div style={{ overflowY: "auto", flex: 1, minHeight: 0 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", paddingBottom: "4px" }}>
              {filtered.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  onClick={() => setLocalSel(item)}
                  style={{
                    position: "relative",
                    borderRadius: "12px",
                    overflow: "hidden",
                    cursor: "pointer",
                    border: localSel?.id === item.id ? "2px solid #6366f1" : "2px solid transparent",
                    transition: "all 0.15s",
                  }}
                >
                  {/* paddingBottom=75% = יחס 4:3 קבוע ללא קשר לרוחב */}
                  <div style={{ position: "relative", paddingBottom: "75%", background: "#111" }}>
                    {item.type.includes("video") ?
                      <video
                        src={item.url + "#t=0.1"} // ה-#t=0.1 אומר לדפדפן לטעון את הפריים בשנייה ה-0.1
                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      />

                      : (<img
                        src={item.url}
                        alt={item.name}
                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      />)}
                  {item.type === "video" && (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)" }}>
                        <span style={{ color: "white", fontSize: "20px" }}>▶</span>
                      </div>
                    )}
                    {localSel?.id === item.id && (
                      <div style={{ position: "absolute", top: 4, right: 4, width: 20, height: 20, background: "#6366f1", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "white", fontSize: "10px", fontWeight: "bold" }}>✓</span>
                      </div>
                    )}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.65)", padding: "2px 6px" }}>
                      <p style={{ fontSize: "9px", color: "white", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => { onSelect(localSel); onClose(); }}
            className="mt-4 w-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-[15px] rounded-2xl py-3.5 border-none cursor-pointer transition-all hover:-translate-y-0.5 active:scale-[0.98] shrink-0">
            {localSel ? `בחר — ${localSel.name}` : "בחר קובץ"}
          </button>
        </div>
      </div>
    ));
}

export default function MediaSection({ form, setForm }) {
  const [mediaOpen, setMediaOpen] = useState(false);

  return (
    <>
      <SectionCard icon="🖼️" title="מדיה">
        {form.Messages_Media ? (
          <div className="flex items-center gap-3">
            <div className="relative w-20 h-16 rounded-xl overflow-hidden shrink-0">
              {form.Messages_Media.type.includes("video") ? (
                <video src={form.Messages_Media.url + "#t=0.1"} className="w-full h-full object-cover" />
              ) : ( 
              <img src={form.Messages_Media.url} alt={form.Messages_Media.name} className="w-full h-full object-cover" />
              )}
              {/* {form.Messages_Media.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="text-white text-lg">▶</span>
                </div>
              )} */}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-200 font-medium truncate">{form.Messages_Media.name}</div>
              <div className="text-[11px] text-gray-500 mt-0.5">{form.Messages_Media.type.includes("video") ? "סרטון" : "תמונה"}</div>
            </div>
            <div className="flex flex-col gap-1.5">
              <button onClick={() => setMediaOpen(true)}
                className="text-[11px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-2.5 py-1 cursor-pointer hover:bg-indigo-500/20 transition-all">
                החלף
              </button>
              <button onClick={() => setForm({ ...form, Messages_Media: null })}
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
          onSelect={m => setForm({ ...form, Messages_Media: m })}
          onClose={() => setMediaOpen(false)}
        />
      )}
    </>
  );
}