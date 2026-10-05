/**
 * CircularTimer — Green hero with breathing glow aura
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, useWindowDimensions } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { Pause, Play, RotateCcw } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { PomodoroPhase } from '@/hooks/usePomodoroTimer';

const STROKE = 12; const R = 125; const SIZE = 300; const CX = SIZE/2; const CY = SIZE/2; const CIRCUM = 2*Math.PI*R;
interface Props { remainingMs:number; totalMs:number; progress:number; phase:PomodoroPhase; isRunning:boolean; onPlayPause:()=>void; onReset:()=>void; }
const presets=[{label:'15m',value:15},{label:'25m',value:25},{label:'45m',value:45},{label:'Pausa',value:5}];

export function CircularTimer({remainingMs,totalMs,progress,phase,isRunning,onPlayPause,onReset}:Props){
  const{colors,isDark}=useTheme();const{width}=useWindowDimensions();const size=Math.min(SIZE,Math.max(220,width-72));const offset=CIRCUM*(1-Math.min(progress,1));
  const secs=Math.max(0,Math.ceil(remainingMs/1000));
  const display=`${String(Math.floor(secs/60)).padStart(2,'0')}:${String(secs%60).padStart(2,'0')}`;
  const stopped=phase==='idle';const isLight=!isDark;
  const pulse=useRef(new Animated.Value(0)).current;
  useEffect(()=>{
    if(isRunning){const loop=Animated.loop(Animated.sequence([Animated.timing(pulse,{toValue:1,duration:1500,easing:Easing.inOut(Easing.ease),useNativeDriver:true}),Animated.timing(pulse,{toValue:0,duration:1500,easing:Easing.inOut(Easing.ease),useNativeDriver:true})]));loop.start();return()=>loop.stop();}else pulse.setValue(0);
  },[isRunning]);
  const glow=pulse.interpolate({inputRange:[0,1],outputRange:[0.06,0.18]});

  return(
    <LinearGradient colors={[isLight?'rgba(33,131,58,0.08)':'rgba(73,209,107,0.09)','transparent']} style={[styles.glassCard,{borderColor:colors.border}]}>
      <View style={styles.wrapper}>
        <View style={[styles.container,{width:size,height:size}]}>
          <Animated.View style={[styles.glowRing,{borderColor:colors.accent,opacity:glow}]}/>
          <Svg width={SIZE} height={SIZE} viewBox="0 0 300 300">
            <Defs><SvgGradient id="pg" x1="0%" y1="0%" x2="100%" y2="100%"><Stop offset="0%" stopColor={colors.gradientPrimary[0]}/><Stop offset="100%" stopColor={colors.gradientPrimary[1]}/></SvgGradient><SvgGradient id="gw" x1="0%" y1="0%" x2="100%" y2="100%"><Stop offset="0%" stopColor={colors.gradientPrimary[0]} stopOpacity={0.12}/><Stop offset="100%" stopColor={colors.gradientPrimary[1]} stopOpacity={0.12}/></SvgGradient></Defs>
            <Circle cx={CX} cy={CY} r={R+16} stroke="url(#gw)" strokeWidth={20} fill="none"/>
            <Circle cx={CX} cy={CY} r={R} stroke={colors.track} strokeWidth={STROKE} fill="none"/>
            <Circle cx={CX} cy={CY} r={R} stroke="url(#pg)" strokeWidth={STROKE} fill="none" strokeDasharray={CIRCUM} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90,${CX},${CY})`}/>
          </Svg>
          <View style={styles.label}><Text numberOfLines={1} adjustsFontSizeToFit style={[styles.time,{color:colors.text,opacity:stopped?0.62:1,fontSize:size*0.215}]}>{display}</Text><Text style={[styles.sub,{color:colors.textMuted}]}>{stopped?'pronto para focar':'presente neste momento'}</Text></View>
        </View>
        <View style={styles.controlsRow}>
          <TouchableOpacity onPress={onPlayPause} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel={isRunning?'Pausar sessão':'Iniciar sessão'} style={[styles.playBtn,{backgroundColor:colors.accent,shadowColor:colors.accent}]}>{isRunning?<Pause size={28} color={colors.onAccent} fill={colors.onAccent}/>:<Play size={28} color={colors.onAccent} fill={colors.onAccent} style={{marginLeft:2}}/>}</TouchableOpacity>
          <TouchableOpacity onPress={onReset} activeOpacity={0.7} accessibilityRole="button" accessibilityLabel="Reiniciar temporizador" style={[styles.resetBtn,{backgroundColor:colors.surfaceAlt}]}><RotateCcw size={18} color={colors.textMuted}/></TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles=StyleSheet.create({
  glassCard:{marginHorizontal:-8,padding:10,borderRadius:28,borderWidth:1,marginBottom:8},
  wrapper:{alignItems:'center',gap:12},container:{alignItems:'center',justifyContent:'center'},
  glowRing:{position:'absolute',width:280,height:280,borderRadius:140,borderWidth:8},
  label:{position:'absolute',alignItems:'center',width:'78%'},time:{fontWeight:'800',fontVariant:['tabular-nums'],letterSpacing:1,textAlign:'center',fontFamily:'Sora_600SemiBold'},sub:{fontSize:11,marginTop:5,letterSpacing:0.4},
  controlsRow:{flexDirection:'row',alignItems:'center',gap:20,marginTop:2},playBtn:{width:60,height:60,borderRadius:30,alignItems:'center',justifyContent:'center',shadowOffset:{width:0,height:6},shadowOpacity:0.32,shadowRadius:16,elevation:8},resetBtn:{width:40,height:40,borderRadius:20,alignItems:'center',justifyContent:'center'},
  presets:{flexDirection:'row',gap:8},chip:{paddingHorizontal:18,paddingVertical:7,borderRadius:999,borderWidth:1},chipText:{fontSize:13,fontWeight:'600'},
});