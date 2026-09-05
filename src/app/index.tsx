/**
 * Focus Screen — Timer + Flip sensor + GPS logging on session complete
 */
import React,{useState,useCallback,useEffect}from'react';
import{View,Text,StyleSheet,StatusBar,ScrollView,TouchableOpacity}from'react-native';
import{useSafeAreaInsets}from'react-native-safe-area-context';import{LinearGradient}from'expo-linear-gradient';
import*as Haptics from'expo-haptics';
import{Target,MapPin,Flame,Smartphone}from'lucide-react-native';
import{useTheme}from'@/context/ThemeContext';import{useSettings}from'@/context/SettingsContext';
import{SPACING}from'@/constants/theme';
import{useFlipDetector}from'@/hooks/useFlipDetector';import{usePomodoroTimer}from'@/hooks/usePomodoroTimer';
import{useTasks}from'@/hooks/useTasks';import{useLocations}from'@/hooks/useLocations';
import{ScreenHeader}from'@/components/navigation/ScreenHeader';import{SessionBadge}from'@/components/focus/SessionBadge';
import{CircularTimer}from'@/components/focus/CircularTimer';import{CurrentTaskCard}from'@/components/focus/CurrentTaskCard';
import{FooterStatus}from'@/components/focus/FooterStatus';import{TaskPickerModal}from'@/components/focus/TaskPickerModal';
import{Button}from'@/components/ui/Button';import{Task}from'@/types';
import{createSession}from'@/services/sessionService';import{addFocusedTime}from'@/services/taskService';

export default function FocusScreen(){
  const insets=useSafeAreaInsets();const{colors,isDark}=useTheme();
  const{settings,updateSettings}=useSettings();
  const timer=usePomodoroTimer({requireFlipToRun:true,focusMinutes:settings.focusMinutes,shortBreakMinutes:settings.shortBreakMinutes,longBreakMinutes:settings.longBreakMinutes,cyclesBeforeLongBreak:settings.cyclesBeforeLongBreak});
  const{isFaceDown}=useFlipDetector({onLift:()=>{if(timer.isRunning)Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);},onFaceDown:()=>{Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).then(()=>Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy));}});
  const{tasks,refresh}=useTasks();const{locations,resolveLocation}=useLocations();
  const[showTaskPicker,setShowTaskPicker]=useState(false);const[linkedTask,setLinkedTask]=useState<Task|null>(null);

  useEffect(()=>{timer.setFlipState(isFaceDown);},[isFaceDown]);
  useEffect(()=>{if(isFaceDown&&timer.phase==='idle')timer.start();},[isFaceDown,timer.phase]);

  const handleSessionComplete=useCallback(async(actualMs:number)=>{
    const loc=await resolveLocation();
    await createSession({taskId:linkedTask?.id??null,startAt:Date.now()-actualMs,endAt:Date.now(),durationMs:timer.totalMs,actualMs,locationId:loc.locationId,interrupted:false});
    if(linkedTask){await addFocusedTime(linkedTask.id,actualMs);await refresh();}
  },[linkedTask,timer.totalMs,refresh,resolveLocation]);

  useEffect(()=>{if(timer.phase!=='focusing'&&timer.remainingMs===0)handleSessionComplete(timer.totalMs);},[timer.phase,timer.remainingMs]);

  const locationName=locations.length>0?locations[0].name:'Nao definido';
  const doneToday=tasks.filter(t=>t.status==='done').length;const totalToday=tasks.length;
  const pomoProgress=totalToday>0?doneToday/totalToday:0;
  const handlePreset=(m:number)=>updateSettings({focusMinutes:m});
  const isLight=!colors.text.startsWith('#F');const bg=isLight?'rgba(0,0,0,0.04)':'rgba(255,255,255,0.05)';

  return(
    <View style={[styles.container,{backgroundColor:colors.background,paddingTop:insets.top,paddingBottom:Math.max(insets.bottom,24)}]}>
      <StatusBar barStyle={isDark?'light-content':'dark-content'}/>
      <ScreenHeader title="Pomodu">
        <View style={{flexDirection:'row',gap:8,alignItems:'center'}}>
          <View style={[styles.liveBadge,{backgroundColor:colors.accentSoft}]}><Flame size={11} color={colors.accent}/><Text style={[styles.liveText,{color:colors.accent}]}>128</Text></View>
          <Button title="" variant="ghost" size="sm" onPress={()=>setShowTaskPicker(true)} icon={<Target size={16} color={colors.textMuted}/>}/>
        </View>
      </ScreenHeader>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:SPACING.xl}}>
        <View style={styles.topBadges}>
          <View style={[styles.badge,{backgroundColor:bg}]}><Smartphone size={11} color={isFaceDown?colors.accent:colors.textMuted}/>
            <Text style={[styles.badgeText,{color:isFaceDown?colors.accent:colors.textMuted}]}>{isFaceDown?'Focando':'Vire para focar'}</Text></View>
          <View style={[styles.badge,{backgroundColor:bg}]}><MapPin size={11} color={colors.textMuted}/><Text style={[styles.badgeText,{color:colors.textMuted}]}>{locationName}</Text></View>
        </View>
        <View style={styles.badgeArea}><SessionBadge phase={timer.phase}/></View>
        <View style={styles.heroArea}>
          <CircularTimer remainingMs={timer.remainingMs} totalMs={timer.totalMs} progress={timer.progress} phase={timer.phase}
            isRunning={timer.isRunning} onPlayPause={()=>{if(timer.phase==='idle')timer.start();else if(timer.isRunning)timer.pause();else timer.resume();}}
            onReset={timer.reset} />
        </View>
        <View style={[styles.dailyWidget,{backgroundColor:colors.surface,borderColor:colors.border}]}>
          <View style={styles.dailyHeader}><Target size={14} color={colors.accent}/>
            <Text style={[styles.dailyLabel,{color:colors.text}]}>Meta de hoje</Text>
            <Text style={[styles.dailyCount,{color:colors.textMuted}]}>{doneToday}/{totalToday} pomodoros</Text>
          </View>
          <View style={[styles.dailyBar,{backgroundColor:colors.track}]}>
            <LinearGradient colors={colors.gradientPrimary} style={[styles.dailyBarFill,{width:`${Math.min(pomoProgress*100,100)}%`}]}/>
          </View>
        </View>
        <CurrentTaskCard title={linkedTask?.title??'No task linked'} category="Design" session={timer.cycle+1} totalSessions={4}/>
        <FooterStatus isFaceDown={isFaceDown} locationName={locationName}/>
      </ScrollView>
      <TaskPickerModal visible={showTaskPicker} tasks={tasks.filter(t=>t.status!=='done')}
        onSelect={(task:Task)=>{setLinkedTask(task);setShowTaskPicker(false);}} onClose={()=>setShowTaskPicker(false)}/>
    </View>
  );
}

const styles=StyleSheet.create({
  container:{flex:1,paddingHorizontal:SPACING.lg},topBadges:{flexDirection:'row',justifyContent:'center',gap:8,paddingVertical:4},
  badge:{flexDirection:'row',alignItems:'center',gap:4,paddingHorizontal:10,paddingVertical:4,borderRadius:999},badgeText:{fontSize:11,fontWeight:'500'},
  liveBadge:{flexDirection:'row',alignItems:'center',gap:3,paddingHorizontal:8,paddingVertical:4,borderRadius:999},liveText:{fontSize:11,fontWeight:'700'},
  badgeArea:{paddingVertical:8,alignItems:'center'},heroArea:{alignItems:'center',paddingVertical:4},
  soundRow:{flexDirection:'row',alignItems:'center',gap:6,justifyContent:'center',paddingVertical:8,marginBottom:4},
  soundChip:{paddingHorizontal:12,paddingVertical:5,borderRadius:999,borderWidth:1},soundText:{fontSize:11},
  dailyWidget:{padding:16,borderRadius:24,borderWidth:1,gap:12,marginBottom:16},
  dailyHeader:{flexDirection:'row',alignItems:'center',gap:6},dailyLabel:{fontSize:14,fontWeight:'600'},dailyCount:{fontSize:12,marginLeft:'auto'},
  dailyBar:{height:6,borderRadius:3,overflow:'hidden'},dailyBarFill:{height:'100%',borderRadius:3},
});