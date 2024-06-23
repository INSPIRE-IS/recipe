import {createContext, useContext, useEffect, useState} from 'react';
import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';
import loginJS from '../assets/login.json';

interface AuthProps{
    authState?: {
        ipcUserID: string | null;
        ipcPword: string | null;
        tt_br: string | null;
        cType: string | null;
        token: string | null; 
        isLoaded: boolean | null;
        authenticated: boolean | null
    };
    //onRegister?: (ipcUserID: string, ipcPword: string) => Promise<any>;
    onUpdate?: (ctype: string) => Promise<any>;
    onLogin?: (ipcUserID: string, ipcPword: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

export const TOKEN_KEY = 'MyJWT';
export const AUTH_STATE = 'AuthUser';
// export const API_URL = process.env.EXPO_PUBLIC_API_URL;
export const API_URL = "";
const AuthContext = createContext<AuthProps>({});
//axios.defaults.headers.common['ResponseType'] = 'application/json';
//axios.defaults.headers.common['dataType'] = 'json';

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({children}: any) =>{
    const [authState, setAuthState] = useState<{
        ipcUserID: string | null;
        ipcPword: string | null;
        tt_br: string | null;
        cType: string | null;
        token: string | null;
        isLoaded: boolean | null;
        authenticated: boolean | null;
    }>({
        ipcUserID: null,
        ipcPword: null,
        tt_br: null,
        cType: null,
        token: null,
        isLoaded: null,
        authenticated: null,
    });


    useEffect(() => {
        console.log("auth: ",);
        const loadToken = async () => {
            const token =  await AsyncStorage.getItem(TOKEN_KEY);
            const user = await AsyncStorage.getItem(AUTH_STATE);

            console.log("stored: ",token);

            if(token && user){
                const user_detail = JSON.parse(user);
                const ipcUserID = user_detail.tt_user;
                const ipcPword = user_detail.tt_pass; 
                const tt_br = user_detail.tt_br;
                //axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setAuthState({
                    ipcUserID: ipcUserID,
                    ipcPword: ipcPword,
                    tt_br: tt_br,
                    cType: 'CSR',
                    token: token,
                    isLoaded: true,
                    authenticated: true
                });
            }else{
                console.log("err token: ");
                setAuthState({
                    ipcUserID: null,
                    ipcPword: null,
                    tt_br: null,
                    cType: null,
                    token: null,
                    isLoaded: true,
                    authenticated: false
                });
            }
        };
         loadToken();
    }, []);
    // not used
    // const register = async (ipcUserID: string, ipcPword: string) => {
    //     try{
    //         console.log('register');
    //         return await axios.post(`${API_URL}/users`, {ipcUserID, ipcPword});
    //     }catch(e){
    //         return {error: true, msg: (e as any).response.data.msg};
    //     }
    // };
    const updateType = async (ctype: string) => {
        const authUser = await AsyncStorage.getItem(AUTH_STATE);
        if(authUser != undefined){
            const user = JSON.parse(authUser);
            setAuthState({
                ipcUserID: user['ipcUserID'],//result.data["tt-user"],
                ipcPword: user['ipcPword'],
                tt_br: user['tt_br'],//result.data["tt-br"],
                cType: ctype,//result.data["tt-br"],
                token: user['token'],//result.data.token,
                isLoaded: true,
                authenticated: true
            });
            await AsyncStorage.setItem(AUTH_STATE, JSON.stringify({
                ipcUserID: user['ipcUserID'],
                ipcPword: user['ipcPword'],
                tt_br: user['tt_br'],
                cType: ctype,
                token: user['token'],
                isLoaded: true,
                authenticated: true
            }));
            
            return true; 
        }else{
            return false;
        }
    }

    const login = async (ipcUserID: string, ipcPword: string) => {

        console.log('auth login');
        // inMobilogin?ipcUserID=devatstbn&ipcPword=steve
        try{
            //const result = await loginJS;
            console.log('auth login');

            //const ipcType = "CSR";
            ipcUserID = 'devatstbn'; // or devatstbc
            ipcPword = 'steve';
            //const tt_br = "BN";
            //let login_url = `${API_URL}inMobilogin?ipcUserID=${ipcUserID}&ipcPword=${ipcPword}`; 

            // should be a post and return a token not the data
            //const result = await axios.post(`${API_URL}/auth`, {email, password}); `${API_URL}/rest/MidasMobiGoService/outPOD?ipcUserID=${ipcUserID}&ipcPword=${ipcPword}&ipcType=${ipcType}`
            //const results = await axios.get(`${API_URL}inMobilogin?ipcUserID=${ipcUserID}&ipcPword=${ipcPword}`);
            const results = await axios.get(`${API_URL}inMobilogin?ipcUserID=${ipcUserID}&ipcPword=${ipcPword}`);
            console.log(results);
            // [{"tt-user":"devatstbn","tt-br":"BN","tt-result":"200 - Login Succesful"}]

            if(results){
                setAuthState({
                    ipcUserID: ipcUserID,
                    ipcPword: ipcPword,
                    tt_br: results.data[0]['tt-br'],
                    cType: 'CSR',//set to POD initially
                    token: results.data[0]['tt-user'] + '-' + results.data[0]['tt-br'],//result.data.token,
                    isLoaded: true,
                    authenticated: true
                });

                //axios.defaults.headers.common['Authorization'] = 'Bearer NoTokenFromServerYet'; // `Bearer ${result.data.token}`;
                //await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
                await AsyncStorage.setItem(TOKEN_KEY, 'NoTokenFromServerYet');
                await AsyncStorage.setItem(AUTH_STATE, JSON.stringify({
                    ipcUserID: ipcUserID,
                    ipcPword: ipcPword,
                    tt_br: results.data[0]['tt-br'],
                    cType: 'CSR',//set to POD initially
                    token: results.data[0]['tt-user'] + '-' + results.data[0]['tt-br'],
                    isLoaded: true,
                    authenticated: true
                }));
                
                return results;                
            }
        }catch(e){
            console.log(JSON.stringify(e));
            return {error: true, msg: 'auth error'};
            // return {error: true, msg: (e as any).response.data.msg};
            // return {error: true, msg: (e as any).response.data.msg};
        }
    };

    const logout = async () => {
        await AsyncStorage.multiRemove([TOKEN_KEY,AUTH_STATE,"ListItems","ListItem","ItemDetail","Detail","PartDetail"]);
        //axios.defaults.headers.common['Authorization'] = '';
        console.log("logout");
        setAuthState({
            ipcUserID: null,
            ipcPword: null,
            tt_br: null,
            cType: null,
            token: null,
            isLoaded: true,
            authenticated: false
        });
        return true;
    };

    const value = {
        //onRegister: register,
        onUpdate: updateType,
        onLogin: login,
        onLogout: logout,
        authState
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}


