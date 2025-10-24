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
import {
  firebaseLogin,
  firebaseResetPassword,
} from "../firebase/firebaseFunctions";
import Colors from "../constants/colors";
import { Ionicons } from "@expo/vector-icons"; 

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      // if (false) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const user = await firebaseLogin(email, password);
      login(user.email);
    } catch (err) {
      console.error(err);
      setError("Invalid email or password.");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Enter your email first to reset password.");
      return;
    }

    try {
      await firebaseResetPassword(email);
      setMessage("Password reset email sent! Check your inbox.");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error sending reset email. Check if the email is valid.");
    }
  };

  const handleNavigateToSignup = () => {
    navigation.navigate("Signup");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/logo placeholder.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Login</Text>

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

      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError("");
            setMessage("");
          }}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {message ? <Text style={styles.success}>{message}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotText}>Forgot your password?</Text>
      </TouchableOpacity>

      {/*Added Sign Up Option */}
      <TouchableOpacity onPress={handleNavigateToSignup}>
        <Text style={styles.signupText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 300,
    marginBottom: 15,
  },
  eyeButton: {
    position: "absolute",
    right: 10,
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
  forgotText: {
    color: Colors.primary,
    marginTop: 15,
    textDecorationLine: "underline",
    fontFamily: "Inter-Regular",
  },
  signupText: {
    color: Colors.primary,
    marginTop: 10,
    fontFamily: "Inter-Regular",
  },
});
