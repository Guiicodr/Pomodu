/**
 * Forgot Password — Request password reset email
 */
import React,{useState}from'react';
import{View,Text,TextInput,TouchableOpacity,StyleSheet,StatusBar,KeyboardAvoidingView,Platform,ScrollView,ActivityIndicator}from'react-native';
import{useSafeAreaInsets}from'react-native-safe-area-context';import{LinearGradient}from'expo-linear-gradient';
import{Mail,ArrowLeft,CheckCircle}from'lucide-react-native';import{router}from'expo-router';
import{useAuth}from'@/context/AuthContext';import{PomoduBrandLockup}from'@/components/brand/PomoduBrandLockup';
import{lightTheme}from'@/constants/themes';const C=lightTheme.colors;

export default function ForgotPasswordScreen(){
  const insets=useSafeAreaInsets();const{requestPasswordReset,isLoading}=useAuth();
  const[email,setEmail]=useState('');const[error,setError]=useState('');const[sent,setSent]=useState(false);

  const handleReset=async()=>{
    setError('');if(!email.trim()){setError('Digite seu email');return;}
    const result=await requestPasswordReset(email.trim());
    if(result)setError(result.message);
    else setSent(true);
  };

  return(
    <KeyboardAvoidingView style={[styles.container,{backgroundColor:C.background}]} behavior={Platform.OS==='ios'?'padding':'height'}>
      <StatusBar barStyle="dark-content"/>
      <ScrollView contentContainerStyle={[styles.scroll,{paddingTop:insets.top+60,paddingBottom:insets.bottom+40}]} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={()=>router.back()} style={styles.backBtn}><ArrowLeft size={20} color={C.text}/></TouchableOpacity>
        <View style={styles.brandSection}><PomoduBrandLockup size={32} textSize={20}/><Text style={[styles.title,{color:C.text}]}>Recuperar Senha</Text></View>
        {sent?(
          <View style={styles.successCard}>
            <CheckCircle size={48} color={C.accent}/>
            <Text style={[styles.successTitle,{color:C.text}]}>Email enviado!</Text>
            <Text style={[styles.successText,{color:C.textMuted}]}>Verifique sua caixa de entrada e siga as instrucoes para redefinir sua senha.</Text>
            <TouchableOpacity onPress={()=>router.push('/(auth)/login')} activeOpacity={0.8}>
              <LinearGradient colors={C.gradientPrimary} style={styles.ctaBtn}><Text style={styles.ctaText}>Voltar ao Login</Text></LinearGradient>
            </TouchableOpacity>
          </View>
        ):(
          <View style={styles.form}>
            <Text style={[styles.instructions,{color:C.textMuted}]}>Digite seu email cadastrado e enviaremos um link para redefinir sua senha.</Text>
            <TextInput style={[styles.input,{backgroundColor:C.surface,color:C.text,borderColor:C.border}]}
              placeholder="Seu email" placeholderTextColor={C.textMuted} value={email} onChangeText={setEmail}
              autoCapitalize="none" keyboardType="email-address" autoComplete="email"/>
            {error?<Text style={[styles.errorText,{color:'#EF4444'}]}>{error}</Text>:null}
            <TouchableOpacity onPress={handleReset} activeOpacity={0.8} disabled={isLoading}>
              <LinearGradient colors={C.gradientPrimary} style={styles.ctaBtn}>
                {isLoading?<ActivityIndicator color="#fff"/>:<Mail size={20} color="#fff"/>}
                <Text style={styles.ctaText}>Enviar link</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>router.push('/(auth)/login')} activeOpacity={0.7} style={[styles.guestBtn,{borderColor:C.border}]}>
              <Text style={[styles.guestText,{color:C.textMuted}]}>Voltar ao login</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles=StyleSheet.create({
  container:{flex:1},scroll:{flexGrow:1,paddingHorizontal:24},
  backBtn:{width:40,height:40,borderRadius:20,alignItems:'center',justifyContent:'center',marginBottom:16},
  brandSection:{alignItems:'center',gap:8,marginBottom:40},
  title:{fontSize:26,fontWeight:'800',letterSpacing:-0.5},
  instructions:{fontSize:14,lineHeight:20,marginBottom:8},
  form:{gap:14},input:{paddingHorizontal:16,paddingVertical:16,borderRadius:14,borderWidth:1,fontSize:16},
  errorText:{fontSize:13,textAlign:'center'},
  ctaBtn:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,paddingVertical:16,borderRadius:14},
  ctaText:{color:'#fff',fontSize:17,fontWeight:'700'},
  guestBtn:{alignItems:'center',paddingVertical:14,borderRadius:14,borderWidth:1},
  guestText:{fontSize:15,fontWeight:'500'},
  successCard:{alignItems:'center',gap:16,marginTop:20},
  successTitle:{fontSize:20,fontWeight:'700'},
  successText:{fontSize:14,textAlign:'center',lineHeight:20},
});