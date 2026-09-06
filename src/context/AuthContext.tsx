/**
 * AuthContext — Login, signup, password rules, guest migration, forgot password
 */
import React,{createContext,useContext,useState,useEffect,useCallback,ReactNode}from'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile{uid:string;displayName:string;email:string;createdAt:number;streak:number;level:number;totalFocusedMs:number;}
export interface AuthError{code:string;message:string;}
interface AuthCtx{user:UserProfile|null;isGuest:boolean;isLoading:boolean;login:(email:string,password:string)=>Promise<AuthError|null>;signup:(displayName:string,email:string,password:string)=>Promise<AuthError|null>;loginAsGuest:()=>Promise<void>;logout:()=>Promise<void>;updateProfile:(updates:Partial<UserProfile>)=>Promise<void>;requestPasswordReset:(email:string)=>Promise<AuthError|null>;}

const AUTH_KEY='@pomodu/auth';const GUEST_KEY='@pomodu/guest';const USERS_KEY='@pomodu/users';
const AuthContext=createContext<AuthCtx>({} as AuthCtx);
const EMAIL_RE=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function genId(){return`${Date.now()}-${Math.random().toString(36).slice(2,9)}`;}

export function validateEmail(e:string):string|null{if(!e.trim())return'Digite seu email';if(!EMAIL_RE.test(e.trim()))return'Email invalido';return null;}
export function validatePassword(p:string):string|null{
  if(!p)return'Digite sua senha';if(p.length<8)return'Minimo 8 caracteres';
  if(!/[a-z]/.test(p))return'Falta letra minuscula';if(!/[A-Z]/.test(p))return'Falta letra maiuscula';
  if(!/\d/.test(p))return'Falta numero';if(!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p))return'Falta especial';return null;
}
export function getPwdStrength(p:string):{score:number;label:string;color:string}{
  let s=0;if(p.length>=8)s++;if(p.length>=12)s++;if(/[a-z]/.test(p))s++;if(/[A-Z]/.test(p))s++;if(/\d/.test(p))s++;if(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p))s++;
  if(s<=2)return{score:s,label:'Fraca',color:'#EF4444'};if(s<=4)return{score:s,label:'Media',color:'#F59E0B'};return{score:s,label:'Forte',color:'#249c44'};
}

interface StoredUser{email:string;password:string;profile:UserProfile;}
async function getUsers():Promise<StoredUser[]>{try{const r=await AsyncStorage.getItem(USERS_KEY);return r?JSON.parse(r):[]}catch{return[]}}
async function saveUsers(u:StoredUser[]):Promise<void>{await AsyncStorage.setItem(USERS_KEY,JSON.stringify(u));}

export function AuthProvider({children}:{children:ReactNode}){
  const[user,setUser]=useState<UserProfile|null>(null);const[isGuest,setIsGuest]=useState(false);const[isLoading,setIsLoading]=useState(true);
  useEffect(()=>{(async()=>{try{const s=await AsyncStorage.getItem(AUTH_KEY);if(s){setUser(JSON.parse(s));setIsGuest(false);setIsLoading(false);return;}const g=await AsyncStorage.getItem(GUEST_KEY);if(g){setUser(JSON.parse(g));setIsGuest(true);}}catch{}setIsLoading(false);})();},[]);
  const persist=useCallback(async(u:UserProfile,g:boolean)=>{await AsyncStorage.setItem(g?GUEST_KEY:AUTH_KEY,JSON.stringify(u));},[]);

  const login=useCallback(async(email:string,password:string):Promise<AuthError|null>=>{
    setIsLoading(true);const e=validateEmail(email);if(e){setIsLoading(false);return{code:'invalid-email',message:e};}
    const users=await getUsers();const f=users.find(u=>u.email===email.trim().toLowerCase());
    if(!f){setIsLoading(false);return{code:'user-not-found',message:'Usuario nao encontrado'};}
    if(f.password!==password){setIsLoading(false);return{code:'wrong-password',message:'Senha incorreta'};}
    setUser(f.profile);setIsGuest(false);await persist(f.profile,false);await AsyncStorage.removeItem(GUEST_KEY);setIsLoading(false);return null;
  },[persist]);

  const signup=useCallback(async(dn:string,email:string,password:string):Promise<AuthError|null>=>{
    setIsLoading(true);if(!dn.trim()){setIsLoading(false);return{code:'missing-name',message:'Digite seu nome'};}
    const e=validateEmail(email);if(e){setIsLoading(false);return{code:'invalid-email',message:e};}
    const p=validatePassword(password);if(p){setIsLoading(false);return{code:'weak-password',message:p};}
    const users=await getUsers();const ne=email.trim().toLowerCase();
    if(users.find(u=>u.email===ne)){setIsLoading(false);return{code:'email-exists',message:'Email ja cadastrado'};}
    const nu:UserProfile={uid:genId(),displayName:dn.trim(),email:ne,createdAt:Date.now(),streak:0,level:1,totalFocusedMs:0};
    const gd=await AsyncStorage.getItem(GUEST_KEY);
    if(gd){const g=JSON.parse(gd);nu.totalFocusedMs=g.totalFocusedMs||0;nu.streak=g.streak||0;nu.level=g.level||1;await AsyncStorage.removeItem(GUEST_KEY);}
    users.push({email:ne,password,profile:nu});await saveUsers(users);setUser(nu);setIsGuest(false);await persist(nu,false);setIsLoading(false);return null;
  },[persist]);

  const loginAsGuest=useCallback(async()=>{setIsLoading(true);const g:UserProfile={uid:`guest-${genId()}`,displayName:'Convidado',email:'',createdAt:Date.now(),streak:0,level:1,totalFocusedMs:0};setUser(g);setIsGuest(true);await persist(g,true);setIsLoading(false);},[persist]);
  const logout=useCallback(async()=>{setUser(null);setIsGuest(false);await AsyncStorage.removeItem(AUTH_KEY);await AsyncStorage.removeItem(GUEST_KEY);},[]);
  const updateProfile=useCallback(async(u:Partial<UserProfile>)=>{if(!user)return;const n={...user,...u};setUser(n);await persist(n,isGuest);},[user,isGuest,persist]);
  const requestPasswordReset=useCallback(async(email:string):Promise<AuthError|null>=>{const e=validateEmail(email);if(e)return{code:'invalid-email',message:e};const users=await getUsers();if(!users.find(u=>u.email===email.trim().toLowerCase()))return{code:'user-not-found',message:'Email nao encontrado'};return null;},[]);

  return(<AuthContext.Provider value={{user,isGuest,isLoading,login,signup,loginAsGuest,logout,updateProfile,requestPasswordReset}}>{children}</AuthContext.Provider>);
}
export function useAuth():AuthCtx{return useContext(AuthContext);}