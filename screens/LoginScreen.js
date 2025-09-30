import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import Colors from "../constants/colors";

const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    login("1"); // example login with ID 1
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
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text
          style={{ color: "white", fontSize: 18, fontFamily: "Inter-Regular" }}
        >
          Login
        </Text>
      </TouchableOpacity>
      <Text style={styles.or}>OR</Text>
      <TouchableOpacity onPress={handleLogin}>
        <Image
          source={require("../assets/images/google login.jpg")}
          style={styles.googleLogin}
        ></Image>
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
    fontWeight: 500,
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
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 60,
    paddingVertical: 10,
    borderRadius: 10,
  },
  or: {
    marginTop: 50,
    fontSize: 25,
    fontFamily: "Inter-Light",
  },
  googleLogin: {
    resizeMode: "contain",
    marginTop: 50,
    height: 45,
  },
});
