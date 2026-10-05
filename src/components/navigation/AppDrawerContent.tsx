/**
 * Drawer — Perfil real, logout, tema, metricas
 */
import React,{useEffect,useState}from'react';import{View,Text,TouchableOpacity,StyleSheet,Image}from'react-native';
import{useSafeAreaInsets}from'react-native-safe-area-context';import{router}from'expo-router';
import{Timer,ListTodo,MapPin,Settings,Sun,Moon,Flame,Target,Clock,LogOut}from'lucide-react-native';
import{useTheme}from'@/context/ThemeContext';import{useAuth}from'@/context/AuthContext';
import{calculateStreak,getTotalFocusedMs,getTodaySessionCount}from'@/services/sessionService';
const menu=[{label:'Foco',route:'index',icon:Timer},{label:'Tarefas',route:'tasks',icon:ListTodo},{label:'Progresso',route:'insights',icon:MapPin},{label:'Ajustes',route:'settings',icon:Settings}];

export function AppDrawerContent(props:any){
  const{colors,isDark,toggleTheme}=useTheme();const{user,logout}=useAuth();const insets=useSafeAreaInsets();
  const{state,navigation}=props;const active=state.routes[state.index]?.name;
  const[streak,setStreak]=useState(0);const[totalHrs,setTotalHrs]=useState('0h');const[todaySess,setTodaySess]=useState(0);
  useEffect(()=>{(async()=>{try{const[s,t,d]=await Promise.all([calculateStreak(),getTotalFocusedMs(),getTodaySessionCount()]);setStreak(s);setTotalHrs(`${Math.round(t/3600000)}h`);setTodaySess(d);}catch(error){console.error('[AppDrawerContent] load profile metrics',error);}})();},[]);
  const handleLogout=async()=>{await logout();router.replace('/(auth)/login');};
  const stats=[{icon:Flame,value:String(streak),label:'Dias'},{icon:Clock,value:totalHrs,label:'Foco'},{icon:Target,value:String(todaySess),label:'Hoje'}];
  const name=user?.displayName||'Convidado';const level=user?.level||1;

  return(
    <View style={[styles.c,{backgroundColor:colors.background,paddingTop:insets.top}]}>
      <View style={[styles.p,{backgroundColor:colors.surface,borderColor:colors.border}]}>
        <View style={styles.arow}><View style={[styles.av,{borderColor:colors.accent}]}>
            <Image source={require('../../../assets/images/brand/logo.png')} style={{width:28,height:28,borderRadius:14,resizeMode:'cover'}} />
          </View>
          <View style={{flex:1}}><Text style={[styles.n,{color:colors.text}]} numberOfLines={1}>{name}</Text><Text style={[styles.b,{color:colors.textMuted}]}>Nível {level}</Text></View>
        </View>
        <View style={[styles.div,{backgroundColor:colors.border}]}/>
        <View style={styles.srow}>{stats.map(s=>(
          <View key={s.label} style={styles.st}><s.icon size={14} color={colors.accent}/><Text style={[styles.sv,{color:colors.text}]}>{s.value}</Text><Text style={[styles.sl,{color:colors.textMuted}]}>{s.label}</Text></View>
        ))}</View>
      </View>
      <View style={styles.m}>{menu.map(i=>{
        const ia=active===i.route;const Ic=i.icon;
        return(<TouchableOpacity key={i.route} style={[styles.mi,ia&&{backgroundColor:colors.accentSoft}]} onPress={()=>{navigation.navigate(i.route as any);navigation.closeDrawer();}} activeOpacity={0.7} accessibilityRole="button" accessibilityState={{selected:ia}}>
          <Ic size={20} color={ia?colors.accent:colors.textMuted} strokeWidth={ia?2:1.5}/>
          <Text style={[styles.ml,{color:ia?colors.accent:colors.textMuted,fontWeight:ia?'700':'400'}]}>{i.label}</Text>
        </TouchableOpacity>);
      })}</View>
      <View style={[styles.bt,{paddingBottom:insets.bottom+16}]}>
        <View style={[styles.div,{backgroundColor:colors.border}]}/>
        <TouchableOpacity style={styles.trow} onPress={toggleTheme} activeOpacity={0.7} accessibilityRole="button" accessibilityLabel={isDark?'Usar tema claro':'Usar tema escuro'}>
          <View style={[styles.ti,{backgroundColor:isDark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.04)'}]}>{isDark?<Sun size={16} color={colors.textMuted}/>:<Moon size={16} color={colors.textMuted}/>}</View>
          <Text style={[styles.tt,{color:colors.textMuted}]}>{isDark?'Usar tema claro':'Usar tema escuro'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.trow} onPress={handleLogout} activeOpacity={0.7} accessibilityRole="button">
          <LogOut size={16} color={colors.textMuted}/><Text style={[styles.tt,{color:colors.textMuted}]}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles=StyleSheet.create({
  c:{flex:1},p:{marginHorizontal:16,marginTop:18,marginBottom:22,padding:16,borderRadius:22,borderWidth:1,gap:15},arow:{flexDirection:'row',alignItems:'center',gap:12},
  av:{width:46,height:46,borderRadius:16,borderWidth:1.5,alignItems:'center',justifyContent:'center',overflow:'hidden'},n:{fontSize:15,fontWeight:'700'},b:{fontSize:11,fontWeight:'500',marginTop:3},div:{height:1},
  srow:{flexDirection:'row',justifyContent:'space-between'},st:{alignItems:'center',gap:4},sv:{fontSize:16,fontWeight:'700'},sl:{fontSize:10,fontWeight:'500'},
  m:{flex:1,paddingHorizontal:16,gap:5},
  mi:{flexDirection:'row',alignItems:'center',gap:13,paddingVertical:13,paddingHorizontal:14,borderRadius:14},ml:{fontSize:14,letterSpacing:-0.1},
  bt:{paddingHorizontal:16,gap:16},trow:{flexDirection:'row',alignItems:'center',gap:12,paddingVertical:8},
  ti:{width:34,height:34,borderRadius:12,alignItems:'center',justifyContent:'center'},tt:{fontSize:13,fontWeight:'500'},
});