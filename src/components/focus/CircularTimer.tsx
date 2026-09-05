/**
 * CircularTimer — Green hero with breathing glow aura
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { Pause, Play, RotateCcw } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { PomodoroPhase } from '@/hooks/usePomodoroTimer';

const STROKE = 12; const R = 125; const SIZE = 300; const CX = SIZE/2; const CY = SIZE/2; const CIRCUM = 2*Math.PI*R;
interface Props { remainingMs:number; totalMs:number; progress:number; phase:PomodoroPhase; isRunning:boolean; onPlayPause:()=>void; onReset:()=>void; }
const presets=[{label:'15m',value:15},{label:'25m',value:25},{label:'45m',value:45},{label:'Pausa',value:5}];

export function CircularTimer({remainingMs,totalMs,progress,phase,isRunning,onPlayPause,onReset}:Props){
  const{colors}=useTheme();const offset=CIRCUM*(1-Math.min(progress,1));
  const secs=Math.max(0,Math.ceil(remainingMs/1000));
  const display=`${String(Math.floor(secs/60)).padStart(2,'0')}:${String(secs%60).padStart(2,'0')}`;
  const stopped=phase==='idle';const isLight=!colors.text.startsWith('#F');
  const pulse=useRef(new Animated.Value(0)).current;
  useEffect(()=>{
    if(isRunning){const loop=Animated.loop(Animated.sequence([Animated.timing(pulse,{toValue:1,duration:1500,easing:Easing.inOut(Easing.ease),useNativeDriver:true}),Animated.timing(pulse,{toValue:0,duration:1500,easing:Easing.inOut(Easing.ease),useNativeDriver:true})]));loop.start();return()=>loop.stop();}else pulse.setValue(0);
  },[isRunning]);
  const glow=pulse.interpolate({inputRange:[0,1],outputRange:[0.06,0.18]});

  return(
    <LinearGradient colors={[isLight?'rgba(36,156,68,0.06)':'rgba(36,156,68,0.08)','transparent']} style={[styles.glassCard,{borderColor:isLight?'rgba(0,0,0,0.06)':'rgba(255,255,255,0.08)'}]}>
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <Animated.View style={[styles.glowRing,{borderColor:colors.accent,opacity:glow}]}/>
          <Svg width={SIZE} height={SIZE} viewBox="0 0 300 300">
            <Defs><SvgGradient id="pg" x1="0%" y1="0%" x2="100%" y2="100%"><Stop offset="0%" stopColor={colors.gradientPrimary[0]}/><Stop offset="100%" stopColor={colors.gradientPrimary[1]}/></SvgGradient><SvgGradient id="gw" x1="0%" y1="0%" x2="100%" y2="100%"><Stop offset="0%" stopColor={colors.gradientPrimary[0]} stopOpacity={0.12}/><Stop offset="100%" stopColor={colors.gradientPrimary[1]} stopOpacity={0.12}/></SvgGradient></Defs>
            <Circle cx={CX} cy={CY} r={R+16} stroke="url(#gw)" strokeWidth={20} fill="none"/>
            <Circle cx={CX} cy={CY} r={R} stroke={colors.track} strokeWidth={STROKE} fill="none"/>
            <Circle cx={CX} cy={CY} r={R} stroke="url(#pg)" strokeWidth={STROKE} fill="none" strokeDasharray={CIRCUM} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90,${CX},${CY})`}/>
          </Svg>
          <View style={styles.label}><Text numberOfLines={1} style={[styles.time,{color:colors.text,opacity:stopped?0.5:1}]}>{display}</Text><Text style={[styles.sub,{color:colors.textMuted}]}>{stopped?'ready to focus':'stay present'}</Text></View>
        </View>
        <View style={styles.controlsRow}>
          <TouchableOpacity onPress={onPlayPause} activeOpacity={0.8} style={[styles.playBtn,{backgroundColor:colors.accent,shadowColor:colors.accent}]}>{isRunning?<Pause size={28} color="#fff" fill="#fff"/>:<Play size={28} color="#fff" fill="#fff" style={{marginLeft:2}}/>}</TouchableOpacity>
          <TouchableOpacity onPress={onReset} activeOpacity={0.7} style={styles.resetBtn}><RotateCcw size={18} color={colors.textMuted}/></TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles=StyleSheet.create({
  glassCard:{marginHorizontal:-8,padding:12,borderRadius:28,borderWidth:1,marginBottom:8},
  wrapper:{alignItems:'center',gap:16},container:{width:SIZE,height:SIZE,alignItems:'center',justifyContent:'center'},
  glowRing:{position:'absolute',width:280,height:280,borderRadius:140,borderWidth:8},
  label:{position:'absolute',alignItems:'center',width:220},time:{fontSize:64,fontWeight:'800',fontVariant:['tabular-nums'],letterSpacing:2,textAlign:'center'},sub:{fontSize:13,marginTop:4,letterSpacing:1},
  controlsRow:{flexDirection:'row',alignItems:'center',gap:20,marginTop:4},playBtn:{width:64,height:64,borderRadius:32,alignItems:'center',justifyContent:'center',shadowOffset:{width:0,height:6},shadowOpacity:0.4,shadowRadius:16,elevation:8},resetBtn:{width:40,height:40,borderRadius:20,alignItems:'center',justifyContent:'center'},
  presets:{flexDirection:'row',gap:8},chip:{paddingHorizontal:18,paddingVertical:7,borderRadius:999,borderWidth:1},chipText:{fontSize:13,fontWeight:'600'},
});