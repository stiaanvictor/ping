import { useContext, useState, useEffect } from "react";
import { AppState } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import * as Font from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import LoginScreen from "./screens/LoginScreen";
import DashboardScreen from "./screens/DashboardScreen";
import ViewNoticeScreen from "./screens/ViewNoticeScreen";
import CalendarScreen from "./screens/CalendarScreen";
import GroupSelectionScreen from "./screens/GroupSelectionScreen";
import EditNoticeScreen from "./screens/EditNoticeScreen";
import TeacherGroupsScreen from "./screens/TeacherGroupsScreen";
import AddCategoryScreen from "./screens/AddCategoryScreen";
import AddGroupScreen from "./screens/AddGroupScreen";
import EditCategoryScreen from "./screens/EditCategoryScreen";
import EditGroupScreen from "./screens/EditGroupScreen";
import ManageGroupScreen from "./screens/ManageGroupScreen";
import CreateNewNoticeScreen from "./screens/CreateNoticeScreen";
import NoticesByCategoryScreen from "./screens/NoticesByCategoryScreen";
import SignupScreen from "./screens/SignupScreen";
import ManageUsersScreen from "./screens/ManageUsersScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user } = useContext(AuthContext);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  async function hideNavBar() {
    try {
      await NavigationBar.setVisibilityAsync("hidden");
      await NavigationBar.setBehaviorAsync("overlay-swipe");
    } catch (err) {
      console.warn("Failed to hide navigation bar:", err);
    }
  }

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Inter-Regular": require("./assets/fonts/Inter-VariableFont_opsz,wght.ttf"),
        "Inter-Italic": require("./assets/fonts/Inter-Italic-VariableFont_opsz,wght.ttf"),
      });
      setFontsLoaded(true);
    }

    loadFonts();
    hideNavBar();

    // Re-hide when app regains focus
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") hideNavBar();
    });

    return () => subscription.remove();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <NavigationContainer
      onReady={hideNavBar}
      onStateChange={hideNavBar} // Re-hide after navigation changes
    >
      {!user.isLoggedIn ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="ViewNotice" component={ViewNoticeScreen} />
          <Stack.Screen name="EditNotice" component={EditNoticeScreen} />
          <Stack.Screen name="Calendar" component={CaledarScreen} />
          <Stack.Screen
            name="GroupSelection"
            component={GroupSelectionScreen}
          />
          <Stack.Screen name="TeacherGroups" component={TeacherGroupsScreen} />
          <Stack.Screen name="AddCategory" component={AddCategoryScreen} />
          <Stack.Screen name="AddGroup" component={AddGroupScreen} />
          <Stack.Screen name="EditCategory" component={EditCategoryScreen} />
          <Stack.Screen name="EditGroup" component={EditGroupScreen} />
          <Stack.Screen name="ManageGroup" component={ManageGroupScreen} />
          <Stack.Screen name="ManageUsers" component={ManageUsersScreen} />
          <Stack.Screen
            name="NoticesByCategory"
            component={NoticesByCategoryScreen}
          />
          <Stack.Screen
            name="CreateNewNotice"
            component={CreateNewNoticeScreen}
          />
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
