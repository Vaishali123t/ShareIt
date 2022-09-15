import React, {useEffect, useState} from 'react';
import UserList from '../components/UsersList';
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users=()=>{

    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedUsers, setLoadedUsers]=useState()

    useEffect(()=>{
        const fetchUsers=async ()=>{
            try{
                const responseData=await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/api/users`);
                setLoadedUsers(responseData.users);
                console.log(responseData.users);
            }catch(err){}
        }
        fetchUsers();
    },[sendRequest]);

    return (
      <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        {isLoading && (
          <div className="center">
            <LoadingSpinner />
          </div>
        )}
        {!isLoading && loadedUsers && <UserList items={loadedUsers} />}
      </React.Fragment>
    );
};

export default Users;