import { Text } from "react-native";
import StudentDashboardScreen from "./StudentDashboardScreen";
import TeacherDashboardScreen from "./TeacherDashboardScreen";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function DashboardScreen() {
  const { user } = useContext(AuthContext);

  if (user.userType === "student" || user.userType == "admin") {
    return <StudentDashboardScreen />;
  } else if (user.userType === "teacher") {
    return <TeacherDashboardScreen />;
  } else {
    return <Text>Screen not found</Text>;
  }
}

export default DashboardScreen;
