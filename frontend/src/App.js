import React, { Suspense, useState, useCallback, useEffect } from "react";
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom'

import Users from './users/pages/Users'
import MainNavigation from './shared/components/Navigation/MainNavigation';
import {AuthContext} from './shared/context/auth-context';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

const NewPlace=React.lazy(()=> import('./places/pages/NewPlace'))
const UserPlaces= React.lazy(()=> import('./places/pages/UserPlaces'))
const UpdatePlace=React.lazy(()=>import('./places/pages/UpdatePlace'))
const Auth= React.lazy(()=> import('./users/pages/Auth'))
// import {useAuth} from './shared/hooks/auth-hook'

let logOutTimer;

function App() {

const [token,setToken]=useState(false)
const [tokenExpirationDate, setTokenExpirationDate]= useState();
const [userId, setUserId]= useState(null)

//  const { token, login, logout, userId } = useAuth()

const login=useCallback((uid,token, expirationDate)=>{
  setToken(token);
  setUserId(uid);
  const tokenExpirationDate= new Date(new Date().getTime()+1000*60*60)
  setTokenExpirationDate(tokenExpirationDate);

  localStorage.setItem(
    "userData",
    JSON.stringify({
      userId: uid,
      token: token,
      expiration: expirationDate || tokenExpirationDate.toISOString(),
    })
  );

},[])

const logout=useCallback(()=>{
  setToken(null);
  setUserId(null);
  localStorage.removeItem('userData');
},[])

useEffect(() => {
  if (token && tokenExpirationDate) {
    const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
    logOutTimer = setTimeout(logout, remainingTime);
  }
  else{
    clearTimeout(logOutTimer);
  }
}, [token, logout, tokenExpirationDate]);

useEffect(() => {
  const storedData = JSON.parse(localStorage.getItem("userData"));
  if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
    login(storedData.userId, storedData.token, new Date(storedData.expiration));
  }
}, [login]);

let routes;

if(token){
  routes = (
    <Switch>
      <Route path="/" exact>
        <Users />
      </Route>
      <Route path="/places/new" exact>
        <NewPlace />
      </Route>
      <Route path="/:userId/places" exact>
        <UserPlaces />
      </Route>
      <Route path="/places/:placeId" exact>
        <UpdatePlace />
      </Route>
      <Redirect to="/" />
    </Switch>
  );
}
else{
  routes = (
    <Switch>
      <Route path="/" exact>
        <Users />
      </Route>
      <Route path="/:userId/places" exact>
        <UserPlaces />
      </Route>
      <Route path="/auth" exact>
        <Auth />
      </Route>
      <Redirect to="/auth" />
    </Switch>
  );
}

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token:token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
