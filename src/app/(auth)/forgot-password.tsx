/**
 * Forgot Password — Request password reset email
 */
import React,{useState}from'react';
import{View,Text,TextInput,TouchableOpacity,StyleSheet,StatusBar,KeyboardAvoidingView,Platform,ScrollView,ActivityIndicator}from'react-native';
import{useSafeAreaInsets}from'react-native-safe-area-context';import{LinearGradient}from'expo-linear-gradient';
import{Mail,ArrowLeft,CheckCircle}from'lucide-react-native';import{router}from'expo-router';
import{useAuth}from'@/context/AuthContext';import{useTheme}from'@/context/ThemeContext';import{PomoduBrandLockup}from'@/components/brand/PomoduBrandLockup';

export default function ForgotPasswordScreen(){
  const insets=useSafeAreaInsets();const{colors,isDark,fontBody}=useTheme();const{requestPasswordReset,isLoading}=useAuth();
  const[email,setEmail]=useState('');const[error,setError]=useState('');const[sent,setSent]=useState(false);

  const handleReset=async()=>{
    setError('');if(!email.trim()){setError('Digite seu email');return;}
    const result=await requestPasswordReset(email.trim());
    if(result)setError(result.message);
    else setSent(true);
  };

  return(
    <KeyboardAvoidingView style={[styles.container,{backgroundColor:colors.background}]} behavior={Platform.OS==='ios'?'padding':'height'}>
      <StatusBar barStyle={isDark?'light-content':'dark-content'}/>
      <ScrollView contentContainerStyle={[styles.scroll,{paddingTop:insets.top+30,paddingBottom:insets.bottom+32}]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={()=>router.back()} style={[styles.backBtn,{backgroundColor:colors.surfaceAlt}]} accessibilityRole="button" accessibilityLabel="Voltar"><ArrowLeft size={20} color={colors.text}/></TouchableOpacity>
        <View style={styles.brandSection}><PomoduBrandLockup size={32} textSize={20}/><Text style={[styles.eyebrow,{color:colors.accent}]}>RECUPERE SEU ACESSO</Text><Text style={[styles.title,{color:colors.text,fontFamily:'Sora_600SemiBold'}]}>Vamos redefinir sua senha.</Text></View>
        {sent?(
          <View style={[styles.successCard,{backgroundColor:colors.surface,borderColor:colors.border}]}>
            <View style={[styles.successIcon,{backgroundColor:colors.accentSoft}]}><CheckCircle size={30} color={colors.accent}/></View>
            <Text style={[styles.successTitle,{color:colors.text,fontFamily:'Sora_600SemiBold'}]}>E-mail enviado</Text>
            <Text style={[styles.successText,{color:colors.textMuted}]}>Confira sua caixa de entrada e siga as instruções para criar uma nova senha.</Text>
            <TouchableOpacity onPress={()=>router.push('/(auth)/login')} activeOpacity={0.8}>
              <LinearGradient colors={colors.gradientPrimary} style={styles.ctaBtn}><Text style={[styles.ctaText,{color:colors.onAccent,fontFamily:fontBody}]}>Voltar ao login</Text></LinearGradient>
            </TouchableOpacity>
          </View>
        ):(
          <View style={styles.form}>
            <Text style={[styles.instructions,{color:colors.textMuted}]}>Digite o e-mail da sua conta. Enviaremos um link para você criar uma nova senha.</Text>
            <TextInput style={[styles.input,{backgroundColor:colors.surfaceAlt,color:colors.text,borderColor:colors.border}]}
              placeholder="voce@exemplo.com" placeholderTextColor={colors.textMuted} value={email} onChangeText={setEmail}
              autoCapitalize="none" autoCorrect={false} keyboardType="email-address" autoComplete="email" textContentType="emailAddress" accessibilityLabel="E-mail"/>
            {error?<Text style={[styles.errorText,{color:isDark?'#FCA5A5':'#B91C1C',backgroundColor:isDark?'rgba(239,68,68,0.12)':'#FEF2F2'}]} accessibilityRole="alert">{error}</Text>:null}
            <TouchableOpacity onPress={handleReset} activeOpacity={0.8} disabled={isLoading}>
              <LinearGradient colors={colors.gradientPrimary} style={[styles.ctaBtn,isLoading&&{opacity:0.7}]}>
                {isLoading?<ActivityIndicator color={colors.onAccent}/>:<Mail size={20} color={colors.onAccent}/>}
                <Text style={[styles.ctaText,{color:colors.onAccent,fontFamily:fontBody}]}>Enviar link</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>router.push('/(auth)/login')} activeOpacity={0.7} style={[styles.guestBtn,{borderColor:colors.border}]}>
              <Text style={[styles.guestText,{color:colors.textMuted}]}>Voltar ao login</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles=StyleSheet.create({
  container:{flex:1},scroll:{flexGrow:1,paddingHorizontal:24},
  backBtn:{width:40,height:40,borderRadius:14,alignItems:'center',justifyContent:'center',marginBottom:24},
  brandSection:{alignItems:'flex-start',gap:9,marginBottom:30},
  eyebrow:{fontSize:10,fontWeight:'700',letterSpacing:1.4,marginTop:20},
  title:{fontSize:28,lineHeight:36,fontWeight:'700',letterSpacing:-0.6},
  instructions:{fontSize:14,lineHeight:21,marginBottom:4},
  form:{gap:14},input:{paddingHorizontal:16,paddingVertical:15,borderRadius:14,borderWidth:1,fontSize:15},
  errorText:{fontSize:13,textAlign:'center',lineHeight:19,padding:10,borderRadius:10},
  ctaBtn:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,paddingVertical:16,borderRadius:14,minHeight:54},
  ctaText:{fontSize:15,fontWeight:'700'},
  guestBtn:{alignItems:'center',paddingVertical:14,borderRadius:14,borderWidth:1},
  guestText:{fontSize:14,fontWeight:'600'},
  successCard:{alignItems:'center',gap:14,marginTop:12,padding:24,borderRadius:22,borderWidth:1},
  successIcon:{width:58,height:58,borderRadius:20,alignItems:'center',justifyContent:'center'},
  successTitle:{fontSize:20,fontWeight:'700'},
  successText:{fontSize:14,textAlign:'center',lineHeight:21},
});