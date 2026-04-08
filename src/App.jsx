import { useState ,useEffect ,useContext } from 'react'


import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Outlet,
  Navigate
} from 'react-router-dom'
import HomePage from "./components/Pages/Privet/HomePage/HomePage.jsx"
import Page404 from './components/Pages/Public/Page404.jsx'
import { AuthContext } from './components/Context/AuthGlobalContxt.jsx'
import Loading from '../UI/Loading.jsx'
import Nav from '../UI/Nav.jsx'

function Root( {isAuth , isLoading} ) {

  // מציג את כל שאר האוטלט שלא מוגנים ציבורית ולא פרטיים שהם הכללים והשכבה הכללית 
  // console.log(isAuth,"this is the second isAuth")
  return (
    <div>
      {isLoading ? <Loading /> : 
      isAuth ? (<div > 
        <Outlet />
        <Nav />
      </div>
       ):
       <Page404 />}
    </div>
  )
}


function App() {
  const{ isAuth , isLoading } = useContext(AuthContext)
console.log(isLoading,"this is the isLoading")
const test=true;

  console.log(isAuth,"this is the first isAuth")
    const router = createBrowserRouter(
    createRoutesFromElements(
      // <Route path="/" element={<Root isAuth={isAuth} isLoading={isLoading} />} errorElement={<Page404 />}>
       <Route path="/" element={<Root isAuth={test} isLoading={isLoading} />} errorElement={<Page404 />}> 
        {/* Main Routes */}
        <Route index element={<HomePage />} />
   
             <Route
            path="CreateNewPublish"
            lazy={async () => ({
              Component: (await import('./components/Pages/Privet/NewPost/CreateNewPublish.jsx')).default,
            })}
          />
              <Route
            path="GroupsManager"
            lazy={async () => ({
              Component: (await import('./components/Pages/Privet/Groups/GroupsManagerPage.jsx')).default,
            })}
          />
                   <Route
            path="Managers"
            lazy={async () => ({
              Component: (await import('./components/Pages/Privet/Managers/ManagersPage.jsx')).default,
            })}
          />
                         <Route
            path="AllPosts"
            lazy={async () => ({
              Component: (await import('./components/Pages/Privet/PostsManage/AllPostManager.jsx')).default,
            })}
          />
   
      

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
