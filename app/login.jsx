import React, { useState, useEffect } from "react";
import { StyleSheet, View, TextInput, Pressable, Text , ImageBackground , Image } from "react-native";
import { Link, useRouter } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const CustomAlert = ({ message }) => (
  <View style={styles.alertContainer}>
    <Text style={styles.alertText}>{message}</Text>
  </View>
);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(null);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLoginButtonPress = async () => {
    setUsername(await handleLogin());
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password); // Authenticate user
      const user = userCredential.user;

      // After authentication, check if the user is an admin
      const userQuery = query(collection(db, 'users'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(userQuery);
      const userId = user.uid;
      
      if (querySnapshot.empty) {
        throw new Error('User data not found');
      }

      const userData = querySnapshot.docs[0].data();

      if (userData.isAdmin) { // Check if the user has admin privileges
        router.replace(`./Products?userId=${userId}&username=${username}`);
      } else {
        router.replace(`/Home?userId=${userId}&username=${username}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Pressable style={styles.button} onPress={handleLoginButtonPress}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
      <Text style={styles.link}>
        Don't have an account ? <Link href={"./signup"} style={styles.SignUp}>Sign Up</Link>
      </Text>
      <Text >
        <Link href={"./forgotPassword"} style={styles.SignUp}>Forgot Password?</Link>
      </Text>
      {errors && <CustomAlert message={errors} />}
    </View>
    // </ImageBackground>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor : "lightgray",
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 70, 
    marginBottom: 40, 
    fontWeight: 'bold',
    color: "#0a4a7c",
  },
  input: {
    width: '100%',
    height: 55, 
    backgroundColor: 'white', 
    borderColor: "#0a4a7c", 
    borderWidth: 1,
    borderRadius: 10, 
    marginBottom: 25,  
    paddingHorizontal: 15, 
  },
  SignUp: {
    color: "#0a4a7c", 
    textDecorationLine: 'underline', 
    fontSize: 20,  
  },
  button: {
    backgroundColor: "#0a4a7c",  
    paddingVertical: 14, 
    paddingHorizontal: 60, 
    borderRadius: 10, 
  },
  buttonText: {
    color: 'white', 
    fontSize: 20,
    fontWeight: 'bold', 
  },
  link: {
    margin: 15, 
    fontSize: 18, 
    color: '#000',  
  },
  alertContainer: {
    backgroundColor: '#FEE2E2',
    padding: 15,
    borderRadius: 10, 
    marginBottom: 15, 
  },
  alertText: {
    color: '#EF4444', 
    fontSize: 16, 
    textAlign: 'center', 
  },
});
