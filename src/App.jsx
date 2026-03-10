import { useState ,useEffect } from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Outlet,
  Navigate
} from 'react-router-dom'
import HomePage from "./components/Pages/Privet/HomePage.jsx"
import Page404 from './components/Pages/Public/Page404.jsx'



function Root( {isAuth} ) {

  // מציג את כל שאר האוטלט שלא מוגנים ציבורית ולא פרטיים שהם הכללים והשכבה הכללית 
  // console.log(isAuth,"this is the second isAuth")
  return (
    <div>
    {isAuth ? <Outlet /> : <Page404 />} 
    </div>
  )
}


function App() {
  
useEffect(() => {
    // 1. שליפת פרטי המשתמש מטלגרם
    const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
    
    if (telegramUser) 
      {
        console.log("ID המשתמש:", telegramUser.id);
  console.log("שם המשתמש:", telegramUser.first_name);
  console.log("Username:", telegramUser.username);
      }
 
  }, []);

const [isAuth, setIsAuth] = useState(true)
  console.log(isAuth,"this is the first isAuth")
    const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root isAuth={isAuth} />} errorElement={<Page404 />}>
        {/* Main Routes */}
        <Route index element={<HomePage />} />
   
   
   
      

      </Route>
    )
  );

  return (
  <>
  <RouterProvider router={router}/>
  </>
  )
}

export default App
