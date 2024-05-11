import React, { useState } from "react";
import { Link, router } from "expo-router";
import { StyleSheet, ScrollView , View, TextInput, TouchableOpacity, Text , ImageBackground , Image} from "react-native";
import { firebase } from "../firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const CustomAlert = ({ message }) => (
  <View style={styles.alertContainer}>
    <Text style={styles.alertText}>{message}</Text>
  </View>
);

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [Age, setAge] = useState("");
  const [gender, setgender] = useState("");
  const [Phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userId = user.uid;

      const userData = {
        name: username,
        email: email,
        password: password,
        userId: userId,
        gender: gender,
        isAdmin : false,
        Age : Age , 
        Phone : Phone ,
      };
      await addDoc(collection(db, "users"), userData);

      router.replace(`/Home?userId=${userId}&username=${username}`);
    } catch (error) {
      console.error("Error signing up:", error.message);
      setError(error.message);
    }
  };

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={setUsername}
        value={username}
      />
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
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        onChangeText={setPhone}
        value={Phone}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        onChangeText={setAge}
        value={Age}
      />
      <TextInput
        style={styles.input}
        placeholder="gender"
        onChangeText={setgender}
        value={gender}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={styles.link}>
        Already have an account? <Link href={"./login"} style={styles.Login}>Login</Link>
      </Text>
      {error && <CustomAlert message={error} />}
    </View>
</ScrollView>
  );
};

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
    paddingTop: 30,
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
  signUpText: {
    color: '#10B981', 
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
    color: '#3a3a3c',  
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
  Login : {
    color: "#0a4a7c", 
    textDecorationLine: 'underline', 
    fontSize: 20,  
  },
});

export default SignUp;
