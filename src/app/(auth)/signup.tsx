/**
 * Sign Up — With password strength meter, email validation, strong password rules
 */
import React,{useState}from'react';
import{View,Text,TextInput,TouchableOpacity,StyleSheet,StatusBar,KeyboardAvoidingView,Platform,ScrollView,ActivityIndicator}from'react-native';
import{useSafeAreaInsets}from'react-native-safe-area-context';import{LinearGradient}from'expo-linear-gradient';
import{Eye,EyeOff,UserPlus}from'lucide-react-native';import{router}from'expo-router';
import{useTheme}from'@/context/ThemeContext';import{useAuth,validatePassword,getPwdStrength}from'@/context/AuthContext';
import{PomoduBrandLockup}from'@/components/brand/PomoduBrandLockup';

export default function SignupScreen(){
  const insets=useSafeAreaInsets();const{colors,isDark,fontBody}=useTheme();
  const{signup,isLoading}=useAuth();
  const[displayName,setDisplayName]=useState('');const[email,setEmail]=useState('');const[password,setPassword]=useState('');
  const[showPassword,setShowPassword]=useState(false);const[error,setError]=useState('');

  const strength=getPwdStrength(password);
  const strengthColor=strength.score<=2?(isDark?'#FF776A':'#B9382C'):strength.score<=4?(isDark?'#E8AE50':'#94600A'):colors.accent;
  const passErr=password?validatePassword(password):null;

  const handleSignup=async()=>{
    setError('');
    if(!displayName.trim()){setError('Digite seu nome');return;}
    if(!email.trim()){setError('Digite seu email');return;}
    const result=await signup(displayName.trim(),email.trim(),password);
    if(result)setError(result.message);
    else router.replace('/');
  };

  return(
    <KeyboardAvoidingView style={[styles.container,{backgroundColor:colors.background}]} behavior={Platform.OS==='ios'?'padding':'height'}>
      <StatusBar barStyle={isDark?'light-content':'dark-content'}/>
      <ScrollView contentContainerStyle={[styles.scroll,{paddingTop:insets.top+32,paddingBottom:insets.bottom+32}]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.brandSection}><PomoduBrandLockup size={32} textSize={22}/><Text style={[styles.eyebrow,{color:colors.accent}]}>UM PASSO DE CADA VEZ</Text><Text style={[styles.title,{color:colors.text,fontFamily:'Sora_600SemiBold'}]}>Seu foco começa aqui.</Text><Text style={[styles.slogan,{color:colors.textMuted}]}>Crie sua conta e faça espaço para o que importa.</Text></View>
        <View style={styles.form}>
          <TextInput style={[styles.input,{backgroundColor:colors.surfaceAlt,color:colors.text,borderColor:colors.border}]} placeholder="Nome completo" placeholderTextColor={colors.textMuted} value={displayName} onChangeText={setDisplayName} autoCapitalize="words" autoComplete="name" accessibilityLabel="Nome completo"/>
          <TextInput style={[styles.input,{backgroundColor:colors.surfaceAlt,color:colors.text,borderColor:colors.border}]} placeholder="E-mail" placeholderTextColor={colors.textMuted} value={email} onChangeText={setEmail} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" autoComplete="email" accessibilityLabel="E-mail"/>
          <View style={styles.passwordRow}>
            <TextInput style={[styles.input,styles.passwordInput,{backgroundColor:colors.surfaceAlt,color:colors.text,borderColor:colors.border}]} placeholder="Senha (mínimo 8 caracteres)" placeholderTextColor={colors.textMuted} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} autoComplete="new-password" accessibilityLabel="Senha"/>
            <TouchableOpacity style={styles.eyeBtn} onPress={()=>setShowPassword(!showPassword)} accessibilityRole="button" accessibilityLabel={showPassword?'Ocultar senha':'Mostrar senha'}>{showPassword?<EyeOff size={20} color={colors.textMuted}/>:<Eye size={20} color={colors.textMuted}/>}</TouchableOpacity>
          </View>
          {/* Password strength meter */}
          {password.length>0&&(
            <View style={styles.strengthRow}>
              <View style={[styles.strengthBar,{backgroundColor:colors.track}]}>
                <View style={[styles.strengthFill,{backgroundColor:strengthColor,width:`${(strength.score/6)*100}%`}]}/>
              </View>
              <Text style={[styles.strengthLabel,{color:strengthColor}]}>{strength.label}</Text>
            </View>
          )}
          {password.length>0&&passErr&&<Text style={[styles.rulesText,{color:colors.textMuted}]} accessibilityRole="alert">{passErr}</Text>}
          {error?<Text style={[styles.errorText,{color:isDark?'#FCA5A5':'#B91C1C',backgroundColor:isDark?'rgba(239,68,68,0.12)':'#FEF2F2'}]} accessibilityRole="alert">{error}</Text>:null}
          <TouchableOpacity onPress={handleSignup} activeOpacity={0.8} disabled={isLoading}>
            <LinearGradient colors={colors.gradientPrimary} style={[styles.ctaBtn,isLoading&&{opacity:0.7}]}>
              {isLoading?<ActivityIndicator color={colors.onAccent}/>:<UserPlus size={20} color={colors.onAccent}/>}
              <Text style={[styles.ctaText,{color:colors.onAccent,fontFamily:fontBody}]}>Criar conta</Text>
            </LinearGradient>
          </TouchableOpacity>
          <View style={styles.footer}>
            <Text style={[styles.footerText,{color:colors.textMuted}]}>Ja tem uma conta?</Text>
            <TouchableOpacity onPress={()=>router.push('/(auth)/login')}><Text style={[styles.footerLink,{color:colors.accent}]}>  Entrar</Text></TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles=StyleSheet.create({
  container:{flex:1},scroll:{flexGrow:1,paddingHorizontal:24},
  brandSection:{alignItems:'flex-start',gap:9,marginBottom:30,marginTop:14},
  eyebrow:{fontSize:10,fontWeight:'700',letterSpacing:1.5,marginTop:22},
  title:{fontSize:29,lineHeight:36,fontWeight:'700',letterSpacing:-0.8},slogan:{fontSize:14,lineHeight:21,letterSpacing:0.1},
  form:{gap:14},input:{paddingHorizontal:16,paddingVertical:15,borderRadius:14,borderWidth:1,fontSize:15},
  passwordRow:{position:'relative'},passwordInput:{paddingRight:48},
  eyeBtn:{position:'absolute',right:14,top:14,padding:4},
  strengthRow:{flexDirection:'row',alignItems:'center',gap:8},
  strengthBar:{flex:1,height:6,borderRadius:3,overflow:'hidden'},
  strengthFill:{height:'100%',borderRadius:3},
  strengthLabel:{fontSize:12,fontWeight:'700',minWidth:40},
  rulesText:{fontSize:12,marginTop:-8},
  errorText:{fontSize:13,textAlign:'center'},
  ctaBtn:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,paddingVertical:16,borderRadius:14,minHeight:54},
  ctaText:{color:'#fff',fontSize:15,fontWeight:'700'},
  footer:{flexDirection:'row',justifyContent:'center',marginTop:8},
  footerText:{fontSize:14},footerLink:{fontSize:14,fontWeight:'700'},
});