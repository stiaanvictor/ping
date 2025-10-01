import { useContext, useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import LoginScreen from "./screens/LoginScreen";
import * as Font from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import DashboardScreen from "./screens/DashboardScreen";
import ViewEventScreen from "./screens/ViewEventScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user } = useContext(AuthContext);
  const [userType, setUserType] = useState("student");

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      NavigationBar.setVisibilityAsync("hidden");

      await Font.loadAsync({
        "Inter-Regular": require("./assets/fonts/Inter-VariableFont_opsz,wght.ttf"),
        "Inter-Italic": require("./assets/fonts/Inter-Italic-VariableFont_opsz,wght.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <NavigationContainer>
      {!user.isLoggedIn ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="ViewEvent" component={ViewEventScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
