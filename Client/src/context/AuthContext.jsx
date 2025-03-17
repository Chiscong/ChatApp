import {createContext, useState, useEffect} from "react";
import {useCallback} from "react"

import { postRequest,baseUrl } from '../utils/services'; 


export const AuthContext = createContext();
export const AuthContextProvider = ({  children  }) =>{

   const [user, setUser] = useState(null);
   const [registerError,setRegisterError] = useState(null);
   const [isregisterLoading,setisregisterLoading] = useState(false);

   const [registerInfo, setRegisterInfo] = useState(
    {
        name: "",
        email: "",
        password: "",
      
    }
   ) ;
   const [LoginError,setLoginError] = useState(null);
   const [isLoginLoading,setisLoginLoading] = useState(false);

   const [loginInfo, setLoginInfo] = useState(
    {
        email: "",
        password: "",
      
    }
   ) ;
   console.log("Userr",user);
   console.log ("loginInfo", loginInfo);


   useEffect(() => {
    const user = localStorage.getItem("User");
   
    if(user)
    {
        setUser(JSON.parse(user));
    }
   },[]);

   const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
   },[]);

   const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
   },[]);

   const registerUser = useCallback(async (e) => {
    e.preventDefault();

    setisregisterLoading(true);

    setRegisterError(null);

 const response =  await postRequest(
    `${baseUrl}/users/register`, 
    JSON.stringify(registerInfo)
);
 setisregisterLoading(false);
if(response.error)
{
   return setRegisterError(response);
}
    localStorage.setItem("User",JSON.stringify(response));
    setUser(response);
   },[registerInfo]);

const loginUser = useCallback(async (e) => {
    e.preventDefault();

    setisLoginLoading(true);
    setLoginError(null);

    const response =  await postRequest(
        `${baseUrl}/users/login`, 
        JSON.stringify(loginInfo)
    );
    if(response.error) {
       return setLoginError(response);
    }
    localStorage.setItem("User",JSON.stringify(response));
    setUser(response);
    setisLoginLoading(false);

},[loginInfo]);

const logoutUser = useCallback(() => {
    localStorage.removeItem("User");
    setUser(null);
},[]);

    return (
    <AuthContext.Provider 
    value = {{
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isregisterLoading,
        logoutUser,
        loginUser,
        loginInfo,
        LoginError,
        updateLoginInfo,
        isLoginLoading,
    }} 
    > 
    {children} 
    </AuthContext.Provider>
    );
};



