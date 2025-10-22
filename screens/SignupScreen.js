import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import Colors from "../constants/colors";

const SignupScreen = () => {
  const { signup } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await signup(email, password);
      setMessage("Account created successfully!");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to create account.");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/logo placeholder.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setError("");
          setMessage("");
        }}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setError("");
          setMessage("");
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          setError("");
          setMessage("");
        }}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {message ? <Text style={styles.success}>{message}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", backgroundColor: "white" },
  logo: {
    resizeMode: "contain",
    height: 250,
    marginTop: 50,
  },
  title: {
    fontSize: 34,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Inter-Regular",
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#F3F3F3",
    color: "black",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    width: 300,
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  error: {
    color: "red",
    marginBottom: 10,
    fontFamily: "Inter-Regular",
  },
  success: {
    color: "green",
    marginBottom: 10,
    fontFamily: "Inter-Regular",
  },
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 60,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "Inter-Regular",
  },
});
