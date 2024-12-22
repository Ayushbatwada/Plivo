import {createContext, useEffect, useState} from "react";
import useStorage from "./useStorage";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [userInfo, setUserInfo] = useState({});
    const storageService = useStorage();

    useEffect(() => {
        const userData = storageService.getItem();
        if (userData) {
            setUserInfo(userData);
        }
    }, []);

    return (
        <AuthContext.Provider value={{userInfo, setUserInfo}}>
            {children}
        </AuthContext.Provider>
    );
};
