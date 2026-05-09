import { useState ,useEffect} from "react";
import {useNavigate} from 'react-router-dom'
import { toastSuccess, toastError } from "../../../../../UI/Toast/Toast.jsx";
import ContentSection from "./ContentSection.jsx";
import LinksSection from "./Linkssection.jsx";
import MediaSection from "./Mediasection.jsx";
import TimingSection from "./Timingsection.jsx";
import GroupsSection from "./Groupssection.jsx";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from 'axios';


export default function CreateAd() {
   const queryClient = useQueryClient();
         
   const navigate = useNavigate();
  const [form, setForm] = useState({
    messagesname: "",
    messages_text: "",
    messages_links: [[{ text: "", url: "" }]],
    messages_media: null,
    datestart: "", firsttimestart: "",
    dateend: "", endtime: "",
    repetition: "",
    isactive: true,
    pin_message: false,
    deletelaste: false,
    groupids: [],
  });


  useEffect(() => { 
    console.log("Form data updated:", form);
  }, [form]);


  
    // עדכון מנהל בDB 
  const {
    mutate: CreatePost, // הפונקציה שתפעיל את השאילתה
    data: SetCreatePostData,
    isPending: SetCreatePostisLoading, // בגרסאות חדשות זה isPending במקום isLoading
    error: SetCreatePostError,
    isError: isSetCreatePostError
  } = useMutation({
    mutationFn: async ( form) => {
      console.log("create post:", form);
      // כאן אנחנו שולחים את ה-Body שמתקבל מהקריאה לפונקציה
      const response = await axios.post(`/Messages/CreatNewMessage`, form);
      return response.data;
    },
    // אפשר לעבד את הנתונים כאן או ב-onSuccess
    onSuccess: (data) => {
      console.log("Data received:", data);
      toastSuccess("מודעה נוצרה בהצלחה!");
      navigate('/AllPosts'); // נווט חזרה לדף הבית לאחר יצירת המודעה
       queryClient.invalidateQueries({ queryKey: ["get_AllPostsData"] });

    },
    onError: (error) => {
      console.error("Error creating post:", error);
      toastError("שגיאה ביצירת המודעה. אנא נסה שוב.");
    }
  });

const handelSubmit = () => {
  // כאן תוכל להוסיף את הלוגיקה לשמירת המודעה, למשל קריאה ל-API
  console.log("Submitting form data:", form);
CreatePost(form);

}



  return (
    <div className="relative flex flex-col w-full bg-[#0f0f1a] font-sans" dir="rtl">

      <div className="fixed top-[-100px] left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.25)_0%,transparent_70%)] pointer-events-none z-0" />

      <div className="relative z-10 px-5 pt-5 pb-4 text-center">
        <div className="inline-flex items-center gap-1.5 bg-indigo-500/15 border border-indigo-500/30 rounded-full px-3 py-1 text-[11px] text-indigo-300 mb-3 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          יצירת מודעה חדשה
        </div>
        <h1 className="text-[22px] font-extrabold leading-tight bg-gradient-to-br from-white to-indigo-300 bg-clip-text text-transparent">
          בניית מודעה
        </h1>
      </div>

      <div className="relative z-10 px-5 pb-6">
        <ContentSection form={form} setForm={setForm} />
        <LinksSection form={form} setForm={setForm} />
        <MediaSection form={form} setForm={setForm} />
        <TimingSection form={form} setForm={setForm} />
        {/* <GroupsSection form={form} setForm={setForm} AllExistGroupsData={AllExistGroupsData} /> */}
        <GroupsSection form={form} setForm={setForm} />

        <button className="w-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-[15px] rounded-2xl py-4 border-none cursor-pointer shadow-[0_4px_20px_rgba(99,102,241,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(99,102,241,0.5)] active:scale-[0.98] mt-1"
        onClick={handelSubmit}>
          ✅ שמור מודעה
        </button>
        <div className="h-20 w-full flex-shrink-0" aria-hidden="true">
</div>
      </div>
      

    </div>
  );
}