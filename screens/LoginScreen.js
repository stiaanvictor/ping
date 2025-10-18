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
import { firebaseLogin } from "../firebase/firebaseFunctions";
import Colors from "../constants/colors";

const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    // if (!email || !password) {
    if (false) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      // const user = await firebaseLogin(email, password);
      const user = await firebaseLogin("frikkieviljoen@gmail.com", "Coffee123");
      login(user.uid, user.email);
    } catch (err) {
      console.error(err);
      setError("Invalid email or password.");
    }
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
        }}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
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
  error: {
    color: "red",
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
