/**
 * Drawer — Perfil real, logout, tema, metricas
 */
import React,{useEffect,useState}from'react';import{View,Text,TouchableOpacity,StyleSheet,Image}from'react-native';
import{useSafeAreaInsets}from'react-native-safe-area-context';import{router}from'expo-router';
import{Timer,ListTodo,MapPin,Settings,Sun,Moon,Flame,Target,Clock,LogOut}from'lucide-react-native';
import{useTheme}from'@/context/ThemeContext';import{useAuth}from'@/context/AuthContext';
import{calculateStreak,getTotalFocusedMs,getTodaySessionCount}from'@/services/sessionService';
const menu=[{label:'Foco',route:'index',icon:Timer},{label:'Tarefas',route:'tasks',icon:ListTodo},{label:'Metricas',route:'insights',icon:MapPin},{label:'Configuracoes',route:'settings',icon:Settings}];

export function AppDrawerContent(props:any){
  const{colors,isDark,toggleTheme}=useTheme();const{user,logout}=useAuth();const insets=useSafeAreaInsets();
  const{state,navigation}=props;const active=state.routes[state.index]?.name;
  const[streak,setStreak]=useState(0);const[totalHrs,setTotalHrs]=useState('0h');const[todaySess,setTodaySess]=useState(0);
  useEffect(()=>{(async()=>{try{const[s,t,d]=await Promise.all([calculateStreak(),getTotalFocusedMs(),getTodaySessionCount()]);setStreak(s);setTotalHrs(`${Math.round(t/3600000)}h`);setTodaySess(d);}catch{}})();},[]);
  const handleLogout=async()=>{await logout();router.replace('/(auth)/login');};
  const stats=[{icon:Flame,value:String(streak),label:'Streak'},{icon:Clock,value:totalHrs,label:'Foco'},{icon:Target,value:String(todaySess),label:'Hoje'}];
  const name=user?.displayName||'Convidado';const level=user?.level||1;

  return(
    <View style={[styles.c,{backgroundColor:colors.background,paddingTop:insets.top}]}>
      <View style={[styles.p,{backgroundColor:colors.surface,borderColor:colors.border}]}>
        <View style={styles.arow}><View style={[styles.av,{borderColor:colors.accent}]}>
            <Image source={require('../../../assets/images/brand/logo.png')} style={{width:28,height:28,borderRadius:14,resizeMode:'cover'}} />
          </View>
          <View style={{flex:1}}><Text style={[styles.n,{color:colors.text}]}>{name}</Text><Text style={[styles.b,{color:colors.textMuted}]}>Level {level} Focus Master</Text></View>
        </View>
        <View style={[styles.div,{backgroundColor:colors.border}]}/>
        <View style={styles.srow}>{stats.map(s=>(
          <View key={s.label} style={styles.st}><s.icon size={14} color={colors.accent}/><Text style={[styles.sv,{color:colors.text}]}>{s.value}</Text><Text style={[styles.sl,{color:colors.textMuted}]}>{s.label}</Text></View>
        ))}</View>
        <View style={[styles.xp,{backgroundColor:colors.track}]}><View style={[styles.xf,{backgroundColor:colors.accent,width:`${Math.min((level%10)*10,100)}%`}]}/></View>
      </View>
      <View style={styles.m}>{menu.map(i=>{
        const ia=active===i.route;const Ic=i.icon;
        return(<TouchableOpacity key={i.route} style={[styles.mi,ia&&{backgroundColor:colors.accentSoft}]} onPress={()=>{navigation.navigate(i.route as any);navigation.closeDrawer();}} activeOpacity={0.6}>
          <Ic size={20} color={ia?colors.accent:colors.textMuted} strokeWidth={ia?2:1.5}/>
          <Text style={[styles.ml,{color:ia?colors.accent:colors.textMuted,fontWeight:ia?'700':'400'}]}>{i.label}</Text>
        </TouchableOpacity>);
      })}</View>
      <View style={[styles.bt,{paddingBottom:insets.bottom+16}]}>
        <View style={[styles.div,{backgroundColor:colors.border}]}/>
        <TouchableOpacity style={styles.trow} onPress={toggleTheme} activeOpacity={0.6}>
          <View style={[styles.ti,{backgroundColor:isDark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.04)'}]}>{isDark?<Sun size={16} color={colors.textMuted}/>:<Moon size={16} color={colors.textMuted}/>}</View>
          <Text style={[styles.tt,{color:colors.textMuted}]}>{isDark?'Light Mode':'Dark Mode'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.trow} onPress={handleLogout} activeOpacity={0.6}>
          <LogOut size={16} color={colors.textMuted}/><Text style={[styles.tt,{color:colors.textMuted}]}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles=StyleSheet.create({
  c:{flex:1},p:{margin:16,padding:16,borderRadius:24,borderWidth:1,gap:16},arow:{flexDirection:'row',alignItems:'center',gap:12},
  av:{width:44,height:44,borderRadius:22,borderWidth:2,alignItems:'center',justifyContent:'center'},n:{fontSize:17,fontWeight:'700'},b:{fontSize:12,fontWeight:'500',marginTop:1},div:{height:1},
  srow:{flexDirection:'row',justifyContent:'space-between'},st:{alignItems:'center',gap:3},sv:{fontSize:17,fontWeight:'700'},sl:{fontSize:11,fontWeight:'500'},
  xp:{height:4,borderRadius:2,overflow:'hidden'},xf:{height:'100%',borderRadius:2},m:{flex:1,paddingHorizontal:16,gap:4},
  mi:{flexDirection:'row',alignItems:'center',gap:12,paddingVertical:14,paddingHorizontal:14,borderRadius:14},ml:{fontSize:16,letterSpacing:-0.2},
  bt:{paddingHorizontal:16,gap:16},trow:{flexDirection:'row',alignItems:'center',gap:12,paddingVertical:8},
  ti:{width:32,height:32,borderRadius:16,alignItems:'center',justifyContent:'center'},tt:{fontSize:14,fontWeight:'500'},
});