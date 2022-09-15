import React, {Suspense, useCallback, useState} from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom'
import Users from './users/pages/Users'
import MainNavigation from './shared/components/Navigation/MainNavigation';
// import NewPlace from './places/pages/NewPlace';
// import UserPlaces from './places/pages/UserPlaces';
// import UpdatePlace from './places/pages/UpdatePlace';
// import Auth from './users/pages/Auth';
import {AuthContext} from './shared/context/auth-context';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

const NewPlace=React.lazy(()=> import('./places/pages/NewPlace'))
const UserPlaces= React.lazy(()=> import('./places/pages/UserPlaces'))
const UpdatePlace=React.lazy(()=>import('./places/pages/UpdatePlace'))
const Auth= React.lazy(()=> import('./users/pages/Auth'))

function App() {

const [isLoggedIn,setIsLoggedIn]=useState(false)
const [userId, setUserId]= useState(null)

const login=useCallback((uid)=>{
  setIsLoggedIn(true)
  setUserId(uid);
},[])

const logout=useCallback(()=>{
  setIsLoggedIn(false)
  setUserId(null);
},[])


let routes;

if(isLoggedIn){
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
        isLoggedIn: isLoggedIn,
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
