import { useState, useCallback, useEffect, useRef } from "react"


export const useHttpClient= ()=>{
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const activeHttpRequest= useRef([]);

  const sendRequest=useCallback(async (url,method='GET',body=null, headers={})=>{

    setIsLoading(true);
    const httpabortCtrl= new AbortController();
    activeHttpRequest.current.push(httpabortCtrl);

    try{
        const response=await fetch(url,{
            method,
            body,
            headers,
            signal:httpabortCtrl.signal
        })
        const responseData= await response.json();

        activeHttpRequest.current= activeHttpRequest.current.filter(reqCtrl => reqCtrl !== httpabortCtrl);
        if (!response.ok) {
        throw new Error(responseData.message);
        }
        setIsLoading(false);
        return responseData;

    }catch(err){
        setIsLoading(false);
        setError(err.message);
        throw err;
    }
  },[])

  const ClearError=()=>{
    setError(null);
  }

  useEffect(()=>{
    return ()=>{
        activeHttpRequest.current.forEach(abortctrl => { abortctrl.abort()      
        });
    }
  },[])

  return { isLoading, error, sendRequest, ClearError };
}

