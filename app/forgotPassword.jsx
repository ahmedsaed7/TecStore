import React, { useState } from "react";
import { StyleSheet, View, TextInput, Pressable, Text } from "react-native";
import { Link } from "expo-router";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleResetPassword = async () => {
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      console.log("Password reset email sent to:", email);
    } catch (error) {
      console.error("Error sending password reset email:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />
      <Pressable style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </Pressable>
      <Text style={styles.link}>
        Remember your password?{" "}
        <Link href={"./login"} style={styles.Login}>
          Login
        </Link>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor : "lightgray",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 70, 
    marginBottom: 40, 
    fontWeight: 'bold',
    color: "#0a4a7c", 
    textAlign : "center",
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
  Login : {
    color: "#0a4a7c", 
    textDecorationLine: 'underline', 
    fontSize: 20,  
  },
  button: {
    backgroundColor: "#0a4a7c",  
    paddingVertical: 14, 
    paddingHorizontal: 60, 
    borderRadius: 10, 
    marginBottom: 25, 
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    margin: 15, 
    fontSize: 18, 
    color: '#000',  
  },
});

export default ForgotPassword;