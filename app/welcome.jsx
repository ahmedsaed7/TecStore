import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Image, Pressable , ActivityIndicator} from 'react-native';
import { Link, useRouter } from 'expo-router';
import logo from '../assets/images/logo.png';

const Welcome = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
        <View style={styles.container1}>
          <TouchableOpacity onPress={() => router.push('/Home')}>
            <Text style={styles.Icon}> Skip </Text>
          </TouchableOpacity>
          <View style={styles.logoc}>
          <Image source= {logo} resizeMode="contain" style={styles.logo} />

          <Text style={styles.welcomeText}>Welcome to Our App!</Text>
          <Text style={styles.instructions}>We're glad you're here. Click the button below to continue.</Text>
          </View>

            <View>
              <Pressable onPress={() =>router.push('/login')}
                style={styles.btn} > 
                <Text style = {styles.bodyText}>Login</Text>
                
              </Pressable>
            </View>

            <Text style={styles.link}> Don't have an account ?    
              <Link href={"./signup"} style={styles.SignUp}>Sign Up</Link>
            </Text>
            </View>
        </View>
  );
};

const styles = StyleSheet.create({
  welcomeText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10 ,
    color : "#3a3a3c" ,
  },
  instructions: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    color: "#0a4a7c", 
  },
  link: {
    maxWidth: '100%',
    margin: 15, 
    fontSize: 20, 
    color: '#3a3a3c',  
  },
  SignUp: {
    color: "#0a4a7c", 
    textDecorationLine: 'underline', 
    fontSize: 20,
  },
  container: {
    flex: 1,
    backgroundColor : "lightgray",
    padding: 20,
  },
  container1: {
    backgroundColor : "lightgray",
  },
  logo: {
    width: '100%',
    height: "70%", 
    marginBottom: 20 ,
  },
  logoc: {
    width: '100%',
    height: "70%", 
  },
  Icon: {
    textAlign :  'right',
    width: '100%' ,
    margin : 10 ,
    marginBottom : 60 ,
    marginTop : 20 ,
    fontWeight: 'bold',
    fontSize: 25,
    color:  "#0a4a7c",
  },
  btn: {
    width: '100%' ,
    backgroundColor: 'lightgray',
    borderColor : "#0a4a7c",
    paddingBottom: 16,
    padding: 10,
    borderWidth: 2,
    borderRadius: 12,
    alignItems: 'center',
  },
  bodyText: {
    color: "#3a3a3c" , 
    fontSize: 30,
    fontWeight: 'bold', 
  },
  signUpText: {
    color: "#0a4a7c", 
    textDecorationLine: 'underline', 
    fontSize: 20,  
    marginRight : 10 ,
  },
});

export default Welcome;

