import { View, Text, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform} from 'react-native';
import styles from "../../assets/styles.js/login.styles";
import { useState } from 'react';
import { Image, TextInput } from 'react-native';
import COLORS from '../../constants/colors';
import {Ionicons} from '@expo/vector-icons';
import {Link} from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { Alert } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {isLoading, login, isCheckingAuth}= useAuthStore();
  const handleLogin= async()=>{
    const result= await login(email, password);  
    if(!result.success) return Alert.alert("Error",result.error);
  }

  if(isCheckingAuth) return null;

  return (
    <KeyboardAvoidingView
      style={{flex:1}}
      behavior={Platform.OS ==='ios' ? "padding" : "height"}>
    <View style={styles.container}>
      {/*Illustration*/}
      <View style={styles.topIllustration}>
        <Image
        source={require("../../assets/images/signup-login.png")}
        style={styles.illustrationImage}
        resizeMode="contain"/>
      </View>

      {/*Form*/}
      <View style={styles.card}>
        <View style={styles.formContainer}>
          {/*Email*/}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={COLORS.primary} style={styles.inputIcon}/>

              <TextInput 
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={COLORS.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              />
            </View>
          </View>

          {/*Password*/}  
          <View styles={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              {/*Left Icon */}
              <Ionicons name='lock-closed-outline' size={20} color={COLORS.primary} style={styles.inputIcon}/>  
              
              {/*Input */}
              <TextInput 
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={COLORS.placeholderText}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              />
              
              {/*Right Icon */}
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={COLORS.primary}/>  
              </TouchableOpacity>
            </View>
          </View>

          {/*Login Button */}
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : ( 
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity> 

          {/*Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <Link href="/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.link}>Signup</Text> 
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </View>
    </KeyboardAvoidingView>)
}