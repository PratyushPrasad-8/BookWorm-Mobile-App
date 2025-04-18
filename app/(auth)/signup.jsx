import { View, Text, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, TextInput, Alert} from 'react-native';
import styles from "../../assets/styles.js/signup.styles";
import COLORS from '../../constants/colors';
import { useState } from 'react';
import {Ionicons} from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';

export default function SignupScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); 
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const {isLoading, user, register, token} = useAuthStore();
  
  const router = useRouter();
  const handleSignUp = async() => {
    const result= await register(username, email, password);
    if(!result.success) return Alert.alert("Error",result.error);
  }

  return (
    <KeyboardAvoidingView
      style={{flex:1}}
      behavior={Platform.OS ==='ios' ? "padding" : "height"}>
 
      <View style={styles.container}>
        <View style={styles.card}>  
          {/*Header*/}
          <View style={styles.header}>
            <Text style={styles.title}>BookWorm </Text>
            <Text style={styles.subtitle}>Share Your favorite Reads</Text>
          </View>

          {/*Form*/}           
           <View style={styles.formContainer}>
            {/*Username Input*/}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.inputIcon}/>

                <TextInput
                  style={styles.input}
                  placeholder='username'
                  placeholderTextColor={COLORS.placeholderText}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize='none'
                  />
              </View>
            </View>

            {/*Email Input*/}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color={COLORS.primary} style={styles.inputIcon}/> 

                <TextInput
                  style={styles.input}
                  placeholder='email'
                  placeholderTextColor={COLORS.placeholderText}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType='email-address'
                  autoCapitalize='none'
                  />
              </View>
            </View>

            {/*Password Input*/}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} style={styles.inputIcon}/>

                <TextInput
                  style={styles.input}
                  placeholder='Password'
                  placeholderTextColor={COLORS.placeholderText}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize='none'
                  />
                

                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={COLORS.primary} style={styles.inputIcon} onPress={() => setShowPassword(!showPassword)}/>
              </View>
            </View>
            
            {/*Signup Button*/}
            <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : ( 
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>   
            
            {/*Footer*/}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.link}>Login</Text>
              </TouchableOpacity>   
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}