import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";


export const AuthContext = createContext();


function AuthProvider({ children }) {

//sates
  const [isAuth, setIsAuth] = useState( false);
  const [User, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // מתחיל בטעינה






// global functions
  async function getAuth() {
  const telegramUser = window.Telegram.WebApp.initData;
if (telegramUser) {

    try {
       const {data} = await axios.get("/Users/auth",{
        headers: {
          // אנחנו שולחים את כל המחרוזת תחת ה-Header Authorization
          'Authorization': `twa-auth ${telegramUser}`
        }
      })
       console.log(data , "this is the data of cccccccccccccccccccccccccccccccccccccccccc")
       if(data){
        setIsAuth(true)
        setUser(data.User)
        setIsLoading(false)
       }
       else {     
           setIsAuth(false)
        setUser(null)
        setIsLoading(false)
        throw new Error("המשתמש אינו מורשה לגשת לאפליקציה");
       }
    } catch (error) {
        console.error("שגיאת אימות:", error.response?.data || error.message);
      setIsAuth(false);
      setUser(null)
      setIsLoading(false)
    }
  
}
else {
  setIsAuth(false)
  setUser(null)
  setIsLoading(false)
  throw new Error("משתמש לא מזוהה בטלגרם");
}
  }





  useEffect(() => {
    getAuth()
  },[]);

// useEffect(() => {
//     // 1. שליפת פרטי המשתמש מטלגרם
//     const telegramUser = window.Telegram.WebApp.initData;
    
//     if (telegramUser) 
//       {
//   //       console.log("ID המשתמש:", telegramUser.id);
//   // console.log("שם המשתמש:", telegramUser.first_name);
//   // console.log("Username:", telegramUser.username);
//   console.log("פרטי המשתמש מטלגרם:", telegramUser);
//       }
 
//   }, []);

  const value = {getAuth ,isAuth , User ,isLoading};
  return <AuthContext.Provider
   value={value}>{children}
  </AuthContext.Provider>;
}

export default AuthProvider;