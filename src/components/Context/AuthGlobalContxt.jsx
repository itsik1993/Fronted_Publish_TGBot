import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";


export const AuthContext = createContext();


function AuthProvider({ children }) {

//sates
  const [isAuth, setIsAuth] = useState( false);
  const [User, setUser] = useState(null);







// global functions
  async function getAuth() {
    try {
       const {data} = await axios.get("/Users/auth");
       console.log(data , "this is the data of cccccccccccccccccccccccccccccccccccccccccc")
       if(data.success){
        setIsAuth(true)
        setUser(data.User)
       }
    } catch (error) {
        console.log(error);
    }
  };




  // useEffects
  useEffect(() => {
    getAuth()
  },[]);



  const value = {getAuth ,isAuth , User};
  return <AuthContext.Provider
   value={value}>{children}
  </AuthContext.Provider>;
}

export default AuthProvider;